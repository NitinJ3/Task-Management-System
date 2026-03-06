<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\Models\Project;


class ProjectController extends Controller
{

    //fetch all projects
    public function getProjects()
    {

        $projects = Project::where('department', Auth::user()->department)->get();

        if (!$projects) {
            return response()->json([
                "message" => "No Projects Found"
            ]);
        }

        return response()->json([
            "projects" => $projects
        ]);
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
            'team_leader' => 'required|string',
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
            'team_leader' => 'required|string',
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
}
