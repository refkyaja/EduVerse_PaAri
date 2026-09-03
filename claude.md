# EduVerse

Platform belajar berbasis kelas — pengguna bisa bikin kelas sendiri, mengundang orang lain lewat kode kelas, menambahkan materi, membuat soal dan kuis, lalu belajar bersama. Tidak berfokus pada sekolah atau guru tertentu; pengelolaan isi kelas jadi tanggung jawab pengguna di dalam kelas itu sendiri. Dibangun dengan arsitektur terpisah: React (frontend) mengonsumsi REST API dari Laravel (backend), autentikasi pakai Laravel Sanctum, database MySQL.

## ATURAN PENULISAN KODE (WAJIB DIPATUHI)

### Gaya Kode

1. Hindari komentar di dalam kode. Tidak ada `//`, tidak ada `/* */`, tidak ada JSDoc, buat hal yang udah jelas dari nama variabel/fungsinya sendiri.
2. Kode harus sederhana. Tidak boleh ada abstraksi berlebihan, design pattern, class helper, atau package tambahan yang gak perlu.
3. Hindari sintaks yang terlihat aneh atau canggih: destructuring bertingkat, optional chaining bertumpuk, ternary bersarang, arrow function di dalam arrow function, reduce, IIFE, regex rumit. Pakai `if`, `for`, dan `function` biasa.
4. Yang penting jalan dan tidak error. Utamakan kode yang lurus dan mudah dibaca daripada kode yang pintar.
5. Nama variabel boleh campur Indonesia/Inggris, konsisten sama istilah di README (`kelas`, `materi`, `soal`, `kuis`, `xp`, `anggota`).
6. Pesan error untuk pengguna ditulis dalam Bahasa Indonesia.
7. Response API pakai format JSON konsisten, contoh: `{ "success": true, "data": ..., "message": "..." }`.
8. React tidak boleh akses database langsung — semua data lewat Laravel API. Validasi dan pengecekan permission wajib di backend, jangan percaya role/permission yang dikirim dari frontend.

### Aturan Migration

9. Dilarang membuat migration baru hanya untuk menambah kolom ke tabel yang sudah ada. Kalau perlu menambah/mengubah kolom di tabel yang sudah ada, langsung edit file migration yang sudah ada, jangan buat file migration baru.

Aturan-aturan ini berlaku untuk semua perubahan berikutnya, tanpa perlu diingatkan lagi. Selain itu, jangan redesign halaman utama atau halaman kelas tanpa instruksi eksplisit (desain lama di `Eduverse-Reference/` sudah dianggap final), jangan hapus fitur lama tanpa alasan, dan jangan bikin role baru selain Owner, Admin, Member.

10. **Jangan pernah render `currentUser`/`user` yang lagi login buat nampilin "siapa yang melakukan X"** (pembuat, pemilik, reviewer, pelaku log, dsb). Data itu SELALU harus dari relasi API (`kelas.owner`, `materi.creator`, `materi_versi.reviewer`, `log.user`, dst), gak peduli siapa yang lagi liat halamannya. Ini pernah jadi bug kritis kebocoran data (nama pembuat kelas ikut ganti sesuai user yang login) — jangan sampe polanya balik lagi di fitur baru.
11. **Semua endpoint sub-resource kelas** (materi, soal, kuis, anggota, leaderboard, audit log, dst) **wajib verifikasi keanggotaan** (`$class->hasUser($user)` atau lewat Gate/Policy) sebelum ngebalikin data — non-anggota harus dapet 403. Kalau bikin controller/endpoint baru buat kelas, contek pola ini dari controller yang udah ada, jangan mulai dari nol tanpa proteksi ini.
12. Data user (kelas yang diikuti, materi, progress, dsb) gak boleh nyangkut di `localStorage`/state global lintas sesi login. Pastikan logout selalu ngebersihin SEMUA key per-user, dan state awal aplikasi kosong sebelum data asli dari API di-fetch.

## Tech Stack

- **Backend**: Laravel, REST API
- **Auth**: Laravel Sanctum
- **Frontend**: React, JavaScript, HTML, CSS
- **Database**: MySQL

## Struktur Project

