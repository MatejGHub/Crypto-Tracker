<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AiInsightHistoryController extends Controller
{
    function createAiInsightHistory(Request $request){
        $aiInsights = DB::table('ai_insights')->orderbyDesc('id')->paginate(10);

        return response()->json([
            'aiInsights' => $aiInsights
        ]);
    }
}