<?php

namespace Tests\Feature\Api\V1\Contract;

use App\Models\User;
use Laravel\Pennant\Feature;
use Tests\TestCase;

/**
 * Base class for public-API contract tests.
 *
 * Contract tests pin down the JSON shape of each /api/v1 endpoint so that
 * third-party consumers (the Chrome extension, external integrations) can rely
 * on a stable schema. Behaviour is covered by PublicApiTest — these tests
 * exist solely to catch accidental changes to field names, nesting, and types.
 */
abstract class ApiContractTestCase extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        // Anime uses the Searchable trait; tests create records without a
        // running Scout engine, so stub it out.
        config()->set('scout.driver', 'null');
    }

    protected function enabledUser(array $attributes = []): User
    {
        $user = User::factory()->create($attributes);
        Feature::for($user)->activate('public-api');

        return $user;
    }

    /**
     * Issue a bearer token for the given user and return its plain-text form.
     */
    protected function bearerFor(User $user, string $name = 'Contract Test'): string
    {
        return $user->createToken($name)->plainTextToken;
    }

    /**
     * Authorization header array ready to pass to `withHeaders(...)`.
     *
     * @return array<string, string>
     */
    protected function bearerHeader(string $token): array
    {
        return ['Authorization' => "Bearer $token"];
    }
}
