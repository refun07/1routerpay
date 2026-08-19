<?php

namespace Tests\Feature;

use App\Models\Provider;
use App\Models\ProviderMetricDaily;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RankingsTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        config()->set('marketing.rankings_demo_data', false);
    }

    private function provider(string $slug, array $overrides = []): Provider
    {
        return Provider::create(array_merge([
            'slug' => $slug,
            'name' => ucfirst($slug),
            'short_description' => 'Demo provider.',
            'category' => 'mfs',
            'provider_type' => 'mfs',
            'methods' => ['mfs'],
            'methods_confirmed' => true,
            'currencies' => ['BDT'],
            'connection_type' => 'merchant_credentials',
            'integration_status' => 'coming_soon',
            'settlement_ownership' => 'Merchant agreement.',
            'is_public' => true,
        ], $overrides));
    }

    private function metric(Provider $provider, array $attributes = []): ProviderMetricDaily
    {
        return ProviderMetricDaily::create(array_merge([
            'provider_id' => $provider->id,
            'date' => now()->subDay()->toDateString(),
        ], $attributes));
    }

    public function test_it_reports_an_empty_state_when_nothing_has_been_measured(): void
    {
        $this->provider('alpha');

        $this->getJson('/api/public/rankings')
            ->assertOk()
            ->assertJsonPath('data.mode', 'empty')
            ->assertJsonCount(0, 'data.providers');
    }

    public function test_it_ranks_by_measured_availability(): void
    {
        $low = $this->provider('low');
        $high = $this->provider('high');

        $this->metric($low, ['probes_total' => 100, 'probes_healthy' => 80]);
        $this->metric($high, ['probes_total' => 100, 'probes_healthy' => 99]);

        $response = $this->getJson('/api/public/rankings')->assertOk();

        $response->assertJsonPath('data.mode', 'live');
        $this->assertSame(['high', 'low'], array_column($response->json('data.providers'), 'slug'));
        // JSON drops the trailing .0, so compare numerically rather than by type.
        $this->assertEqualsWithDelta(99.0, $response->json('data.providers.0.availability'), 0.001);
    }

    public function test_an_unmeasured_metric_is_null_rather_than_zero(): void
    {
        $provider = $this->provider('alpha');

        // Health was probed, but no payments were routed.
        $this->metric($provider, ['probes_total' => 10, 'probes_healthy' => 10]);

        $this->getJson('/api/public/rankings')
            ->assertOk()
            ->assertJsonPath('data.providers.0.success_rate', null)
            ->assertJsonPath('data.providers.0.payments_routed', 0);
    }

    public function test_unknown_outcomes_are_not_counted_as_failures(): void
    {
        $provider = $this->provider('alpha');

        $this->metric($provider, [
            'probes_total' => 10,
            'probes_healthy' => 10,
            'payments_routed' => 100,
            'payments_succeeded' => 90,
            'payments_failed' => 5,
            'payments_unknown' => 5,
        ]);

        $response = $this->getJson('/api/public/rankings')->assertOk();

        $this->assertEqualsWithDelta(90.0, $response->json('data.providers.0.success_rate'), 0.001);
        $this->assertEqualsWithDelta(5.0, $response->json('data.providers.0.unknown_rate'), 0.001);
    }

    public function test_it_only_counts_metrics_inside_the_window(): void
    {
        $provider = $this->provider('alpha');
        $this->metric($provider, ['date' => now()->subDays(45)->toDateString(), 'probes_total' => 10, 'probes_healthy' => 10]);

        $this->getJson('/api/public/rankings?window=7')->assertJsonPath('data.mode', 'empty');
        $this->getJson('/api/public/rankings?window=90')->assertJsonPath('data.mode', 'live');
    }

    public function test_it_rejects_an_arbitrary_window(): void
    {
        $this->getJson('/api/public/rankings?window=3650')->assertStatus(422);
    }

    public function test_private_providers_are_never_ranked_publicly(): void
    {
        $hidden = $this->provider('hidden', ['is_public' => false]);
        $this->metric($hidden, ['probes_total' => 10, 'probes_healthy' => 10]);

        $this->getJson('/api/public/rankings')->assertJsonPath('data.mode', 'empty');
    }

    public function test_it_breaks_a_provider_down_by_payment_method(): void
    {
        $pso = $this->provider('sslcommerz', ['provider_type' => 'pso']);

        $this->metric($pso, [
            'method' => 'bkash',
            'probes_total' => 100, 'probes_healthy' => 99,
            'payments_routed' => 200, 'payments_succeeded' => 190,
        ]);
        $this->metric($pso, [
            'method' => 'nagad',
            'probes_total' => 100, 'probes_healthy' => 90,
            'payments_routed' => 100, 'payments_succeeded' => 80,
        ]);

        $response = $this->getJson('/api/public/rankings?view=by_method')->assertOk();

        $response->assertJsonPath('data.view', 'by_method');
        $response->assertJsonPath('data.methods', ['bkash', 'nagad']);

        $this->assertEqualsWithDelta(95.0, $response->json('data.providers.0.methods.bkash.success_rate'), 0.001);
        $this->assertEqualsWithDelta(80.0, $response->json('data.providers.0.methods.nagad.success_rate'), 0.001);
    }

    public function test_provider_totals_are_the_sum_across_methods(): void
    {
        $pso = $this->provider('sslcommerz', ['provider_type' => 'pso']);

        $this->metric($pso, ['method' => 'bkash', 'payments_routed' => 200, 'payments_succeeded' => 190]);
        $this->metric($pso, ['method' => 'nagad', 'payments_routed' => 100, 'payments_succeeded' => 80]);

        $response = $this->getJson('/api/public/rankings?view=by_method')->assertOk();

        // 300 routed, 270 succeeded — no double counting of the per-method rows.
        $response->assertJsonPath('data.providers.0.totals.payments_routed', 300);
        $this->assertEqualsWithDelta(90.0, $response->json('data.providers.0.totals.success_rate'), 0.001);

        // The overall view must agree with the by-method totals.
        $overall = $this->getJson('/api/public/rankings')->assertOk();
        $overall->assertJsonPath('data.providers.0.payments_routed', 300);
    }

    public function test_an_unmeasured_pairing_is_simply_absent(): void
    {
        $pso = $this->provider('sslcommerz', ['provider_type' => 'pso']);
        $this->metric($pso, ['method' => 'bkash', 'payments_routed' => 10, 'payments_succeeded' => 10]);

        $response = $this->getJson('/api/public/rankings?view=by_method')->assertOk();

        // Nagad was never routed through this operator, so it is not a column
        // and not a zero — the UI renders an em dash for the gap.
        $this->assertSame(['bkash'], $response->json('data.methods'));
        $this->assertArrayNotHasKey('nagad', $response->json('data.providers.0.methods'));
    }

    public function test_it_rejects_an_unknown_view(): void
    {
        $this->getJson('/api/public/rankings?view=sideways')->assertStatus(422);
    }

    public function test_demo_data_is_labelled_and_disabled_in_production(): void
    {
        $this->provider('alpha');
        config()->set('marketing.rankings_demo_data', true);

        $response = $this->getJson('/api/public/rankings')->assertOk();
        $response->assertJsonPath('data.mode', 'demo');
        $this->assertStringContainsString('generated, not measured', $response->json('data.note'));

        // Production must never fabricate a number, whatever the flag says.
        app()['env'] = 'production';
        $this->getJson('/api/public/rankings')->assertJsonPath('data.mode', 'empty');
    }
}
