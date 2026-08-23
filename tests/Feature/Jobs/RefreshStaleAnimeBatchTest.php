<?php

namespace Tests\Feature\Jobs;

use App\Exceptions\AniListServiceUnavailableException;
use App\Jobs\RefreshStaleAnimeBatch;
use App\Models\Anime;
use App\Models\SyncRun;
use App\Services\AniListClient;
use App\Services\AnimeRefreshPolicy;
use App\Services\SyncRunTracker;
use Illuminate\Contracts\Queue\Job as QueueJobContract;
use Illuminate\Support\Facades\Queue;
use Illuminate\Support\Facades\Redis;
use Mockery;
use Mockery\Adapter\Phpunit\MockeryPHPUnitIntegration;
use Tests\TestCase;

class RefreshStaleAnimeBatchTest extends TestCase
{
    use MockeryPHPUnitIntegration;

    protected function setUp(): void
    {
        parent::setUp();

        // The persistence service pushes relation/recommendation edges onto
        // Redis; nothing in these tests depends on that.
        Redis::shouldReceive('rpush')->zeroOrMoreTimes();
    }

    public function test_refreshes_stale_anime_and_records_progress_on_the_run(): void
    {
        Queue::fake();

        $stale = Anime::factory()->create([
            'anilist_id' => 501,
            'status' => 'RELEASING',
            'synced_at' => now()->subDays(90),
        ]);

        $run = app(SyncRunTracker::class)->start(SyncRun::MODE_STALE_REFRESH);

        $this->runBatch($run, [$this->minimalMedia(501, status: 'RELEASING')]);

        $run->refresh();
        $this->assertSame(1, $run->processed_items);
        $this->assertSame(1, $run->current_page);
        $this->assertSame(SyncRun::STATUS_COMPLETED, $run->status);

        $stale->refresh();
        $this->assertTrue($stale->synced_at->isToday());
        $this->assertNull($stale->refresh_excluded_at, 'A releasing anime must stay in the sweep.');
    }

    public function test_long_finished_anime_are_excluded_from_future_sweeps(): void
    {
        Queue::fake();

        $finished = Anime::factory()->create([
            'anilist_id' => 502,
            'status' => 'FINISHED',
            'synced_at' => now()->subDays(90),
        ]);

        $run = app(SyncRunTracker::class)->start(SyncRun::MODE_STALE_REFRESH);

        $this->runBatch($run, [
            $this->minimalMedia(502, status: 'FINISHED', endDate: now()->subYears(4)),
        ]);

        $finished->refresh();
        $this->assertNotNull($finished->refresh_excluded_at);
        $this->assertSame(AnimeRefreshPolicy::REASON_FINISHED, $finished->refresh_exclusion_reason);
    }

    public function test_recently_finished_anime_stay_in_the_sweep(): void
    {
        Queue::fake();

        $justFinished = Anime::factory()->create([
            'anilist_id' => 503,
            'status' => 'FINISHED',
            'synced_at' => now()->subDays(90),
        ]);

        $run = app(SyncRunTracker::class)->start(SyncRun::MODE_STALE_REFRESH);

        $this->runBatch($run, [
            $this->minimalMedia(503, status: 'FINISHED', endDate: now()->subDays(7)),
        ]);

        $this->assertNull($justFinished->fresh()->refresh_excluded_at);
    }

    public function test_anime_missing_from_the_anilist_response_are_excluded(): void
    {
        Queue::fake();

        $gone = Anime::factory()->create([
            'anilist_id' => 504,
            'status' => 'RELEASING',
            'synced_at' => now()->subDays(90),
        ]);

        $run = app(SyncRunTracker::class)->start(SyncRun::MODE_STALE_REFRESH);

        // AniList returns nothing for the requested id — the row can never be
        // refreshed, so it must leave the backlog instead of being reselected.
        $this->runBatch($run, []);

        $gone->refresh();
        $this->assertNotNull($gone->refresh_excluded_at);
        $this->assertSame(AnimeRefreshPolicy::REASON_MISSING_UPSTREAM, $gone->refresh_exclusion_reason);
        $this->assertSame(SyncRun::STATUS_COMPLETED, $run->fresh()->status);
    }

    public function test_already_excluded_anime_are_never_selected(): void
    {
        Queue::fake();

        Anime::factory()->create([
            'anilist_id' => 505,
            'status' => 'FINISHED',
            'synced_at' => now()->subDays(90),
            'refresh_excluded_at' => now()->subDay(),
            'refresh_exclusion_reason' => AnimeRefreshPolicy::REASON_FINISHED,
        ]);

        $run = app(SyncRunTracker::class)->start(SyncRun::MODE_STALE_REFRESH);

        // No AniList call should happen at all — there is nothing to fetch.
        $client = Mockery::mock(AniListClient::class);
        $client->shouldReceive('query')->never();
        $this->instance(AniListClient::class, $client);

        $job = new RefreshStaleAnimeBatch(syncRunId: $run->id);
        app()->call([$job, 'handle']);

        $this->assertSame(SyncRun::STATUS_COMPLETED, $run->fresh()->status);
    }

    public function test_chains_another_batch_while_the_backlog_remains(): void
    {
        Queue::fake();
        config(['anilist.refresh.batch_size' => 1]);

        Anime::factory()->create([
            'anilist_id' => 506,
            'status' => 'RELEASING',
            'synced_at' => now()->subDays(90),
        ]);
        Anime::factory()->create([
            'anilist_id' => 507,
            'status' => 'RELEASING',
            'synced_at' => now()->subDays(60),
        ]);

        $run = app(SyncRunTracker::class)->start(SyncRun::MODE_STALE_REFRESH);

        $this->runBatch($run, [$this->minimalMedia(506, status: 'RELEASING')]);

        Queue::assertPushed(
            RefreshStaleAnimeBatch::class,
            fn (RefreshStaleAnimeBatch $job) => $job->batchNumber === 2 && $job->syncRunId === $run->id,
        );
        $this->assertSame(SyncRun::STATUS_RUNNING, $run->fresh()->status);
    }

