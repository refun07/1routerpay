<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Public provider shape. Commercial rates are never exposed here.
 */
class ProviderResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'slug' => $this->slug,
            'name' => $this->name,
            'legal_name' => $this->legal_name,
            'short_description' => $this->short_description,
            'description' => $this->description,
            'category' => $this->category,
            'provider_type' => $this->provider_type,
            // Only ever an approved asset supplied by the product owner.
            'logo_path' => $this->logo_path ? asset($this->logo_path) : null,
            'use_cases' => $this->use_cases ?? [],
            'website' => $this->website,
            'methods' => $this->methods,
            'methods_confirmed' => (bool) $this->methods_confirmed,
            'currencies' => $this->currencies,
            'connection_type' => $this->connection_type,
            'integration_status' => $this->integration_status,
            'settlement_ownership' => $this->settlement_ownership,
            'is_partner' => (bool) $this->is_partner,
            'health' => $this->currentHealth(),
        ];
    }
}
