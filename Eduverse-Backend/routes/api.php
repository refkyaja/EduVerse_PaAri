<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ClassController;
use App\Http\Controllers\Api\ClassMemberController;
use App\Http\Controllers\Api\MapelController;
use App\Http\Controllers\Api\MateriController;
use App\Http\Controllers\Api\SoalController;
use App\Http\Controllers\Api\KuisController;
use App\Http\Controllers\Api\LeaderboardController;
use App\Http\Controllers\Api\LogAktivitasController;
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

    // Mapel (Mata Pelajaran) API
    Route::get('/classes/{id}/mapel', [MapelController::class, 'index']);
    Route::post('/classes/{id}/mapel', [MapelController::class, 'store']);

    // Materi API
    Route::get('/classes/{id}/materi', [MateriController::class, 'index']);
    Route::post('/classes/{id}/materi', [MateriController::class, 'store']);
    Route::get('/classes/{id}/materi/{materiId}', [MateriController::class, 'show']);
    Route::put('/classes/{id}/materi/{materiId}', [MateriController::class, 'update']);
    Route::post('/classes/{id}/materi-versi/{versiId}/verify', [MateriController::class, 'verifyVersion']);

    // Bank Soal API
    Route::get('/classes/{id}/soal', [SoalController::class, 'index']);
    Route::post('/classes/{id}/soal', [SoalController::class, 'store']);
    Route::post('/classes/{id}/soal/parse-teks', [SoalController::class, 'parseTeks']);
    Route::post('/classes/{id}/soal/impor', [SoalController::class, 'imporBatch']);

    // Kuis API
    Route::get('/classes/{id}/kuis', [KuisController::class, 'index']);
    Route::post('/classes/{id}/kuis', [KuisController::class, 'store']);
    Route::get('/classes/{id}/kuis/{kuisId}', [KuisController::class, 'show']);
    Route::post('/classes/{id}/kuis/{kuisId}/submit', [KuisController::class, 'submitAttempt']);

    // Leaderboard XP API
    Route::get('/classes/{id}/leaderboard', [LeaderboardController::class, 'index']);

    // Log Aktivitas API
    Route::get('/classes/{id}/log-aktivitas', [LogAktivitasController::class, 'index']);
});
