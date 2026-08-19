<?php

namespace Database\Seeders;

use App\Models\SystemComponent;
use Illuminate\Database\Seeder;

/**
 * Status components live in the database so the public status page never reads
 * an operational claim from a frontend constant.
 */
class SystemStatusSeeder extends Seeder
{
    public function run(): void
    {
        $components = [
            ['key' => 'api', 'name' => 'API', 'description' => 'Payment, refund and provider endpoints.'],
            ['key' => 'checkout', 'name' => 'Checkout', 'description' => 'Hosted checkout session creation.'],
            ['key' => 'dashboard', 'name' => 'Dashboard', 'description' => 'Merchant dashboard and reporting.'],
            ['key' => 'webhooks', 'name' => 'Webhooks', 'description' => 'Outbound event delivery.'],
            ['key' => 'routing', 'name' => 'Provider Routing', 'description' => 'Route selection and provider health checks.'],
        ];

        foreach ($components as $index => $component) {
            SystemComponent::updateOrCreate(
                ['key' => $component['key']],
                $component + ['sort_order' => $index]
            );
        }
    }
}
