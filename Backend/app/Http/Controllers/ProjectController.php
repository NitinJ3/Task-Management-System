<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\Models\Project;
use App\Models\User;


class ProjectController extends Controller
{

    public function verifyProjectAcess($project_id)
    {

        if (Auth::user()->role_id == 1) {

            $project = Project::with('creator')->find($project_id);

            if (Auth::user()->id !== $project->creator->id) {
                return response()->json(["message" => "You are trying to acess a project that belongs to a different creator"], 403);
            }
        }
    }


    //fetch all projects in your department
    // public function getProjects()
    // {

    //   $projects = Project::where('department', Auth::user()->department)
    //             ->where('status', '!=', 'completed')
    //             ->get();

    //     if (!$projects || $projects->isEmpty()) {
    //         return response()->json([
    //             "message" => "No Projects Found"
    //         ], 404);
    //     }

    //     return response()->json([
    //         "projects" => $projects
    //     ], 200);
    // }


    public function getProjects()
{
    $department = Auth::user()->department;

    // Existing projects (non-completed)
    $projects = Project::where('department', $department)
                ->where('status', '!=', 'completed')
                ->get();

    //  Add counts
    $total = Project::where('department', $department)->count();

    $completed = Project::where('department', $department)
                        ->where('status', 'completed')
                        ->count();

    if ($projects->isEmpty()) {
        return response()->json([
            "message" => "No Projects Found",
            "projects" => [],
            "total_projects" => $total,
            "completed_projects" => $completed
        ], 200); // better than 404 for dashboard
    }

    return response()->json([
        "projects" => $projects,
        "total_projects" => $total,
        "completed_projects" => $completed
    ], 200);
}

    //create a project
    public function createProject(Request $request)
    {


        $request->merge([
            'name' => trim($request->name),
            'description' => trim($request->description),
        ]);


        $validated = $request->validate([
            'name'        => 'required|string|min:3',
            'description' => 'required|string|min:8',
            'team_leader' => 'required|exists:users,id',
            'start_date'  => 'required|date',
            'status'      => 'required|in:pending,active,completed',
            'end_date'    => 'required|date|after:start_date',
        ]);


        $user = Auth::user();
        $validated['department'] = $user->department;
        $validated['created_by'] = $user->id;


        Project::create($validated);

        return response()->json([
            "message" => "Project created successfully",
            "project" => $validated
        ]);
    }


    //get project by id
    public function viewProject($id)
    {
        $response = $this->verifyProjectAcess($id);
        if ($response) {
            return $response;
        }

        //attaches the user attributes using model reations
        $project = Project::with('user')->find($id);

        if ($project && $project->department === Auth::user()->department) {
            return response()->json([
                "message" => "data fetched succesfully",
                "project" => $project,

            ], 200);
        } else {
            return response()->json([
                "message" => "data not found"
            ], 404);
        }
    }


    //update project 
    function updateProject(Request $request)
    {

        $response = $this->verifyProjectAcess($request->id);
        if ($response) {
            return $response;
        }

        $project = Project::find($request->id);
        if (!$project) {
            return response()->json([
                "message" => "sorry no such project found"
            ], 404);
        }

        $request->merge([
            'name' => trim($request->name),
            'description' => trim($request->description),
        ]);


        $validated = $request->validate([
            'name'        => 'required|string|min:3',
            'description' => 'required|string|min:8',
            'team_leader' => 'required|exists:users,id',
            'start_date'  => 'required|date',
            'status'      => 'required|in:pending,active,completed',
            'end_date'    => 'required|date|after:start_date',
        ]);


        $project->update($validated);


        //if project is marked completed then all the tasks under that project will also be marked completed
    if ($project->status === 'completed') {
        $project->tasks()->update([
            'status' => 'completed'
        ]);
    }


        return response()->json([
            "message" => "updated",
            "project" => $project
        ], 200);
    }

    //delete project
    function deleteProject($id)
    {
        $response = $this->verifyProjectAcess($id);
        if ($response) {
            return $response;
        }

        $project = Project::find($id);
        if (!$project) {
            return response()->json([
                "message" => "sorry no such project found"
            ], 404);
        }
        $project->delete();
        return response()->json([
            "message" => "Project deleted successfully"
        ], 200);
    }

    //completed projects
    function getPrevious(){
        $projects = Project::where('department', Auth::user()->department)
        ->where('status', 'completed')
        ->get();

        if (!$projects || $projects->isEmpty()) {
            return response()->json([
                "message" => "No Projects Found"
            ], 404);
        }

        return response()->json([
            "projects" => $projects
        ], 200);    
    }


    //fetch all projects which belong to team leader
    function getTeamLeaderProjects()
    {

        $projects = Project::where('team_leader', Auth::id())
        ->where('status', '!=', 'completed')
        ->get();

        if ($projects->isEmpty()) {
            return response()->json([
                "message" => "No projects found"
            ], 404);
        }

        return response()->json([
            "projects" => $projects
        ], 200);
    }

    //this includes team leader and all employees of the department
    function getAssociatedEmployees($id)
    {
        $response = $this->verifyProjectAcess($id);
        if ($response) {
            return $response;
        }

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


    //fetch all projects in which employees are assigned through tasks assigned to the employees
   function getProjectsByEmployee()
{   
    $projects = Project::whereHas('tasks', function ($query) {
        $query->where('assigned_to', Auth::id());
    })
    ->with(['tasks' => function ($query) {  
        $query->where('assigned_to', Auth::id());
    }])
    ->get();

    if ($projects->isEmpty()) {
        return response()->json([
            "message" => "You arent assigned any tasks",
            "projects" => []
        ], 200);
    }

    return response()->json([
        'projects' => $projects
    ]);
}
}
