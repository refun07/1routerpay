<?php

namespace App\Support;

/**
 * Server-side SEO metadata for the public SPA.
 *
 * The React app is mounted by a Laravel-rendered shell, so title/description/canonical
 * are present in the initial HTML response and never depend on client-side JavaScript.
 */
class PageMeta
{
    /**
     * @return array{title: string, description: string, canonical: string}
     */
    public static function for(string $page): array
    {
        $product = config('marketing.product_name');
        $meta = self::definitions($product)[$page] ?? self::definitions($product)['home'];

        return [
            'title' => $meta['title'],
            'description' => $meta['description'],
            'canonical' => url()->current(),
        ];
    }

    /**
     * @return array<string, array{title: string, description: string}>
     */
    private static function definitions(string $product): array
    {
        return [
            'home' => [
                'title' => "{$product} — One API for Payments in Bangladesh",
                'description' => 'Connect and manage multiple payment providers through one developer-friendly payment orchestration layer. Route payments, monitor provider health, and simplify reconciliation.',
            ],
            'providers' => [
                'title' => "Payment Providers — {$product}",
                'description' => "Browse the payment providers and methods available through {$product}, including MFS, cards, and bank payments, with integration status for each connection.",
            ],
            'routing' => [
                'title' => "Payment Routing — {$product}",
                'description' => 'Define how payment providers are selected using availability, method support, merchant priority, commercial rules, and transaction context.',
            ],
            'pricing' => [
                'title' => "Pricing — {$product}",
                'description' => "Pricing for {$product} payment orchestration: bring your own provider accounts, or talk to sales about enterprise routing, SLA, and volume pricing.",
            ],
            'developers' => [
                'title' => "Developers — {$product}",
                'description' => 'A consistent payment object across providers: predictable states, signed webhooks, idempotency keys, and clear routing visibility.',
            ],
            'status' => [
                'title' => "System Status — {$product}",
                'description' => "Current operational status for {$product} API, checkout, dashboard, webhooks, and provider routing.",
            ],
            'rankings' => [
                'title' => "Provider Rankings — {$product}",
                'description' => 'Measured availability, routing latency, and volume for every connected payment provider. Nothing here is estimated.',
            ],
            'benchmarks' => [
                'title' => "Routing Benchmarks — {$product}",
                'description' => 'How provider availability, success, and routing latency are measured, what counts as a failure, and what is deliberately excluded.',
            ],
            'docs' => [
                'title' => "Quickstart — {$product} Docs",
                'description' => 'Go from an API key to your first routed payment: create a payment, handle the response, verify the webhook, and go live.',
            ],
            'dashboard' => [
                'title' => "Dashboard — {$product}",
                'description' => "Manage your {$product} organization and API keys.",
            ],
            'login' => [
                'title' => "Sign in — {$product}",
                'description' => "Sign in to your {$product} account.",
            ],
            'register' => [
                'title' => "Create your account — {$product}",
                'description' => "Create a {$product} account and generate sandbox API keys.",
            ],
            'contact-sales' => [
                'title' => "Talk to Sales — {$product}",
                'description' => "Contact the {$product} team about enterprise routing, provider strategy, and volume pricing.",
            ],
        ];
    }
}
