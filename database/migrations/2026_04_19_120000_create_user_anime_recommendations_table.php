<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('user_anime_recommendations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('anime_id')->constrained('anime')->cascadeOnDelete();
            $table->decimal('score', 8, 4);
            $table->string('strategy', 20)->default('hybrid');
            $table->unsignedSmallInteger('rank');
            $table->timestamp('computed_at');
            $table->timestamps();

            $table->unique(['user_id', 'anime_id']);
            $table->index(['user_id', 'rank']);
            $table->index('computed_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_anime_recommendations');
    }
};
