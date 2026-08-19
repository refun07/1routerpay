<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MarketingLinksTest extends TestCase
{
    use RefreshDatabase;

    private function brandPayload(): array
    {
        preg_match('/window\.__PAYROUTER__ = (.*?);<\/script>/s', $this->get('/')->getContent(), $matches);

        return json_decode($matches[1], true);
    }

    public function test_unpublished_links_are_not_sent_to_the_frontend(): void
    {
        config()->set('marketing.footer_links', [
            'Product' => ['Providers' => '/providers'],
            'Legal' => ['Privacy' => null, 'Terms' => null],
        ]);

        $footer = $this->brandPayload()['footerLinks'];

        $this->assertSame(['Product' => ['Providers' => '/providers']], $footer);
        $this->assertArrayNotHasKey('Legal', $footer, 'A column with nothing published must be dropped.');
    }

    public function test_published_links_are_sent_through(): void
    {
        config()->set('marketing.footer_links', [
            'Legal' => ['Privacy' => 'https://example.com/privacy', 'Terms' => null],
        ]);

        $this->assertSame(
            ['Legal' => ['Privacy' => 'https://example.com/privacy']],
            $this->brandPayload()['footerLinks']
        );
    }

    public function test_docs_link_is_null_until_documentation_exists(): void
    {
        config()->set('marketing.links.docs', null);
        $this->assertNull($this->brandPayload()['links']['docs']);

        config()->set('marketing.links.docs', 'https://docs.example.com');
        $this->assertSame('https://docs.example.com', $this->brandPayload()['links']['docs']);
    }

    public function test_only_configured_social_accounts_are_exposed(): void
    {
        config()->set('marketing.social', ['github' => null, 'linkedin' => 'https://linkedin.com/company/x', 'x' => null]);

        $this->assertSame(
            ['linkedin' => 'https://linkedin.com/company/x'],
            $this->brandPayload()['social']
        );
    }

    public function test_the_brand_payload_carries_no_secrets(): void
    {
        $payload = json_encode($this->brandPayload());

        foreach (['APP_KEY', config('app.key'), 'password', 'secret_key'] as $needle) {
            $this->assertStringNotContainsString((string) $needle, $payload);
        }
    }
}
