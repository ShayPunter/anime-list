<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('anime_studio', function (Blueprint $table) {
            $table->foreignId('anime_id')->constrained('anime')->cascadeOnDelete();
            $table->foreignId('studio_id')->constrained('studios')->cascadeOnDelete();
            $table->boolean('is_main')->default(false);
            $table->primary(['anime_id', 'studio_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('anime_studio');
    }
};
