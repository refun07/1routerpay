# PayRouter BD — OpenRouter-Inspired Payment Orchestration Landing Page
## Product + UI/UX + Laravel/React Implementation Specification

> **Working name:** `PayRouter BD`
>
> This is a temporary product name and must be implemented as a configurable brand variable so it can be renamed globally later.
>
> **Core positioning:**  
> **The Unified Payment Layer for Bangladesh**
>
> **Core promise:**  
> One API to connect, route, monitor, and reconcile payments across multiple payment providers.
>
> **Important:** This product may integrate with licensed PSPs/PSOs/payment gateways. Do not imply that PayRouter itself is licensed, holds customer funds, guarantees settlement, or directly provides a regulated payment service unless that is legally and contractually true.
>
> **Design inspiration:** OpenRouter's developer-first clarity, unified-access concept, dense-but-clean marketplace feel, dark interface, metrics, routing language, and API-first onboarding.
>
> **Do not clone OpenRouter.** Do not copy its logo, exact copy, source code, component structure, illustrations, spacing, or page composition pixel-for-pixel. Create an original payment infrastructure brand with a similar level of clarity and technical confidence.

---

# 1. Claude Build Instruction

Build a production-quality, responsive landing page and supporting public frontend for a Bangladesh-focused payment orchestration platform using:

- Laravel backend
- React.js frontend
- MySQL
- REST API
- Tailwind CSS
- Vite
- TypeScript preferred for React
- Laravel Sanctum for authenticated dashboard/API sessions where appropriate
- Redis-ready caching architecture
- Queue-ready Laravel jobs for non-blocking tasks
- Clean component architecture
- SEO-friendly public pages
- Accessible semantic HTML
- Dark mode first
- Mobile-first responsive design

The first deliverable is the **public website / landing experience**, but the codebase must be structured so a merchant dashboard, provider dashboard, admin panel, API keys, transaction routing, analytics, reconciliation, and billing can be added without rewriting the frontend architecture.

---

# 2. Product Concept

PayRouter BD is a payment orchestration layer.

Instead of a merchant maintaining separate application logic for multiple gateways, the merchant integrates one PayRouter API.

Conceptual flow:

```text
Customer
   ↓
Merchant Checkout
   ↓
PayRouter Unified Payment API
   ↓
Routing Engine
   ├── Provider A
   ├── Provider B
   ├── Provider C
   └── Future Providers
   ↓
Licensed payment rails / banks / MFS
   ↓
Merchant settlement according to provider agreement
```

The public website should make this idea understandable within 5–8 seconds.

The visitor should immediately understand:

1. This is infrastructure for online businesses.
2. It connects multiple payment providers through one integration.
3. It can make payment operations more resilient.
4. It gives developers one clean API.
5. It gives finance/operations teams one dashboard for visibility and reconciliation.

---

# 3. Primary Audiences

## 3.1 Developers

Need:
- One consistent API
- Clear documentation
- Sandbox
- API keys
- Webhooks
- Error normalization
- SDK/code examples
- Provider abstraction
- Minimal integration time

Primary CTA:
`Get API Key`

Secondary CTA:
`Read the Docs`

---

## 3.2 Founders / Ecommerce Operators

Need:
- Higher payment availability
- Less dependency on one provider
- Easy provider switching
- Better checkout reliability
- Better payment visibility

Primary CTA:
`Start Building`

Secondary CTA:
`See How Routing Works`

---

## 3.3 Finance / Operations Teams

Need:
- Unified transactions
- Settlement visibility
- Reconciliation
- Provider fee visibility
- Refund tracking
- Mismatch identification
- Exportable reports

Primary CTA:
`Explore Dashboard`

---

## 3.4 Enterprise Merchants

Need:
- SLA
- Routing policies
- Multiple provider contracts
- Provider health
- Roles/permissions
- Audit logs
- Custom limits
- Dedicated support
- Security and compliance documentation

Primary CTA:
`Talk to Sales`

---

# 4. Brand Personality

The brand should feel:

- Developer-first
- Infrastructure-grade
- Financially trustworthy
- Fast
- Precise
- Calm
- Modern
- Not “bank corporate”
- Not “crypto”
- Not a generic colorful fintech template
- Not overly decorative
- Not AI-generated-looking

Tone of copy:

- Short
- Confident
- Technical when useful
- No exaggerated “revolutionary” language
- No fake claims
- No fabricated customer logos
- No fabricated GMV
- No fabricated success rate
- No fake testimonials

Preferred writing style:

```text
One API. Multiple payment providers.
Route every payment with more control.
```

Avoid:

```text
We are revolutionizing the future of digital finance with cutting-edge next-generation solutions.
```

---

# 5. Visual Direction

## 5.1 General Look

Create an original dark developer-infrastructure aesthetic.

Think:
- Technical
- Dense information displayed elegantly
- Large clean typography
- Thin borders
- Subtle grid
- Soft shadows
- Data cards
- Status indicators
- Monospace details
- Minimal gradients
- Strong whitespace
- Small restrained animations

