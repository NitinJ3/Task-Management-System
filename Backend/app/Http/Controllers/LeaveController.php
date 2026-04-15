<?php

namespace App\Http\Controllers;

use App\Models\Leave;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LeaveController extends Controller
{
    // ✅ Apply Leave (Employee)
    public function applyLeave(Request $request)
    {
        $validated = $request->validate([
            'reason' => 'required|string|min:5',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
        ]);

        $leave = Leave::create([
            'user_id' => Auth::id(),
            'reason' => trim($validated['reason']),
            'start_date' => $validated['start_date'],
            'end_date' => $validated['end_date'],
            'status' => 'pending'
        ]);

        return response()->json([
            'message' => 'Leave applied successfully',
            'leave' => $leave
        ], 201);
    }

    // ✅ Show My Leave Requests (Employee)
    public function showMyLeaves()
    {
        $leaves = Leave::where('user_id', Auth::id())
                        ->orderBy('created_at', 'desc')
                        ->get();

        return response()->json([
            'leaves' => $leaves
        ]);
    }

    // ✅ Show All Leaves in My Department (Department Head)
    public function showDepartmentLeaves()
    {
        $user = Auth::user();

        // Get users in same department
        $userIds = User::where('department', $user->department)
                        ->pluck('id');

        $leaves = Leave::whereIn('user_id', $userIds)
                        ->with('user') // optional: get user details
                        ->orderBy('created_at', 'desc')
                        ->get();

        return response()->json([
            'leaves' => $leaves
        ]);
    }

    // ✅ Approve Leave (Department Head)
    public function approveLeave($id)
    {
        $leave = Leave::find($id);

        if (!$leave) {
            return response()->json([
                'message' => 'Leave not found'
            ], 404);
        }

        $leave->status = 'approved';
        $leave->save();

        return response()->json([
            'message' => 'Leave approved',
            'leave' => $leave
        ]);
    }

    // ✅ Reject Leave (Department Head)
    public function rejectLeave($id)
    {
        $leave = Leave::find($id);

        if (!$leave) {
            return response()->json([
                'message' => 'Leave not found'
            ], 404);
        }

        $leave->status = 'rejected';
        $leave->save();

        return response()->json([
            'message' => 'Leave rejected',
            'leave' => $leave
        ]);
    }
}