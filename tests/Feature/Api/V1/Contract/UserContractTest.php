<?php

namespace Tests\Feature\Api\V1\Contract;

class UserContractTest extends ApiContractTestCase
{
    /** GET /api/v1/user → 200 with the authenticated user's profile. */
    public function test_me_response_shape(): void
    {
        $user = $this->enabledUser([
            'name' => 'Ada Lovelace',
            'username' => 'ada',
            'email' => 'ada@example.com',
            'bio' => 'Countess of Lovelace.',
            'timezone' => 'Europe/London',
            'list_is_public' => true,
        ]);
        $token = $this->bearerFor($user);

        $response = $this->withHeaders($this->bearerHeader($token))
            ->getJson('/api/v1/user');

        $response->assertOk()
            ->assertJsonStructure([
                'id',
                'name',
                'username',
                'email',
                'avatar_url',
                'bio',
                'timezone',
                'list_is_public',
                'created_at',
            ])
            ->assertJsonPath('id', $user->id)
            ->assertJsonPath('name', 'Ada Lovelace')
            ->assertJsonPath('username', 'ada')
            ->assertJsonPath('email', 'ada@example.com')
            ->assertJsonPath('bio', 'Countess of Lovelace.')
            ->assertJsonPath('timezone', 'Europe/London')
            ->assertJsonPath('list_is_public', true);

        $this->assertIsInt($response->json('id'));
        $this->assertIsBool($response->json('list_is_public'));
        $this->assertIsString($response->json('created_at'));
    }
}
