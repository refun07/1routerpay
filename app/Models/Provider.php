<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Provider extends Model
{
    protected $guarded = [];

    protected function casts(): array
    {
        return [
            'methods' => 'array',
            'currencies' => 'array',
            'use_cases' => 'array',
            'is_public' => 'boolean',
            'methods_confirmed' => 'boolean',
            'is_partner' => 'boolean',
            'partner_since' => 'date',
        ];
    }

    public function healthSnapshots(): HasMany
    {
        return $this->hasMany(ProviderHealthSnapshot::class);
    }

    public function scopePublic(Builder $query): Builder
    {
        return $query->where('is_public', true);
    }

    /**
     * Latest observed health, or `unknown` when nothing has been observed yet.
     * The public site must never invent an operational status.
     */
    public function currentHealth(): string
    {
        return $this->healthSnapshots
            ->sortByDesc('observed_at')
            ->first()?->status ?? 'unknown';
    }
}
