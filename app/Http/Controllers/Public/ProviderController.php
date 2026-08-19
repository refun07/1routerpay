<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProviderResource;
use App\Models\Provider;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ProviderController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $filters = $request->validate([
            'search' => ['sometimes', 'string', 'max:80'],
            'method' => ['sometimes', 'string', 'max:40'],
            'type' => ['sometimes', 'in:pso,psp,mfs,bank,scheme,rail'],
            'category' => ['sometimes', 'string', 'max:40'],
            'status' => ['sometimes', 'string', 'max:40'],
            'connection' => ['sometimes', 'string', 'max:40'],
            'currency' => ['sometimes', 'string', 'max:8'],
            'sort' => ['sometimes', 'in:name,status,category'],
        ]);

        $providers = Provider::query()
            ->public()
            ->with('healthSnapshots')
            ->when($filters['search'] ?? null, fn ($query, $search) => $query->where(
                fn ($q) => $q->where('name', 'like', "%{$search}%")
                    ->orWhere('short_description', 'like', "%{$search}%")
                    ->orWhere('use_cases', 'like', "%{$search}%")
            ))
            ->when($filters['type'] ?? null, fn ($query, $type) => $query->where('provider_type', $type))
            ->when($filters['category'] ?? null, fn ($query, $category) => $query->where('category', $category))
            ->when($filters['status'] ?? null, fn ($query, $status) => $query->where('integration_status', $status))
            ->when($filters['connection'] ?? null, fn ($query, $connection) => $query->where('connection_type', $connection))
            ->when($filters['method'] ?? null, fn ($query, $method) => $query->whereJsonContains('methods', $method))
            ->when($filters['currency'] ?? null, fn ($query, $currency) => $query->whereJsonContains('currencies', strtoupper($currency)))
            ->when(
                ($filters['sort'] ?? null) === 'name',
                fn ($query) => $query->orderBy('name'),
                fn ($query) => $query->orderBy('sort_order')->orderBy('name')
            )
            ->get();

        return ProviderResource::collection($providers);
    }

    public function show(string $slug): JsonResponse
    {
        $provider = Provider::query()
            ->public()
            ->with('healthSnapshots')
            ->where('slug', $slug)
            ->firstOrFail();

        return ProviderResource::make($provider)->response();
    }
}
