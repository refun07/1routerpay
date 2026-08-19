<?php

/*
 | Marketing / brand configuration.
 |
 | The product name is a working name and must stay renameable in one place.
 | Never put secrets in this file — it is safe to expose to the frontend.
 */

return [
    'product_name' => env('PRODUCT_NAME', '1PayRouter'),
    'tagline' => 'The unified payment layer for Bangladesh',

    'support_email' => env('SUPPORT_EMAIL', 'support@example.com'),
    'sales_email' => env('SALES_EMAIL', 'sales@example.com'),

    /*
     | Pricing is intentionally null until business teams configure it.
     | The UI renders "Configurable" / hides the plan rather than inventing a rate.
     */
    'pricing' => [
        'orchestration' => [
            'setup' => env('PRICING_ORCHESTRATION_SETUP'),
            'monthly' => env('PRICING_ORCHESTRATION_MONTHLY'),
            'routing_rate' => env('PRICING_ORCHESTRATION_RATE'),
        ],
        'payg' => [
            // Plan B is only shown when it is commercially available.
            'enabled' => env('PRICING_PAYG_ENABLED', false),
            'rate_from' => env('PRICING_PAYG_RATE_FROM'),
            'no_charge_on_failure' => env('PRICING_PAYG_NO_CHARGE_ON_FAILURE', false),
        ],
    ],

    /*
     | Primary links. `docs` is null until documentation actually exists — the
     | UI then falls back to the developer reference instead of linking to a 404.
     */
    'links' => [
        'docs' => env('DOCS_URL'),
        'status' => '/status',
        'sales' => '/contact-sales',
    ],

    /*
     | Footer navigation.
     |
     | A null href means "planned but not published yet" and the entry is simply
     | not rendered. Never point a live link at a page that does not exist, and
     | never invent a legal document to fill a column.
     */
    'footer_links' => [
        'Product' => [
            'Providers' => '/providers',
            'Routing' => '/routing',
            'Pricing' => '/pricing',
            'Enterprise' => '/contact-sales',
            'Status' => '/status',
        ],
        'Developers' => [
            'API Reference' => '/developers',
            'Payment states' => '/developers#quickstart',
            'Webhooks' => '/developers#webhooks',
            'Documentation' => env('DOCS_URL', '/docs'),
            'Quickstart' => env('DOCS_QUICKSTART_URL', '/docs#get-a-key'),
            'Rankings' => '/rankings',
            'Benchmarks' => '/benchmarks',
            'SDKs' => env('DOCS_SDKS_URL'),
            'Changelog' => env('CHANGELOG_URL'),
        ],
        'Company' => [
            'Contact' => '/contact-sales',
            'About' => env('ABOUT_URL'),
            'Careers' => env('CAREERS_URL'),
            'Blog' => env('BLOG_URL'),
        ],
        'Legal' => [
            'Privacy' => env('LEGAL_PRIVACY_URL'),
            'Terms' => env('LEGAL_TERMS_URL'),
            'Acceptable Use' => env('LEGAL_ACCEPTABLE_USE_URL'),
            'Security' => env('LEGAL_SECURITY_URL'),
            'Compliance' => env('LEGAL_COMPLIANCE_URL'),
        ],
    ],

    /*
     | Only real, existing accounts belong here. Empty means the link is not rendered.
     */
    'social' => [
        'github' => env('SOCIAL_GITHUB'),
        'linkedin' => env('SOCIAL_LINKEDIN'),
        'x' => env('SOCIAL_X'),
    ],

    /*
     | Launch-state hero metrics. These are product facts, not performance claims.
     | Replace with live data only once real production numbers exist.
     */
    'hero_metrics' => [
        ['value' => 'One API', 'label' => 'Unified integration'],
        ['value' => 'Multi-provider', 'label' => 'Routing ready'],
        ['value' => '24/7', 'label' => 'Health monitoring architecture'],
        ['value' => 'BDT', 'label' => 'Native transaction currency'],
    ],

    'api_base_url' => env('PUBLIC_API_BASE_URL', 'https://api.example.com'),

    /*
     | Renders the rankings page with clearly-labelled synthetic rows so the
     | layout can be reviewed before real traffic exists. Forced off in
     | production — the page shows an honest empty state there instead.
     */
    'rankings_demo_data' => env('RANKINGS_DEMO_DATA', false),

    /*
     | What to show for a provider that has no approved logo yet.
     |
     |   monogram — tinted initials (default)
     |   none     — no mark at all; the name stands on its own
     */
    'provider_mark_fallback' => env('PROVIDER_MARK_FALLBACK', 'monogram'),
];
