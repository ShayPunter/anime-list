<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\DB;
use Laravel\Pennant\Feature;

class FeatureFlagService
{
    /**
     * Check if a feature is active for a user.
     * Resolution order: user-specific override → global override → default (false).
     */
    public function active(string $feature, ?User $user): bool
    {
        if ($user) {
            $scope = $this->userScope($user);
            $userRecord = DB::table('features')
                ->where('name', $feature)
                ->where('scope', $scope)
                ->first();

            if ($userRecord) {
                return $userRecord->value === 'true';
            }
        }

        $global = DB::table('features')
            ->where('name', $feature)
            ->whereNull('scope')
            ->first();

        if ($global) {
            return $global->value === 'true';
        }

        return false;
    }

    /**
     * Get all feature flags resolved for a user.
     */
    public function allForUser(?User $user): array
    {
        $defined = Feature::defined();
        $result = [];

        foreach ($defined as $feature) {
            $result[$feature] = $this->active($feature, $user);
        }

        return $result;
    }

    /**
     * Set global status: everyone, nobody, or default.
     */
    public function setGlobalStatus(string $feature, string $status): void
    {
        // Remove all user-specific overrides when setting global
        if ($status === 'everyone' || $status === 'nobody') {
            DB::table('features')
                ->where('name', $feature)
                ->delete();

            DB::table('features')->insert([
                'name' => $feature,
                'scope' => null,
                'value' => $status === 'everyone' ? 'true' : 'false',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        } else {
            // Default: remove global override only
            DB::table('features')
                ->where('name', $feature)
                ->whereNull('scope')
                ->delete();
        }

        Feature::flushCache();
    }

    /**
     * Activate a feature for a specific user.
     */
    public function activateForUser(string $feature, User $user): void
    {
        DB::table('features')->updateOrInsert(
            ['name' => $feature, 'scope' => $this->userScope($user)],
            ['value' => 'true', 'updated_at' => now()],
        );

        Feature::flushCache();
    }

    /**
     * Remove a user-specific override.
     */
    public function forgetForUser(string $feature, User $user): void
    {
        DB::table('features')
            ->where('name', $feature)
            ->where('scope', $this->userScope($user))
            ->delete();

        Feature::flushCache();
    }

    private function userScope(User $user): string
    {
        return User::class.'|'.$user->id;
    }
}
