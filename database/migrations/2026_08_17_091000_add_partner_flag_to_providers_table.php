<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Partner status, set by the product owner.
     *
     * This is a commercial fact only the business can assert, so it is a field
     * rather than something written into copy. Set it true only where an
     * agreement actually exists — it is separate from `integration_status`,
     * which describes whether the connection is technically live.
     */
    public function up(): void
    {
        Schema::table('providers', function (Blueprint $table) {
            $table->boolean('is_partner')->default(false)->after('is_public')->index();
            $table->date('partner_since')->nullable()->after('is_partner');
        });
    }

    public function down(): void
    {
        Schema::table('providers', function (Blueprint $table) {
            $table->dropColumn(['is_partner', 'partner_since']);
        });
    }
};
