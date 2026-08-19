<?php

/*
 | FAQ content.
 |
 | Kept in config rather than a CMS until business users genuinely need editing.
 | Answers are deliberately written to avoid regulatory claims that have not been
 | verified — see section 50 of the product specification.
 */

$product = env('PRODUCT_NAME', '1PayRouter');

return [
    [
        'question' => 'What is payment orchestration?',
        'answer' => "Payment orchestration is a layer between your application and your payment providers. Instead of integrating each provider separately, you integrate once and the orchestration layer handles provider selection, normalized responses, callback verification, and transaction visibility.",
    ],
    [
        'question' => "Is {$product} a payment gateway?",
        'answer' => "{$product} is designed as a payment orchestration and infrastructure layer. Actual payment processing and settlement may be performed by licensed payment providers and financial institutions, depending on the integration and commercial arrangement.",
    ],
    [
        'question' => 'Can I use my existing gateway accounts?',
        'answer' => "Where a provider permits third-party orchestration, you can connect your own provider credentials and keep your existing commercial relationship. Availability depends on each provider's terms, so connections are enabled only where they are contractually permitted.",
    ],
    [
        'question' => 'How does smart routing work?',
        'answer' => 'Routing evaluates the payment against your rules: provider availability, payment method support, merchant priority, commercial preferences, transaction context, and risk policy. The engine selects a preferred provider before the payment is initiated and records the decision for later inspection.',
    ],
    [
        'question' => 'What happens if a provider is down?',
        'answer' => 'Health monitoring marks the provider degraded and routing can exclude it from selection for new payments. Payments already in flight are not re-initiated automatically — they are resolved by querying the provider for their true state.',
    ],
    [
        'question' => 'Can a failed payment automatically be retried through another provider?',
        'answer' => "Only when it is safe. If a payment was never initiated with a provider, a different route can be selected or a new checkout session created. If a transaction may already have been authorized or charged, it is never re-attempted automatically — that risks charging a customer twice. Ambiguous transactions are held in an `unknown` state until the provider confirms the outcome.",
    ],
    [
        'question' => 'How are callbacks secured?',
        'answer' => 'Provider callbacks are verified server-to-server using signature validation, timestamps, and replay protection before any state change. A client-side redirect is never treated as proof of payment, and an unverified callback can never mark a transaction successful.',
    ],
    [
        'question' => "Does {$product} hold merchant funds?",
        'answer' => 'Settlement responsibilities are defined by each provider agreement. Funds flow according to the arrangement between the merchant and the licensed provider or financial institution involved in that connection.',
    ],
    [
        'question' => 'How does settlement work?',
        'answer' => 'Settlement is performed by the connected provider under the agreement that covers that connection. The platform records expected settlement data so operations teams can compare payments, fees, and refunds against what actually settles.',
    ],
    [
        'question' => "Can I use {$product} in sandbox mode?",
        'answer' => 'Yes. Sandbox and production are strictly separated, with distinct API keys prefixed `pr_test_` and `pr_live_`, separate credentials, and separate webhook endpoints.',
    ],
    [
        'question' => 'Which payment methods are supported?',
        'answer' => 'The provider directory lists every method and its current integration status, covering mobile financial services, cards, bank payments, internet banking, and QR rails as those connections become available.',
    ],
    [
        'question' => 'How is pricing calculated?',
        'answer' => 'Pricing depends on your plan and the providers you connect. Your applicable platform pricing, provider fees, taxes, and settlement terms are set out in your commercial agreement.',
    ],
];
