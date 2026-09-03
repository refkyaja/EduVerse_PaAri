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

    /**
     * 17. Test Isolasi Data Antar Akun & Konsistensi Nama Pembuat (Owner).
     */
    public function test_class_data_isolation_and_owner_consistency(): void
    {
        $userA = User::factory()->create(['name' => 'User A Original Owner']);
        $userB = User::factory()->create(['name' => 'User B New Account']);

        // 1. User A membuat kelas
        $classResponse = $this->actingAs($userA, 'sanctum')->postJson('/api/classes', [
            'name' => 'Kelas Rahasia User A',
            'category' => 'Sains',
        ]);
        $classResponse->assertStatus(201);
        $classCode = $classResponse->json('data.code');

        // 2. User B login (belum gabung kelas) -> Pastikan tidak melihat kelas User A
        $userBClassesResponse = $this->actingAs($userB, 'sanctum')->getJson('/api/classes');
        $userBClassesResponse->assertStatus(200)
            ->assertJsonCount(0, 'data');

        // 3. User B gabung ke kelas User A menggunakan kode
        $joinResponse = $this->actingAs($userB, 'sanctum')->postJson('/api/classes/join', [
            'code' => $classCode,
        ]);
        $joinResponse->assertStatus(200);

        // 4. User B getJson /api/classes -> Harus melihat 1 kelas, dan owner.name harus 'User A Original Owner' (TIDAK BERUBAH KE USER B)
        $userBClassesAfterJoin = $this->actingAs($userB, 'sanctum')->getJson('/api/classes');
        $userBClassesAfterJoin->assertStatus(200)
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.owner.name', 'User A Original Owner')
            ->assertJsonPath('data.0.role', 'member');
    }

    /**
     * 18. Test Non-Anggota Tidak Bisa Mengakses Materi, Kuis, Log Aktivitas, & Leaderboard Kelas.
     */
    public function test_non_member_cannot_access_class_sub_resources(): void
    {
        $owner = User::factory()->create(['name' => 'Owner Class']);
        $outsider = User::factory()->create(['name' => 'Outsider User']);

        $class = ClassModel::create([
            'owner_id' => $owner->id,
            'name' => 'Kelas Fisika Lanjutan',
            'category' => 'Sains',
            'code' => 'FSK999',
        ]);

        ClassMember::create([
            'class_id' => $class->id,
            'user_id' => $owner->id,
            'role' => 'owner',
        ]);

        // Outsider attempts to access class sub-resources
        $this->actingAs($outsider, 'sanctum')->getJson("/api/classes/{$class->id}/materi")->assertStatus(403);
        $this->actingAs($outsider, 'sanctum')->getJson("/api/classes/{$class->id}/kuis")->assertStatus(403);
        $this->actingAs($outsider, 'sanctum')->getJson("/api/classes/{$class->id}/soal")->assertStatus(403);
        $this->actingAs($outsider, 'sanctum')->getJson("/api/classes/{$class->id}/members")->assertStatus(403);
        $this->actingAs($outsider, 'sanctum')->getJson("/api/classes/{$class->id}/log-aktivitas")->assertStatus(403);
        $this->actingAs($outsider, 'sanctum')->getJson("/api/classes/{$class->id}/leaderboard")->assertStatus(403);
    }

    /**
     * 19. Test Konsistensi Nama Pembuat Materi & Kuis Saat Diakses Anggota Lain.
     */
    public function test_creator_names_remain_consistent_across_members(): void
    {
        $owner = User::factory()->create(['name' => 'Pak Guru Fisika']);
        $member = User::factory()->create(['name' => 'Siswa Belajar']);

        $class = ClassModel::create([
            'owner_id' => $owner->id,
            'name' => 'Kelas Kuis & Materi',
            'category' => 'Sains',
            'code' => 'MAT999',
        ]);

        ClassMember::create(['class_id' => $class->id, 'user_id' => $owner->id, 'role' => 'owner']);
        ClassMember::create(['class_id' => $class->id, 'user_id' => $member->id, 'role' => 'member']);

        // Owner creates Materi and Kuis
        $materiRes = $this->actingAs($owner, 'sanctum')->postJson("/api/classes/{$class->id}/materi", [
            'judul' => 'Hukum Newton I',
            'isi' => 'Isi materi fisika...',
        ]);
        $materiRes->assertStatus(201);

        $kuisRes = $this->actingAs($owner, 'sanctum')->postJson("/api/classes/{$class->id}/kuis", [
            'judul' => 'Kuis Fisika Dasar',
            'batas_waktu' => 15,
        ]);
        $kuisRes->assertStatus(201);

        // Member accesses Materi & Kuis lists -> Creator name MUST be 'Pak Guru Fisika' (not Siswa Belajar)
        $materiListRes = $this->actingAs($member, 'sanctum')->getJson("/api/classes/{$class->id}/materi");
        $materiListRes->assertStatus(200)
            ->assertJsonPath('data.0.creator.name', 'Pak Guru Fisika');

        $kuisListRes = $this->actingAs($member, 'sanctum')->getJson("/api/classes/{$class->id}/kuis");
        $kuisListRes->assertStatus(200)
            ->assertJsonPath('data.0.creator.name', 'Pak Guru Fisika');
    }

    /**
     * 20. Test Konsistensi Nama Reviewer & Pelaku Audit Log.
     */
    public function test_reviewer_and_audit_log_actor_consistency(): void
    {
        $owner = User::factory()->create(['name' => 'Bapak Kepala Sekolah']);
        $admin = User::factory()->create(['name' => 'Ibu Guru Kimia']);
        $student = User::factory()->create(['name' => 'Siswa Pintar']);

        $class = ClassModel::create([
            'owner_id' => $owner->id,
            'name' => 'Kelas Kimia Lengkap',
            'category' => 'Sains',
            'code' => 'KIM999',
        ]);

        ClassMember::create(['class_id' => $class->id, 'user_id' => $owner->id, 'role' => 'owner']);
        ClassMember::create(['class_id' => $class->id, 'user_id' => $admin->id, 'role' => 'admin']);
        ClassMember::create(['class_id' => $class->id, 'user_id' => $student->id, 'role' => 'member']);

        // Admin submits material for review (status: menunggu_verifikasi)
        $materiRes = $this->actingAs($admin, 'sanctum')->postJson("/api/classes/{$class->id}/materi", [
            'judul' => 'Ikatan Kimia',
            'isi' => 'Konten ikatan kovalen...',
        ]);
        $materiRes->assertStatus(201);
        $materiId = $materiRes->json('data.id');
        $versiId = $materiRes->json('data.versi_aktif.id');

        // Owner approves version
        $verifyRes = $this->actingAs($owner, 'sanctum')->postJson("/api/classes/{$class->id}/materi-versi/{$versiId}/verify", [
            'status' => 'terverifikasi',
            'catatan_review' => 'Bagus sekali!',
        ]);
        $verifyRes->assertStatus(200);

        // Student views materi detail -> creator MUST be Ibu Guru Kimia
        $detailRes = $this->actingAs($student, 'sanctum')->getJson("/api/classes/{$class->id}/materi/{$materiId}");
        $detailRes->assertStatus(200)
            ->assertJsonPath('data.creator.name', 'Ibu Guru Kimia');

        // Student views audit logs -> actor names MUST match actual actors (Ibu Guru Kimia, Bapak Kepala Sekolah)
        $logsRes = $this->actingAs($student, 'sanctum')->getJson("/api/classes/{$class->id}/log-aktivitas");
        $logsRes->assertStatus(200);
        
        $userNamesInLogs = collect($logsRes->json('data'))->pluck('user.name')->all();
        $this->assertContains('Ibu Guru Kimia', $userNamesInLogs);
        $this->assertContains('Bapak Kepala Sekolah', $userNamesInLogs);
        $this->assertNotContains('Siswa Pintar', $userNamesInLogs);
    }
}
