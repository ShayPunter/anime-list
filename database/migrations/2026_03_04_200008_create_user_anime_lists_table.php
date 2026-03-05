<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('user_anime_lists', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('anime_id')->constrained('anime')->cascadeOnDelete();
            $table->string('status', 20);
            $table->unsignedTinyInteger('score')->default(0);
            $table->unsignedSmallInteger('progress')->default(0);
            $table->unsignedSmallInteger('rewatch_count')->default(0);
            $table->date('started_at')->nullable();
            $table->date('completed_at')->nullable();
            $table->text('notes')->nullable();
            $table->json('tags')->nullable();
            $table->boolean('is_private')->default(false);
            $table->boolean('is_rewatching')->default(false);
            $table->timestamps();
            $table->softDeletes();

            $table->unique(['user_id', 'anime_id']);
            $table->index(['user_id', 'status']);
            $table->index(['user_id', 'score']);
            $table->index(['user_id', 'updated_at']);
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_anime_lists');
    }
};
