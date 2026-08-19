<?php

namespace Database\Seeders;

use App\Models\Provider;
use Illuminate\Database\Seeder;

/**
 * Bangladesh payment ecosystem, seeded as *integration targets* — not as
 * partnerships, endorsements, or regulatory statements.
 *
 * Rules this file exists to protect:
 *
 * 1. NOTHING is seeded as `available`. That status implies a live commercial
 *    connection. Flip it only when the connection is contractually real.
 *
 * 2. The PSO entries below use the registered entity names supplied by the
 *    product owner. `provider_type = 'pso'` records that grouping — it is NOT a
 *    statement that a given licence is current. Licences are granted, renewed,
 *    suspended, and revoked; re-confirm with Bangladesh Bank before publishing,
 *    and treat this list as a snapshot that needs an owner.
 *
 * 3. `methods_confirmed` stays false until each provider's supported methods are
 *    confirmed during integration scoping. The directory shows "to be confirmed"
 *    instead of listing capabilities that may not exist on that connection.
 *
 * 4. `logo_path` stays null until the product owner supplies an APPROVED brand
 *    asset at public/brand/providers/{slug}.svg. Never scrape, trace, or
 *    recreate an official logo.
 *
 * 5. Trading brand names are only recorded where they were supplied. Where only
 *    the registered entity is known, that is what is shown — no guessed brands.
 */
class ProviderSeeder extends Seeder
{
    /**
     * Payment System Operators, as supplied by the product owner.
     *
     * @var array<int, array{slug: string, legal_name: string, name?: string}>
     */
    private const PAYMENT_SYSTEM_OPERATORS = [
        ['slug' => 'sslcommerz', 'legal_name' => 'SSLCOMMERZ Limited', 'name' => 'SSLCOMMERZ'],
        ['slug' => 'software-shop', 'legal_name' => 'Software Shop Limited'],
        ['slug' => 'shurjopay', 'legal_name' => 'ShurjoMukhi Ltd', 'name' => 'shurjoPay'],
        ['slug' => 'portonics', 'legal_name' => 'Portonics Limited'],
        ['slug' => 'soft-tech-innovation', 'legal_name' => 'Soft Tech Innovation Limited'],
        ['slug' => 'optimum-solution', 'legal_name' => 'Optimum Solution & Services Limited'],
        ['slug' => 'paystation', 'legal_name' => 'Service Hub Limited', 'name' => 'PayStation'],
        ['slug' => 'fingerprint-it', 'legal_name' => 'Fingerprint Information Technology Limited'],
        ['slug' => 'dgepay', 'legal_name' => 'DGepay Services Limited'],
        ['slug' => 'paperless', 'legal_name' => 'Paperless Limited'],
        ['slug' => 'paysuite', 'legal_name' => 'Paysuite Fintech Limited'],
        ['slug' => 'walletmix', 'legal_name' => 'Walletmix Limited'],
        ['slug' => 'eps', 'legal_name' => 'EPS', 'name' => 'EPS'],
    ];

