<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;

class MakeAdminCommand extends Command
{
    protected $signature = 'make:admin {email : The email of the user to promote} {--revoke : Revoke admin access instead}';

    protected $description = 'Grant or revoke admin access for a user';

    public function handle(): int
    {
        $email = $this->argument('email');
        $user = User::where('email', $email)->first();

        if (! $user) {
            $this->error("No user found with email: {$email}");

            return self::FAILURE;
        }

        $revoke = $this->option('revoke');
        $user->update(['is_admin' => ! $revoke]);

        if ($revoke) {
            $this->info("Admin access revoked for {$user->name} ({$email})");
        } else {
            $this->info("Admin access granted to {$user->name} ({$email})");
        }

        return self::SUCCESS;
    }
}