```
EduVerse_PaAri/
├── Eduverse-Backend/
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/
│   │   │   │   └── Api/
│   │   │   │       ├── AuthController.php
│   │   │   │       ├── KelasController.php
│   │   │   │       ├── AnggotaController.php
│   │   │   │       ├── MateriController.php
│   │   │   │       ├── SoalController.php
│   │   │   │       ├── KuisController.php
│   │   │   │       └── LeaderboardController.php
│   │   │   └── Middleware/
│   │   │       └── CekPeranKelas.php
│   │   └── Models/
│   │       ├── User.php
│   │       ├── Kelas.php
│   │       ├── AnggotaKelas.php
│   │       ├── Materi.php
│   │       ├── MateriVersi.php
│   │       ├── Soal.php
│   │       ├── OpsiSoal.php
│   │       ├── Kuis.php
│   │       ├── KuisSoal.php
│   │       ├── PercobaanKuis.php
│   │       └── JawabanPercobaan.php
│   ├── database/
│   │   └── migrations/
│   └── routes/
│       └── api.php
├── Eduverse-Frontend/
│   └── src/
│       ├── routes/
│       │   └── AppRoutes.jsx       daftar route react-router-dom
│       ├── layouts/
│       │   └── MobileLayout.jsx
│       ├── pages/
│       │   ├── LoginPage.jsx
│       │   ├── RegisterPage.jsx
│       │   ├── AboutPage.jsx        halaman publik "Tentang"
│       │   ├── MainPage.jsx         daftar kelas, buat/gabung kelas
│       │   ├── HomePage.jsx         beranda kelas (/class/:classId)
│       │   ├── MateriPage.jsx
│       │   ├── QuizPickerPage.jsx   daftar kuis
│       │   ├── QuizPlayPage.jsx     kerjain kuis
│       │   ├── LeaderboardPage.jsx
│       │   ├── ClassAnggotaPage.jsx
│       │   ├── ProfilePage.jsx      hub tab: profile/settings/add_subject/add_material/add_quiz/verification/members/audit_log
│       │   └── AccountSettingsPage.jsx  pengaturan akun (global, bukan per kelas)
│       ├── components/
│       ├── context/
│       │   └── AppStateContext.jsx
│       └── services/
│           └── authService.js
├── Eduverse-Reference/        desain lama, acuan visual — jangan diubah/dihapus
└── README.md
```

## Role dan Permission

Role berlaku **per-kelas**, disimpan di kolom `role` tabel `anggota_kelas` — satu akun bisa jadi Owner di kelas buatan sendiri, tapi cuma Member di kelas orang lain.

| Peran | Siapa | Bisa |
|---|---|---|
| Owner | Pembuat kelas (otomatis) | Ubah info kelas, atur Admin, kelola anggota, buat materi (langsung terverifikasi), buat soal & kuis, verifikasi materi buatan Admin, generate ulang kode kelas, transfer kepemilikan, hapus kelas |
| Admin | Ditambahkan Owner | Buat/edit materi (masuk `menunggu_verifikasi`), buat soal, buat kuis, buat pengumuman, kelola konten sesuai permission |
| Member | Join pakai kode kelas | Lihat materi & riwayat versinya, kerjain & ulangi kuis, lihat hasil pengerjaan, lihat leaderboard, lihat anggota kelas |

Tidak ada role tambahan (Moderator, Kontributor, Super Admin, dsb).

## Routes (routes/api.php)

> **Belum diverifikasi dari kode asli** — backend belum dikirim. Ini asumsi
> berdasarkan struktur data, cocokin ke `routes/api.php` yang sebenarnya begitu
> ada, jangan langsung dipakai buat implementasi tanpa dicek dulu.

