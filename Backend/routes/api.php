<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\LeaveController;


// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');

Route::post("/register", [UserController::class, "registerUser"]);

Route::post("/login", [UserController::class, "loginUser"]);

Route::middleware('auth:sanctum')->group(function () {

    Route::get("/getUser", [UserController::class, "getUser"]);
    Route::post("/logout", [UserController::class, "logoutUser"]);

    //department head apis

    Route::middleware('role:1')->group(function () {

        Route::get('/head/projects', [ProjectController::class, "getProjects"]);
        Route::post('head/projects/create', [ProjectController::class, "createProject"]);
        Route::get('head/projects/view/{id}', [ProjectController::class, "viewProject"]);
        Route::patch("/head/projects/edit", [ProjectController::class, 'updateProject']);

        Route::delete("/head/projects/delete/{id}", [ProjectController::class, 'deleteProject']);
        Route::get("/head/users/teamleads", [UserController::class, 'getDepartmentTeamLeads']);

        Route::get("/user/employee/{id}",[UserController::class,'getUserById']);
        Route::patch("/user/employee/update",[UserController::class,'updateUser']);
        Route::get("/users/add",[UserController::class,'createCode']);
        Route::delete("/user/employee/delete/{id}",[UserController::class,'deleteUser']);
        Route::get("/head/projects/completed",[ProjectController::class,'getPrevious']);
        Route::get('/leave/department', [LeaveController::class, 'showDepartmentLeaves']);
        Route::put('/leave/approve/{id}', [LeaveController::class, 'approveLeave']);
        Route::put('/leave/reject/{id}', [LeaveController::class, 'rejectLeave']);
    });

    Route::middleware('role:1,2')->group(function () {

        Route::get('/users/employees', [UserController::class, 'getDepartmentEmployees']);

        Route::post('/tasks/create', [TaskController::class, 'createTask']);

        Route::delete('/tasks/delete/{id}', [TaskController::class, 'deleteTask']);
        Route::patch('/tasks/edit', [TaskController::class, 'updateTask']);
        Route::get('/tasks/{id}', [TaskController::class, 'getTask']);
        Route::get('/leader/projects', [ProjectController::class, 'getTeamLeaderProjects']);
        Route::get('/project/employees/{project_id}', [ProjectController::class, 'getAssociatedEmployees']);
    });

    Route::get('/project/tasks/{project_id}', [TaskController::class, 'getTasks']);

    Route::get("/employee/projects", [ProjectController::class, 'getProjectsByEmployee']);

    Route::get("/mytasks/{project_id}",[TaskController::class,'toDoTasks']);
    Route::put('/tasks/status/{id}', [TaskController::class, 'toggleStatus']);
    Route::post('/leave/apply', [LeaveController::class, 'applyLeave']);
    Route::get('/leave/my', [LeaveController::class, 'showMyLeaves']);
});
