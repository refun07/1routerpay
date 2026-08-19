<?php

namespace Tests\Feature;

use App\Models\Provider;
use Database\Seeders\ProviderSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProviderDirectoryTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(ProviderSeeder::class);
    }

    public function test_no_provider_is_seeded_as_a_live_partnership(): void
    {
        $this->assertSame(
            0,
            Provider::where('integration_status', 'available')->count(),
            'Seeding a provider as `available` implies a live commercial connection that does not exist.'
        );
    }

    public function test_no_provider_ships_with_a_logo_asset(): void
    {
        $this->assertSame(
            0,
            Provider::whereNotNull('logo_path')->count(),
            'Logos must come from approved assets supplied by the product owner, never from the repository.'
        );
    }

    public function test_every_provider_declares_use_cases(): void
    {
        Provider::each(function (Provider $provider) {
            $this->assertNotEmpty($provider->use_cases, "{$provider->slug} has no use cases.");
        });
    }

    public function test_it_filters_by_provider_type(): void
    {
        $response = $this->getJson('/api/public/providers?type=pso')->assertOk();

        $types = array_column($response->json('data'), 'provider_type');

        $this->assertNotEmpty($types);
        $this->assertSame(['pso'], array_values(array_unique($types)));
    }

    public function test_it_rejects_an_unknown_provider_type(): void
    {
        $this->getJson('/api/public/providers?type=bank-of-nowhere')->assertStatus(422);
    }

    public function test_search_matches_use_cases(): void
    {
        $response = $this->getJson('/api/public/providers?search=wholesale')->assertOk();

        $this->assertNotEmpty($response->json('data'));
        $this->assertSame('bank-transfer', $response->json('data.0.slug'));
    }

    public function test_the_logo_path_is_exposed_as_a_url_when_one_is_approved(): void
    {
        Provider::where('slug', 'sslcommerz')->update(['logo_path' => 'brand/providers/sslcommerz.svg']);

        $this->getJson('/api/public/providers/sslcommerz')
            ->assertOk()
            ->assertJsonPath('data.logo_path', asset('brand/providers/sslcommerz.svg'));
    }

    public function test_no_provider_record_asserts_a_licence(): void
    {
        // Regulatory claims belong to Bangladesh Bank, not to seed data.
        foreach (Provider::all() as $provider) {
            $text = strtolower($provider->description.' '.$provider->short_description);

            $this->assertStringNotContainsString('licensed by', $text);
            $this->assertStringNotContainsString('bangladesh bank approved', $text);
        }
    }
}
