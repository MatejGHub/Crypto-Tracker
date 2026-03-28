<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Container\Attributes\DB;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

use function Symfony\Component\Translation\t;

class registerController extends Controller
{
    function register(Request $request){

        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required|string|min:8',
        ]);

        $storeData = User::create([
            "name" => $validatedData["name"],
            "email" => $validatedData["email"],
            "password" => Hash::make($validatedData["password"]),
        ]);

        if($storeData){
            return response()->json(["message" => "Successfully registered"]);
        }else{
            return response()->json(["message" => "Failed to register"], 500);
        }
    }

    function login(Request $request){
        $validateData = $request->validate([
            'email' => 'required|email',
            'password' => 'required|string|min:8',
        ]);

        $user = User::where('email', $validateData['email'])->first();
        if(!$user){
            return response()->json(["message" => "User not found"], 404);
        }

        if(Hash::check($validateData['password'], $user->password)){
            return response()->json([
                "message" => "Login successful",
                "token" => $user->createToken('auth_token')->plainTextToken,
                "user" => $user->name,
                "user_id" => $user->id,
            ], 200);
        }else{
            return response()->json(["message" => "Invalid password"], 401);
        }
    }
}