Do not use generic:
- 3D coins
- Flying credit cards
- Stock fintech illustrations
- Random glassmorphism
- Giant neon gradients
- Fake dashboard screenshots made of meaningless data

---

# 6. Color System

Use CSS variables / Tailwind design tokens.

```css
--background: #090B0D;
--surface: #101316;
--surface-raised: #15191D;
--surface-soft: #191E23;

--text-primary: #F5F7F8;
--text-secondary: #9CA6AF;
--text-muted: #68727C;

--border: #242A30;
--border-strong: #343C44;

--brand: #DFFE52;
--brand-hover: #E8FF85;
--brand-dark: #A8C830;

--success: #4ADE80;
--warning: #FACC15;
--danger: #FB7185;
--info: #60A5FA;
```

Use brand lime sparingly:
- Main CTA
- Active states
- Tiny indicators
- Charts
- Important numeric accents

Do not flood the interface with lime.

---

# 7. Typography

Use a modern sans-serif plus monospace pairing.

Recommended:
- Sans: `Inter`, `Geist`, or similar
- Mono: `Geist Mono`, `JetBrains Mono`, or similar

Hero:
- Desktop: 64–76px
- Tablet: 52–60px
- Mobile: 42–48px
- Tight line height
- Weight 500–650 rather than ultra-bold

Body:
- 16–18px
- Comfortable line height
- Muted secondary color

Technical labels:
- 12–14px
- Monospace where appropriate

---

# 8. Page Width and Grid

Use:

```text
Max content width: 1280–1360px
Standard content: 1180–1240px
Page gutter desktop: 32px
Tablet: 24px
Mobile: 18px
```

Use a subtle background grid on the hero only.

Grid opacity must be very low.

---

# 9. Global Navbar

Sticky navbar.

Desktop layout:

```text
[Logo] PayRouter

Providers
Routing
Pricing
Developers
Docs
Status

                         Sign In
                         Get API Key
```

Recommended routes:

```text
/
 /providers
 /routing
 /pricing
 /developers
 /docs
 /status
 /login
 /register
```

Navbar behavior:
- Starts transparent/dark
- On scroll becomes slightly opaque with backdrop blur
- Thin bottom border
- Height 64–72px
- Dropdowns optional for Developers / Resources
- Mobile uses an accessible drawer menu

Buttons:
- Sign In = ghost
- Get API Key = lime primary button

---

# 10. Homepage Information Architecture

Order:

1. Navbar
2. Hero
3. Live platform metrics
4. Unified payment API feature grid
5. Featured providers / payment methods
6. Smart routing visualizer
7. Reliability / fallback section
8. Developer API section
9. Unified reconciliation / operations dashboard
10. How it works
11. Use cases
12. Pricing
13. Security / trust architecture
14. FAQ
15. Final CTA
16. Footer

---

# 11. Hero Section

## Eyebrow

```text
PAYMENT INFRASTRUCTURE FOR MODERN BUSINESSES
```

Optional live badge:

```text
● All systems operational
```

This status must come from a backend status endpoint or be omitted until real monitoring exists.

## H1

```text
The Unified Payment Layer
for Bangladesh
```

Alternative A/B headline:

```text
One API for Every Payment Provider
```

## Supporting copy

```text
Connect multiple payment providers through one developer-friendly API.
Route transactions, monitor provider health, and reconcile payments from one place.
```

## CTA row

Primary:

```text
Get API Key
```

Secondary:

```text
Explore Providers
```

Text link:

```text
Read the Docs →
```

## Hero Developer Console

Place a large code/transaction console under or beside the hero.

The console should feel like a real infrastructure tool.

Tabs:

```text
cURL
JavaScript
PHP
```

Default cURL example:

```bash
curl https://api.example.com/v1/payments \
  -H "Authorization: Bearer pr_live_xxxxxxxxx" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 2500,
    "currency": "BDT",
    "payment_method": "mfs",
    "routing": "smart",
    "reference": "ORDER-1048"
  }'
```

Response:

```json
{
  "id": "pay_01J...",
  "status": "pending",
  "currency": "BDT",
  "amount": 2500,
  "route": {
    "mode": "smart",
    "provider": "provider_slug"
  },
  "checkout_url": "https://checkout.example.com/..."
}
```

Never include real secrets.

Add:
- Copy button
- Syntax highlighting
- Rounded 14–16px surface
- Tiny request status chip
- No fake terminal typing animation

---

# 12. Metrics Strip

Create four compact metrics.

Until live data exists, use neutral product metrics that do not claim unsupported scale.

Recommended launch-state metrics:

```text
ONE API
Unified integration

MULTI-PROVIDER
Routing ready

24/7
Health monitoring architecture

BDT
Native transaction currency
```

Once real production data exists, metrics can become dynamic:

```text
৳XXCr+
Monthly routed volume

XX%
Payment success

XXms
Routing decision latency

XX+
Connected providers
```

Never seed fake production metrics as if they are real.

---

# 13. Core Feature Grid

Use four large editorial cards.

## Card 1 — One Payment API

Title:

```text
One API for payments
```

Copy:

```text
Integrate once and normalize payment requests, responses, callbacks, and transaction states across supported providers.
```

