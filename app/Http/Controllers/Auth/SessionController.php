<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class SessionController extends Controller
{
    /**
     * Sign in.
     *
     * The failure message never distinguishes "no such account" from "wrong
     * password" — that difference tells an attacker which emails are registered.
     */
    public function store(Request $request): JsonResponse
    {
        $credentials = $request->validate([
            'email' => ['required', 'email:rfc'],
            'password' => ['required', 'string'],
        ]);

        if (! auth()->attempt($credentials, (bool) $request->boolean('remember'))) {
            throw ValidationException::withMessages([
                'email' => 'Those credentials do not match our records.',
            ]);
        }

        // A fresh session id on privilege change defeats session fixation.
        $request->session()->regenerate();

        return response()->json(['data' => $this->profile($request->user())]);
    }

    public function show(Request $request): JsonResponse
    {
        $user = $request->user();

        return response()->json(['data' => $user ? $this->profile($user) : null]);
    }

    public function destroy(Request $request): JsonResponse
    {
        auth()->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json(['data' => null]);
    }

    private function profile(User $user): array
    {
        $organization = $user->currentOrganization();

        return [
            'name' => $user->name,
            'email' => $user->email,
            'organization' => $organization ? [
                'name' => $organization->name,
                'slug' => $organization->slug,
            ] : null,
        ];
    }
}