```
POST /api/register                                    → daftar akun
POST /api/login                                        → login
POST /api/logout                                       → logout
GET  /api/user                                         → profil sendiri
PUT  /api/user                                          → edit profil

GET  /api/kelas                                        → daftar kelas yang diikuti user
POST /api/kelas                                        → buat kelas baru, pembuat jadi Owner
POST /api/kelas/gabung                                 → join kelas pakai kode
GET  /api/kelas/{kelas}                                → beranda kelas
PUT  /api/kelas/{kelas}                                → update info kelas (Owner)
DELETE /api/kelas/{kelas}                              → hapus kelas (Owner)
POST /api/kelas/{kelas}/regenerate-kode                → buat ulang kode kelas (Owner)
POST /api/kelas/{kelas}/transfer-owner                 → transfer kepemilikan (Owner)

GET  /api/kelas/{kelas}/anggota                        → daftar anggota
PUT  /api/kelas/{kelas}/anggota/{user}                 → ubah role anggota (Owner)
DELETE /api/kelas/{kelas}/anggota/{user}                → keluarkan anggota (Owner)

GET  /api/kelas/{kelas}/materi                          → daftar materi
POST /api/kelas/{kelas}/materi                          → buat materi (Admin & Owner)
GET  /api/kelas/{kelas}/materi/{materi}                 → detail + versi aktif
PUT  /api/kelas/{kelas}/materi/{materi}                 → edit, bikin versi baru
GET  /api/kelas/{kelas}/materi/{materi}/versi           → riwayat versi
GET  /api/kelas/{kelas}/materi-verifikasi                → daftar menunggu verifikasi (Owner)
POST /api/kelas/{kelas}/materi-versi/{versi}/setuju      → approve versi (Owner)
POST /api/kelas/{kelas}/materi-versi/{versi}/tolak       → tolak versi, catatan wajib (Owner)

GET  /api/kelas/{kelas}/soal                             → bank soal
POST /api/kelas/{kelas}/soal                             → buat soal manual satu-satu (Admin & Owner)
POST /api/kelas/{kelas}/soal/parse-teks                   → parse teks hasil AI jadi preview soal, belum disimpan (Admin & Owner)
POST /api/kelas/{kelas}/soal/impor                        → simpan banyak soal sekaligus dari hasil preview parse-teks
PUT  /api/kelas/{kelas}/soal/{soal}                      → edit soal
DELETE /api/kelas/{kelas}/soal/{soal}                    → hapus soal

GET  /api/kelas/{kelas}/kuis                             → daftar kuis
POST /api/kelas/{kelas}/kuis                             → buat kuis dari bank soal (Admin & Owner)
GET  /api/kelas/{kelas}/kuis/{kuis}                      → detail kuis
PUT  /api/kelas/{kelas}/kuis/{kuis}                      → edit kuis
POST /api/kelas/{kelas}/kuis/{kuis}/mulai                → mulai percobaan baru
POST /api/kelas/{kelas}/kuis/{kuis}/percobaan/{percobaan}/submit → submit jawaban, hitung skor & XP
GET  /api/kelas/{kelas}/kuis/{kuis}/riwayat              → riwayat percobaan user

GET  /api/kelas/{kelas}/leaderboard                      → leaderboard kelas berdasar XP
```

## Routes Frontend (react-router-dom, di AppRoutes.jsx)

```
/about, /login, /register                    → publik, gak butuh login

/                                              → MainPage (daftar kelas, buat/gabung kelas)
/class/:classId                                → HomePage (beranda kelas)
/class/:classId/materi                         → MateriPage
/class/:classId/kuis                           → QuizPickerPage
/quiz/play                                     → QuizPlayPage
/class/:classId/leaderboard                    → LeaderboardPage
/class/:classId/anggota                        → ClassAnggotaPage

/class/:classId/profile                        → ProfilePage (tab profil, default)
/class/:classId/edit-info                      → ProfilePage tab=settings
/class/:classId/add-subject                    → ProfilePage tab=add_subject
/class/:classId/add-material                   → ProfilePage tab=add_material
/class/:classId/add-quiz                       → ProfilePage tab=add_quiz
/class/:classId/verification                   → ProfilePage tab=verification
/class/:classId/members                        → ProfilePage tab=members
/class/:classId/audit-log                      → ProfilePage tab=audit_log

/settings                                      → AccountSettingsPage (pengaturan akun, global bukan per kelas)
```

`classId` di URL berupa string slug format `cls-<timestamp>`, bukan integer biasa — cek kolom `id`/`slug` di tabel `kelas` backend beneran pakai format ini atau ada kolom terpisah buat slug URL.

## Halaman Frontend (React)

### LoginPage.jsx / RegisterPage.jsx
- Form login dan register terpisah, data akun dasar: nama, username, email, password, foto profil, bio

### AboutPage.jsx
- Halaman publik "Tentang" — jelasin fungsi EduVerse, gak butuh login

### MainPage.jsx
- Daftar kelas yang diikuti, tombol Gabung Kelas & Buat Kelas, profil, pengaturan akun
- Desain halaman ini sudah dianggap baik — fokus pengembangan cuma bikin responsif, jangan redesign

### HomePage.jsx — Beranda Kelas
- Pengumuman, aktivitas terbaru, materi baru, kuis baru, info kelas
- Navigasi Member/Admin: Beranda | Materi | Kuis | Leaderboard | Anggota
- Navigasi Owner: tambah menu ke ProfilePage (Pengaturan)

