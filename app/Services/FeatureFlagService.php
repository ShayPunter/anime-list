<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\DB;
use Laravel\Pennant\Feature;

class FeatureFlagService
{
    /**
     * Per-request memo of fully-resolved flag maps, keyed by user id (or
     * 'guest'). Cleared automatically between requests because the service is
     * a fresh instance each time, but explicitly invalidated when overrides
     * change so admin tooling stays correct within a single request.
     *
     * @var array<string, array<string, bool>>
     */
    private array $resolvedCache = [];

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
            ->where('scope', '')
            ->first();

        if ($global) {
            return $global->value === 'true';
        }

        return false;
    }

    /**
     * Get all feature flags resolved for a user.
     *
     * Issues at most two queries (one user-scoped, one global) regardless of
     * how many flags are defined, to avoid N*2 hits on every request from the
     * Inertia middleware.
     */
    public function allForUser(?User $user): array
    {
        $cacheKey = $user ? 'u:'.$user->id : 'guest';
        if (isset($this->resolvedCache[$cacheKey])) {
            return $this->resolvedCache[$cacheKey];
        }

        $defined = Feature::defined();

        if (empty($defined)) {
            return $this->resolvedCache[$cacheKey] = [];
        }

        $scopes = [''];
        if ($user) {
            $scopes[] = $this->userScope($user);
        }

        $records = DB::table('features')
            ->whereIn('name', $defined)
            ->whereIn('scope', $scopes)
            ->get(['name', 'scope', 'value']);

        $userScope = $user ? $this->userScope($user) : null;
        $userOverrides = [];
        $globalOverrides = [];

        foreach ($records as $row) {
            if ($userScope !== null && $row->scope === $userScope) {
                $userOverrides[$row->name] = $row->value === 'true';
            } elseif ($row->scope === '') {
                $globalOverrides[$row->name] = $row->value === 'true';
            }
        }

        $result = [];
        foreach ($defined as $feature) {
            $result[$feature] = $userOverrides[$feature]
                ?? $globalOverrides[$feature]
                ?? false;
        }

        return $this->resolvedCache[$cacheKey] = $result;
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
                'scope' => '',
                'value' => $status === 'everyone' ? 'true' : 'false',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        } else {
            // Default: remove global override only
            DB::table('features')
                ->where('name', $feature)
                ->where('scope', '')
                ->delete();
        }

        $this->resolvedCache = [];
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

        $this->resolvedCache = [];
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

        $this->resolvedCache = [];
        Feature::flushCache();
    }

    private function userScope(User $user): string
    {
        return User::class.'|'.$user->id;
    }
}