Visual:
- API request
- standardized response
- provider chips

CTA:
`View API`

---

## Card 2 — Higher Availability

Title:

```text
Built for payment resilience
```

Copy:

```text
Track provider health and use configurable routing and fallback policies to reduce dependency on a single integration.
```

Visual:

```text
Primary Provider    ● Healthy
Backup Provider     ● Healthy
Provider C          ● Degraded
```

Important:
Do not claim automatic payment retries where retrying the underlying financial transaction could cause duplicate charges.

Fallback logic must distinguish between:
- safe provider selection before payment initiation
- checkout/session regeneration
- ambiguous transaction state
- already-authorized/charged transactions

Never automatically charge a customer twice.

---

## Card 3 — Cost + Performance

Title:

```text
Route with context
```

Copy:

```text
Choose providers using merchant-defined priorities such as availability, payment method, commercial rate, transaction value, and historical performance.
```

Visual:
Routing score table.

Example UI:

```text
Provider     Health     Success     Cost     Decision
Provider A   Healthy    —           —        Recommended
Provider B   Healthy    —           —        Available
Provider C   Degraded   —           —        Avoid
```

No fabricated success/cost values.

---

## Card 4 — Unified Operations

Title:

```text
One view of every transaction
```

Copy:

```text
Search payments, inspect provider responses, review settlements, identify reconciliation mismatches, and export normalized reports.
```

Visual:
Mini transaction table.

---

# 14. Featured Providers Section

Section title:

```text
Connect your payment stack
```

Subtitle:

```text
Build against one interface while keeping provider connectivity modular.
```

Display provider/payment-method cards.

Possible Bangladesh ecosystem categories:

```text
MFS
Cards
Bank Payments
Internet Banking
QR / Future rails
```

Potential provider or rail labels may include only those the business has permission and technical capability to integrate.

Examples for UI prototyping:
- bKash
- Nagad
- Rocket
- Upay
- Visa
- Mastercard
- Bank payment
- Local gateway

Important brand rule:
Do not scrape or recreate official logos.
Use:
- approved official assets supplied by the product owner, OR
- neutral text/icon placeholders.

Each provider card can include:

```text
Provider Name
Category
Status
Supported currency
Settlement ownership
Integration state
```

Example states:

```text
Available
Private beta
Coming soon
Merchant connection required
```

Add:
`View all providers →`

---

# 15. Provider Directory Page

Route:

```text
/providers
```

This is inspired by the concept of a searchable provider marketplace but must be designed originally.

Page structure:
- H1: `Payment Providers`
- Search input
- Filters
- Sort control
- Responsive provider grid/table

Filters:

```text
Payment method
Provider type
Integration status
Currency
Settlement type
Merchant-owned credentials supported
```

Provider card:

```text
[Icon]

Provider Name
Short description

Methods: MFS / Card / Bank
Currency: BDT
Connection: Direct / Merchant credentials / Partner
Health: Operational / Degraded / Offline
```

Do not show commercial fees publicly unless configured and approved.

---

# 16. Smart Routing Visualizer

This should be one of the strongest sections.

Headline:

```text
Send each payment down the right route
```

Supporting copy:

```text
Define how providers are selected using health, method support, commercial rules, transaction context, and merchant preferences.
```

Create an interactive visual:

```text
Incoming Payment
৳2,500 · MFS
       ↓
Routing Engine

[Availability] ✓
[Method support] ✓
[Merchant priority] ✓
[Cost preference] ✓
[Risk policy] ✓

       ↓

Provider A    Recommended
Provider B    Standby
Provider C    Degraded
```

Add mode selector:

```text
Smart
Lowest Cost
Highest Availability
Merchant Priority
Manual
```

These can be demo UI states only on the public page.

The backend must eventually control real routing.

---

# 17. Routing Rules UX

Public demo card should show:

```text
IF
payment_method = "mfs"

AND
amount >= 1000 BDT

THEN
prefer Provider A

FALLBACK
Provider B

EXCLUDE
providers with degraded health
```

Make this feel like a rules engine.

Use compact dropdown-style chips.

---

# 18. Reliability Section

Headline:

```text
Designed around provider failure
```

Copy:

```text
Payment infrastructure fails in different ways. PayRouter gives your team a consistent layer for provider health, error normalization, route visibility, and controlled fallback behavior.
```

Show horizontal event timeline:

```text
10:42:02  Payment request created
10:42:02  Provider health checked
10:42:03  Route selected
10:42:03  Checkout session created
10:43:21  Provider callback received
10:43:21  Signature verified
10:43:22  Payment marked successful
```

Security note:

```text
Transaction state must never be changed to success from an unauthenticated or unverified callback.
```

---

# 19. Developer API Section

Headline:

```text
Build once. Keep providers replaceable.
```

Copy:

```text
Use a consistent payment object across providers so your application code does not depend on every provider's individual response format.
```

Tabs:

```text
PHP
JavaScript
cURL
```

PHP example:

