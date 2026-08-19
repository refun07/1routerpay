<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('provider_health_snapshots', function (Blueprint $table) {
            $table->id();
            $table->foreignId('provider_id')->constrained()->cascadeOnDelete();

            // operational | degraded | offline | unknown
            $table->string('status')->default('unknown');
            $table->unsignedInteger('latency_ms')->nullable();
            $table->string('note')->nullable();
            $table->timestamp('observed_at')->index();

            $table->timestamps();
            $table->index(['provider_id', 'observed_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('provider_health_snapshots');
    }
};
