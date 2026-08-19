<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Break the rollup down by payment method.
     *
     * "How does bKash perform through SSLCOMMERZ?" is a different question from
     * "how does SSLCOMMERZ perform?", and merchants route on the answer to the
     * first one. Adding `method` to the key makes the per-wallet grain the only
     * grain, so provider totals are always a sum across methods and can never
     * double-count.
     */
    public function up(): void
    {
        Schema::table('provider_metric_daily', function (Blueprint $table) {
            // bkash | nagad | rocket | upay | card | internet_banking | bank_transfer | qr
            $table->string('method')->default('unspecified')->after('date')->index();
        });

        Schema::table('provider_metric_daily', function (Blueprint $table) {
            $table->index('provider_id');
            $table->dropUnique(['provider_id', 'date']);
            $table->unique(['provider_id', 'method', 'date']);
        });
    }

    public function down(): void
    {
        Schema::table('provider_metric_daily', function (Blueprint $table) {
            $table->dropUnique(['provider_id', 'method', 'date']);
            $table->unique(['provider_id', 'date']);
            $table->dropIndex(['provider_id']);
            $table->dropColumn('method');
        });
    }
};
