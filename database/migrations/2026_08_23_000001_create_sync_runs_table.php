<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('sync_runs', function (Blueprint $table) {
            $table->id();
            // full, incremental, finished_incremental, targeted, schedule, stale_refresh
            $table->string('mode', 40);
            // Distinguishes concurrent runs of the same mode, e.g. the
            // RELEASING and NOT_YET_RELEASED targeted syncs.
            $table->string('label', 80)->nullable();
            // running, paused, completed, failed, superseded
            $table->string('status', 20)->default('running');
            $table->unsignedInteger('current_page')->default(0);
            $table->unsignedInteger('last_page')->default(0);
            $table->unsignedInteger('total_items')->default(0);
            $table->unsignedInteger('processed_items')->default(0);
            // Unix timestamp this run used as its "updated since" cutoff.
            $table->unsignedInteger('cutoff_at')->nullable();
            $table->timestamp('started_at')->nullable();
            $table->timestamp('heartbeat_at')->nullable();
            $table->timestamp('finished_at')->nullable();
            $table->text('last_error')->nullable();
            $table->timestamps();

            $table->index(['mode', 'label', 'started_at']);
            $table->index(['mode', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sync_runs');
    }
};
