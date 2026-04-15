<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Targeted syncs: keep actively relevant data fresh
Schedule::command('sync:anime --status=RELEASING')
    ->everySixHours()
    ->timezone('UTC')
    ->withoutOverlapping(120)
    ->onFailure(function () {
        Log::error('Scheduled RELEASING anime sync failed');
    });

Schedule::command('sync:anime --status=NOT_YET_RELEASED')
    ->dailyAt('04:00')
    ->timezone('UTC')
    ->withoutOverlapping(120)
    ->onFailure(function () {
        Log::error('Scheduled NOT_YET_RELEASED anime sync failed');
    });

// Weekly incremental sync for everything else
Schedule::command('sync:anime')
    ->weeklyOn(1, '03:00')
    ->timezone('UTC')
    ->withoutOverlapping(120)
    ->onFailure(function () {
        Log::error('Scheduled incremental anime sync failed');
    });

Schedule::command('sync:schedule')
    ->hourly()
    ->withoutOverlapping(55)
    ->onFailure(function () {
        Log::error('Scheduled airing schedule sync failed');
    });

// Recalculate Bayesian scores twice daily (after syncs finish)
Schedule::command('anime:recalculate-bayesian')
    ->twiceDaily(5, 17)
    ->timezone('UTC')
    ->withoutOverlapping()
    ->onFailure(function () {
        Log::error('Bayesian score recalculation failed');
    });

// Refresh top popular cache daily
Schedule::call(function () {
    Cache::forget('top:popular:100');
})->dailyAt('05:15')->timezone('UTC');

// Prune old raw API responses to keep the table from ballooning
Schedule::command('anilist:prune-raw-responses')
    ->dailyAt('05:00')
    ->timezone('UTC')
    ->withoutOverlapping()
    ->onFailure(function () {
        Log::error('Scheduled raw_api_responses prune failed');
    });
