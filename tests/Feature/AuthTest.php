<?php

namespace Tests\Feature;

use App\Models\Organization;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    private function payload(array $overrides = []): array
    {
        return array_merge([
            'name' => 'Ayesha R',
            'email' => 'ayesha@example.com',
            'password' => 'a-long-enough-password',
            'organization' => 'Example Commerce',
        ], $overrides);
    }

    public function test_registering_creates_a_user_an_organization_and_a_session(): void
    {
        $response = $this->postJson('/api/auth/register', $this->payload())->assertCreated();

        $response->assertJsonPath('data.email', 'ayesha@example.com');
        $response->assertJsonPath('data.organization.name', 'Example Commerce');

        $user = User::sole();
        $this->assertAuthenticatedAs($user);

        // The creator owns the organization they just made.
        $this->assertSame('owner', $user->organizations()->sole()->pivot->role);
    }

    public function test_passwords_are_hashed_and_never_returned(): void
    {
        $response = $this->postJson('/api/auth/register', $this->payload())->assertCreated();

        $this->assertStringNotContainsString('a-long-enough-password', $response->getContent());
        $this->assertNotSame('a-long-enough-password', User::sole()->password);
        $this->assertTrue(Hash::check('a-long-enough-password', User::sole()->password));
    }

    public function test_registration_rejects_short_passwords_and_duplicate_emails(): void
    {
        $this->postJson('/api/auth/register', $this->payload(['password' => 'short']))
            ->assertStatus(422)
            ->assertJsonValidationErrors('password');

        $this->postJson('/api/auth/register', $this->payload())->assertCreated();
        $this->post('/api/auth/logout');

        $this->postJson('/api/auth/register', $this->payload(['organization' => 'Another']))
            ->assertStatus(422)
            ->assertJsonValidationErrors('email');
    }

    public function test_organization_slugs_do_not_collide(): void
    {
        Organization::create(['name' => 'Example Commerce', 'slug' => 'example-commerce']);

        $this->postJson('/api/auth/register', $this->payload())->assertCreated();

        $this->assertSame(2, Organization::where('name', 'Example Commerce')->count());
        $this->assertSame(2, Organization::distinct()->count('slug'));
    }

    public function test_sign_in_and_out(): void
    {
        $this->postJson('/api/auth/register', $this->payload())->assertCreated();
        $this->post('/api/auth/logout')->assertOk();
        $this->assertGuest();

        $this->postJson('/api/auth/login', [
            'email' => 'ayesha@example.com',
            'password' => 'a-long-enough-password',
        ])->assertOk()->assertJsonPath('data.organization.name', 'Example Commerce');

        $this->assertAuthenticated();
    }

    public function test_a_wrong_password_does_not_reveal_whether_the_account_exists(): void
    {
        $this->postJson('/api/auth/register', $this->payload())->assertCreated();
        $this->post('/api/auth/logout');

        $known = $this->postJson('/api/auth/login', [
            'email' => 'ayesha@example.com',
            'password' => 'wrong-password-entirely',
        ])->assertStatus(422);

        $unknown = $this->postJson('/api/auth/login', [
            'email' => 'nobody@example.com',
            'password' => 'wrong-password-entirely',
        ])->assertStatus(422);

        $this->assertSame(
            $known->json('errors.email'),
            $unknown->json('errors.email'),
            'The two failures must be indistinguishable.'
        );

        $this->assertGuest();
    }

    public function test_login_is_rate_limited(): void
    {
        foreach (range(1, 5) as $attempt) {
            $this->postJson('/api/auth/login', ['email' => 'a@example.com', 'password' => 'nope-nope-nope']);
        }

        $this->postJson('/api/auth/login', ['email' => 'a@example.com', 'password' => 'nope-nope-nope'])
            ->assertStatus(429);
    }

    public function test_me_returns_null_for_a_guest(): void
    {
        $this->getJson('/api/auth/me')->assertOk()->assertJsonPath('data', null);
    }
}
