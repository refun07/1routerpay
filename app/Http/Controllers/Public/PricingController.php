<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;

class PricingController extends Controller
{
    /**
     * Pricing is data-driven. Unset values are returned as null so the UI can
     * render "Configurable" instead of inventing a rate.
     */
    public function __invoke(): JsonResponse
    {
        $pricing = config('marketing.pricing');

        return response()->json([
            'data' => [
                'plans' => [
                    [
                        'key' => 'orchestration',
                        'name' => 'Orchestration',
                        'audience' => 'For merchants using their own provider accounts',
                        'available' => true,
                        'lines' => [
                            ['label' => 'Setup', 'value' => $pricing['orchestration']['setup']],
                            ['label' => 'Monthly platform fee', 'value' => $pricing['orchestration']['monthly']],
                            ['label' => 'Routing fee', 'value' => $pricing['orchestration']['routing_rate']],
                        ],
                        'includes' => [
                            'One API',
                            'Multiple provider connections',
                            'Provider health',
                            'Routing rules',
                            'Unified webhooks',
                            'Transaction dashboard',
                            'Reconciliation tools',
                        ],
                        'cta' => ['label' => 'Start Building', 'href' => '/register'],
                    ],
                    [
                        'key' => 'payg',
                        'name' => 'Pay as You Go',
                        'audience' => 'For merchants using an approved processing arrangement',
                        'available' => (bool) $pricing['payg']['enabled'],
                        'lines' => array_values(array_filter([
                            ['label' => 'Successful transaction fee', 'value' => $pricing['payg']['rate_from']],
                            $pricing['payg']['no_charge_on_failure']
                                ? ['label' => 'Failed transactions', 'value' => 'No charge']
                                : null,
                            ['label' => 'Provider coverage', 'value' => 'Based on merchant eligibility'],
                        ])),
                        'includes' => [],
                        'cta' => ['label' => 'Apply for Access', 'href' => '/contact-sales'],
                    ],
                    [
                        'key' => 'enterprise',
                        'name' => 'Enterprise',
                        'audience' => 'Custom pricing',
                        'available' => true,
                        'lines' => [],
                        'includes' => [
                            'High-volume merchants',
                            'Custom provider strategy',
                            'Advanced routing',
                            'SLA',
                            'Dedicated support',
                            'Custom roles',
                            'Audit logs',
                            'Custom reports',
                            'Volume pricing',
                        ],
                        'cta' => ['label' => 'Talk to Sales', 'href' => '/contact-sales'],
                    ],
                ],
                'note' => 'No hidden rates. Your applicable pricing, provider fees, taxes, and settlement terms are shown in your commercial agreement.',
            ],
        ]);
    }
}
