<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\TaskController;


Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post("/register",[UserController::class,"registerUser"]);

Route::post("/login",[UserController::class,"loginUser"]);

Route::middleware('auth:sanctum')->group(function(){

    Route::get("/getUser",[UserController::class,"getUser"]);
    Route::post("/logout",[UserController::class,"logoutUser"]);

    //department head apis

    Route::middleware('role:1')->group(function(){

    Route::get('/head/projects',[ProjectController::class,"getProjects"]);
    Route::post('head/projects/create',[ProjectController::class,"createProject"]);
    Route::get('head/projects/view/{id}',[ProjectController::class,"viewProject"]);
    Route::patch("/head/projects/edit",[ProjectController::class,'updateProject']);
    

    Route::get("/head/users/teamleads",[UserController::class,'getDepartmentTeamLeads']);

    });

    Route::middleware('role:1,2')->group(function(){
    
    Route::get('/users/employees',[UserController::class,'getDepartmentEmployees']);
    Route::post('/tasks/create',[TaskController::class,'createTask']);

    });



});