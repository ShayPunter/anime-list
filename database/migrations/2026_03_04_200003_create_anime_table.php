<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('anime', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('anilist_id')->unique();
            $table->unsignedBigInteger('mal_id')->nullable()->unique();

            // Titles
            $table->string('title_romaji');
            $table->string('title_english')->nullable();
            $table->string('title_native')->nullable();
            $table->json('title_synonyms')->nullable();

            // Classification
            $table->string('format', 20)->nullable()->index();
            $table->string('status', 20)->nullable()->index();
            $table->string('season', 10)->nullable()->index();
            $table->unsignedSmallInteger('season_year')->nullable()->index();
            $table->string('source', 30)->nullable();

            // Episodes & Duration
            $table->unsignedSmallInteger('episodes')->nullable();
            $table->unsignedSmallInteger('duration')->nullable();
            $table->boolean('episode_count_unknown')->default(false);

            // Dates
            $table->date('aired_from')->nullable();
            $table->date('aired_to')->nullable();

            // Description
            $table->text('synopsis')->nullable();

            // Images
            $table->string('cover_image_large')->nullable();
            $table->string('cover_image_medium')->nullable();
            $table->string('cover_image_color', 7)->nullable();
            $table->string('banner_image')->nullable();

            // Media
            $table->string('trailer_url')->nullable();

            // Scores & Popularity (0-100 scale)
            $table->unsignedTinyInteger('average_score')->nullable()->index();
            $table->unsignedTinyInteger('mean_score')->nullable();
            $table->unsignedTinyInteger('bayesian_score')->nullable()->index();
            $table->unsignedInteger('popularity')->nullable()->index();
            $table->unsignedInteger('trending')->nullable();
            $table->unsignedInteger('favourites')->nullable();

            // Flags
            $table->boolean('is_adult')->default(false)->index();

            // Sync tracking
            $table->timestamp('anilist_updated_at')->nullable();
            $table->timestamp('synced_at')->nullable()->index();

            $table->timestamps();

            // Composite index
            $table->index(['season_year', 'season']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('anime');
    }
};
