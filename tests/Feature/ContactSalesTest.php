<?php

namespace Tests\Feature;

use App\Models\SalesLead;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\RateLimiter;
use Tests\TestCase;

class ContactSalesTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        RateLimiter::clear('');
    }

    private function payload(array $overrides = []): array
    {
        return array_merge([
            'name' => 'Ayesha R',
            'work_email' => 'ayesha@example.com',
            'company' => 'Example Commerce',
            'monthly_volume' => '5,000 payments',
            'message' => 'We route MFS and cards today.',
            'consent' => true,
        ], $overrides);
    }

    public function test_it_stores_a_lead_without_storing_the_raw_ip(): void
    {
        $this->postJson('/api/public/contact-sales', $this->payload())
            ->assertCreated()
            ->assertJsonPath('data.message', 'Thanks — the team will get back to you shortly.');

        $lead = SalesLead::sole();

        $this->assertSame('Example Commerce', $lead->company);
        $this->assertTrue($lead->consented);
        $this->assertSame(64, strlen($lead->ip_hash));
        $this->assertStringNotContainsString('127.0.0.1', (string) $lead->ip_hash);
    }

    public function test_it_validates_required_fields(): void
    {
        $this->postJson('/api/public/contact-sales', [])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['name', 'work_email', 'company', 'consent']);

        $this->assertSame(0, SalesLead::count());
    }

    public function test_consent_must_be_given(): void
    {
        $this->postJson('/api/public/contact-sales', $this->payload(['consent' => false]))
            ->assertStatus(422)
            ->assertJsonValidationErrors('consent');
    }

    public function test_the_honeypot_field_rejects_bots(): void
    {
        $this->postJson('/api/public/contact-sales', $this->payload(['website' => 'http://spam.example']))
            ->assertStatus(422);

        $this->assertSame(0, SalesLead::count());
    }

    public function test_it_is_rate_limited(): void
    {
        foreach (range(1, 5) as $attempt) {
            $this->postJson('/api/public/contact-sales', $this->payload())->assertCreated();
        }

        $this->postJson('/api/public/contact-sales', $this->payload())->assertStatus(429);
    }
}