```php
$response = Http::withToken(config('services.payrouter.key'))
    ->post('https://api.example.com/v1/payments', [
        'amount' => 2500,
        'currency' => 'BDT',
        'payment_method' => 'mfs',
        'routing' => 'smart',
        'reference' => 'ORDER-1048',
    ]);

$payment = $response->json();
```

JavaScript example:

```js
const response = await fetch('https://api.example.com/v1/payments', {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${PAYROUTER_API_KEY}`,
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

const payment = await response.json();
```

Public API concepts:

```text
POST /v1/payments
GET  /v1/payments/{id}
POST /v1/payments/{id}/cancel
POST /v1/refunds
GET  /v1/refunds/{id}

GET  /v1/providers
GET  /v1/provider-health

GET  /v1/transactions
GET  /v1/settlements
GET  /v1/reconciliation

POST /v1/webhooks/test
```

Only expose endpoints actually implemented.

---

# 20. Webhook Section

Headline:

```text
One webhook format
```

Normalize upstream callbacks into a PayRouter event schema.

Example:

```json
{
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
}
```

Security requirements:
- HMAC signing
- timestamp
- event ID
- replay protection
- webhook signing secret
- retry strategy
- webhook delivery logs
- endpoint health
- idempotent event processing

Never trust a client-side redirect as proof of payment.

---

# 21. Reconciliation Section

Headline:

```text
Payments in. Reports matched.
```

Copy:

```text
Normalize provider transaction data and give operations teams a single place to compare payments, fees, refunds, and expected settlements.
```

Dashboard mock data columns:

```text
Payment ID
Merchant Ref
Provider
Gross Amount
Provider Fee
Platform Fee
Net Expected
Payment Status
Settlement Status
Mismatch
```

Do not hard-code business rates.

Fee calculation must be data-driven.

---

# 22. How It Works

Section title:

```text
Go live without rebuilding your checkout stack
```

Four steps.

## Step 1

```text
Create your account
Set up your organization and merchant profile.
```

## Step 2

```text
Connect providers
Connect approved provider credentials or activate available partner connections.
```

## Step 3

```text
Create an API key
Use separate sandbox and production credentials.
```

## Step 4

```text
Route payments
Send payments through one API and inspect every route from the dashboard.
```

Visual style:
- Large step number
- Compact card
- Tiny product screenshot/diagram
- No oversized illustration

---

# 23. Bring Your Own Gateway / Provider Concept

Name:

```text
BYOG — Bring Your Own Gateway
```

Headline:

```text
Already have payment provider accounts?
Connect them.
```

Copy:

```text
Keep your existing commercial relationships while using PayRouter as the orchestration, observability, and reconciliation layer.
```

Do not claim every gateway allows credential sharing or third-party orchestration.

Provider integrations must be enabled only when contractually permitted.

---

# 24. Use Cases

Use a clean 2x3 card grid.

Cards:

```text
Ecommerce
Improve payment resilience and simplify provider operations.

Marketplaces
Centralize transaction visibility across complex payment flows.

SaaS
Keep recurring and one-time payment integrations modular.

Education
Handle high-volume fee collection with stronger transaction visibility.

Ticketing
Prepare for payment spikes and monitor provider health in real time.

Enterprise
Create custom routing rules, permissions, reporting, and controls.
```

Do not make claims about split settlement, escrow, recurring debit, marketplace payouts, or sub-merchant aggregation unless those features are legally and technically supported.

---

# 25. Pricing Section

Design this similarly in clarity to infrastructure SaaS pricing, but not as an OpenRouter clone.

Headline:

```text
Simple pricing that scales with payment volume
```

Use three pricing cards.

All numbers must be loaded from config/database so business teams can change them.

## Plan A — Orchestration

```text
For merchants using their own provider accounts

Setup
Configurable

Monthly platform fee
Configurable

Routing fee
Configurable %

Includes:
One API
Multiple provider connections
Provider health
Routing rules
Unified webhooks
Transaction dashboard
Reconciliation tools
```

CTA:
`Start Building`

---

## Plan B — Pay as You Go

Only display if legally/commercially available.

Possible display:

```text
For merchants using an approved processing arrangement

Successful transaction fee
From [CONFIGURED_RATE]%

No charge for failed transactions
[Only display if this is actually true contractually]

Provider coverage
Based on merchant eligibility
```

CTA:
`Apply for Access`

---

## Plan C — Enterprise

```text
Custom pricing

High-volume merchants
Custom provider strategy
Advanced routing
SLA
Dedicated support
Custom roles
Audit logs
Custom reports
Volume pricing
```

CTA:
`Talk to Sales`

Below cards:

```text
No hidden rates. Your applicable pricing, provider fees, taxes, and settlement terms are shown in your commercial agreement.
```

---

# 26. Security Section

This must feel serious and technical.

Headline:

```text
Payment infrastructure is security infrastructure
```

Show six compact security cards:

```text
Signed Webhooks
Verify every server-to-server event.

Idempotency
Prevent duplicate request processing.

Encrypted Secrets
Provider credentials encrypted at rest.

Role-Based Access
Separate developer, finance, operations, and admin permissions.

Audit Logs
Track sensitive configuration and account changes.

