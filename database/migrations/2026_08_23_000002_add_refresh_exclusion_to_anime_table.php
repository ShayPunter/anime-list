<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('anime', function (Blueprint $table) {
            // Set when an anime should be skipped by the stale-data refresh
            // sweep — long-finished shows almost never change on AniList, and
            // entries that no longer exist upstream can never be refreshed.
            $table->timestamp('refresh_excluded_at')->nullable()->after('synced_at');
            $table->string('refresh_exclusion_reason', 40)->nullable()->after('refresh_excluded_at');

            $table->index(['refresh_excluded_at', 'synced_at'], 'anime_refresh_sweep_index');
        });
    }

    public function down(): void
    {
        Schema::table('anime', function (Blueprint $table) {
            $table->dropIndex('anime_refresh_sweep_index');
            $table->dropColumn(['refresh_excluded_at', 'refresh_exclusion_reason']);
        });
    }
};
