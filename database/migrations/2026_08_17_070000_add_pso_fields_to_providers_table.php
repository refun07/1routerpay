<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('providers', function (Blueprint $table) {
            // pso | psp | mfs | bank | scheme | rail
            $table->string('provider_type')->default('psp')->after('category')->index();

            /*
             | Path to an APPROVED brand asset under public/, e.g.
             | "brand/providers/sslcommerz.svg". Null renders a neutral text mark.
             | Never populate this with a scraped or recreated logo.
             */
            $table->string('logo_path')->nullable()->after('provider_type');

            // What merchants realistically use this connection for.
            $table->json('use_cases')->nullable()->after('logo_path');

            $table->string('website')->nullable()->after('use_cases');
        });
    }

    public function down(): void
    {
        Schema::table('providers', function (Blueprint $table) {
            $table->dropColumn(['provider_type', 'logo_path', 'use_cases', 'website']);
        });
    }
};
