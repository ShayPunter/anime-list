<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $now = now();

        $roles = [
            [
                'slug' => 'owner',
                'name' => 'Owner',
                'description' => 'Full access to the application, including role management.',
            ],
            [
                'slug' => 'content-manager',
                'name' => 'Content Manager',
                'description' => 'Can create and edit site content.',
            ],
        ];

        foreach ($roles as $role) {
            DB::table('roles')->updateOrInsert(
                ['slug' => $role['slug']],
                [
                    'name' => $role['name'],
                    'description' => $role['description'],
                    'created_at' => $now,
                    'updated_at' => $now,
                ],
            );
        }
    }

    public function down(): void
    {
        DB::table('roles')
            ->whereIn('slug', ['owner', 'content-manager'])
            ->delete();
    }
};
