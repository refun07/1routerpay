<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('providers', function (Blueprint $table) {
            // Registered entity name, where it differs from the trading brand.
            $table->string('legal_name')->nullable()->after('name');

            /*
             | False until the supported methods have been confirmed with the
             | provider during integration scoping. The UI says "to be confirmed"
             | rather than listing methods the connection may not actually serve.
             */
            $table->boolean('methods_confirmed')->default(false)->after('methods');
        });
    }

    public function down(): void
    {
        Schema::table('providers', function (Blueprint $table) {
            $table->dropColumn(['legal_name', 'methods_confirmed']);
        });
    }
};
