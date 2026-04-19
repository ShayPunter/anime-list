<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::table('user_anime_lists')
            ->where('score', '>', 0)
            ->update(['score' => DB::raw('ROUND(score / 10)')]);
    }

    public function down(): void
    {
        DB::table('user_anime_lists')
            ->where('score', '>', 0)
            ->update(['score' => DB::raw('score * 10')]);
    }
};
