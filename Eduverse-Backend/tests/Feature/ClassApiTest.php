<?php

namespace Tests\Feature;

use App\Models\ClassMember;
use App\Models\ClassModel;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ClassApiTest extends TestCase
{
    use RefreshDatabase;

    /**
     * 1. User dapat membuat kelas.
     */
    public function test_user_can_create_class(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user, 'sanctum')->postJson('/api/classes', [
            'name' => 'XI RPL 1',
            'description' => 'Kelas Pemrograman Web',
            'category' => 'Pemrograman',
            'visibility' => 'public',
        ]);

        $response->assertStatus(201)
            ->assertJson([
                'status' => 'success',
                'message' => 'Kelas berhasil dibuat',
                'data' => [
                    'name' => 'XI RPL 1',
                    'category' => 'Pemrograman',
                    'role' => 'owner',
                ],
            ]);

        $this->assertDatabaseHas('classes', [
            'name' => 'XI RPL 1',
            'owner_id' => $user->id,
        ]);
    }

    /**
     * 2. Pembuat kelas otomatis menjadi Owner.
     */
    public function test_class_creator_automatically_becomes_owner(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user, 'sanctum')->postJson('/api/classes', [
            'name' => 'Pemrograman Web',
            'category' => 'Coding',
        ]);

        $classId = $response->json('data.id');

        $this->assertDatabaseHas('class_members', [
            'class_id' => $classId,
            'user_id' => $user->id,
            'role' => 'owner',
        ]);
    }

    /**
     * 3. User dapat melihat kelasnya.
     */
    public function test_user_can_view_their_classes(): void
    {
        $user = User::factory()->create();

        $class = ClassModel::create([
            'owner_id' => $user->id,
            'name' => 'Kelas Saya',
            'category' => 'Umum',
            'code' => 'KODE01',
        ]);

        ClassMember::create([
            'class_id' => $class->id,
            'user_id' => $user->id,
            'role' => 'owner',
        ]);

        $response = $this->actingAs($user, 'sanctum')->getJson('/api/classes');

        $response->assertStatus(200)
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.id', $class->id);
    }

    /**
     * 4. User dapat bergabung menggunakan kode.
     */
    public function test_user_can_join_class_using_code(): void
    {
        $owner = User::factory()->create();
        $member = User::factory()->create();

        $class = ClassModel::create([
            'owner_id' => $owner->id,
            'name' => 'Kelas Fisika',
            'category' => 'Sains',
            'code' => 'FSK123',
        ]);

        $response = $this->actingAs($member, 'sanctum')->postJson('/api/classes/join', [
            'code' => 'FSK123',
        ]);

        $response->assertStatus(200)
            ->assertJsonPath('data.role', 'member');

        $this->assertDatabaseHas('class_members', [
            'class_id' => $class->id,
            'user_id' => $member->id,
            'role' => 'member',
        ]);
    }

    /**
     * 5. User tidak dapat bergabung dua kali.
     */
    public function test_user_cannot_join_same_class_twice(): void
    {
        $owner = User::factory()->create();
        $member = User::factory()->create();

        $class = ClassModel::create([
            'owner_id' => $owner->id,
            'name' => 'Kelas Kimia',
            'category' => 'Sains',
            'code' => 'KIM123',
        ]);

        ClassMember::create([
            'class_id' => $class->id,
            'user_id' => $member->id,
            'role' => 'member',
        ]);

        $response = $this->actingAs($member, 'sanctum')->postJson('/api/classes/join', [
            'code' => 'KIM123',
        ]);

        $response->assertStatus(400)
            ->assertJson([
                'status' => 'error',
                'message' => 'Anda sudah terdaftar dalam kelas ini',
            ]);
    }

    /**
     * 6. User yang bukan anggota tidak dapat melihat detail kelas private.
     */
    public function test_non_member_cannot_view_private_class_detail(): void
    {
        $owner = User::factory()->create();
        $outsider = User::factory()->create();

        $class = ClassModel::create([
            'owner_id' => $owner->id,
            'name' => 'Kelas Private Rahasia',
            'category' => 'Rahasia',
            'visibility' => 'private',
            'code' => 'PRV123',
        ]);

        $response = $this->actingAs($outsider, 'sanctum')->getJson("/api/classes/{$class->id}");

        $response->assertStatus(403);
    }

    /**
     * 7. User dapat melihat kelas publik.
     */
    public function test_user_can_view_public_class_detail(): void
    {
        $owner = User::factory()->create();
        $anyone = User::factory()->create();

        $class = ClassModel::create([
            'owner_id' => $owner->id,
            'name' => 'Kelas Terbuka',
            'category' => 'Umum',
            'visibility' => 'public',
            'code' => 'PUB123',
        ]);

        $response = $this->actingAs($anyone, 'sanctum')->getJson("/api/classes/{$class->id}");

        $response->assertStatus(200)
            ->assertJsonPath('data.name', 'Kelas Terbuka');
    }

    /**
     * 8. Owner dapat promote Member menjadi Admin.
     */
    public function test_owner_can_promote_member_to_admin(): void
    {
        $owner = User::factory()->create();
        $member = User::factory()->create();

        $class = ClassModel::create([
            'owner_id' => $owner->id,
            'name' => 'Kelas Tim',
            'category' => 'Manajemen',
            'code' => 'TIM123',
        ]);

        ClassMember::create([
            'class_id' => $class->id,
            'user_id' => $member->id,
            'role' => 'member',
        ]);

        $response = $this->actingAs($owner, 'sanctum')
            ->postJson("/api/classes/{$class->id}/members/{$member->id}/promote");

        $response->assertStatus(200)
            ->assertJsonPath('data.role', 'admin');

        $this->assertDatabaseHas('class_members', [
            'class_id' => $class->id,
            'user_id' => $member->id,
            'role' => 'admin',
        ]);
    }

    /**
     * 9. Owner dapat demote Admin menjadi Member.
     */
    public function test_owner_can_demote_admin_to_member(): void
    {
        $owner = User::factory()->create();
        $adminUser = User::factory()->create();

        $class = ClassModel::create([
            'owner_id' => $owner->id,
            'name' => 'Kelas Modul',
            'category' => 'Modul',
            'code' => 'MDL123',
        ]);

        ClassMember::create([
            'class_id' => $class->id,
            'user_id' => $adminUser->id,
            'role' => 'admin',
        ]);

        $response = $this->actingAs($owner, 'sanctum')
            ->postJson("/api/classes/{$class->id}/members/{$adminUser->id}/demote");

        $response->assertStatus(200)
            ->assertJsonPath('data.role', 'member');

        $this->assertDatabaseHas('class_members', [
            'class_id' => $class->id,
            'user_id' => $adminUser->id,
            'role' => 'member',
        ]);
    }

    /**
     * 10. Member tidak dapat mengubah role.
     */
    public function test_member_cannot_change_roles(): void
    {
        $owner = User::factory()->create();
        $memberA = User::factory()->create();
        $memberB = User::factory()->create();

        $class = ClassModel::create([
            'owner_id' => $owner->id,
            'name' => 'Kelas Studi',
            'category' => 'Studi',
            'code' => 'STD123',
        ]);

        ClassMember::create([
            'class_id' => $class->id,
            'user_id' => $memberA->id,
            'role' => 'member',
        ]);

        ClassMember::create([
            'class_id' => $class->id,
            'user_id' => $memberB->id,
            'role' => 'member',
        ]);

        $response = $this->actingAs($memberA, 'sanctum')
            ->postJson("/api/classes/{$class->id}/members/{$memberB->id}/promote");

        $response->assertStatus(403);
    }

    /**
     * 11. Admin tidak dapat mengubah Owner.
     */
    public function test_admin_cannot_change_owner(): void
    {
        $owner = User::factory()->create();
        $adminUser = User::factory()->create();

        $class = ClassModel::create([
            'owner_id' => $owner->id,
            'name' => 'Kelas Admin Control',
            'category' => 'Studi',
            'code' => 'ADM123',
        ]);

        ClassMember::create([
            'class_id' => $class->id,
            'user_id' => $adminUser->id,
            'role' => 'admin',
        ]);

        $response = $this->actingAs($adminUser, 'sanctum')
            ->postJson("/api/classes/{$class->id}/members/{$owner->id}/demote");

        $response->assertStatus(403);
    }

    /**
     * 12. Owner dapat regenerate code.
     */
    public function test_owner_can_regenerate_class_code(): void
    {
        $owner = User::factory()->create();

        $class = ClassModel::create([
            'owner_id' => $owner->id,
            'name' => 'Kelas Regenerate',
            'category' => 'Tes',
            'code' => 'OLD123',
        ]);

        $response = $this->actingAs($owner, 'sanctum')
            ->postJson("/api/classes/{$class->id}/regenerate-code");

        $response->assertStatus(200);

        $newCode = $response->json('data.code');
        $this->assertNotEquals('OLD123', $newCode);

        $this->assertDatabaseHas('classes', [
            'id' => $class->id,
            'code' => $newCode,
        ]);
    }

    /**
     * 13. Owner dapat mengubah informasi kelas.
     */
    public function test_owner_can_update_class_info(): void
    {
        $owner = User::factory()->create();

        $class = ClassModel::create([
            'owner_id' => $owner->id,
            'name' => 'Nama Lama',
            'description' => 'Deskripsi Lama',
            'category' => 'Lama',
            'code' => 'UPD123',
        ]);

        $response = $this->actingAs($owner, 'sanctum')
            ->putJson("/api/classes/{$class->id}", [
                'name' => 'Nama Baru',
                'description' => 'Deskripsi Baru',
                'category' => 'Baru',
            ]);

        $response->assertStatus(200)
            ->assertJsonPath('data.name', 'Nama Baru');

        $this->assertDatabaseHas('classes', [
            'id' => $class->id,
            'name' => 'Nama Baru',
        ]);
    }

    /**
     * 14. Owner dapat menghapus kelas.
     */
    public function test_owner_can_delete_class(): void
    {
        $owner = User::factory()->create();

        $class = ClassModel::create([
            'owner_id' => $owner->id,
            'name' => 'Kelas Dihapus',
            'category' => 'Tes',
            'code' => 'DEL123',
        ]);

        $response = $this->actingAs($owner, 'sanctum')
            ->deleteJson("/api/classes/{$class->id}");

        $response->assertStatus(200);

        $this->assertDatabaseMissing('classes', [
            'id' => $class->id,
        ]);
    }

    /**
     * 15. Member dapat keluar dari kelas.
     */
    public function test_member_can_leave_class(): void
    {
        $owner = User::factory()->create();
        $member = User::factory()->create();

        $class = ClassModel::create([
            'owner_id' => $owner->id,
            'name' => 'Kelas Leaving',
            'category' => 'Tes',
            'code' => 'LEV123',
        ]);

        ClassMember::create([
            'class_id' => $class->id,
            'user_id' => $member->id,
            'role' => 'member',
        ]);

        $response = $this->actingAs($member, 'sanctum')
            ->postJson("/api/classes/{$class->id}/leave");

        $response->assertStatus(200);

        $this->assertDatabaseMissing('class_members', [
            'class_id' => $class->id,
            'user_id' => $member->id,
        ]);
    }

    /**
     * 16. Owner tidak dapat leave tanpa transfer ownership.
     */
    public function test_owner_cannot_leave_class_without_ownership_transfer(): void
    {
        $owner = User::factory()->create();

        $class = ClassModel::create([
            'owner_id' => $owner->id,
            'name' => 'Kelas Owner Leave',
            'category' => 'Tes',
            'code' => 'OWN123',
        ]);

        ClassMember::create([
            'class_id' => $class->id,
            'user_id' => $owner->id,
            'role' => 'owner',
        ]);

        $response = $this->actingAs($owner, 'sanctum')
            ->postJson("/api/classes/{$class->id}/leave");

        $response->assertStatus(400)
            ->assertJson([
                'status' => 'error',
                'message' => 'Owner tidak dapat keluar dari kelas tanpa transfer ownership',
            ]);
    }
}