    public function run(): void
    {
        $providers = [];

        /*
         | Every PSO gets the same conservative description and use cases.
         |
         | These are true of the orchestration relationship regardless of which
         | methods a given operator supports, so nothing here claims a capability
         | that has not been scoped. Replace with provider-specific detail as each
         | integration is confirmed.
         */
        foreach (self::PAYMENT_SYSTEM_OPERATORS as $index => $operator) {
            $providers[] = [
                'slug' => $operator['slug'],
                'name' => $operator['name'] ?? $operator['legal_name'],
                'legal_name' => $operator['legal_name'],
                'provider_type' => 'pso',
                // Kept short on purpose: the card clamps to two lines, and a longer
                // sentence truncated to "Supported methods confirmed…" would claim
                // the opposite of what the Methods row says.
                'short_description' => 'Aggregated gateway access under your own operator agreement.',
                'description' => 'A payment system operator in the Bangladesh market. Connected using the merchant’s own operator agreement, with requests, responses, callbacks, and transaction states normalized into the same payment object as every other route.',
                'category' => 'card',
                'methods' => [],
                'methods_confirmed' => false,
                'connection_type' => 'merchant_credentials',
                'integration_status' => 'merchant_connection_required',
                'settlement_ownership' => 'The operator settles to the merchant under the merchant’s own agreement.',
                'use_cases' => [
                    'Keep an existing operator contract while routing through one API',
                    'Add a standby route so one operator is not a single point of failure',
                    'Compare routes on measured availability once traffic is live',
                ],
                // Partner status asserted by the product owner. Correct any entry
                // here that does not have a signed agreement behind it.
                'is_partner' => true,
                'sort_order' => $index,
            ];
        }

        // ---- Mobile financial services ----
        $providers[] = [
            'slug' => 'bkash',
            'name' => 'bKash',
            'legal_name' => 'bKash Limited',
            'provider_type' => 'mfs',
            'short_description' => 'Mobile financial services wallet payments.',
            'description' => 'Wallet-based payments where the customer authorizes the charge in the bKash flow and the outcome is confirmed by a verified server-to-server callback. Connected with the merchant’s own merchant credentials.',
            'category' => 'mfs',
            'methods' => ['mfs', 'wallet'],
            'methods_confirmed' => true,
            'connection_type' => 'merchant_credentials',
            'integration_status' => 'merchant_connection_required',
            'settlement_ownership' => 'Provider settles to the merchant under the merchant’s own agreement.',
            'use_cases' => [
                'Consumer checkout for customers without a card',
                'Low-value, high-frequency payments',
                'Wallet coverage alongside a gateway route',
            ],
            'sort_order' => 20,
        ];

        $providers[] = [
            'slug' => 'nagad',
            'name' => 'Nagad',
            'legal_name' => 'Nagad Limited',
            'provider_type' => 'mfs',
            'short_description' => 'Mobile financial services wallet payments.',
            'description' => 'Wallet-based payments authorized in the Nagad flow, normalized into the same payment object and event schema as every other connection. Uses the merchant’s own credentials.',
            'category' => 'mfs',
            'methods' => ['mfs', 'wallet'],
            'methods_confirmed' => true,
            'connection_type' => 'merchant_credentials',
            'integration_status' => 'merchant_connection_required',
            'settlement_ownership' => 'Provider settles to the merchant under the merchant’s own agreement.',
            'use_cases' => [
                'Second wallet route alongside bKash',
                'Fee-driven routing between wallets',
                'Coverage for customers without a card',
            ],
            'sort_order' => 21,
        ];

        $providers[] = [
            'slug' => 'rocket',
            'name' => 'Rocket',
            'legal_name' => 'Dutch-Bangla Bank PLC',
            'provider_type' => 'mfs',
            'short_description' => 'Bank-backed mobile financial services.',
            'description' => 'Bank-backed mobile financial services, planned as a merchant-credential connection alongside the other wallet rails.',
            'category' => 'mfs',
            'methods' => ['mfs', 'wallet'],
            'methods_confirmed' => true,
            'connection_type' => 'merchant_credentials',
            'integration_status' => 'coming_soon',
            'settlement_ownership' => 'Provider settles to the merchant under the merchant’s own agreement.',
            'use_cases' => [
                'Additional wallet coverage',
                'Customers already banking with the issuing bank',
            ],
            'sort_order' => 22,
        ];

        $providers[] = [
            'slug' => 'upay',
            'name' => 'Upay',
            'legal_name' => 'UCB Fintech Company Limited',
            'provider_type' => 'mfs',
            'short_description' => 'Mobile financial services wallet payments.',
            'description' => 'Mobile financial services wallet payments, planned as a merchant-credential connection.',
            'category' => 'mfs',
            'methods' => ['mfs', 'wallet'],
            'methods_confirmed' => true,
            'connection_type' => 'merchant_credentials',
            'integration_status' => 'coming_soon',
            'settlement_ownership' => 'Provider settles to the merchant under the merchant’s own agreement.',
            'use_cases' => [
                'Broadening wallet reach',
                'Campaign-driven checkout flows',
            ],
            'sort_order' => 23,
        ];

        // ---- Card schemes / acquiring ----
        $providers[] = [
            'slug' => 'card-acquiring',
            'name' => 'Card Acquiring',
            'legal_name' => null,
            'provider_type' => 'scheme',
            'short_description' => 'Visa and Mastercard acceptance through an acquiring partner.',
            'description' => 'Card acceptance through an acquiring partner, covering the standard authorize and capture flow plus refunds. Availability depends on merchant eligibility and the acquiring agreement.',
            'category' => 'card',
            'methods' => ['card'],
            'methods_confirmed' => true,
            'connection_type' => 'partner',
            'integration_status' => 'private_beta',
            'settlement_ownership' => 'Acquirer settles according to the merchant’s acquiring agreement.',
            'use_cases' => [
                'Higher-value transactions',
                'International cardholders',
                'Merchants with their own acquiring relationship',
            ],
            'sort_order' => 30,
        ];

        // ---- Bank rails ----
        $providers[] = [
            'slug' => 'internet-banking',
            'name' => 'Internet Banking',
            'legal_name' => null,
            'provider_type' => 'bank',
            'short_description' => 'Direct debit from supported bank internet-banking channels.',
            'description' => 'Customer-authorized debits through supported bank internet-banking channels. Availability follows each bank’s own integration and approval process.',
            'category' => 'internet_banking',
            'methods' => ['internet_banking'],
            'methods_confirmed' => true,
            'connection_type' => 'partner',
            'integration_status' => 'coming_soon',
            'settlement_ownership' => 'Bank settles according to the merchant’s banking agreement.',
            'use_cases' => [
                'Customers who prefer paying from a bank account',
                'Mid-value payments where card fees bite',
            ],
            'sort_order' => 31,
        ];

        $providers[] = [
            'slug' => 'bank-transfer',
            'name' => 'Bank Transfer',
            'legal_name' => null,
            'provider_type' => 'bank',
            'short_description' => 'Account-to-account bank payments with reference matching.',
            'description' => 'Account-to-account transfers matched back to a payment using the merchant reference. Suited to higher-value payments where instant confirmation is not required.',
            'category' => 'bank',
            'methods' => ['bank_transfer'],
            'methods_confirmed' => true,
            'connection_type' => 'merchant_credentials',
            'integration_status' => 'coming_soon',
            'settlement_ownership' => 'Funds land in the merchant’s own bank account.',
            'use_cases' => [
                'B2B and wholesale invoices',
                'High-value payments where card limits apply',
                'Tuition, rent, and instalment collection',
            ],
            'sort_order' => 32,
        ];

        $providers[] = [
            'slug' => 'qr-rails',
            'name' => 'QR Rails',
            'legal_name' => null,
            'provider_type' => 'rail',
            'short_description' => 'Interoperable QR acceptance as rails become available.',
            'description' => 'Interoperable QR acceptance, added as national and partner QR rails become technically available.',
            'category' => 'qr',
            'methods' => ['qr'],
            'methods_confirmed' => true,
            'connection_type' => 'partner',
            'integration_status' => 'coming_soon',
            'settlement_ownership' => 'Determined by the connecting scheme or partner.',
            'use_cases' => [
                'In-person and hybrid checkout',
                'One QR that many wallets can pay',
            ],
            'sort_order' => 33,
        ];


        // ---- Additional wallets seen on live checkouts ----
        $wallets = [
            ['slug' => 'mcash', 'name' => 'mCash', 'legal_name' => 'Islami Bank Bangladesh PLC', 'status' => 'coming_soon'],
            ['slug' => 'islamic-wallet', 'name' => 'Islamic Wallet', 'legal_name' => null, 'status' => 'coming_soon'],
            ['slug' => 'meghnapay', 'name' => 'MeghnaPay', 'legal_name' => null, 'status' => 'coming_soon'],
        ];

        foreach ($wallets as $index => $wallet) {
            $providers[] = [
                'slug' => $wallet['slug'],
                'name' => $wallet['name'],
                'legal_name' => $wallet['legal_name'],
                'provider_type' => 'mfs',
                'short_description' => 'Mobile financial services wallet payments.',
                'description' => 'Wallet payments authorized in the provider’s own flow and confirmed by a verified server-to-server callback, normalized into the same payment object as every other route.',
                'category' => 'mfs',
                'methods' => ['mfs', 'wallet'],
                'methods_confirmed' => true,
                'connection_type' => 'merchant_credentials',
                'integration_status' => $wallet['status'],
                'settlement_ownership' => 'Provider settles to the merchant under the merchant’s own agreement.',
                'use_cases' => [
                    'Wallet coverage beyond the largest two providers',
                    'Customers who bank with the issuing institution',
                ],
                'sort_order' => 24 + $index,
            ];
        }

        // Entries removed from the list should not linger in the directory.
        Provider::whereNotIn('slug', array_column($providers, 'slug'))->delete();

        foreach ($providers as $provider) {
            Provider::updateOrCreate(
                ['slug' => $provider['slug']],
                $provider + [
                    'currencies' => ['BDT'],
                    'is_public' => true,
                    // Populated only with an approved asset. See the class docblock.
                    'logo_path' => null,
                ]
            );
        }
    }
}
