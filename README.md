# EduVerse

EduVerse adalah platform belajar berbasis kelas yang dibuat untuk
membantu orang belajar bersama dalam satu ruang digital.

EduVerse tidak berfokus pada sekolah atau guru tertentu. Pengguna dapat
membuat kelas sendiri, mengundang orang lain, menambahkan materi,
membuat soal dan kuis, serta belajar bersama.

Pengelolaan isi kelas menjadi tanggung jawab pengguna di dalam kelas
tersebut.

## Tujuan

EduVerse awalnya dibuat untuk membantu teman sekelas dalam belajar dan
menghadapi ujian. Versi pengembangan EduVerse dibuat agar sistem
tersebut dapat digunakan oleh siapa saja.

Konsep utama EduVerse adalah menyediakan sistemnya. Pengguna bebas
menentukan kelas tersebut digunakan untuk apa.

Contoh penggunaan:

-   Kelas sekolah
-   Kelompok belajar
-   Kelas pemrograman
-   Persiapan ujian
-   Belajar bahasa
-   Belajar mandiri bersama
-   Komunitas belajar

## Teknologi

Frontend: - React - JavaScript - HTML - CSS

Backend: - Laravel - PHP - REST API

Database: - MySQL

Authentication: - Laravel Sanctum

Struktur project:

``` text
EduVerse/
├── Eduverse-Frontend/
│   └── React application
│
├── Eduverse-Backend/
│   └── Laravel application
│
└── README.md
```

## Konsep Sistem

EduVerse menggunakan arsitektur frontend dan backend yang terpisah.

``` text
React Frontend
      ↓
   REST API
      ↓
Laravel Backend
      ↓
    MySQL
```

React bertanggung jawab terhadap tampilan dan interaksi pengguna.

Laravel bertanggung jawab terhadap autentikasi, logika aplikasi,
validasi, permission, dan komunikasi dengan database.

React tidak boleh mengakses database secara langsung.

## Autentikasi

Sebelum menggunakan EduVerse, pengguna harus memiliki akun.

Halaman autentikasi:

-   Login
-   Register

Setelah berhasil login, pengguna diarahkan ke halaman utama.

Data akun dasar:

-   Nama
-   Username
-   Email
-   Password
-   Foto profil
-   Bio

## Halaman Utama

Setelah login, pengguna masuk ke halaman utama EduVerse.

Halaman utama menampilkan:

-   Daftar kelas yang diikuti
-   Tombol Gabung Kelas
-   Tombol Buat Kelas
-   Profil
-   Pengaturan akun

Halaman utama yang sudah ada memiliki desain yang dianggap sudah baik
dan tidak boleh di-redesign tanpa instruksi khusus.

Fokus pengembangan frontend awal adalah membuat tampilan menjadi
responsif tanpa mengubah identitas desain yang sudah ada.

## Kelas

Pengguna dapat membuat kelas sendiri.

Saat membuat kelas, pengguna dapat menentukan:

-   Nama kelas
-   Deskripsi

Pengguna yang membuat kelas otomatis menjadi Owner.

## Kode Kelas

Setiap kelas memiliki kode untuk bergabung.

Contoh:

``` text
ABCD123
```

Owner dapat membuat ulang kode kelas.

Jika kode dibuat ulang, kode sebelumnya tidak dapat digunakan lagi.

## Role

EduVerse hanya menggunakan tiga role di dalam kelas:

### Owner

Owner adalah pengguna yang membuat kelas.

Owner dapat:

-   Mengubah informasi kelas
-   Mengatur kelas
-   Mengatur Admin
-   Mengelola anggota
-   Membuat materi
-   Membuat soal
-   Membuat kuis
-   Memverifikasi materi yang dibuat Admin
-   Membuat ulang kode kelas
-   Transfer kepemilikan kelas
-   Menghapus kelas

### Admin

Admin adalah pengguna yang dipercaya oleh Owner untuk membantu mengelola
kelas.

Admin dapat:

-   Membuat materi
-   Mengedit materi
-   Membuat soal
-   Membuat kuis
-   Membuat pengumuman
-   Mengelola konten kelas sesuai permission

Materi yang dibuat atau diubah oleh Admin harus diverifikasi oleh Owner.

### Member

Member adalah pengguna biasa di dalam kelas.

Member dapat:

-   Melihat materi
-   Melihat riwayat versi materi
-   Mengerjakan kuis
-   Mengulang kuis
-   Melihat hasil pengerjaan
-   Melihat leaderboard
-   Melihat anggota kelas

Tidak diperlukan role tambahan seperti Moderator, Kontributor, Super
Admin, atau role hierarki lainnya untuk sistem kelas.

