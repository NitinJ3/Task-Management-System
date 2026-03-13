<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;



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


        $task = Task::find($id);

        if (!$task) {
            return response()->json(['message' => 'Task not found'], 404);
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

        $task->update($validatedData);

        return response()->json(['message' => 'Task updated successfully', 'task' => $task], 200);
    }


    //this includes team leader and all employees of the department
    function getAssociatedEmployees($id)
    {

        $project = Project::with('user')->findOrFail($id);

        $lead = $project->user;

        $users = User::where('department', Auth::user()->department)
            ->where('role_id', 3)
            ->get();

        $users->push($lead);

        return response()->json([
            "employees" => $users
        ]);
    }
}
