<?php

namespace Tests\Feature;

use App\Models\Provider;
use App\Models\ProviderHealthSnapshot;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PublicProviderApiTest extends TestCase
{
    use RefreshDatabase;

    private function provider(array $overrides = []): Provider
    {
        return Provider::create(array_merge([
            'slug' => 'provider-alpha',
            'name' => 'Provider Alpha',
            'short_description' => 'Demo provider.',
            'category' => 'mfs',
            'methods' => ['mfs'],
            'methods_confirmed' => true,
            'currencies' => ['BDT'],
            'connection_type' => 'merchant_credentials',
            'integration_status' => 'available',
            'settlement_ownership' => 'Merchant agreement.',
            'is_public' => true,
        ], $overrides));
    }

    public function test_it_lists_public_providers(): void
    {
        $this->provider();

        $this->getJson('/api/public/providers')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.slug', 'provider-alpha');
    }

    public function test_it_hides_providers_that_are_not_public(): void
    {
        $this->provider(['slug' => 'hidden', 'name' => 'Hidden', 'is_public' => false]);

        $this->getJson('/api/public/providers')->assertOk()->assertJsonCount(0, 'data');
        $this->getJson('/api/public/providers/hidden')->assertNotFound();
    }

    public function test_it_filters_by_category_status_and_search(): void
    {
        $this->provider();
        $this->provider([
            'slug' => 'provider-beta',
            'name' => 'Provider Beta',
            'short_description' => 'Card acceptance.',
            'category' => 'card',
            'methods' => ['card'],
            'integration_status' => 'coming_soon',
        ]);

        $this->getJson('/api/public/providers?category=card')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.slug', 'provider-beta');

        $this->getJson('/api/public/providers?status=available')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.slug', 'provider-alpha');

        $this->getJson('/api/public/providers?search=Card')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.slug', 'provider-beta');
    }

    public function test_it_rejects_an_unknown_sort_value(): void
    {
        $this->getJson('/api/public/providers?sort=; DROP TABLE providers')
            ->assertStatus(422);
    }

    public function test_health_defaults_to_unknown_until_it_is_observed(): void
    {
        $provider = $this->provider();

        $this->getJson('/api/public/providers')->assertJsonPath('data.0.health', 'unknown');

        ProviderHealthSnapshot::create([
            'provider_id' => $provider->id,
            'status' => 'degraded',
            'observed_at' => now(),
        ]);

        $this->getJson('/api/public/providers')->assertJsonPath('data.0.health', 'degraded');
    }

    public function test_it_never_exposes_commercial_rates(): void
    {
        $this->provider();

        $response = $this->getJson('/api/public/providers/provider-alpha')->assertOk();

        $this->assertSame(
            [],
            array_intersect(['fee', 'rate', 'commercial_rate', 'pricing'], array_keys($response->json('data')))
        );
    }
}
