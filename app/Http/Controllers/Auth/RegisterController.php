<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Organization;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

class RegisterController extends Controller
{
    /**
     * Create the user and their organization together — an account without an
     * organization cannot own API keys, so the two are one atomic step.
     */
    public function __invoke(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:120'],
            'email' => ['required', 'email:rfc', 'max:180', 'unique:users,email'],
            'password' => ['required', Password::min(12)],
            'organization' => ['required', 'string', 'max:160'],
        ]);

        $user = DB::transaction(function () use ($data) {
            $user = User::create([
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => Hash::make($data['password']),
            ]);

            $organization = Organization::create([
                'name' => $data['organization'],
                'slug' => Organization::uniqueSlug($data['organization']),
            ]);

            // The person who creates the organization owns it.
            $organization->users()->attach($user->id, ['role' => 'owner']);

            return $user;
        });

        auth()->login($user);
        $request->session()->regenerate();

        return response()->json(['data' => $this->profile($user)], 201);
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