    public function test_stops_chaining_once_the_per_run_batch_cap_is_reached(): void
    {
        Queue::fake();
        config(['anilist.refresh.batch_size' => 1]);

        Anime::factory()->create([
            'anilist_id' => 508,
            'status' => 'RELEASING',
            'synced_at' => now()->subDays(90),
        ]);
        Anime::factory()->create([
            'anilist_id' => 509,
            'status' => 'RELEASING',
            'synced_at' => now()->subDays(60),
        ]);

        $run = app(SyncRunTracker::class)->start(SyncRun::MODE_STALE_REFRESH);

        $this->runBatch(
            $run,
            [$this->minimalMedia(508, status: 'RELEASING')],
            new RefreshStaleAnimeBatch(batchNumber: 1, maxBatches: 1, syncRunId: $run->id),
        );

        Queue::assertNotPushed(RefreshStaleAnimeBatch::class);
        $this->assertSame(SyncRun::STATUS_COMPLETED, $run->fresh()->status);
    }

    public function test_an_anilist_outage_pauses_the_run_instead_of_failing_it(): void
    {
        Queue::fake();

        Anime::factory()->create([
            'anilist_id' => 510,
            'status' => 'RELEASING',
            'synced_at' => now()->subDays(90),
        ]);

        $run = app(SyncRunTracker::class)->start(SyncRun::MODE_STALE_REFRESH);

        $client = Mockery::mock(AniListClient::class);
        $client->shouldReceive('query')->once()->andThrow(new AniListServiceUnavailableException(
            statusCode: 403,
            retryAfter: 900,
            message: 'AniList API temporarily unavailable',
        ));
        $this->instance(AniListClient::class, $client);

        // The job releases itself back onto the queue rather than throwing;
        // releases must not count against the attempt budget.
        $queueJob = Mockery::mock(QueueJobContract::class);
        $queueJob->shouldReceive('release')->once()->with(900);
        $queueJob->shouldReceive('isReleased')->andReturn(true);
        $queueJob->shouldReceive('isDeleted')->andReturn(false);
        $queueJob->shouldReceive('hasFailed')->andReturn(false);

        $job = new RefreshStaleAnimeBatch(syncRunId: $run->id);
        $job->setJob($queueJob);
        app()->call([$job, 'handle']);

        $this->assertSame(SyncRun::STATUS_PAUSED, $run->fresh()->status);
        Queue::assertNotPushed(RefreshStaleAnimeBatch::class);
    }

    public function test_the_job_survives_outage_releases_rather_than_capping_attempts(): void
    {
        $job = new RefreshStaleAnimeBatch;

        // tries = 0 hands the bound to retryUntil(), so repeated outage
        // releases cannot trigger MaxAttemptsExceededException.
        $this->assertSame(0, $job->tries);
        $this->assertGreaterThan(now()->addHour(), $job->retryUntil());
        $this->assertSame(3, $job->maxExceptions);
    }

    /**
     * @param  array<int, array<string, mixed>>  $media
     */
    private function runBatch(SyncRun $run, array $media, ?RefreshStaleAnimeBatch $job = null): void
    {
        $client = Mockery::mock(AniListClient::class);
        $client->shouldReceive('query')->once()->andReturn([
            'Page' => [
                'pageInfo' => ['hasNextPage' => false, 'currentPage' => 1, 'lastPage' => 1, 'total' => count($media)],
                'media' => $media,
            ],
        ]);
        $client->shouldReceive('storeRawResponse')->zeroOrMoreTimes();
        $this->instance(AniListClient::class, $client);

        $job ??= new RefreshStaleAnimeBatch(syncRunId: $run->id);
        app()->call([$job, 'handle']);
    }

    /**
     * @return array<string, mixed>
     */
    private function minimalMedia(int $id, string $status = 'FINISHED', ?\DateTimeInterface $endDate = null): array
    {
        return [
            'id' => $id,
            'idMal' => null,
            'title' => ['romaji' => "Anime #{$id}", 'english' => null, 'native' => null],
            'synonyms' => [],
            'format' => 'TV',
            'status' => $status,
            'season' => null,
            'seasonYear' => null,
            'source' => null,
            'episodes' => 12,
            'duration' => 24,
            'startDate' => null,
            'endDate' => $endDate === null ? null : [
                'year' => (int) $endDate->format('Y'),
                'month' => (int) $endDate->format('n'),
                'day' => (int) $endDate->format('j'),
            ],
            'description' => null,
            'coverImage' => ['large' => null, 'medium' => null, 'color' => null],
            'bannerImage' => null,
            'trailer' => null,
            'averageScore' => null,
            'meanScore' => null,
            'popularity' => null,
            'trending' => null,
            'favourites' => null,
            'isAdult' => false,
            'updatedAt' => null,
            'genres' => [],
            'studios' => ['edges' => []],
            'relations' => ['edges' => []],
            'externalLinks' => [],
            'nextAiringEpisode' => null,
            'streamingEpisodes' => [],
            'airingSchedule' => ['nodes' => []],
            'characters' => ['edges' => []],
            'recommendations' => ['edges' => []],
        ];
    }
}
