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
    public function getProjects()
    {

        $projects = Project::where('department', Auth::user()->department)->get();

        if (!$projects || $projects->isEmpty()) {
            return response()->json([
                "message" => "No Projects Found"
            ], 404);
        }

        return response()->json([
            "projects" => $projects
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

    //fetch all projects which belong to team leader
    function getTeamLeaderProjects()
    {

        $projects = Project::where('team_leader', Auth::id())->get();

        if ($projects->isEmpty()) {
            return response()->json([
                "message" => "No projects found"
            ], 404);
        }

        return response()->json([
            "projects" => $projects
        ], 200);
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

        if (!$projects) {

            return response()->json([
                "message" => "You arent assigned any taks"
            ]);
        }

        return response()->json([
            'projects' => $projects
        ]);
    }
}
