<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('username', 30)->nullable()->unique()->after('name');
        });

        // Backfill existing users with a slug of their name
        $users = DB::table('users')->get(['id', 'name']);
        foreach ($users as $user) {
            $base = Str::slug($user->name);
            $username = $base ?: 'user';
            $suffix = 0;
            while (DB::table('users')->where('username', $username)->where('id', '!=', $user->id)->exists()) {
                $suffix++;
                $username = $base.'-'.$suffix;
            }
            DB::table('users')->where('id', $user->id)->update(['username' => $username]);
        }

        Schema::table('users', function (Blueprint $table) {
            $table->string('username', 30)->nullable(false)->change();
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('username');
        });
    }
};
