<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProviderMetricDaily extends Model
{
    protected $table = 'provider_metric_daily';

    protected $guarded = [];

    protected function casts(): array
    {
        return ['date' => 'date'];
    }

    public function provider(): BelongsTo
    {
        return $this->belongsTo(Provider::class);
    }
}
