<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use App\Models\Leave;



class TaskController extends Controller
{
    //verify
    public function verifyProjectAcess($project_id)
    {

        if (Auth::user()->role_id == 1) {

            $project = Project::with('creator')->find($project_id);

            if (Auth::user()->id !== $project->creator->id) {
                return response()->json(["message" => "You are trying to acess a task that belongs to a project you did not create"], 403);
            }
        }
        if (Auth::user()->role_id == 2) {

            $project = Project::with('user')->find($project_id);

            if (Auth::user()->id !== $project->user->id) {
                return response()->json(["message" => "You are trying to acess a task that belongs to a project you are not leading"], 403);
            }
        }
    }


    //create new task
    public function createTask(Request $request)
    {

        $response = $this->verifyProjectAcess($request->project_id);

        if ($response) {
            return $response;
        }

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

        $hasleave = Leave::with('user')->where('user_id', $validatedData['assigned_to'])
            ->where('start_date', '<=', $validatedData['due_date'])
            ->where('end_date', '>=', $validatedData['due_date'])
            ->where('status', 'approved')
            ->first();
        
        if ($hasleave){
            
            return response()->json([
                 'message' => "{$hasleave->user->name} is on leave from $hasleave->start_date to $hasleave->end_date. Please assign the task to someone else or change the due date."
            ], 400);
        }


        $task = Task::create($validatedData);

        return response()->json(['message' => 'Task created successfully', 'task' => $task], 201);
    }

    //get task for a project
    public function getTasks($project_id)
    {

        if (Auth::user()->role_id === 3) {
            return response()->json([], 403);
        }

        $response = $this->verifyProjectAcess($project_id);

        if ($response) {
            return $response;
        }

        $tasks = Task::with('user')->where('project_id', $project_id)->get();


        if ($tasks->isEmpty()) {
            return response()->json(['message' => 'No tasks found for this project'], 404);
        }

        return response()->json(['tasks' => $tasks], 200);
    }

    //delete a task
    public function deleteTask($id)
    {

        $project_id = Task::where('id', $id)->value('project_id');

        $response = $this->verifyProjectAcess($project_id);

        if ($response) {
            return $response;
        }

        if ($response) {
            return $response;
        }

        $task = Task::find($id);

        if (!$task) {
            return response()->json(['message' => 'Task not found'], 404);
        }

        $task->delete();

        return response()->json(['message' => 'Task deleted successfully'], 200);
    }

    //get a task by its id
    public function getTask($id)
    {
        $task = Task::with('project')->find($id);

        if (!$task) {
            return response()->json(['message' => 'Task not found'], 404);
        }

        $user = Auth::user();

        if ($user->role_id == 3 && $user->id != $task->assigned_to) {
            return response()->json(["message" => "Its not your task"], 403);
        }

        if ($user->role_id == 1 && $user->id != $task->project->created_by) {
            return response()->json(["message" => "Not your project"], 403);
        }

        if ($user->role_id == 2 && $user->id != $task->project->team_leader) {
            return response()->json(["message" => "Not team leader"], 403);
        }

       

        return response()->json(['task' => $task], 200);
    }


    //update a task
    public function updateTask(Request $request)
    {

        $response = $this->verifyProjectAcess($request->project_id);

        if ($response) {
            return $response;
        }

        $request->merge([
            'title' => trim($request->title),
            'description' => trim($request->description),
        ]);

        $validatedData = $request->validate([
            'id' => 'required|exists:tasks,id',
            'project_id' => 'required|exists:projects,id',
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'assigned_to' => 'required|exists:users,id',
            'status' => 'required|string|in:pending,active,completed',
            'priority' => 'required|string|in:low,medium,high',
            'due_date' => 'required|date',
        ]);

        $task = Task::find($validatedData['id']);

        if (!$task) {
            return response()->json(['message' => 'Task not found'], 404);
        }
        
        $hasleave = Leave::with('user')->where('user_id', $validatedData['assigned_to'])
            ->where('start_date', '<=', $validatedData['due_date'])
            ->where('end_date', '>=', $validatedData['due_date'])
            ->where('status', 'approved')
            ->first();
        
        if ($hasleave){
            
            return response()->json([
                 'message' => "{$hasleave->user->name} is on leave from $hasleave->start_date to $hasleave->end_date. Please assign the task to someone else or change the due date."
            ], 400);
        }


        $task->update($validatedData);

        return response()->json(['message' => 'Task updated successfully', 'task' => $task], 200);
    }

      public function toDoTasks($id)
{
    $userId = Auth::user()->id;

    return response()->json([
        'low' => Task::where('assigned_to', $userId)
                    ->where('project_id', $id)
                    ->where('priority', 'low')
                    ->where('status', '!=', 'completed')
                    ->orderBy('due_date', 'asc')
                    ->get(),

        'medium' => Task::where('assigned_to', $userId)
                        ->where('project_id', $id)
                        ->where('priority', 'medium')
                        ->where('status', '!=', 'completed')
                        ->orderBy('due_date', 'asc')
                        ->get(),

        'high' => Task::where('assigned_to', $userId)
                      ->where('project_id', $id)
                      ->where('priority', 'high')
                      ->where('status', '!=', 'completed')
                      ->orderBy('due_date', 'asc')
                      ->get(),

        
    ], 200);
}

public function toggleStatus(Request $request, $id)
{
    $task = Task::find($id);

    if (!$task) {
        return response()->json([
            "message" => "Task not found"
        ], 404);
    }

    // Optional: authorization check
    if (Auth::id() != $task->assigned_to) {
        return response()->json([
            "message" => "Unauthorized"
        ], 403);
    }

    // Validate status
    $validated = $request->validate([
        'status' => 'required|in:active,completed'
    ]);

    // Update status
    $task->status = $validated['status'];
    $task->save();

    return response()->json([
        "message" => "Status updated",
        "task" => $task
    ], 200);
}

public function getCompletedTasks($id){
    $userId = Auth::user()->id;
    return response()->json([
        "completed"=>Task::where('assigned_to',$userId)
                    ->where('project_id',$id)
                    ->where('status','completed')
                    ->get(),
    ],200);
}
    public function getTaskStatistics()
{
    $user = Auth::user();
    

    $total_tasks = Task::whereHas('user', function ($query) use ($user) {
        $query->where('department', $user->department);
    })->get();

    $non_completed_tasks = $total_tasks
        ->whereIn('status', ['pending', 'active'])
        ->count();

    $completed_tasks = $total_tasks
        ->where('status', 'completed')
        ->count();

    return response()->json([
        "total_tasks" => $total_tasks->count(),
        "non_completed_tasks" => $non_completed_tasks,
        "completed_tasks" => $completed_tasks
    ], 200);
}

public function getPersonalTaskStatistics(){

    $total =  Task::where('assigned_to',Auth::user()->id)
                  ->count();

    $non_completed_tasks = Task::where('assigned_to',Auth::user()->id)
                  ->whereIn('status',['pending', 'active'])
                  ->count();

    $completed = Task::where('assigned_to',Auth::user()->id)
                  ->where('status','completed')
                  ->count();

    return response()->json([
        'total' => $total,
        'noncompleted' => $non_completed_tasks,
        'completed' => $completed
    ]);
    
}

}
