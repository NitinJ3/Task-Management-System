<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use App\Models\Role;
use App\Models\Registration;

class UserController extends Controller
{   

    public function registerUser(Request $request)
    {

        if($request->registered_role == 1) {
            // Handle department head registration
            $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6',
            'department' => 'required|string|max:255|unique:users',
        ]);

            $validated['role_id']=1;
            $user = User::create($validated);
            return response()->json([
            "message" => "User registration succesfull"
        ]);

        } 
        
           
        else if($request->registered_role == 2) {
            // Handle employee registration
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users',
                'password' => 'required|string|min:6',
            ]);

            $code = $request->registration_code;

            $column = Registration::where("code", $code)->first();
            if (!$column) {
                return response()->json([
                    "message" => "Invalid registration code"
                ], 400);
            }
            else{
                $head = User::find($column->user_id);
                $validated['department'] = $head->department;
            }

            $validated['role_id'] = 3; 
            $user = User::create($validated);
            return response()->json([
            "message" => "User registration succesfull"
        ]);
        }

        
    }

 public function createCode()
{
    if (!Auth::check()) {
        return response()->json([
            'error' => 'User not logged in'
        ], 401);
    }

    $user_id = Auth::user()->id;
    $column = Registration::where('user_id',$user_id)->delete();
    
    $registration = new Registration();
    $registration->user_id = Auth::id(); 
    $registration->code = random_int(10000000, 99999999);
    $registration->save();

    return response()->json([
        "message" => "Registration code created",
        "code" => $registration->code
    ]);
}

    public function loginUser(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|string|email|max:255|',
            'password' => 'required|string|min:6',
        ]);

        if (Auth::attempt($credentials)) {
            $user = Auth::user();
            $user->tokens()->delete();
            $token = $user->createToken('API Token')->plainTextToken;
            return response()->json([
                "message" => "Login successfull",
                'token' => $token,
                'user' => $user
            ]);
        } else {
            return response()->json([
                "message" => "Incorrect Email or Password",
            ], 401);
        }
    }
    function getUser()
    {
        $user = Auth::user();

        if ($user) {
            return response()->json([
                "user" => $user
            ]);
        }
    }

    function logoutUser()
    {
        $user = Auth::user();
        $user->tokens()->delete();

        return response()->json([
            "message" => "Logout successful"
        ]);
    }

    function getDepartmentTeamLeads()
    {

        $team_leads = User::where("department", Auth::user()->department)
            ->where("role_id", 2)
            ->get();

        if (!$team_leads) {
            return response()->json([
                "message" => "failed to fetch department team leads"
            ], 404);
        }
        return response()->json([
            "message" => "team leads fetched",
            "team_leads" => $team_leads
        ]);
    }


    function getDepartmentEmployees()
    {

        $employees = User::with("role")
            ->where("department", Auth::user()->department)
            ->where("role_id", "!=", 1)
            ->get();
        

        if (!$employees || $employees->isEmpty()) {
            return response()->json([
                "message" => "failed to fetch department employees"
            ], 404);
        }
        return response()->json([
            "message" => "employees fetched",
            "employees" => $employees
        ]);
    }


    function getUserById($id){
        $user = User::find($id);
        if(!$user){
            return response()->json([
                "message" => "failed to fetch the employee user"
            ], 404);
        }


            return response()->json([
                "user"=>$user
            ]);

    }

    function updateUser(Request $request){
        $user = User::find($request->id);

         if(!$user){
            return response()->json([
                "message"=>"User doesnt exist"
            ],404);
        }

        if($user->department!=Auth::user()->department){
            return response()->json([
                "message"=>"You are trying to update a user not in your department"
            ],403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,'.$user->id,
            'is_active' => 'required|numeric|in:0,1',
            'role_id' => 'required|numeric|in:1,2,3',
        ]);

        $user->update($validated);
        
        return response()->json([
            "message"=>"Succesfully updated employee"
        ]);

    }

    function deleteUser($id){
        $user = User::find($id);

         if(!$user){
            return response()->json([
                "message"=>"User doesn't exist"
            ],404);
        }

        if($user->department!=Auth::user()->department){
            return response()->json([
                "message"=>"You are trying to delete a user not in your department"
            ],403);
        }

        $user->delete();
        
        return response()->json([
            "message"=>"Succesfully deleted employee"
        ]);

    }
}
