<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;


class watchlist_controler extends Controller
{
    function WatchlistItems(Request $request){
        $validateData = $request->validate([
            'coin_id' => 'required|string|max:100',
        ]);

        $userId = $request->user()->id;
        $alreadyExists = DB::table('watchlist')
            ->where('user_id', $userId)
            ->where('coin_id', $validateData['coin_id'])
            ->exists();

        if ($alreadyExists) {
            return response()->json(["message" => "Coin already in watchlist"], 200);
        }

        $data = DB::table('watchlist')->insert([
            'user_id' => $userId,
            'coin_id' => $validateData['coin_id'],
            'created_at' => now(),
            'updated_at' => now(),
         ]);

         if($data){
            return response()->json(["message"=> "Data stored succesfully"], 200);
         } else{
            return response()->json(["message"=> "Failed to store data"], 500);
         }
         
        return response()->json(["message"=> "I recieved your request storing into db."]);
    }

    function GetWatchlistItems(Request $request){
        $items = DB::table('watchlist')
        ->where('user_id', $request->user()->id)
        ->pluck('coin_id');


        if($items){
            return response()->json(["items" => $items], 200);
        } else{
            return response()->json(["message" => "No items found"], 404);
        }
    }

    function DeleteWatchlistItem(Request $request, string $coinId){
        $deleted = DB::table('watchlist')
            ->where('user_id', $request->user()->id)
            ->where('coin_id', $coinId)
            ->delete();

        if ($deleted > 0) {
            return response()->json(["message" => "Data removed succesfully"], 200);
        }

        return response()->json(["message" => "Item not found"], 404);
    }
}
