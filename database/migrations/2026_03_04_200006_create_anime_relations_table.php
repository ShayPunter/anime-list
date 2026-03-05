<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('anime_relations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('anime_id')->constrained('anime')->cascadeOnDelete();
            $table->foreignId('related_anime_id')->constrained('anime')->cascadeOnDelete();
            $table->string('relation_type', 30);
            $table->timestamps();

            $table->unique(['anime_id', 'related_anime_id', 'relation_type'], 'anime_relations_unique');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('anime_relations');
    }
};
