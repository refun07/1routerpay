<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * API keys are stored as hashes only.
     *
     * The plaintext secret exists exactly once, in the response to the request
     * that created it. There is deliberately no column that could hold it, so a
     * database dump cannot leak a working credential.
     */
    public function up(): void
    {
        Schema::create('api_keys', function (Blueprint $table) {
            $table->id();
            $table->foreignId('organization_id')->constrained()->cascadeOnDelete();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();

            $table->string('label');

            // test | live — also encoded in the key prefix so it is visible in logs.
            $table->string('environment')->default('test');

            // Shown in the UI so a key is identifiable without revealing it.
            $table->string('prefix', 16);
            $table->char('hash', 64)->unique();

            $table->timestamp('last_used_at')->nullable();
            $table->timestamp('revoked_at')->nullable();
            $table->timestamps();

            $table->index(['organization_id', 'environment']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('api_keys');
    }
};