Environment Separation
Strict sandbox and production separation.
```

Additional requirements:

- TLS only
- CSRF protection
- XSS protections
- Secure cookies
- Rate limiting
- IP/risk controls where required
- Database encryption strategy for sensitive secrets
- Laravel encrypted casts or dedicated vault abstraction
- No provider secret returned to frontend
- No API secret stored in localStorage
- Hash platform API keys in database
- Show full API secret only once when generated
- Key rotation
- Revocation
- Webhook signature validation
- Callback allowlisting when supported
- Replay prevention
- Idempotency keys
- Request correlation IDs
- Immutable payment event logs
- Principle of least privilege
- Security headers
- Content Security Policy
- Centralized exception handling
- Sanitized logs
- PII minimization
- Backup/restore strategy

Do not claim PCI DSS certification unless certification actually exists.

---

# 27. FAQ

Create accordion.

Questions:

```text
What is payment orchestration?

Is PayRouter a payment gateway?

Can I use my existing gateway accounts?

How does smart routing work?

What happens if a provider is down?

Can a failed payment automatically be retried through another provider?

How are callbacks secured?

Does PayRouter hold merchant funds?

How does settlement work?

Can I use PayRouter in sandbox mode?

Which payment methods are supported?

How is pricing calculated?
```

Recommended legal-safe response pattern for:

## Is PayRouter a payment gateway?

```text
PayRouter is designed as a payment orchestration and infrastructure layer. Actual payment processing and settlement may be performed by licensed payment providers and financial institutions, depending on the integration and commercial arrangement.
```

## Does PayRouter hold merchant funds?

```text
The platform should not state that it holds or safeguards merchant funds unless an applicable licensed structure explicitly permits this. Settlement responsibilities must be described per provider agreement.
```

---

# 28. Final CTA

Large but simple.

Headline:

```text
One integration.
More control over every payment.
```

Copy:

```text
Build on a payment layer designed to keep providers modular and payment operations visible.
```

Buttons:

```text
Get API Key
Read the Docs
```

Background:
- subtle radial glow
- grid
- no stock image

---

# 29. Footer

Columns:

## Product

```text
Providers
Routing
Pricing
Enterprise
Status
```

## Developers

```text
Documentation
API Reference
Quickstart
Webhooks
SDKs
Changelog
```

## Company

```text
About
Contact
Careers
Blog
```

## Legal

```text
Privacy
Terms
Acceptable Use
Security
Compliance
```

Bottom:

```text
© {CURRENT_YEAR} {PRODUCT_NAME}. All rights reserved.
```

Add:
- system status
- GitHub only if repository is public
- LinkedIn only if account exists

Never create fake social links.

---

# 30. Homepage Interaction Details

Animations must be restrained.

Use:
- 150–250ms hover transitions
- cards brighten border slightly
- routing nodes animate only during interaction
- tiny status pulse
- count-up only for real metrics
- code tab crossfade
- scroll reveal with very small translate
- respect `prefers-reduced-motion`

Avoid:
- excessive parallax
- floating blobs
- mouse-following glow everywhere
- animation that slows first render

---

# 31. Responsive Requirements

## Desktop

- Full navigation
- Multi-column hero
- Feature grid
- Wide provider table
- Interactive routing graph

## Tablet

- 2-column cards
- Hero can stack
- Routing graph simplified

## Mobile

- Single column
- Hero code window below CTA
- Provider list becomes cards
- Pricing vertically stacked
- Tables horizontally scroll only when unavoidable
- Sticky CTA optional but not intrusive
- Tap targets >= 44px
- No content hidden simply for visual convenience

---

# 32. React Component Architecture

Suggested structure:

```text
resources/js/
├── app/
│   ├── App.tsx
│   ├── router.tsx
│   └── providers/
│
├── pages/
│   ├── HomePage.tsx
│   ├── ProvidersPage.tsx
│   ├── RoutingPage.tsx
│   ├── PricingPage.tsx
│   ├── DevelopersPage.tsx
│   ├── StatusPage.tsx
│   ├── LoginPage.tsx
│   └── RegisterPage.tsx
│
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── PageContainer.tsx
│   │   └── Section.tsx
│   │
│   ├── home/
│   │   ├── Hero.tsx
│   │   ├── MetricsStrip.tsx
│   │   ├── FeatureGrid.tsx
│   │   ├── ProviderShowcase.tsx
│   │   ├── RoutingVisualizer.tsx
│   │   ├── ReliabilityTimeline.tsx
│   │   ├── DeveloperSection.tsx
│   │   ├── ReconciliationPreview.tsx
│   │   ├── HowItWorks.tsx
│   │   ├── UseCases.tsx
│   │   ├── PricingPreview.tsx
│   │   ├── SecuritySection.tsx
│   │   ├── FAQ.tsx
│   │   └── FinalCTA.tsx
│   │
│   ├── providers/
│   │   ├── ProviderCard.tsx
│   │   ├── ProviderFilters.tsx
│   │   └── ProviderStatus.tsx
│   │
│   ├── developer/
│   │   ├── CodeBlock.tsx
│   │   ├── CodeTabs.tsx
│   │   └── ApiMethodBadge.tsx
│   │
│   └── ui/
│       ├── Button.tsx
│       ├── Badge.tsx
│       ├── Card.tsx
│       ├── Accordion.tsx
│       ├── Tabs.tsx
│       ├── Input.tsx
│       ├── Tooltip.tsx
│       └── StatusDot.tsx
│
├── hooks/
├── lib/
│   ├── api.ts
│   ├── formatCurrency.ts
│   ├── cn.ts
│   └── analytics.ts
│
├── types/
│   ├── provider.ts
│   ├── pricing.ts
│   └── status.ts
│
└── styles/
    └── app.css
