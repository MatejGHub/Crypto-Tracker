<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('ai_insights', function (Blueprint $table) {
            $table->id();
            $table->text('market_status');
            $table->decimal('market_change_percent', 12, 4)->nullable();
            $table->decimal('ai_confidence', 5, 2)->nullable();
            $table->json('active_signals')->nullable();
            $table->decimal('accuracy', 5, 2)->nullable();
            $table->text('title');
            $table->text('standout_summary');
            $table->text('coin_symbol');
            $table->text('coin_name');
            $table->timestampTz('news_created_at')->nullable();
            $table->timestamps();

            $table->index('news_created_at');
            $table->index('coin_symbol');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ai_insights');
    }
};
