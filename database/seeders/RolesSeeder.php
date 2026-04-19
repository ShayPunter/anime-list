<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Seeder;

class RolesSeeder extends Seeder
{
    public function run(): void
    {
        $roles = [
            [
                'slug' => Role::OWNER,
                'name' => 'Owner',
                'description' => 'Full access to the application, including role management.',
            ],
            [
                'slug' => Role::CONTENT_MANAGER,
                'name' => 'Content Manager',
                'description' => 'Can create and edit site content.',
            ],
        ];

        foreach ($roles as $role) {
            Role::updateOrCreate(['slug' => $role['slug']], $role);
        }
    }
}
