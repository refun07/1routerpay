<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\ApiKey;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;

/**
 * Merchant API keys.
 *
 * The plaintext secret is returned exactly once, by `store`. Every other
 * response carries only the prefix, so the list view can identify a key without
 * ever being able to reveal it.
 */
class ApiKeyController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $organization = $this->organization($request);

        $keys = $organization->apiKeys()
            ->orderByDesc('created_at')
            ->get()
            ->map(fn (ApiKey $key) => $this->present($key));

        return response()->json(['data' => $keys]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'label' => ['required', 'string', 'max:80'],
            'environment' => ['required', 'in:test,live'],
        ]);

        $organization = $this->organization($request);

        $issued = ApiKey::issue(
            $organization,
            $data['label'],
            $data['environment'],
            $request->user()->id,
        );

        return response()->json([
            'data' => $this->present($issued['key']) + [
                // The only time this value will ever exist in a response.
                'plaintext' => $issued['plaintext'],
            ],
        ], 201);
    }

    public function destroy(Request $request, ApiKey $apiKey): JsonResponse
    {
        $organization = $this->organization($request);

        // Never let one organization revoke another's key.
        if ($apiKey->organization_id !== $organization->id) {
            throw new AccessDeniedHttpException('This key belongs to another organization.');
        }

        if (! $apiKey->isRevoked()) {
            $apiKey->update(['revoked_at' => now()]);
        }

        return response()->json(['data' => $this->present($apiKey->fresh())]);
    }

    private function organization(Request $request)
    {
        $organization = $request->user()->currentOrganization();

        if (! $organization) {
            throw new AccessDeniedHttpException('This account has no organization.');
        }

        return $organization;
    }

    private function present(ApiKey $key): array
    {
        return [
            'id' => $key->id,
            'label' => $key->label,
            'environment' => $key->environment,
            // Identifiable, not usable.
            'prefix' => $key->prefix.'…',
            'created_at' => $key->created_at?->toIso8601String(),
            'last_used_at' => $key->last_used_at?->toIso8601String(),
            'revoked_at' => $key->revoked_at?->toIso8601String(),
        ];
    }
}
