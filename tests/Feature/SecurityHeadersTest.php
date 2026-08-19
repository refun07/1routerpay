<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SecurityHeadersTest extends TestCase
{
    use RefreshDatabase;

    public function test_baseline_headers_are_present_on_public_pages(): void
    {
        $response = $this->get('/');

        $response->assertHeader('X-Content-Type-Options', 'nosniff');
        $response->assertHeader('X-Frame-Options', 'DENY');
        $response->assertHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
        $this->assertStringContainsString("frame-ancestors 'none'", $response->headers->get('Content-Security-Policy'));
    }

    public function test_headers_also_cover_api_responses(): void
    {
        $this->getJson('/api/public/faqs')->assertHeader('X-Content-Type-Options', 'nosniff');
    }

    public function test_production_script_policy_uses_a_nonce_instead_of_unsafe_inline(): void
    {
        app()['env'] = 'production';

        $response = $this->get('/');
        $csp = $response->headers->get('Content-Security-Policy');

        $this->assertMatchesRegularExpression("/script-src 'self' 'nonce-[^']+'/", $csp);
        $this->assertStringNotContainsString("script-src 'self' 'unsafe-inline'", $csp);

        // The one inline script must carry the matching nonce, or it will not run.
        preg_match("/'nonce-([^']+)'/", $csp, $matches);
        $response->assertSee('nonce="'.$matches[1].'"', false);
    }
}