## Halaman Kelas

Desain halaman kelas yang sudah ada tidak boleh diubah tanpa instruksi.

Navigasi untuk Member dan Admin:

``` text
Beranda | Materi | Kuis | Leaderboard | Anggota
```

Navigasi untuk Owner:

``` text
Beranda | Materi | Kuis | Leaderboard | Anggota | Pengaturan
```

Admin dan Member menggunakan halaman kelas yang sama.

Perbedaan antara role ditentukan berdasarkan permission.

Owner menggunakan halaman kelas yang sama dengan tambahan menu
Pengaturan.

Tidak perlu membuat dashboard Admin terpisah untuk saat ini.

## Beranda Kelas

Beranda kelas digunakan untuk menampilkan aktivitas dan informasi kelas.

Contoh konten:

-   Pengumuman
-   Aktivitas terbaru
-   Materi baru
-   Kuis baru
-   Informasi kelas

## Materi

Admin dan Owner dapat membuat materi.

Materi dapat berisi:

-   Judul
-   Isi materi
-   File
-   Informasi pendukung lainnya

Materi memiliki status verifikasi.

Status yang digunakan:

-   Draft
-   Menunggu Verifikasi
-   Terverifikasi
-   Perlu Perbaikan
-   Ditolak

### Verifikasi Materi

Jika Owner membuat materi:

``` text
Owner membuat materi
↓
Langsung Terverifikasi
```

Jika Admin membuat materi:

``` text
Admin membuat materi
↓
Menunggu Verifikasi
↓
Owner memeriksa
↓
Disetujui / Ditolak
```

Jika Admin mengubah materi yang sudah terverifikasi:

``` text
Materi Terverifikasi
↓
Admin melakukan perubahan
↓
Versi baru dibuat
↓
Menunggu Verifikasi
↓
Owner memeriksa
↓
Versi baru menjadi versi aktif jika disetujui
```

Owner tidak perlu memverifikasi materi yang dibuat sendiri.

## Versi Materi

Setiap perubahan pada materi yang sudah terverifikasi harus menghasilkan
versi baru.

Versi sebelumnya tidak boleh langsung dihapus.

Contoh:

``` text
Versi 1
5 Agustus 2026

Versi 2
6 Agustus 2026

Versi 3
7 Agustus 2026
```

Pada halaman materi, pengguna dapat membuka dropdown atau kontrol versi
untuk melihat materi sebelumnya.

Contoh:

``` text
Versi Materi
▼ Versi 3 · 7 Agustus 2026

Versi 2 · 6 Agustus 2026
Versi 1 · 5 Agustus 2026
```

Riwayat versi harus menyimpan informasi seperti:

-   Nomor versi
-   Waktu perubahan
-   Pengguna yang melakukan perubahan
-   Status verifikasi
-   Perubahan yang dilakukan jika tersedia

Member dapat melihat versi sebelumnya.

## Soal

Owner dan Admin dapat membuat soal.

Soal dapat digunakan kembali untuk membuat berbagai kuis.

Soal memiliki informasi seperti:

-   Pertanyaan
-   Jenis soal
-   Pilihan jawaban
-   Jawaban benar
-   Pembahasan
-   Tingkat kesulitan
-   Materi atau topik

Untuk tahap awal, sistem dapat memprioritaskan:

-   Pilihan ganda
-   Benar / salah

Sistem verifikasi terpisah untuk soal tidak diperlukan untuk tahap awal.

## Kuis

Owner dan Admin dapat membuat kuis menggunakan soal yang tersedia.

Kuis dapat memiliki:

-   Judul
-   Deskripsi
-   Daftar soal
-   Batas waktu pengerjaan (opsional)
-   Jumlah soal
-   Pengacakan soal
-   Pengacakan pilihan
-   Status aktif
-   Informasi percobaan

Kuis dapat dikerjakan lebih dari satu kali.

Setiap percobaan harus disimpan agar riwayat pengerjaan tetap tersedia.

## XP

EduVerse menggunakan XP untuk mendukung leaderboard.

Sistem XP awal:

Percobaan pertama: - Mendapat XP penuh

Percobaan kedua: - Mendapat XP lebih sedikit

Percobaan ketiga dan seterusnya: - Tidak mendapatkan XP tambahan

Tujuannya agar pengguna tetap dapat mengulang kuis untuk belajar tanpa
membuat leaderboard dapat dinaikkan tanpa batas hanya dengan mengulang
kuis.

Detail angka XP dapat disesuaikan saat implementasi.

## Leaderboard

Leaderboard berada di dalam kelas.

