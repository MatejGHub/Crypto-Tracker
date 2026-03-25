<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AiInsightHistoryController extends Controller
{
    function createAiInsightHistory(Request $request){
        $aiInsights = DB::table('ai_insights')->orderbyDesc('id')->limit(10)->get();
        return response()->json($aiInsights);
    }
}
