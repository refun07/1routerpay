<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

/**
 * A merchant API key.
 *
 * Only the SHA-256 hash is persisted. `issue()` returns the plaintext once, to
 * the caller that created it, and nothing else in the system can recover it.
 */
class ApiKey extends Model
{
    protected $guarded = [];

    protected $hidden = ['hash'];

    protected function casts(): array
    {
        return [
            'last_used_at' => 'datetime',
            'revoked_at' => 'datetime',
        ];
    }

    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function scopeActive(Builder $query): Builder
    {
        return $query->whereNull('revoked_at');
    }

    public function isRevoked(): bool
    {
        return $this->revoked_at !== null;
    }

    /**
     * Create a key and return it alongside its one-time plaintext secret.
     *
     * @return array{key: self, plaintext: string}
     */
    public static function issue(
        Organization $organization,
        string $label,
        string $environment,
        ?int $createdBy = null,
    ): array {
        // 32 bytes of entropy, URL-safe. The prefix makes the environment
        // obvious at a glance in logs, dashboards, and bug reports.
        $secret = Str::random(40);
        $prefix = "pr_{$environment}_";
        $plaintext = $prefix.$secret;

        $key = static::create([
            'organization_id' => $organization->id,
            'created_by' => $createdBy,
            'label' => $label,
            'environment' => $environment,
            // Enough to identify the key in a list without being usable.
            'prefix' => $prefix.substr($secret, 0, 4),
            'hash' => hash('sha256', $plaintext),
        ]);

        return ['key' => $key, 'plaintext' => $plaintext];
    }

    /** Constant-time lookup by plaintext, for the future /v1 API middleware. */
    public static function findByPlaintext(string $plaintext): ?self
    {
        return static::active()->where('hash', hash('sha256', $plaintext))->first();
    }
}