Leaderboard tidak menggunakan total nilai mentah dari seluruh percobaan
karena kuis dapat diulang.

Leaderboard menggunakan XP.

Contoh:

``` text
1. Refky    1250 XP
2. Budi     1180 XP
3. Andi     1050 XP
```

Leaderboard harus tetap menjadi bagian dari halaman kelas.

## Anggota

Halaman Anggota menampilkan seluruh pengguna yang berada di kelas.

Informasi dapat mencakup:

-   Foto profil
-   Nama
-   Username

Owner dapat mengelola anggota sesuai permission.

## Pengaturan Owner

Menu Pengaturan hanya muncul untuk Owner.

Pengaturan dapat mencakup:

### Informasi Kelas

-   Nama kelas
-   Deskripsi

### Kode Kelas

-   Melihat kode
-   Membuat ulang kode

### Pengelolaan

-   Mengatur Admin
-   Mengelola anggota

### Danger Zone

-   Menghapus kelas

## Prinsip Desain

Desain frontend yang sudah ada harus dipertahankan.

Prioritas:

1.  Responsif di desktop
2.  Responsif di tablet
3.  Responsif di mobile
4.  Mempertahankan layout dan visual yang sudah ada
5.  Memperbaiki masalah UI hanya jika diperlukan

Jangan melakukan redesign pada halaman utama atau halaman kelas tanpa
instruksi khusus.

Jika fitur baru membutuhkan elemen UI, elemen tersebut harus mengikuti
desain yang sudah ada.

## Prinsip Pengembangan

-   Jangan menghapus fitur lama tanpa alasan dan instruksi.
-   Jangan mengubah desain yang sudah dianggap final.
-   Jangan membuat role baru tanpa kebutuhan yang jelas.
-   Jangan mengakses database langsung dari React.
-   Semua data utama harus diproses melalui Laravel API.
-   Validasi harus dilakukan di backend.
-   Permission harus diperiksa di backend.
-   Jangan mempercayai role atau permission yang hanya dikirim dari
    frontend.
-   Gunakan database migration Laravel.
-   Gunakan API yang terstruktur.
-   Gunakan komponen React yang dapat digunakan kembali.
-   Hindari duplikasi kode.
-   Perubahan besar harus dilakukan secara bertahap.

## Rencana Pengembangan

### Phase 1: Frontend

-   Migrasi frontend lama ke React
-   Mempertahankan desain lama
-   Membuat seluruh halaman responsif
-   Membuat routing React
-   Membuat struktur komponen

### Phase 2: Backend

-   Menyiapkan Laravel
-   Menyiapkan database
-   Membuat migration
-   Membuat model
-   Membuat API
-   Menyiapkan authentication

### Phase 3: Authentication

-   Register
-   Login
-   Logout
-   Session atau token
-   Profile
-   Edit profile

### Phase 4: Sistem Kelas

-   Membuat kelas
-   Melihat kelas
-   Gabung menggunakan kode
-   Regenerate kode
-   Owner
-   Admin
-   Member

### Phase 5: Materi

-   Membuat materi
-   Edit materi
-   Verifikasi Owner
-   Status materi
-   Version history
-   Melihat versi sebelumnya

### Phase 6: Soal

-   Bank soal
-   Membuat soal
-   Edit soal
-   Hapus soal
-   Topik
-   Pembahasan

### Phase 7: Kuis

-   Membuat kuis
-   Mengambil soal
-   Mengerjakan kuis
-   Timer
-   Submit
-   Penilaian
-   Riwayat percobaan
-   Pengulangan kuis

### Phase 8: XP dan Leaderboard

-   Sistem XP
-   Perhitungan XP
-   Leaderboard per kelas
-   Riwayat XP

### Phase 9: Pengaturan Owner

-   Informasi kelas
-   Pengelolaan Admin
-   Pengelolaan anggota
-   Regenerate kode
-   Transfer Owner
-   Hapus kelas

## Catatan untuk AI Developer

Sebelum melakukan perubahan pada project:

1.  Baca README.md ini.
2.  Periksa struktur project yang sudah ada.
3.  Jangan mengubah desain yang sudah ada tanpa instruksi.
4.  Jangan menghapus fitur lama tanpa alasan.
5.  Kerjakan fitur secara bertahap.
6.  Pastikan frontend dan backend memiliki tanggung jawab yang jelas.
7.  Jika membutuhkan perubahan arsitektur, jelaskan perubahan tersebut
    sebelum menerapkannya.
8.  Prioritaskan kode yang sederhana, mudah dipelihara, dan sesuai
    dengan struktur project.

README ini menjadi dokumen acuan utama untuk pengembangan EduVerse.
