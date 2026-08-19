<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('system_components', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->string('name');
            $table->string('description')->nullable();

            // operational | degraded | partial_outage | major_outage | maintenance
            $table->string('status')->default('operational');
            $table->timestamp('status_changed_at')->nullable();
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('system_incidents', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('summary');

            // investigating | identified | monitoring | resolved
            $table->string('state')->default('investigating');
            // degraded | partial_outage | major_outage | maintenance
            $table->string('impact')->default('degraded');

            $table->json('affected_components')->nullable();
            $table->timestamp('started_at');
            $table->timestamp('resolved_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('system_incidents');
        Schema::dropIfExists('system_components');
    }
};