```

---

# 33. Laravel Architecture

Suggested structure:

```text
app/
├── Http/
│   ├── Controllers/
│   │   ├── Public/
│   │   │   ├── ProviderController.php
│   │   │   ├── PricingController.php
│   │   │   └── StatusController.php
│   │   └── Api/V1/
│   │       ├── PaymentController.php
│   │       ├── RefundController.php
│   │       ├── ProviderController.php
│   │       └── WebhookController.php
│   │
│   ├── Middleware/
│   └── Requests/
│
├── Models/
│   ├── Organization.php
│   ├── Merchant.php
│   ├── Provider.php
│   ├── ProviderConnection.php
│   ├── ApiKey.php
│   ├── Payment.php
│   ├── PaymentAttempt.php
│   ├── PaymentEvent.php
│   ├── Refund.php
│   ├── Settlement.php
│   ├── ReconciliationRecord.php
│   ├── RoutingRule.php
│   └── WebhookEndpoint.php
│
├── Services/
│   ├── Payments/
│   │   ├── PaymentOrchestrator.php
│   │   ├── RoutingEngine.php
│   │   ├── ProviderHealthService.php
│   │   ├── IdempotencyService.php
│   │   └── PaymentStateMachine.php
│   │
│   ├── Providers/
│   │   ├── Contracts/
│   │   │   └── PaymentProvider.php
│   │   ├── ProviderManager.php
│   │   └── Adapters/
│   │
│   ├── Webhooks/
│   ├── Reconciliation/
│   └── Billing/
│
├── Jobs/
├── Events/
├── Listeners/
└── Policies/
```

---

# 34. Provider Adapter Contract

Every provider adapter should normalize to one interface.

Example conceptual PHP contract:

```php
interface PaymentProvider
{
    public function createPayment(CreatePaymentData $data): ProviderPaymentResult;

    public function queryPayment(string $providerPaymentId): ProviderPaymentStatus;

    public function refund(RefundPaymentData $data): ProviderRefundResult;

    public function verifyWebhook(array $headers, string $rawBody): VerifiedProviderEvent;

    public function health(): ProviderHealth;
}
```

Provider-specific controllers must not leak throughout application logic.

All provider behavior should remain behind adapter/service boundaries.

---

# 35. Payment State Machine

Use explicit states.

Suggested:

```text
created
routing
provider_session_created
pending
requires_action
processing
succeeded
failed
cancelled
expired
refunded
partially_refunded
unknown
```

`unknown` is important for ambiguous provider/network states.

Never convert unknown directly to failed if the upstream provider may still have charged the customer.

Query provider status when required.

---

# 36. Database Foundations

Suggested tables:

```text
users
organizations
organization_user
merchants
providers
provider_connections
provider_health_snapshots
api_keys

payments
payment_attempts
payment_events
refunds

routing_rules
routing_decisions

webhook_endpoints
webhook_deliveries

settlements
settlement_items
reconciliation_records

pricing_plans
merchant_pricing

audit_logs
```

Landing-page-specific:

```text
site_settings
faqs
blog_posts
system_incidents
```

Do not overbuild CMS functionality initially.

Static marketing content can remain in React configuration files until business users truly need editing.

---

# 37. Public Backend Endpoints

Initial landing-site endpoints:

```text
GET /api/public/providers
GET /api/public/providers/{slug}
GET /api/public/pricing
GET /api/public/platform-status
GET /api/public/faqs
```

Optional:

```text
POST /api/public/contact-sales
POST /api/public/waitlist
```

Add:
- validation
- rate limiting
- spam protection
- server-side logging
- email notification
- consent text if storing leads

---

# 38. API Key UX

API key format example:

```text
pr_test_xxxxxxxxxxxxxxxxx
pr_live_xxxxxxxxxxxxxxxxx
```

Rules:
- prefix distinguishes environment
- display plaintext once
- store only secure hash
- allow label
- allow creation date
- last used timestamp
- optional IP restrictions
- optional scopes
- revoke
- rotate

Never use provider credentials as merchant-facing PayRouter API keys.

---

# 39. Public Status Page

Route:

```text
/status
```

Components:

```text
API
Checkout
Dashboard
Webhooks
Provider Routing
Provider A
Provider B
Provider C
```

Statuses:

```text
Operational
Degraded Performance
Partial Outage
Major Outage
Maintenance
```

Include incident history.

Do not mark systems operational from static frontend constants once platform is live.

---

# 40. SEO Requirements

Homepage metadata:

```text
Title:
PayRouter — One API for Payments in Bangladesh

