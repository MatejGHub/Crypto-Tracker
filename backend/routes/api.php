<?php


use App\Http\Controllers\AiInsightHistoryController;
use App\Http\Controllers\AiInsightsController;
use App\Http\Controllers\registerController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');



Route::get('/ai-insights', [AiInsightsController::class, 'getAiInsights']);

Route::post('/ai-insights-history', [AiInsightHistoryController::class, 'createAiInsightHistory']);

Route::post('/register', [registerController::class, 'register']);

Route::post('/login', [registerController::class, 'login']);