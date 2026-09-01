export const INITIAL_USER = {
  id: "usr-101",
  name: "Refky Satria",
  username: "@refky",
  email: "refky@eduverse.id",
  avatar: "/assets/companion.png",
  totalXp: 3950,
  streak: 7,
  school: "SMKN 13 Bandung",
  grade: "XI RPL 1",
  activeRole: "owner", // 'owner' | 'admin' | 'member'
};

export const INITIAL_CLASSES = [
  {
    id: "cls-101",
    name: "XI RPL 1",
    description: "Kelas Rekayasa Perangkat Lunak 1 - Pembelajaran bersama & latihan ujian",
    code: "RPL101",
    memberCount: 32,
    bannerImage: "/assets/banner_eduverse.png",
    bannerBg: "linear-gradient(135deg, #b23be7 0%, #3b82f6 100%)",
    role: "owner",
    ownerName: "Refky Satria",
    createdAt: "2026-08-01",
  },
  {
    id: "cls-102",
    name: "Pemrograman Web",
    description: "Belajar HTML, CSS, JavaScript, React, dan Laravel dari tingkat dasar hingga mahir",
    code: "PWP2026",
    memberCount: 45,
    bannerImage: "/assets/banner_eduverse.png",
    bannerBg: "linear-gradient(135deg, #f43f5e 0%, #fb923c 100%)",
    role: "admin",
    ownerName: "Pak Budi",
    createdAt: "2026-07-15",
  },
  {
    id: "cls-103",
    name: "Belajar JavaScript",
    description: "Komunitas belajar logika JavaScript, DOM, Async, dan Modern ES6+",
    code: "JSCOMM",
    memberCount: 68,
    bannerImage: "/assets/banner_eduverse.png",
    bannerBg: "linear-gradient(135deg, #eab308 0%, #16a34a 100%)",
    role: "member",
    ownerName: "Siti Rahma",
    createdAt: "2026-06-20",
  },
];

export const INITIAL_ANNOUNCEMENTS = [
  {
    id: "anc-1",
    classId: "cls-101",
    authorName: "Refky Satria",
    authorRole: "Owner",
    authorAvatar: "/assets/companion.png",
    title: "Persiapan Ulangan Harian PWP & Laravel",
    content: "Halo teman-teman! Ulangan harian PWP akan dilaksanakan hari Rabu. Silakan pelajari materi Laravel yang telah diunggah.",
    createdAt: "10 Menit yang lalu",
  },
  {
    id: "anc-2",
    classId: "cls-101",
    authorName: "Budi Santoso",
    authorRole: "Admin",
    authorAvatar: "/assets/avatar.png",
    title: "Materi Matematika Diskrit Sudah Diperbarui",
    content: "Materi bab Relasi & Fungsi versi 2 sudah diunggah dan menunggu verifikasi Owner.",
    createdAt: "2 Jam yang lalu",
  },
];

export const INITIAL_MATERIALS = [
  {
    id: "mat-101",
    classId: "cls-101",
    title: "Pengenalan Arsitektur MVC pada Laravel",
    createdBy: "Refky Satria",
    creatorRole: "Owner",
    status: "Terverifikasi", // 'Draft' | 'Menunggu Verifikasi' | 'Terverifikasi' | 'Perlu Perbaikan' | 'Ditolak'
    activeVersion: 2,
    summary: "Konsep Model-View-Controller, Routing, dan Controller pada Laravel 11.",
    content: `<h4 class="font-extrabold text-base mb-2">Pengenalan Laravel MVC</h4>
<p class="text-muted-foreground">Laravel mengadopsi arsitektur Model-View-Controller untuk memisahkan logika bisnis, tampilan, dan pengelolaan data.</p>
<ul class="list-disc pl-5 space-y-1 text-muted-foreground mt-2">
  <li><strong>Model:</strong> Mengelola struktur data & komunikasi database.</li>
  <li><strong>View:</strong> Menampilkan interface kepada user.</li>
  <li><strong>Controller:</strong> Menghubungkan Model dan View.</li>
</ul>`,
    versions: [
      {
        version: 2,
        updatedAt: "7 Agustus 2026",
        updatedBy: "Refky Satria",
        status: "Terverifikasi",
        content: `<h4 class="font-extrabold text-base mb-2">Pengenalan Laravel MVC (Versi 2)</h4>
<p class="text-muted-foreground">Versi diperbarui dengan contoh Controller dan Migration.</p>`,
      },
      {
        version: 1,
        updatedAt: "5 Agustus 2026",
        updatedBy: "Refky Satria",
        status: "Terverifikasi",
        content: `<h4 class="font-extrabold text-base mb-2">Pengenalan Laravel MVC (Versi 1)</h4>
<p class="text-muted-foreground">Draft dasar pengenalan framework Laravel.</p>`,
      },
    ],
  },
  {
    id: "mat-102",
    classId: "cls-101",
    title: "Harmoni dalam Keberagaman dan Resolusi Konflik",
    createdBy: "Budi Santoso",
    creatorRole: "Admin",
    status: "Menunggu Verifikasi",
    activeVersion: 1,
    summary: "Prinsip toleransi, faktor pendorong harmoni sosial, dan landasan hukum UU No. 7 Tahun 2012.",
    content: `<h4 class="font-extrabold text-base mb-2">Harmoni Sosial</h4>
<p class="text-muted-foreground">Mewujudkan harmoni dalam keberagaman merupakan kunci stabilitas nasional berbasis nilai Pancasila.</p>`,
    versions: [
      {
        version: 1,
        updatedAt: "8 Agustus 2026",
        updatedBy: "Budi Santoso (Admin)",
        status: "Menunggu Verifikasi",
        content: `<h4 class="font-extrabold text-base mb-2">Harmoni Sosial</h4>
<p class="text-muted-foreground">Mewujudkan harmoni dalam keberagaman merupakan kunci stabilitas nasional berbasis nilai Pancasila.</p>`,
      },
    ],
  },
  {
    id: "mat-103",
    classId: "cls-101",
    title: "Matriks & Operasi Aljabar Matriks",
    createdBy: "Refky Satria",
    creatorRole: "Owner",
    status: "Terverifikasi",
    activeVersion: 1,
    summary: "Penjumlahan, perkalian matriks, determinan, dan invers matriks 2x2.",
    content: `<h4 class="font-extrabold text-base mb-2">Operasi Matriks</h4>
<p class="text-muted-foreground">Penjumlahan dan pengurangan matriks dapat dilakukan jika ordonya sama.</p>`,
    versions: [
      {
        version: 1,
        updatedAt: "4 Agustus 2026",
        updatedBy: "Refky Satria",
        status: "Terverifikasi",
        content: `<h4 class="font-extrabold text-base mb-2">Operasi Matriks</h4>
<p class="text-muted-foreground">Penjumlahan dan pengurangan matriks dapat dilakukan jika ordonya sama.</p>`,
      },
    ],
  },
];

