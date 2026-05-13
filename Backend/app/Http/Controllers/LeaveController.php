<?php

namespace App\Http\Controllers;

use App\Models\Leave;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;


class LeaveController extends Controller
{
    public function applyLeave(Request $request){
            $validated = $request->validate([
                'start_date' => 'required|date',
                'end_date' => 'required|date|after_or_equal:start_date',
                'reason'=>'required|string|min:3',
                
            ]);


        $leave = Leave::create([
                ...$validated,
                'user_id' => Auth::id(),
                'reason' => trim($validated['reason']),
                'status' => 'pending',
        ]);

            return response()->json([
                "message"=>"leave applied successfully",
                "data"=>$validated
            ]);
    }

        public function showLeaves(){
            $leaves = Leave::with('user')
            ->whereHas('user',function($query){
                $query->where('department',Auth::user()->department);
            })
            ->orderBy('created_at','desc')
            ->paginate(1);
            if(!$leaves || $leaves->isEmpty()){
                return response()->json([
                    "message"=>"Leaves not found"
                ],404); 
            }

            return response()->json([
                "leaves"=>$leaves
            ]);
        }
        public function showMyLeaves(){
            $leaves = Leave::with('user')->where('user_id', Auth::id())
            ->orderBy('created_at','desc')
            ->paginate(1);
            if(!$leaves || $leaves->isEmpty()){
                return response()->json([
                    "message"=>"Leaves not found"
                ],404); 
            }
            return response()->json([
                "leaves"=>$leaves
            ]);
        }
        public function approveLeave($id){
            $leave = Leave::with('user')->find($id);
   
            if(!$leave){
                return response()->json([
                    "message"=>"This leave is not found"
                ],404);
            }
            if($leave->user->department!=Auth::user()->department){
                return response()->json([
                    "message"=>"This leave is not in your departmet"
                ],403);
            }

            
            $leave->status = "approved";   
            $leave->save();

            return response()->json([
                "message"=>"Leave approved"
            ],200);
        }
        public function rejectLeave($id){
            $leave = Leave::with('user')->find($id);
   
            if(!$leave){
                return response()->json([
                    "message"=>"This leave is not found"
                ],404);
            }
            if($leave->user->department!=Auth::user()->department){
                return response()->json([
                    "message"=>"This leave is not in your departmet"
                ],403);
            }

            
            $leave->status = "rejected";   
            $leave->save();

            return response()->json([
                "message"=>"Leave approved"
            ],200);
        }
}