Description:
Connect and manage multiple payment providers through one developer-friendly payment orchestration layer. Route payments, monitor provider health, and simplify reconciliation.
```

Use configurable product name.

Other requirements:
- canonical URLs
- OpenGraph
- Twitter/X card only if account exists
- sitemap.xml
- robots.txt
- JSON-LD Organization schema only with real organization information
- SoftwareApplication/Product schema only when accurate
- meaningful H1/H2 hierarchy
- server-render or prerender public marketing pages if practical
- no critical copy hidden behind client-only JavaScript
- optimized metadata per page

If React SPA rendering creates SEO limitations, use an SSR/prerender strategy or Laravel-rendered entry pages while retaining React components.

---

# 41. Performance Targets

Target:
- Lighthouse Performance >= 90 on production-like mobile conditions
- Accessibility >= 95
- Best Practices >= 95
- SEO >= 95

Implementation:
- lazy load below-fold visualizations
- no huge JS animation libraries unless necessary
- use CSS for simple motion
- preload only critical fonts
- self-host fonts where licensing permits
- use modern image formats
- responsive images
- code split public routes
- cache public provider/status data carefully
- avoid layout shift
- reserve component heights

---

# 42. Accessibility

Must include:
- semantic landmarks
- keyboard navigation
- visible focus state
- proper heading order
- ARIA only when necessary
- accessible mobile drawer
- accessible tabs
- accessible accordions
- status information not conveyed by color alone
- color contrast compliant with WCAG AA
- code blocks keyboard accessible
- `prefers-reduced-motion`

---

# 43. Analytics Events

Abstract analytics behind a small frontend analytics module.

Track:

```text
hero_get_api_key_clicked
hero_explore_providers_clicked
docs_clicked
pricing_viewed
provider_viewed
routing_demo_changed
code_language_changed
code_copied
contact_sales_clicked
signup_started
signup_completed
```

Do not embed multiple analytics SDKs directly in components.

---

# 44. Authentication Pages

Keep login/register visually aligned with developer infrastructure style.

Register:

```text
Create your account

Work email
Password
Organization name

[Create account]

Already have an account? Sign in
```

Potential SSO later:
- Google
- GitHub

Do not show disabled fake SSO buttons.

---

# 45. Design Details That Matter

Buttons:
- Height 42–46px
- Radius 8–10px
- Not pill-shaped everywhere

Cards:
- Radius 12–16px
- 1px border
- Minimal shadow
- Surface color variation instead of heavy shadow

Inputs:
- Dark surface
- Clear focus ring
- 44px+ mobile height

Chips:
- Compact
- Subtle
- Monospace labels allowed

Dividers:
- 1px dark borders

Icons:
- Lucide React or another consistent open-source icon library
- 16/18/20/24px
- Do not mix icon families

---

# 46. Homepage Copy — Final Recommended Version

## Hero

Eyebrow:

```text
PAYMENT ORCHESTRATION FOR BANGLADESH
```

Headline:

```text
The unified layer
for every payment
```

Subheadline:

```text
Connect payment providers through one API. Route transactions with more control, monitor provider health, and reconcile payment operations from one dashboard.
```

Buttons:

```text
Get API Key
Explore Providers
```

Link:

```text
Read the Docs →
```

---

## Features Intro

```text
One integration. A modular payment stack.
```

Supporting:

```text
Keep provider-specific complexity behind a consistent API built for developers, finance teams, and high-growth online businesses.
```

---

## Routing

```text
Route payments with context
```

Supporting:

```text
Use provider availability, payment method support, merchant priorities, commercial rules, and transaction context to determine the preferred route.
```

---

## Reliability

```text
Keep provider failure from becoming application failure
```

Supporting:

```text
Normalize provider errors, monitor health, and design controlled fallback strategies without embedding every provider's logic into your application.
```

---

## Developer

```text
A payment API developers can reason about
```

Supporting:

```text
Consistent request objects, predictable states, signed webhooks, idempotency, and clear provider visibility.
```

---

## Reconciliation

```text
One operational view
```

Supporting:

```text
Bring transactions, provider fees, refunds, settlement expectations, and reconciliation status into a normalized workflow.
```

---

## BYOG

```text
Bring your own gateway
```

Supporting:

```text
Connect eligible existing provider accounts and use PayRouter as the orchestration and visibility layer while keeping supported provider relationships in place.
```

---

## Security

```text
Built around verifiable payment state
```

Supporting:

```text
Signed callbacks, idempotent APIs, immutable event history, encrypted credentials, audit logs, and strict environment separation.
```

---

## Final CTA

```text
Build your payment stack once.
Keep it flexible.
```

Supporting:

```text
Start with one API and keep your provider layer modular as your business grows.
```

---

# 47. Claude Implementation Sequence

Implement in this order:

## Phase 1 — Foundation

1. Initialize Laravel + React + TypeScript + Tailwind.
2. Configure routing.
3. Add global design tokens.
4. Create shared layout.
5. Create Navbar + Footer.
6. Create reusable UI primitives.
7. Implement homepage shell.

## Phase 2 — Homepage

8. Hero.
9. API code panel.
10. Metrics strip.
11. Feature cards.
12. Provider showcase.
13. Smart routing visualizer.
14. Reliability timeline.
15. Developer API section.
16. Reconciliation preview.
17. How it works.
18. BYOG section.
19. Use cases.
20. Pricing.
21. Security.
22. FAQ.
23. Final CTA.

## Phase 3 — Public Product Pages

24. Providers directory.
25. Provider detail page template.
26. Routing page.
27. Pricing page.
28. Developers page.
29. Status page.

## Phase 4 — Laravel Public APIs

30. Provider model/migration/seed.
31. Public providers endpoint.
32. Pricing configuration.
33. Status endpoint.
34. Contact-sales endpoint.
35. Connect React query/fetch layer.

## Phase 5 — Quality

36. Responsive QA.
37. Accessibility QA.
38. SEO.
39. Performance optimization.
40. Automated tests.

---

# 48. Testing Requirements

Laravel:
- Feature tests for public APIs
- validation tests
- rate-limit tests
- status endpoint test
- provider listing filters

React:
- component tests for critical UI states
- routing visualizer behavior
- code tabs
- FAQ accessibility
- mobile nav accessibility

End-to-end:
- homepage loads
- CTA routes correctly
- provider search works
- pricing loads
- sales form validates
- keyboard navigation works

---

# 49. Seed Data Rules

Seed data can contain obvious demo records:

```text
Provider Alpha
Provider Beta
Provider Gamma
```

or real provider names only when used as neutral integration targets and approved.

Never seed:
- fake merchant logos
- fake client testimonials
- fake regulatory badges
- fake certifications
- fake transaction counts
- fake uptime
- fake GMV
- fake provider commercial rates

Use `Demo` labels when necessary.

---

# 50. Compliance-Safe Product Language

Preferred:

```text
Payment orchestration
Unified payment API
Provider connectivity
Routing
Provider health monitoring
Reconciliation
Payment operations
Merchant-owned provider connection
Licensed payment partner
```

Use carefully / only when true:

```text
Payment gateway
Payment aggregator
Acquirer
PSP
PSO
Settlement provider
We process your money
We hold your funds
We guarantee settlement
Bangladesh Bank approved
Licensed by Bangladesh Bank
```

The marketing site should make the technology compelling without creating regulatory claims that have not been verified.

---

# 51. Admin-Configurable Marketing Data

Create configuration capability for:

```text
product_name
logo
support_email
sales_email

