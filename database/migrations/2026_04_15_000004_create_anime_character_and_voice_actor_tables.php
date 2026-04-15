<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('anime_character', function (Blueprint $table) {
            $table->id();
            $table->foreignId('anime_id')->constrained('anime')->cascadeOnDelete();
            $table->foreignId('character_id')->constrained('characters')->cascadeOnDelete();
            $table->string('role', 32)->nullable(); // MAIN, SUPPORTING, BACKGROUND
            $table->timestamps();

            $table->unique(['anime_id', 'character_id']);
            $table->index('role');
        });

        Schema::create('character_voice_actor', function (Blueprint $table) {
            $table->id();
            $table->foreignId('anime_id')->constrained('anime')->cascadeOnDelete();
            $table->foreignId('character_id')->constrained('characters')->cascadeOnDelete();
            $table->foreignId('person_id')->constrained('people')->cascadeOnDelete();
            $table->string('language', 32)->default('JAPANESE');
            $table->timestamps();

            $table->unique(
                ['anime_id', 'character_id', 'person_id', 'language'],
                'cva_unique',
            );
            $table->index(['person_id', 'anime_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('character_voice_actor');
        Schema::dropIfExists('anime_character');
    }
};
