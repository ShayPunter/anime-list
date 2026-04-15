<?php

namespace Tests\Feature\Api\V1\Contract;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Laravel\Pennant\Feature;

class AuthContractTest extends ApiContractTestCase
{
    /** POST /api/v1/auth/token → 201 with token payload. */
    public function test_issue_token_response_shape(): void
    {
        $user = User::factory()->create(['password' => Hash::make('secret1234')]);
        Feature::for($user)->activate('public-api');

        $response = $this->postJson('/api/v1/auth/token', [
            'email' => $user->email,
            'password' => 'secret1234',
            'device_name' => 'Contract Suite',
        ]);

        $response->assertCreated()
            ->assertJsonStructure([
                'token',
                'token_id',
                'device_name',
                'user' => ['id', 'name', 'username', 'email'],
            ]);

        $this->assertIsString($response->json('token'));
        $this->assertIsInt($response->json('token_id'));
        $this->assertIsString($response->json('device_name'));
        $this->assertSame('Contract Suite', $response->json('device_name'));
        $this->assertIsInt($response->json('user.id'));
        $this->assertIsString($response->json('user.email'));

        // token_id must match the actual row so clients can use it in DELETE.
        $this->assertDatabaseHas('personal_access_tokens', [
            'id' => $response->json('token_id'),
            'tokenable_id' => $user->id,
            'name' => 'Contract Suite',
        ]);
    }

    /** POST /api/v1/auth/token with bad credentials → 422 validation error. */
    public function test_issue_token_validation_error_shape(): void
    {
        $user = User::factory()->create(['password' => Hash::make('secret1234')]);
        Feature::for($user)->activate('public-api');

        $this->postJson('/api/v1/auth/token', [
            'email' => $user->email,
            'password' => 'wrong',
            'device_name' => 'Contract Suite',
        ])
            ->assertStatus(422)
            ->assertJsonStructure(['message', 'errors' => ['email']]);
    }

    /** GET /api/v1/auth/tokens → 200 with token list. */
    public function test_list_tokens_response_shape(): void
    {
        $user = $this->enabledUser();
        $user->createToken('first-device');
        $token = $this->bearerFor($user, 'contract-runner');

        $response = $this->withHeaders($this->bearerHeader($token))
            ->getJson('/api/v1/auth/tokens');

        $response->assertOk()
            ->assertJsonStructure([
                'data' => [
                    '*' => ['id', 'device_name', 'last_used_at', 'created_at'],
                ],
            ]);

        $this->assertIsArray($response->json('data'));
        $this->assertCount(2, $response->json('data'));

        $first = $response->json('data.0');
        $this->assertIsInt($first['id']);
        $this->assertIsString($first['device_name']);
        $this->assertIsString($first['created_at']);
        // last_used_at is nullable ISO-8601.
        $this->assertTrue(
            $first['last_used_at'] === null || is_string($first['last_used_at']),
        );
    }

    /** DELETE /api/v1/auth/token → 204 No Content. */
    public function test_revoke_current_token_returns_no_content(): void
    {
        $user = $this->enabledUser();
        $token = $this->bearerFor($user);

        $response = $this->withHeaders($this->bearerHeader($token))
            ->deleteJson('/api/v1/auth/token');

        $response->assertStatus(204);
        $this->assertSame('', $response->getContent());
    }

    /** DELETE /api/v1/auth/tokens/{id} → 204 No Content. */
    public function test_revoke_specific_token_returns_no_content(): void
    {
        $user = $this->enabledUser();
        $target = $user->createToken('other-device')->accessToken;
        $token = $this->bearerFor($user);

        $response = $this->withHeaders($this->bearerHeader($token))
            ->deleteJson("/api/v1/auth/tokens/{$target->id}");

        $response->assertStatus(204);
        $this->assertSame('', $response->getContent());
    }

    /** DELETE /api/v1/auth/tokens/{id} for an unknown token → 404 with message key. */
    public function test_revoke_missing_token_returns_404_with_message(): void
    {
        $user = $this->enabledUser();
        $token = $this->bearerFor($user);

        $this->withHeaders($this->bearerHeader($token))
            ->deleteJson('/api/v1/auth/tokens/999999')
            ->assertStatus(404)
            ->assertJsonStructure(['message']);
    }
}