pricing
provider_visibility
provider_status
provider_category

hero_metrics
system_status

social_links
footer_links
legal_links
```

For MVP this can be `config/marketing.php` plus database-backed provider/pricing/status content.

Do not create a full CMS unless requested.

---

# 52. Suggested `marketing.php`

```php
return [
    'product_name' => env('PRODUCT_NAME', 'PayRouter'),
    'tagline' => 'The unified payment layer for Bangladesh',

    'pricing' => [
        'orchestration_setup' => null,
        'orchestration_monthly' => null,
        'orchestration_rate' => null,
        'payg_rate_from' => null,
    ],

    'links' => [
        'docs' => '/docs',
        'status' => '/status',
        'sales' => '/contact-sales',
    ],
];
```

Never put secrets into this file.

---

# 53. Suggested React Theme Tokens

```ts
export const theme = {
  colors: {
    background: '#090B0D',
    surface: '#101316',
    surfaceRaised: '#15191D',
    textPrimary: '#F5F7F8',
    textSecondary: '#9CA6AF',
    border: '#242A30',
    brand: '#DFFE52',
    success: '#4ADE80',
    warning: '#FACC15',
    danger: '#FB7185',
  },
};
```

Prefer Tailwind CSS variables so theme values are not duplicated across components.

---

# 54. Landing Page Definition of Done

The landing page is complete only when:

- The value proposition is understandable immediately.
- The UI is original and not a copy of OpenRouter.
- Desktop/tablet/mobile are polished.
- Hero includes convincing API-first product visualization.
- Provider directory is functional.
- Routing demo is interactive.
- Pricing is data-driven.
- Code examples copy correctly.
- Accessibility requirements are met.
- Public API data has loading/error/empty states.
- No fake metrics or claims are displayed.
- No provider secrets exist in frontend code.
- No static callback can mark a transaction successful.
- SEO metadata is implemented.
- Production build passes.
- Tests pass.
- Visual hierarchy feels like premium developer infrastructure, not a generic fintech template.

---

# 55. Final Direction to Claude

Build the interface with the **clarity and confidence of a developer infrastructure product**.

The emotional reaction should be:

```text
“This makes a fragmented payment stack feel like one platform.”
```

The landing page should not sell with decoration. It should sell through:

```text
Clarity
API simplicity
Routing intelligence
Reliability
Operational visibility
Security
```

The main product story must remain:

```text
Merchant
   ↓
One PayRouter API
   ↓
Routing + Control Layer
   ↓
Multiple Eligible Payment Providers
   ↓
Normalized Payment State + Operations
```

Do not overdesign.

Make every visual element explain the product.
