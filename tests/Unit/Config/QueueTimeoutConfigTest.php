<?php

namespace Tests\Unit\Config;

use Tests\TestCase;

class QueueTimeoutConfigTest extends TestCase
{
    /**
     * The queue's retry_after is what stops a still-running job from being
     * handed to a second worker. When it sits below a worker timeout, long
     * sweeps get processed twice, chew through their attempts and fail with
     * MaxAttemptsExceededException even though nothing actually broke.
     */
    public function test_redis_retry_after_exceeds_every_horizon_worker_timeout(): void
    {
        $retryAfter = (int) config('queue.connections.redis.retry_after');

        $this->assertNotEmpty(config('horizon.defaults'));

        foreach (config('horizon.defaults') as $supervisor => $settings) {
            $timeout = (int) ($settings['timeout'] ?? 0);

            $this->assertGreaterThan(
                $timeout,
                $retryAfter,
                "queue.connections.redis.retry_after must exceed the {$supervisor} worker timeout.",
            );
        }
    }

    public function test_every_dispatch_target_queue_has_a_horizon_supervisor(): void
    {
        $supervised = collect(config('horizon.defaults'))
            ->flatMap(fn (array $settings) => $settings['queue'] ?? [])
            ->unique();

        // Queues the app dispatches onto. A queue with no supervisor silently
        // accumulates jobs that are never worked.
        foreach (['default', 'sync', 'import', 'recommendations'] as $queue) {
            $this->assertTrue(
                $supervised->contains($queue),
                "No Horizon supervisor is configured for the '{$queue}' queue.",
            );
        }
    }
}
