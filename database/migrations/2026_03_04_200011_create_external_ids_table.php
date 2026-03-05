<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('external_ids', function (Blueprint $table) {
            $table->id();
            $table->foreignId('anime_id')->constrained('anime')->cascadeOnDelete();
            $table->string('platform', 30);
            $table->string('external_id')->nullable();
            $table->string('url')->nullable();
            $table->timestamps();

            $table->unique(['anime_id', 'platform']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('external_ids');
    }
};
