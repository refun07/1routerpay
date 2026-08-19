<?php

namespace Tests\Feature;

use App\Models\ApiKey;
use App\Models\Organization;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ApiKeyTest extends TestCase
{
    use RefreshDatabase;

    private function actingAsMerchant(string $email = 'owner@example.com'): array
    {
        $user = User::factory()->create(['email' => $email]);
        $organization = Organization::create([
            'name' => 'Example Commerce',
            'slug' => Organization::uniqueSlug('Example Commerce'.$email),
        ]);
        $organization->users()->attach($user->id, ['role' => 'owner']);

        $this->actingAs($user);

        return [$user, $organization];
    }

    public function test_api_keys_require_authentication(): void
    {
        $this->getJson('/api/dashboard/api-keys')->assertUnauthorized();
        $this->postJson('/api/dashboard/api-keys', ['label' => 'x', 'environment' => 'test'])
            ->assertUnauthorized();
    }

    public function test_creating_a_key_returns_the_secret_exactly_once(): void
    {
        $this->actingAsMerchant();

        $created = $this->postJson('/api/dashboard/api-keys', [
            'label' => 'Checkout server',
            'environment' => 'test',
        ])->assertCreated();

        $plaintext = $created->json('data.plaintext');

        $this->assertStringStartsWith('pr_test_', $plaintext);

        // Listing the keys must never expose it again.
        $listed = $this->getJson('/api/dashboard/api-keys')->assertOk();

        $this->assertStringNotContainsString($plaintext, $listed->getContent());
        $this->assertNull($listed->json('data.0.plaintext'));
    }

    public function test_only_a_hash_is_persisted(): void
    {
        $this->actingAsMerchant();

        $plaintext = $this->postJson('/api/dashboard/api-keys', [
            'label' => 'Checkout server',
            'environment' => 'live',
        ])->json('data.plaintext');

        $key = ApiKey::sole();

        $this->assertSame(hash('sha256', $plaintext), $key->hash);
        $this->assertStringNotContainsString($plaintext, json_encode($key->toArray()));

        // The hash is still enough to authenticate a future request.
        $this->assertTrue(ApiKey::findByPlaintext($plaintext)?->is($key));
    }

    public function test_the_environment_is_visible_in_the_prefix(): void
    {
        $this->actingAsMerchant();

        $live = $this->postJson('/api/dashboard/api-keys', ['label' => 'Live', 'environment' => 'live'])
            ->json('data.plaintext');
        $test = $this->postJson('/api/dashboard/api-keys', ['label' => 'Test', 'environment' => 'test'])
            ->json('data.plaintext');

        $this->assertStringStartsWith('pr_live_', $live);
        $this->assertStringStartsWith('pr_test_', $test);
    }

    public function test_a_revoked_key_stops_authenticating(): void
    {
        $this->actingAsMerchant();

        $plaintext = $this->postJson('/api/dashboard/api-keys', ['label' => 'Temp', 'environment' => 'test'])
            ->json('data.plaintext');

        $id = ApiKey::sole()->id;

        $this->deleteJson("/api/dashboard/api-keys/{$id}")->assertOk();

        $this->assertNotNull(ApiKey::sole()->revoked_at);
        $this->assertNull(ApiKey::findByPlaintext($plaintext));
    }

    public function test_an_organization_cannot_see_or_revoke_another_organizations_keys(): void
    {
        [, $first] = $this->actingAsMerchant('first@example.com');
        $key = ApiKey::issue($first, 'First key', 'test')['key'];

        $this->actingAsMerchant('second@example.com');

        $this->getJson('/api/dashboard/api-keys')->assertOk()->assertJsonCount(0, 'data');
        $this->deleteJson("/api/dashboard/api-keys/{$key->id}")->assertForbidden();

        $this->assertNull($key->fresh()->revoked_at);
    }

    public function test_it_validates_the_environment(): void
    {
        $this->actingAsMerchant();

        $this->postJson('/api/dashboard/api-keys', ['label' => 'x', 'environment' => 'production'])
            ->assertStatus(422)
            ->assertJsonValidationErrors('environment');
    }
}