### MateriPage.jsx
- Daftar materi, detail materi dengan dropdown/kontrol versi (menampilkan nomor versi, waktu perubahan, pengguna yang mengubah, status)
- **Materi dikelompokkan per Mata Pelajaran** — ada route khusus `add-subject` buat nambah mata pelajaran, jadi ini fitur asli, bukan sisa dummy dari Eduverse-Reference. Perlu dicek apakah tabel `mata_pelajaran`/`subjects` udah ada di backend; kalau belum, ini yang perlu dibikin duluan sebelum form add-subject bisa jalan beneran.

### QuizPickerPage.jsx & QuizPlayPage.jsx
- Daftar kuis (status aktif), halaman kerjain kuis (timer opsional, acak soal/opsi kalau diaktifkan)
- Kuis bisa diulang; tiap percobaan disimpan biar riwayat pengerjaan tetap ada
- Form tambah kuis ada di ProfilePage tab `add_quiz`, dengan 2 mode input:
  - **Manual**: form satu-satu (pertanyaan, jenis soal, opsi jawaban, jawaban benar, pembahasan)
  - **Tempel Teks**: textarea buat paste hasil generate AI (Claude/ChatGPT/dst), tombol "Parse"
    manggil endpoint parse-teks (nama endpoint pasti nyusul dicek dari backend) buat dapetin
    preview soal yang bisa diedit sebelum disimpan. Format teks: nomor+titik+pertanyaan, opsi
    A/B/C/D per baris, baris "Jawaban: [huruf]", opsional baris "Pembahasan: ...". Soal yang
    gagal ke-parse ditandain di preview, bukan didiemin/dibuang.
  - Form kuis TIDAK punya field jadwal/hari — kuis dibuat kapan aja, gak terikat jadwal
    mata pelajaran (EduVerse gak fokus ke sekolah, lihat README bagian Tujuan). Field
    "Jadwal Hari" yang sempet muncul di form add_quiz itu bug, harus dihapus.

### LeaderboardPage.jsx
- Peringkat anggota kelas berdasarkan XP, bukan skor mentah

### ClassAnggotaPage.jsx
- Daftar seluruh anggota kelas: foto profil, nama, username

### ProfilePage.jsx (hub tab, khusus konten Owner banyak diaktifin di sini)
- Tab `settings`: informasi kelas (nama, deskripsi), kode kelas (lihat, buat ulang) — ganti nama kelas TIDAK BOLEH ikut ubah kode kelas
- Tab `mapel` (dulu "Tambah Mapel Baru"): list/tabel daftar mapel kelas ini + tombol Buat di kanan atas
- Tab `materi` (dulu "Tambah Materi"): list/tabel daftar materi kelas ini + tombol Buat di kanan atas
- Tab `add_quiz`: form tambah kuis (lihat detail di atas)
- Tab `verification`: daftar materi menunggu verifikasi, approve/reject, dengan tampilan 2 kolom (versi lama vs versi baru) buat dibandingin
- Tab `members`: khusus Owner, kelola role Admin/Member & keluarkan anggota
- Tab `audit_log`: riwayat perubahan/log aktivitas kelas

### Menu Anggota (baru, semua role — Owner/Admin/Member)
- Terpisah dari tab `members` yang di atas — ini cuma nampilin daftar anggota kelas (read-only: foto, nama, username, role), gak ada tombol kelola. Ditaro di menu navigasi di bawah "Ringkasan & Statistik", di luar grup "Manajemen Owner", karena semua role boleh akses.

### AccountSettingsPage.jsx
- Pengaturan akun user secara global (bukan per kelas): edit profil, foto, bio, dst

## Database

> **Belum diverifikasi dari migration asli.** Tabel di bawah termasuk 2 tambahan
> baru yang ketauan dari routing frontend (`mata_pelajaran` dan `audit_log`) —
> cek dulu apa udah ada migration-nya sebelum bikin baru.

### Tabel mata_pelajaran (baru diketahui, cek dulu sebelum bikin migration baru)
- `id`, `kelas_id` (FK kelas), `nama`, `timestamps` — dipakai buat ngelompokin materi (route `/class/:classId/add-subject`)

### Tabel audit_log (baru diketahui, cek dulu sebelum bikin migration baru)
- `id`, `kelas_id` (FK kelas), `user_id` (FK users, yang ngelakuin aksi), `aksi` (deskripsi singkat perubahan), `timestamps` — ditampilin di tab `audit_log` ProfilePage

### Tabel users
- `id`, `name`, `username`, `email`, `password`, `foto_profil`, `bio`, `timestamps`

### Tabel kelas
- `id`, `nama`, `deskripsi`, `kode_kelas` (unique), `owner_id` (FK users), `timestamps`

