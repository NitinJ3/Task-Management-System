<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    public function registerUser(Request $request){

       $validated = $request->validate([
        'name'=>'required|string|max:255',
        'email'=>'required|string|email|max:255|unique:users',
        'password' => 'required|string|min:6',
       ]);

        $user = User::create($validated);

        return response()->json([
         "message"=>"User registration succesfull"
        ]);

    }

    public function loginUser(Request $request){
        $credentials = $request->validate([
        'email'=>'required|string|email|max:255|',
        'password' => 'required|string|min:6',
        ]);

        if(Auth::attempt($credentials)){
            $user = Auth::user();
            $user->tokens()->delete();
            $token = $user->createToken('API Token')->plainTextToken;
            return response()->json([
                "message"=>"Login successfull",
                'token'=>$token,
                'user'=>$user
            ]);            
        }
        else{
             return response()->json([
                "message"=>"Incorrect Email or Password",
            ],401);         
        }

        
    }
    function getUser(){
        $user = Auth::user();

        if($user){
            return response()->json([
                "user"=>$user
            ]);
        }
    }

    function logoutUser(){
        $user = Auth::user();
        $user->tokens()->delete();

        return response()->json([
            "message"=>"Logout successful"
        ]);
    }

    function getDepartmentTeamLeads(){
     
        $team_leads = User::where("department", Auth::user()->department)
                  ->where("role_id", 2)
                  ->get();

        if(!$team_leads){
            return response()->json([
                "message"=>"failed to fetch department team leads"
            ]);
        }
            return response()->json([
                "message"=>"team leads fetched",
                "team_leads" => $team_leads
            ]);      
            

    }


    function getDepartmentEmployees(){
            
            $employees = User::where("department", Auth::user()->department)
                ->where("role_id", "!=", 1)
                ->get();

            if(!$employees){
                return response()->json([
                    "message"=>"failed to fetch department employees"
                ]);
            }
                return response()->json([
                    "message"=>"employees fetched",
                    "employees" => $employees
                ]);

    }
    

}
