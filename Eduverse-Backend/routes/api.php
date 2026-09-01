<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ClassController;
use App\Http\Controllers\Api\ClassMemberController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes - EduVerse Backend (Auth & Class System API)
|--------------------------------------------------------------------------
*/

// Public Authentication Routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Protected Routes (Requires Laravel Sanctum Token)
Route::middleware('auth:sanctum')->group(function () {
    // User Profile & Auth
    Route::get('/user', [AuthController::class, 'user']);
    Route::put('/user/profile', [AuthController::class, 'updateProfile']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // Class Management API
    Route::get('/classes', [ClassController::class, 'index']);
    Route::post('/classes', [ClassController::class, 'store']);
    Route::post('/classes/join', [ClassController::class, 'join']);
    Route::get('/classes/{id}', [ClassController::class, 'show']);
    Route::put('/classes/{id}', [ClassController::class, 'update']);
    Route::delete('/classes/{id}', [ClassController::class, 'destroy']);
    Route::post('/classes/{id}/regenerate-code', [ClassController::class, 'regenerateCode']);

    // Class Members Management API
    Route::get('/classes/{id}/members', [ClassMemberController::class, 'index']);
    Route::post('/classes/{id}/members/{user}/promote', [ClassMemberController::class, 'promote']);
    Route::post('/classes/{id}/members/{user}/demote', [ClassMemberController::class, 'demote']);
    Route::delete('/classes/{id}/members/{user}', [ClassMemberController::class, 'destroy']);
    Route::post('/classes/{id}/leave', [ClassMemberController::class, 'leave']);
});
