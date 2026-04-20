<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('characters', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('anilist_id')->unique();
            $table->string('name_full');
            $table->string('name_native')->nullable();
            $table->string('image_large')->nullable();
            $table->string('image_medium')->nullable();
            $table->text('description')->nullable();
            $table->string('gender', 255)->nullable();
            $table->string('site_url')->nullable();
            $table->timestamps();

            $table->index('name_full');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('characters');
    }
};
