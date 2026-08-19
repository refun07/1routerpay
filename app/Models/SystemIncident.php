<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SystemIncident extends Model
{
    protected $guarded = [];

    protected function casts(): array
    {
        return [
            'affected_components' => 'array',
            'started_at' => 'datetime',
            'resolved_at' => 'datetime',
        ];
    }
}