export const INITIAL_QUIZZES = [
  {
    id: "quiz-101",
    classId: "cls-101",
    title: "Kuis Basic Laravel & Blade Template",
    timeLimit: 30,
    questionsCount: 5,
    attemptsCount: 2,
    active: true,
    questions: [
      {
        q: "Siapa pembuat pertama framework Laravel?",
        options: ["Rasmus Lerdorf", "Taylor Otwell", "Guido van Rossum", "Brendan Eich"],
        correct: 1,
        hint: "Inisial nama belakangnya Otwell.",
      },
      {
        q: "Arsitektur utama yang diterapkan Laravel adalah...",
        options: ["MVVM", "MVC", "Microservices", "Event-Driven"],
        correct: 1,
        hint: "Model, View, Controller.",
      },
      {
        q: "File route utama untuk aplikasi web Laravel berada di...",
        options: ["routes/api.php", "routes/web.php", "config/app.php", "routes/console.php"],
        correct: 1,
        hint: "routes/web.php",
      },
      {
        q: "Perintah Artisan untuk menjalankan local dev server adalah...",
        options: ["php artisan start", "php artisan serve", "php artisan dev", "php artisan run"],
        correct: 1,
        hint: "php artisan serve",
      },
      {
        q: "Template engine bawaan Laravel dinamakan...",
        options: ["Twig", "Blade", "EJS", "Handlebars"],
        correct: 1,
        hint: "Blade.",
      },
    ],
  },
  {
    id: "quiz-102",
    classId: "cls-101",
    title: "Ulangan Harian Matriks & Determinan",
    timeLimit: 20,
    questionsCount: 3,
    attemptsCount: 1,
    active: true,
    questions: [
      {
        q: "Jika A = [[2,1],[3,4]], maka determinan A adalah...",
        options: ["5", "8", "11", "-5"],
        correct: 0,
        hint: "det = (a*d) - (b*c)",
      },
      {
        q: "Matriks identitas 2x2 memiliki diagonal utama bernilai...",
        options: ["0", "1", "2", "-1"],
        correct: 1,
        hint: "Bernilai 1.",
      },
      {
        q: "Determinan dari matriks [[1,2],[3,4]] adalah...",
        options: ["-2", "2", "10", "0"],
        correct: 0,
        hint: "1*4 - 2*3 = -2",
      },
    ],
  },
];

export const INITIAL_LEADERBOARD = [
  { rank: 1, name: "Refky Satria (Kamu)", username: "@refky", xp: 3950, role: "Owner", isCurrentUser: true },
  { rank: 2, name: "Budi Santoso", username: "@budi", xp: 3420, role: "Admin", isCurrentUser: false },
  { rank: 3, name: "Siti Rahma", username: "@siti", xp: 2980, role: "Member", isCurrentUser: false },
  { rank: 4, name: "Andi Wijaya", username: "@andi", xp: 2650, role: "Member", isCurrentUser: false },
  { rank: 5, name: "Dewi Lestari", username: "@dewi", xp: 2100, role: "Member", isCurrentUser: false },
];

export const INITIAL_MEMBERS = [
  { id: "mem-1", name: "Refky Satria", username: "@refky", role: "Owner", avatar: "/assets/companion.png", joinedAt: "1 Ags 2026" },
  { id: "mem-2", name: "Budi Santoso", username: "@budi", role: "Admin", avatar: "/assets/avatar.png", joinedAt: "2 Ags 2026" },
  { id: "mem-3", name: "Siti Rahma", username: "@siti", role: "Member", avatar: "/assets/avatar.png", joinedAt: "3 Ags 2026" },
  { id: "mem-4", name: "Andi Wijaya", username: "@andi", role: "Member", avatar: "/assets/avatar.png", joinedAt: "3 Ags 2026" },
  { id: "mem-5", name: "Dewi Lestari", username: "@dewi", role: "Member", avatar: "/assets/avatar.png", joinedAt: "4 Ags 2026" },
];
