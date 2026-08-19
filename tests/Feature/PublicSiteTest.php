<?php

namespace Tests\Feature;

use App\Models\SystemComponent;
use App\Models\SystemIncident;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PublicSiteTest extends TestCase
{
    use RefreshDatabase;

    public function test_marketing_pages_render_with_server_side_metadata(): void
    {
        $this->get('/')
            ->assertOk()
            ->assertSee('One API for Payments in Bangladesh', false)
            ->assertSee('<link rel="canonical"', false);

        $this->get('/providers')->assertOk()->assertSee('Payment Providers —', false);
        $this->get('/pricing')->assertOk()->assertSee('Pricing —', false);
    }

    public function test_unknown_routes_return_404_but_still_render_the_app(): void
    {
        $this->get('/not-a-real-page')->assertNotFound()->assertSee('id="app"', false);
    }

    public function test_sitemap_and_robots_are_served(): void
    {
        $this->get('/sitemap.xml')
            ->assertOk()
            ->assertHeader('Content-Type', 'application/xml')
            ->assertSee('/providers', false);

        $this->get('/robots.txt')
            ->assertOk()
            ->assertSee('Sitemap:', false)
            ->assertSee('Disallow: /login', false);
    }

    public function test_status_endpoint_reports_the_worst_component_state(): void
    {
        SystemComponent::create(['key' => 'api', 'name' => 'API', 'status' => 'operational']);
        SystemComponent::create(['key' => 'webhooks', 'name' => 'Webhooks', 'status' => 'partial_outage']);

        SystemIncident::create([
            'title' => 'Webhook delivery delays',
            'summary' => 'Deliveries are retrying.',
            'state' => 'monitoring',
            'impact' => 'partial_outage',
            'started_at' => now()->subHour(),
        ]);

        $this->getJson('/api/public/platform-status')
            ->assertOk()
            ->assertJsonPath('data.overall', 'partial_outage')
            ->assertJsonCount(2, 'data.components')
            ->assertJsonPath('data.incidents.0.title', 'Webhook delivery delays');
    }

    public function test_status_is_unknown_when_no_component_is_registered(): void
    {
        $this->getJson('/api/public/platform-status')
            ->assertOk()
            ->assertJsonPath('data.overall', 'unknown');
    }

    public function test_pricing_returns_null_values_rather_than_invented_rates(): void
    {
        config()->set('marketing.pricing.orchestration.monthly', null);

        $response = $this->getJson('/api/public/pricing')->assertOk();

        $monthly = collect($response->json('data.plans.0.lines'))
            ->firstWhere('label', 'Monthly platform fee');

        $this->assertNull($monthly['value']);
    }

    public function test_pay_as_you_go_is_hidden_until_it_is_commercially_available(): void
    {
        $this->getJson('/api/public/pricing')->assertJsonPath('data.plans.1.available', false);

        config()->set('marketing.pricing.payg.enabled', true);

        $this->getJson('/api/public/pricing')->assertJsonPath('data.plans.1.available', true);
    }

    public function test_faqs_are_returned(): void
    {
        $this->getJson('/api/public/faqs')
            ->assertOk()
            ->assertJsonStructure(['data' => [['question', 'answer']]]);
    }
}
