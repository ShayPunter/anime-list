<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
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
