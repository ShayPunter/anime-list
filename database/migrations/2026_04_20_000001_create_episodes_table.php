<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('episodes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('anime_id')->constrained('anime')->cascadeOnDelete();
            $table->unsignedSmallInteger('number');
            $table->string('title', 500)->nullable();
            $table->text('description')->nullable();
            $table->string('thumbnail_url', 1024)->nullable();
            $table->timestamp('air_date')->nullable();
            $table->unsignedSmallInteger('runtime_minutes')->nullable();
            $table->unsignedTinyInteger('score')->nullable();
            $table->unsignedBigInteger('anilist_airing_id')->nullable()->unique();
            $table->string('site_url', 1024)->nullable();
            $table->string('source_site', 50)->nullable();
            $table->timestamps();

            $table->unique(['anime_id', 'number']);
            $table->index('air_date');
            $table->index(['anime_id', 'air_date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('episodes');
    }
};
