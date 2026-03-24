<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AiInsightHistoryController extends Controller
{
    function createAiInsightHistory(Request $request){
        $delete = DB::table('ai_insights')->delete();

        return response()->json(['deleted' => $delete]);
    }
}
