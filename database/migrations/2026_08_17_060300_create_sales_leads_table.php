<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('sales_leads', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('work_email');
            $table->string('company');
            $table->string('monthly_volume')->nullable();
            $table->text('message')->nullable();

            // Consent is stored alongside the lead, per section 37.
            $table->boolean('consented')->default(false);
            $table->string('source')->default('contact-sales');

            // Minimal request context for abuse handling only.
            $table->string('ip_hash', 64)->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sales_leads');
    }
};
