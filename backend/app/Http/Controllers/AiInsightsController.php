<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\DB;

class AiInsightsController extends Controller
{
    public function getAiInsights()
    {
        $url =
            'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false&price_change_percentage=24h,7d';

        $markets = Http::get($url);
        if (! $markets->successful()) {
            return response()->json(['error' => 'CoinGecko failed'], 502);
        }

        $rows = array_map(static function ($coin) {
            return [
                'symbol' => $coin['symbol'] ?? null,
                'name' => $coin['name'] ?? null,
                'current_price' => $coin['current_price'] ?? null,
                'market_cap_rank' => $coin['market_cap_rank'] ?? null,
                'price_change_percentage_24h' => $coin['price_change_percentage_24h'] ?? null,
                'price_change_percentage_7d_in_currency' => $coin['price_change_percentage_7d_in_currency'] ?? null,
                'market_cap' => $coin['market_cap'] ?? null,
                'total_volume' => $coin['total_volume'] ?? null,
            ];
        }, $markets->json() ?? []);

        $content =
            'Market snapshot JSON (top 10 by cap): '.
            json_encode($rows, JSON_UNESCAPED_SLASHES).
            "\n\n".
            'Reply with ONLY one JSON object (no markdown, no extra text). Shape exactly: '.
            '{"market_status":"bullish"|"bearish","market_change_percent":number (your single estimated tilt for this snapshot, e.g. average 24h move direction as one signed percent),'.
            '"ai_confidence":number 0-100 (how confident you are in that market read),'.
            '"active_signals":array of short strings (2-5 concrete signals you see in the data),'.
            '"accuracy":number 0-100 (your self-assessed reliability of this brief analysis),'.
            '"title":string (news-style headline),'.
            '"standout_summary":string (2-4 sentences on the single most standout coin or theme in this list),'.
            '"coin_symbol":string uppercase (the one coin the standout_summary focuses on),'.
            '"coin_name":string (full name of that coin),'.
            '"news_created_at":string (ISO 8601 UTC timestamp for when this insight is generated, e.g. 2025-03-19T12:00:00Z)}. '.
            'Pick one standout from the list; be brief.';

        $api_key = config('services.groq.api_key');

        $response = Http::withHeaders([
            'Authorization' => 'Bearer '.$api_key,
            'Content-Type' => 'application/json',
        ])->post('https://api.groq.com/openai/v1/chat/completions', [
            'model' => 'llama-3.3-70b-versatile',
            'messages' => [
                ['role' => 'user', 'content' => $content],
            ],
        ]);

        if (! $response->successful()) {
            return response()->json(['error' => 'Groq failed'], 502);
        }

        $groqJson = $response->json();
        $raw = $groqJson['choices'][0]['message']['content'] ?? null;
        $decoded = is_string($raw) ? json_decode(trim($raw), true) : null;

        if (! is_array($decoded)) {
            return response()->json([
                'error' => 'Invalid Groq JSON payload',
                'raw' => $raw,
            ], 502);
        }

        // Store the parsed AI JSON into the DB.
        DB::table('ai_insights')->insert([
            'market_status' => $decoded['market_status'] ?? null,
            'market_change_percent' => $decoded['market_change_percent'] ?? null,
            'ai_confidence' => $decoded['ai_confidence'] ?? null,
            'active_signals' => isset($decoded['active_signals']) ? json_encode($decoded['active_signals']) : null,
            'accuracy' => $decoded['accuracy'] ?? null,
            'title' => $decoded['title'] ?? null,
            'standout_summary' => $decoded['standout_summary'] ?? null,
            'coin_symbol' => $decoded['coin_symbol'] ?? null,
            'coin_name' => $decoded['coin_name'] ?? null,
            'news_created_at' => isset($decoded['news_created_at'])
                ? Carbon::parse($decoded['news_created_at'])
                : now(),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return $response->json();
    }
}
