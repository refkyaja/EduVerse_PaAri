<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_register_successfully(): void
    {
        $response = $this->postJson('/api/register', [
            'name' => 'Refky Satria',
            'username' => 'refky_satria',
            'email' => 'refky@eduverse.com',
            'password' => 'Password123!',
            'password_confirmation' => 'Password123!',
        ]);

        $response->assertStatus(201)
            ->assertJson([
                'success' => true,
                'message' => 'Registrasi berhasil',
            ])
            ->assertJsonStructure([
                'success',
                'message',
                'data' => [
                    'user' => ['id', 'name', 'username', 'email', 'profile_photo', 'bio', 'created_at', 'updated_at'],
                    'token',
                    'token_type',
                ],
            ]);

        $this->assertDatabaseHas('users', [
            'email' => 'refky@eduverse.com',
            'username' => 'refky_satria',
        ]);
    }

    public function test_registration_validation_fails_for_duplicate_email(): void
    {
        User::factory()->create([
            'email' => 'duplicate@eduverse.com',
            'username' => 'user_one',
        ]);

        $response = $this->postJson('/api/register', [
            'name' => 'User Two',
            'username' => 'user_two',
            'email' => 'duplicate@eduverse.com',
            'password' => 'Password123!',
            'password_confirmation' => 'Password123!',
        ]);

        $response->assertStatus(422)
            ->assertJson([
                'success' => false,
                'message' => 'Validasi pendaftaran gagal',
            ]);
    }

    public function test_user_can_login_successfully(): void
    {
        $user = User::factory()->create([
            'email' => 'user@eduverse.com',
            'username' => 'user_test',
            'password' => bcrypt('Secret123!'),
        ]);

        $response = $this->postJson('/api/login', [
            'email' => 'user@eduverse.com',
            'password' => 'Secret123!',
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Login berhasil',
            ])
            ->assertJsonStructure([
                'data' => ['user', 'token', 'token_type'],
            ]);
    }

    public function test_login_fails_with_invalid_credentials(): void
    {
        User::factory()->create([
            'email' => 'user@eduverse.com',
            'password' => bcrypt('Secret123!'),
        ]);

        $response = $this->postJson('/api/login', [
            'email' => 'user@eduverse.com',
            'password' => 'WrongPassword',
        ]);

        $response->assertStatus(401)
            ->assertJson([
                'success' => false,
                'message' => 'Login gagal',
            ]);
    }

    public function test_authenticated_user_can_get_profile(): void
    {
        $user = User::factory()->create([
            'name' => 'Refky Satria',
            'username' => 'refky',
            'email' => 'refky@eduverse.com',
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->getJson('/api/user');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Data user berhasil diambil',
                'data' => [
                    'id' => $user->id,
                    'name' => 'Refky Satria',
                    'username' => 'refky',
                    'email' => 'refky@eduverse.com',
                ],
            ]);
    }

    public function test_unauthenticated_user_cannot_access_profile(): void
    {
        $response = $this->getJson('/api/user');

        $response->assertStatus(401)
            ->assertJson([
                'success' => false,
                'message' => 'Unauthenticated. Token tidak valid atau Anda belum login.',
            ]);
    }

    public function test_authenticated_user_can_logout(): void
    {
        $user = User::factory()->create();
        $token = $user->createToken('auth_token')->plainTextToken;

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->postJson('/api/logout');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Logout berhasil',
            ]);

        $this->assertCount(0, $user->tokens);
    }
}
