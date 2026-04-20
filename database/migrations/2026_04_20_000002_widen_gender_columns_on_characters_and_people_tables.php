<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('characters', function (Blueprint $table) {
            $table->string('gender', 255)->nullable()->change();
        });

        Schema::table('people', function (Blueprint $table) {
            $table->string('gender', 255)->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('characters', function (Blueprint $table) {
            $table->string('gender', 32)->nullable()->change();
        });

        Schema::table('people', function (Blueprint $table) {
            $table->string('gender', 32)->nullable()->change();
        });
    }
};
