<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Provider;
use App\Models\ProviderMetricDaily;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;

/**
 * Provider rankings, derived only from measured data.
 *
 * Two views over the same rollups:
 *
 *   overall   — one row per provider, summed across every method.
 *   by_method — the same providers broken down per payment method, so
 *               "how does bKash perform through this PSO?" is answerable.
 *
 * Three honest modes:
 *
 *   live  — real rollups exist for the window.
 *   empty — nothing measured yet. The page says so.
 *   demo  — clearly-labelled synthetic rows for design review. Enabled by
 *           RANKINGS_DEMO_DATA and never available in production.
 *
 * A provider is never ranked on a metric that was not observed. Success rate in
 * particular is omitted unless real payments were routed, because a fabricated
 * success rate is the most misleading number this product could publish.
 */
class RankingsController extends Controller
{
    private const WINDOWS = [7, 30, 90];

    /** Column order for the by-method view. Wallets first — that is the question being asked. */
    private const METHOD_ORDER = [
        'bkash',
        'nagad',
        'rocket',
        'upay',
        'card',
        'internet_banking',
        'bank_transfer',
        'qr',
    ];

    private const MFS_METHODS = ['bkash', 'nagad', 'rocket', 'upay'];

    public function __invoke(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'window' => ['sometimes', 'integer', 'in:'.implode(',', self::WINDOWS)],
            'view' => ['sometimes', 'in:overall,by_method'],
        ]);

        $days = (int) ($validated['window'] ?? 30);
        $view = $validated['view'] ?? 'overall';
        $since = now()->subDays($days)->startOfDay();

        $metrics = ProviderMetricDaily::query()
            ->with('provider')
            ->where('date', '>=', $since)
            ->get()
            ->filter(fn (ProviderMetricDaily $metric) => $metric->provider?->is_public);

        if ($metrics->isEmpty()) {
            return $this->unmeasured($days, $view);
        }

        $grouped = $metrics->groupBy('provider_id');

        $providers = $view === 'by_method'
            ? $this->byMethod($grouped)
            : $this->overall($grouped);

        return response()->json([
            'data' => [
                'mode' => 'live',
                'view' => $view,
                'window_days' => $days,
                'measured_from' => $since->toDateString(),
                'methods' => $view === 'by_method' ? $this->methodColumns($metrics) : [],
                'providers' => $providers->values(),
                'note' => null,
            ],
        ]);
    }

    /**
     * Reduce a set of daily rows to one set of figures.
     *
     * Null means "not measured" everywhere in here. Callers render that as an
     * em dash; it must never become a zero.
     *
     * @param  Collection<int, ProviderMetricDaily>  $metrics
     */
    private function summarize(Collection $metrics): array
    {
        $probes = $metrics->sum('probes_total');
        $healthy = $metrics->sum('probes_healthy');
        $routed = $metrics->sum('payments_routed');
        $succeeded = $metrics->sum('payments_succeeded');
        $unknown = $metrics->sum('payments_unknown');

        $latencies = $metrics->whereNotNull('decision_latency_p50')->pluck('decision_latency_p50');

        return [
            'availability' => $probes > 0 ? round($healthy / $probes * 100, 2) : null,
            'probes_total' => $probes,
            'payments_routed' => $routed,
            'success_rate' => $routed > 0 ? round($succeeded / $routed * 100, 2) : null,
            'unknown_rate' => $routed > 0 ? round($unknown / $routed * 100, 2) : null,
            'decision_latency_p50' => $latencies->isNotEmpty() ? (int) round($latencies->avg()) : null,
        ];
    }

    private function identity(Provider $provider): array
    {
        return [
            'slug' => $provider->slug,
            'name' => $provider->name,
            'legal_name' => $provider->legal_name,
            'provider_type' => $provider->provider_type,
            'logo_path' => $provider->logo_path ? asset($provider->logo_path) : null,
        ];
    }

    /**
     * @param  Collection<int, Collection<int, ProviderMetricDaily>>  $grouped
     */
    private function overall(Collection $grouped): Collection
    {
        return $grouped
            ->map(function (Collection $metrics) {
                $provider = $metrics->first()->provider;

                return $this->identity($provider) + $this->summarize($metrics);
            })
            // Rank by what was actually observed: availability first, then volume.
            ->sortByDesc(fn (array $row) => [$row['availability'] ?? -1, $row['payments_routed']]);
    }

    /**
     * @param  Collection<int, Collection<int, ProviderMetricDaily>>  $grouped
     */
    private function byMethod(Collection $grouped): Collection
    {
        return $grouped
            ->map(function (Collection $metrics) {
                $provider = $metrics->first()->provider;

                $methods = $metrics
                    ->groupBy('method')
                    ->map(fn (Collection $rows) => $this->summarize($rows));

                return $this->identity($provider) + [
                    // Provider-level totals still come from summing every method.
                    'totals' => $this->summarize($metrics),
                    'methods' => $methods,
                ];
            })
            ->sortByDesc(fn (array $row) => [
                $row['totals']['availability'] ?? -1,
                $row['totals']['payments_routed'],
            ]);
    }

    /**
     * Only methods that were actually measured become columns, in a stable order.
     *
     * @param  Collection<int, ProviderMetricDaily>  $metrics
     */
    private function methodColumns(Collection $metrics): array
    {
        $present = $metrics->pluck('method')->unique();

        $ordered = collect(self::METHOD_ORDER)->filter(fn (string $method) => $present->contains($method));

        // Anything measured that is not in the canonical order still gets a column.
        return $ordered->merge($present->diff(self::METHOD_ORDER)->sort())->values()->all();
    }

    private function unmeasured(int $days, string $view): JsonResponse
    {
        if (! $this->demoEnabled()) {
            return response()->json([
                'data' => [
                    'mode' => 'empty',
                    'view' => $view,
                    'window_days' => $days,
                    'measured_from' => null,
                    'methods' => [],
                    'providers' => [],
                    'note' => 'No provider performance has been measured yet. Rankings appear here once payments are routed and health probes have run.',
                ],
            ]);
        }

        $providers = $view === 'by_method' ? $this->demoByMethod($days) : $this->demoOverall($days);

        return response()->json([
            'data' => [
                'mode' => 'demo',
                'view' => $view,
                'window_days' => $days,
                'measured_from' => null,
                'methods' => $view === 'by_method' ? self::MFS_METHODS : [],
                'providers' => $providers,
                'note' => 'Demo data for design review only. These numbers are generated, not measured, and this mode is disabled outside local development.',
            ],
        ]);
    }

    private function demoEnabled(): bool
    {
        return config('marketing.rankings_demo_data') && ! app()->isProduction();
    }

    /** @return Collection<int, Provider> */
    private function demoProviders(): Collection
    {
        return Provider::query()
            ->public()
            ->where('provider_type', 'pso')
            ->orderBy('sort_order')
            ->take(8)
            ->get();
    }

    /**
     * Deterministic synthetic figures, seeded from the slug (and method) so the
     * page does not reshuffle on every refresh.
     */
    private function demoFigures(string $seedKey, int $days): array
    {
        $seed = crc32($seedKey);

        return [
            'availability' => round(97 + ($seed % 280) / 100, 2),
            'probes_total' => $days * 24 * 2,
            'payments_routed' => 400 + ($seed % 9_000),
            'success_rate' => round(88 + ($seed % 900) / 100, 2),
            'unknown_rate' => round(($seed % 120) / 100, 2),
            'decision_latency_p50' => 8 + ($seed % 40),
        ];
    }

    /**
     * Combine per-method figures into one set of totals, weighting each rate by
     * the volume behind it. Mirrors how live totals are summed from the rollups.
     *
     * @param  Collection<string, array>  $methods
     */
    private function rollUpFigures(Collection $methods): array
    {
        $routed = $methods->sum('payments_routed');
        $probes = $methods->sum('probes_total');

        $weighted = fn (string $key, int $weight) => $weight > 0
            ? round($methods->sum(fn (array $figures) => $figures[$key] * $figures['payments_routed']) / $weight, 2)
            : null;

        return [
            'availability' => $probes > 0
                ? round($methods->sum(fn (array $f) => $f['availability'] * $f['probes_total']) / $probes, 2)
                : null,
            'probes_total' => $probes,
            'payments_routed' => $routed,
            'success_rate' => $weighted('success_rate', $routed),
            'unknown_rate' => $weighted('unknown_rate', $routed),
            'decision_latency_p50' => (int) round($methods->avg('decision_latency_p50')),
        ];
    }

    private function demoOverall(int $days): array
    {
        return $this->demoProviders()
            ->map(fn (Provider $provider) => $this->identity($provider) + $this->demoFigures($provider->slug, $days))
            ->sortByDesc('availability')
            ->values()
            ->all();
    }

    private function demoByMethod(int $days): array
    {
        return $this->demoProviders()
            ->map(function (Provider $provider) use ($days) {
                $methods = collect(self::MFS_METHODS)
                    ->mapWithKeys(fn (string $method) => [
                        $method => $this->demoFigures($provider->slug.':'.$method, $days),
                    ]);

                return $this->identity($provider) + [
                    // Derived from the columns, so the demo reconciles with itself
                    // exactly the way live totals do.
                    'totals' => $this->rollUpFigures($methods),
                    'methods' => $methods,
                ];
            })
            ->sortByDesc(fn (array $row) => $row['totals']['availability'])
            ->values()
            ->all();
    }
}
