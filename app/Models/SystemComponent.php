<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SystemComponent extends Model
{
    protected $guarded = [];

    protected function casts(): array
    {
        return ['status_changed_at' => 'datetime'];
    }
}
