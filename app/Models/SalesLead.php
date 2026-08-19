<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SalesLead extends Model
{
    protected $guarded = [];

    protected function casts(): array
    {
        return ['consented' => 'boolean'];
    }
}
