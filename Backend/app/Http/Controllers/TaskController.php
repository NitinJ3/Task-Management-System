<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;

class TaskController extends Controller
{
        public function createTask(Request $request){

            $request->merge([
                'title' => trim($request->title),
                'description' => trim($request->description),
            ]);

            $validatedData = $request->validate([
                'project_id' => 'required|exists:projects,id',
                'title' => 'required|string|max:255',
                'description' => 'required|string',
                'assigned_to' => 'required|exists:users,id',
                'status' => 'required|string|in:pending,active,completed',
                'priority' => 'required|string|in:low,medium,high',
                'due_date' => 'required|date',
            ]);
    
            $task = Task::create($validatedData);
    
            return response()->json(['message' => 'Task created successfully', 'task' => $task], 201);
        }
}
