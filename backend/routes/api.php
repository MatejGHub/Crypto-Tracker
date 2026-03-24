<?php


use App\Http\Controllers\AiInsightHistoryController;
use App\Http\Controllers\AiInsightsController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');



Route::get('/ai-insights', [AiInsightsController::class, 'getAiInsights']);


Route::post('/ai-insights-history', [AiInsightHistoryController::class, 'createAiInsightHistory']);