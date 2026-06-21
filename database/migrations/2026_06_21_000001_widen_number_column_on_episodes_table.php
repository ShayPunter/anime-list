<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * AniList's `episode` field is a 32-bit Int and some media report episode
     * numbers above the unsignedSmallInteger ceiling (65535), which caused the
     * SyncAnimePage batch upsert to fail with SQLSTATE[22003] "Out of range
     * value for column 'number'". Widen to unsignedInteger so any AniList Int
     * value fits.
     */
    public function up(): void
    {
        Schema::table('episodes', function (Blueprint $table) {
            $table->unsignedInteger('number')->change();
        });
    }

    public function down(): void
    {
        Schema::table('episodes', function (Blueprint $table) {
            $table->unsignedSmallInteger('number')->change();
        });
    }
};
