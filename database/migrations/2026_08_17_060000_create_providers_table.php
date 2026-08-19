<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('providers', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('name');
            $table->string('short_description');
            $table->text('description')->nullable();

            // Presentation grouping: mfs, card, bank, internet_banking, qr
            $table->string('category')->index();

            // Normalized payment methods this provider can serve.
            $table->json('methods');
            $table->json('currencies');

            // direct | merchant_credentials | partner
            $table->string('connection_type');

            // available | private_beta | coming_soon | merchant_connection_required
            $table->string('integration_status')->index();

            // Who owns settlement for this connection. Never assumed by the platform.
            $table->string('settlement_ownership');

            // Public directory visibility is an explicit business decision.
            $table->boolean('is_public')->default(true)->index();
            $table->unsignedInteger('sort_order')->default(0);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('providers');
    }
};
