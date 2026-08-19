<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\SystemComponent;
use App\Models\SystemIncident;
use Illuminate\Http\JsonResponse;

class StatusController extends Controller
{
    /** Severity order used to derive the overall platform state. */
    private const SEVERITY = [
        'operational' => 0,
        'maintenance' => 1,
        'degraded' => 2,
        'partial_outage' => 3,
        'major_outage' => 4,
    ];

    public function __invoke(): JsonResponse
    {
        $components = SystemComponent::query()->orderBy('sort_order')->get();

        $overall = $components
            ->sortByDesc(fn (SystemComponent $c) => self::SEVERITY[$c->status] ?? 0)
            ->first()?->status ?? 'unknown';

        $incidents = SystemIncident::query()
            ->orderByDesc('started_at')
            ->limit(10)
            ->get()
            ->map(fn (SystemIncident $incident) => [
                'title' => $incident->title,
                'summary' => $incident->summary,
                'state' => $incident->state,
                'impact' => $incident->impact,
                'affected_components' => $incident->affected_components ?? [],
                'started_at' => $incident->started_at?->toIso8601String(),
                'resolved_at' => $incident->resolved_at?->toIso8601String(),
            ]);

        return response()->json([
            'data' => [
                'overall' => $overall,
                'components' => $components->map(fn (SystemComponent $component) => [
                    'key' => $component->key,
                    'name' => $component->name,
                    'description' => $component->description,
                    'status' => $component->status,
                    'status_changed_at' => $component->status_changed_at?->toIso8601String(),
                ]),
                'incidents' => $incidents,
                'checked_at' => now()->toIso8601String(),
            ],
        ]);
    }
}
