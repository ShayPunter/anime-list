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
        Schema::table('studios', function (Blueprint $table) {
            $table->string('slug')->nullable()->unique()->after('name');
        });

        // Backfill slugs for existing studios
        $used = [];
        DB::table('studios')->orderBy('id')->each(function ($studio) use (&$used) {
            $base = Str::slug($studio->name) ?: 'studio-'.$studio->id;
            $slug = $base;
            $counter = 2;
            while (isset($used[$slug]) || DB::table('studios')->where('slug', $slug)->exists()) {
                $slug = "{$base}-{$counter}";
                $counter++;
            }
            $used[$slug] = true;
            DB::table('studios')->where('id', $studio->id)->update(['slug' => $slug]);
        });
    }

    public function down(): void
    {
        Schema::table('studios', function (Blueprint $table) {
            $table->dropUnique(['slug']);
            $table->dropColumn('slug');
        });
    }
};
