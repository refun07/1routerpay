<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Daily rollup of *measured* provider behaviour.
     *
     * Everything the rankings and benchmarks pages display is derived from this
     * table. It is written by the platform from real traffic and real health
     * probes — never seeded, so an empty table honestly means "not measured yet".
     */
    public function up(): void
    {
        Schema::create('provider_metric_daily', function (Blueprint $table) {
            $table->id();
            $table->foreignId('provider_id')->constrained()->cascadeOnDelete();
            $table->date('date');

            // Availability, from health probes.
            $table->unsignedInteger('probes_total')->default(0);
            $table->unsignedInteger('probes_healthy')->default(0);

            // Outcomes, from real payment attempts routed to this provider.
            $table->unsignedInteger('payments_routed')->default(0);
            $table->unsignedInteger('payments_succeeded')->default(0);
            $table->unsignedInteger('payments_failed')->default(0);
            // Held separately: an unknown outcome is not a failure.
            $table->unsignedInteger('payments_unknown')->default(0);

            // Routing decision latency, in milliseconds.
            $table->unsignedInteger('decision_latency_p50')->nullable();
            $table->unsignedInteger('decision_latency_p95')->nullable();

            $table->timestamps();
            $table->unique(['provider_id', 'date']);
            $table->index('date');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('provider_metric_daily');
    }
};
