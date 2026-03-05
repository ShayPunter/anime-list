<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('airing_schedules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('anime_id')->constrained('anime')->cascadeOnDelete();
            $table->unsignedBigInteger('anilist_airing_id')->unique();
            $table->unsignedSmallInteger('episode');
            $table->timestamp('airs_at');
            $table->integer('time_until_airing')->nullable();
            $table->timestamps();

            $table->index(['anime_id', 'episode']);
            $table->index('airs_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('airing_schedules');
    }
};
