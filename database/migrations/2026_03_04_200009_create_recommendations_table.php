<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('recommendations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('anime_id')->constrained('anime')->cascadeOnDelete();
            $table->foreignId('recommended_anime_id')->constrained('anime')->cascadeOnDelete();
            $table->string('source', 20)->default('anilist');
            $table->unsignedBigInteger('anilist_recommendation_id')->nullable()->unique();
            $table->integer('rating')->default(0);
            $table->timestamps();

            $table->unique(['anime_id', 'recommended_anime_id', 'source'], 'recommendations_unique');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('recommendations');
    }
};