### Tabel anggota_kelas
- `id`, `kelas_id`, `user_id`, `role` (enum: owner, admin, member), `timestamps`

### Tabel materi
- `id`, `kelas_id`, `judul`, `versi_aktif_id` (nullable, FK ke materi_versi tanpa constraint biar gak circular), `dibuat_oleh` (FK users), `timestamps`

### Tabel materi_versi
- `id`, `materi_id`, `nomor_versi`, `isi`, `file` (nullable), `status` (enum: draft, menunggu_verifikasi, terverifikasi, perlu_perbaikan, ditolak), `dibuat_oleh`, `ditinjau_oleh` (nullable), `ditinjau_pada` (nullable), `catatan_review` (nullable), `timestamps`

### Tabel soal
- `id`, `kelas_id`, `pertanyaan`, `jenis_soal` (enum: pilihan_ganda, benar_salah), `pembahasan` (nullable), `tingkat_kesulitan` (nullable), `materi_id` (nullable, FK materi), `dibuat_oleh`, `timestamps`

### Tabel opsi_soal
- `id`, `soal_id`, `teks_opsi`, `benar` (boolean), `urutan`

### Tabel kuis
- `id`, `kelas_id`, `judul`, `deskripsi`, `batas_waktu` (nullable), `jumlah_soal`, `acak_soal` (boolean), `acak_opsi` (boolean), `status_aktif` (boolean), `dibuat_oleh`, `timestamps`

### Tabel kuis_soal
- `id`, `kuis_id`, `soal_id` (pivot, soal dari bank bisa dipakai lintas kuis), `urutan`

### Tabel percobaan_kuis
- `id`, `kuis_id`, `user_id`, `percobaan_ke`, `skor`, `xp_didapat`, `mulai_pada`, `selesai_pada`, `timestamps`

### Tabel jawaban_percobaan
- `id`, `percobaan_id`, `soal_id`, `opsi_dipilih_id`, `benar`, `timestamps`

## Catatan Penting

- **Backend belum diverifikasi langsung dari kode.** Semua yang ada di section Routes dan Database di file ini disusun dari README + hasil analisa routing frontend (`AppRoutes.jsx`), bukan dari `routes/api.php` atau migration asli. Kalau nemu bedanya pas kerja, kode asli yang bener, bukan file ini — dan tolong laporkan biar file ini diupdate lagi.
- Mata Pelajaran itu fitur asli (ada route `add-subject` khusus), bukan sisa dummy — perlu tabel `mata_pelajaran` dan materi perlu kolom relasi ke situ kalau belum ada.

- Kode kelas: kalau di-regenerate, kode lama otomatis gak berlaku lagi karena udah gak match ke row manapun — gak perlu tabel riwayat kode terpisah.
- Materi punya riwayat versi lengkap (nomor versi, waktu, pengubah, status, catatan) — versi lama tidak dihapus.
- Soal disimpan sebagai bank yang reusable, dipakai lintas kuis lewat tabel pivot `kuis_soal`.
- XP: percobaan pertama dapat XP penuh, percobaan kedua dapat XP lebih sedikit, percobaan ketiga dst tidak dapat XP tambahan — detail angka disesuaikan saat implementasi.
- Leaderboard dihitung dari XP (bukan skor mentah), on-the-fly dari agregat `percobaan_kuis`, per kelas.
- Middleware `CekPeranKelas` cek kolom `role` di `anggota_kelas`, gak perlu package role eksternal karena scoping-nya per-kelas.
- Kalau backend dan frontend jalan di domain/port beda, pastikan `SANCTUM_STATEFUL_DOMAINS` dan CORS di Laravel udah bener, dan request dari React pakai `withCredentials: true`.

## Rencana Pengembangan

1. Frontend: migrasi UI lama ke React, pertahankan desain, bikin responsif, routing & struktur komponen
2. Backend: setup Laravel, database, migration, model, API, authentication
3. Authentication: register, login, logout, session/token, profile
4. Sistem Kelas: buat kelas, lihat kelas, gabung pakai kode, regenerate kode, role Owner/Admin/Member
5. Materi: buat, edit, verifikasi Owner, status materi, version history
6. Soal: bank soal, buat/edit/hapus, topik, pembahasan
7. Kuis: buat kuis, ambil soal dari bank, kerjain, timer, submit, penilaian, riwayat & pengulangan
8. XP dan Leaderboard: sistem XP, perhitungan, leaderboard per kelas
9. Pengaturan Owner: info kelas, kelola Admin/anggota, regenerate kode, transfer Owner, hapus kelas