import { brand } from '@/lib/brand';
import type { Language } from '@/lib/highlight';

/**
 * Example snippets shown on the marketing site.
 *
 * The keys are placeholders (`pr_live_xxxxxxxxx`) — no real secret, and no
 * secret of any kind, ever appears in frontend code.
 */

const base = brand.apiBaseUrl;

export type Snippet = { id: string; label: string; language: Language; code: string };

export const CREATE_PAYMENT_SNIPPETS: Snippet[] = [
    {
        id: 'curl',
        label: 'cURL',
        language: 'bash',
        code: `curl ${base}/v1/payments \\
  -H "Authorization: Bearer pr_live_xxxxxxxxx" \\
  -H "Content-Type: application/json" \\
  -d '{
    "amount": 2500,
    "currency": "BDT",
    "payment_method": "mfs",
    "routing": "smart",
    "reference": "ORDER-1048"
  }'`,
    },
    {
        id: 'javascript',
        label: 'JavaScript',
        language: 'javascript',
        code: `const response = await fetch('${base}/v1/payments', {
  method: 'POST',
  headers: {
    Authorization: \`Bearer \${PAYROUTER_API_KEY}\`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    amount: 2500,
    currency: 'BDT',
    payment_method: 'mfs',
    routing: 'smart',
    reference: 'ORDER-1048',
  }),
});

const payment = await response.json();`,
    },
    {
        id: 'php',
        label: 'PHP',
        language: 'php',
        code: `$response = Http::withToken(config('services.payrouter.key'))
    ->post('${base}/v1/payments', [
        'amount' => 2500,
        'currency' => 'BDT',
        'payment_method' => 'mfs',
        'routing' => 'smart',
        'reference' => 'ORDER-1048',
    ]);

$payment = $response->json();`,
    },
];

export const PAYMENT_RESPONSE = `{
  "id": "pay_01J...",
  "status": "pending",
  "currency": "BDT",
  "amount": 2500,
  "route": {
    "mode": "smart",
    "provider": "provider_slug"
  },
  "checkout_url": "https://checkout.example.com/..."
}`;

export const WEBHOOK_EVENT = `{
  "id": "evt_01J...",
  "type": "payment.succeeded",
  "created_at": "2026-08-17T04:30:00Z",
  "data": {
    "payment_id": "pay_01J...",
    "merchant_reference": "ORDER-1048",
    "amount": 2500,
    "currency": "BDT",
    "provider": "provider_slug",
    "provider_payment_id": "redacted"
  }
}`;

export const API_ENDPOINTS: { method: string; path: string; description: string }[] = [
    { method: 'POST', path: '/v1/payments', description: 'Create a payment and select a route.' },
    { method: 'GET', path: '/v1/payments/{id}', description: 'Read the normalized payment state.' },
    { method: 'POST', path: '/v1/payments/{id}/cancel', description: 'Cancel a payment that has not completed.' },
    { method: 'POST', path: '/v1/refunds', description: 'Refund a settled or captured payment.' },
    { method: 'GET', path: '/v1/refunds/{id}', description: 'Read refund state.' },
    { method: 'GET', path: '/v1/providers', description: 'List connected providers and capabilities.' },
    { method: 'GET', path: '/v1/provider-health', description: 'Current health for each connection.' },
    { method: 'GET', path: '/v1/transactions', description: 'Search normalized transactions.' },
    { method: 'GET', path: '/v1/settlements', description: 'Expected and received settlements.' },
    { method: 'GET', path: '/v1/reconciliation', description: 'Matched, unmatched and mismatched records.' },
    { method: 'POST', path: '/v1/webhooks/test', description: 'Send a signed test event to an endpoint.' },
];
