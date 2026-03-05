<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('raw_api_responses', function (Blueprint $table) {
            $table->id();
            $table->string('source', 20);
            $table->string('endpoint');
            $table->string('external_id');
            $table->longText('response_body');
            $table->timestamp('fetched_at');
            $table->boolean('is_processed')->default(false);
            $table->timestamp('processed_at')->nullable();
            $table->timestamps();

            $table->index(['source', 'external_id']);
            $table->index('is_processed');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('raw_api_responses');
    }
};
