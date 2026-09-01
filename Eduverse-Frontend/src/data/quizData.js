export const SUBJECTS_DATA = {
  pabp: { name: 'PABP', fullName: 'Pendidikan Agama & Budi Pekerti', chapters: [
    { id: 'pabp-bab6',  label: 'Bab 6',  title: 'Mari Belajar',       soal: 10 },
    { id: 'pabp-bab7',  label: 'Bab 7',  title: 'Mari Berlatih',     soal: 10 },
    { id: 'pabp-bab8',  label: 'Bab 8',  title: 'Mari Mengkaji',     soal: 10 },
    { id: 'pabp-bab9',  label: 'Bab 9',  title: 'Mari Memahami',     soal: 10 },
    { id: 'pabp-bab10', label: 'Bab 10', title: 'Mari Mengamalkan',  soal: 10 },
  ]},
  ind: { name: 'Bahasa Indonesia', fullName: 'Bahasa Indonesia', chapters: [
    { id: 'ind-multimodal',       label: 'Teks Multimodal',          title: 'Teks Multimodal',          soal: 10 },
    { id: 'ind-karya-ilmiah',     label: 'Karya Ilmiah',             title: 'Karya Ilmiah',             soal: 10 },
    { id: 'ind-proposal',         label: 'Proposal',                 title: 'Proposal',                 soal: 10 },
    { id: 'ind-puisi',            label: 'Puisi',                    title: 'Puisi',                    soal: 10 },
    { id: 'ind-drama-berita-iklan', label: 'Drama, Berita & Iklan',  title: 'Drama, Berita & Iklan',    soal: 10 },
  ]},
  pwp: { name: 'Pwp', fullName: 'Pendidikan Wirausaha & Prakarya', chapters: [
    { id: 'pwp-laravel', label: 'Laravel', title: 'Laravel', soal: 30 },
  ]},
  ppan: { name: 'Ppan', fullName: 'Pendidikan Pancasila', chapters: [
    { id: 'ppan-bab3', label: 'Bab 3', title: 'Harmoni dalam Keberagaman dan Resolusi Konflik',   soal: 25 },
    { id: 'ppan-bab4', label: 'Bab 4', title: 'Integrasi Nasional, Bentuk Negara, dan Sistem Pemerintahan', soal: 35 },
  ]},
  mtk: { name: 'Matematika', fullName: 'Matematika', chapters: [
    { id: 'mtk-bab1', label: 'Bab 1', title: 'Matriks',                    soal: 5 },
    { id: 'mtk-bab2', label: 'Bab 2', title: 'Determinan',                  soal: 5 },
    { id: 'mtk-bab3', label: 'Bab 3', title: 'Invers Matriks',              soal: 5 },
    { id: 'mtk-bab4', label: 'Bab 4', title: 'Sistem Persamaan Linear',     soal: 5 },
    { id: 'mtk-bab5', label: 'Bab 5', title: 'Vektor',                      soal: 5 },
  ]},
  pbt: { name: 'Pbt', fullName: 'Pemrograman Berbasis Teks & Grafis', chapters: [
    { id: 'pbt-tools', label: 'Tools, Gui dan Fungsinya', title: 'Tools, GUI dan Fungsinya pada Visual Studio', soal: 35 },
  ]},
  cloud: { name: 'Cloud', fullName: 'Cloud Computing', chapters: [
    { id: 'cloud-modul3-6',   label: 'Modul 3–6',   title: 'Modul 3–6 (AWS Core Services)',   soal: 24 },
    { id: 'cloud-modul7-10',  label: 'Modul 7–10',  title: 'Modul 7–10 (AWS Core Services)',  soal: 27 },
    { id: 'cloud-modul11-13', label: 'Modul 11–13', title: 'Modul 11–13 (AWS Architecture)',   soal: 12 },
    { id: 'cloud-modul14-16', label: 'Modul 14–16', title: 'Modul 14–16 (AWS Serverless & DR)', soal: 12 },
  ]},
  sejarah: { name: 'Sejarah', fullName: 'Sejarah Indonesia', chapters: [
    { id: 'sjh-bab1', label: 'Bab 1', title: 'Masa Praaksara',          soal: 5 },
    { id: 'sjh-bab2', label: 'Bab 2', title: 'Kerajaan Hindu-Buddha',   soal: 5 },
    { id: 'sjh-bab3', label: 'Bab 3', title: 'Kerajaan Islam',          soal: 5 },
    { id: 'sjh-bab4', label: 'Bab 4', title: 'Kolonialisme',            soal: 5 },
    { id: 'sjh-bab5', label: 'Bab 5', title: 'Pergerakan Nasional',     soal: 5 },
  ]},
  inggris: { name: 'Bahasa Inggris', fullName: 'Bahasa Inggris', chapters: [
    { id: 'ing-bab1', label: 'Bab 1', title: 'Reading Comprehension',    soal: 5 },
    { id: 'ing-bab2', label: 'Bab 2', title: 'Grammar & Tenses',         soal: 5 },
    { id: 'ing-bab3', label: 'Bab 3', title: 'Writing Skills',           soal: 5 },
    { id: 'ing-bab4', label: 'Bab 4', title: 'Listening & Speaking',     soal: 5 },
    { id: 'ing-bab5', label: 'Bab 5', title: 'Vocabulary Builder',       soal: 5 },
  ]},
  'mtk-diskrit': { name: 'Matematika Diskrit', fullName: 'Matematika Diskrit', chapters: [
    { id: 'disk-bab1', label: 'Bab 1', title: 'Logika Matematika',   soal: 5 },
    { id: 'disk-bab2', label: 'Bab 2', title: 'Himpunan',            soal: 5 },
    { id: 'disk-bab3', label: 'Bab 3', title: 'Relasi & Fungsi',     soal: 5 },
    { id: 'disk-bab4', label: 'Bab 4', title: 'Kombinatorika',       soal: 5 },
    { id: 'disk-bab5', label: 'Bab 5', title: 'Graf & Pohon',        soal: 5 },
  ]},
};

export const ALL_EXAMS_QUESTIONS = {
  'pabp-bab6': [
    { q: "Perhatikan Q.S. Yūnus/10:40 di bawah ini!\nوَمِنْهُم مَّن يُّؤْمِنُ بِهٖ وَمِنْهُم مَّن لَّا يُؤْمِنُ بِهٖۗ وَرَبُّكَ…\nSambungan ayat di atas yang tepat adalah ….", options: ["اَعْلَمُ بِالْمُفْسِدِيْنَ", "اَنْتُمْ بَرِيْۤـُٔوْنَ", "اَعْلَمُ بِالْمُفْسِدِيْنَ", "مَا تَعْمَلُوْنَ", "وَاَنَا بَرِيْۤءٌ مِّمَّا تَعْمَلُوْنَ"], correct: 2, hint: "Lihat lanjutan ayat pada Q.S. Yūnus/10:40." },
    { q: "Dalam Q.S. Yūnus/10:41 ada kalimat فَقُلْ لِّيْ عَمَلِيْ. Terjemahan yang tepat untuk kalimat di atas adalah ….", options: ["maka dengarkanlah, \"Bagiku pekerjaanku…\"", "maka dengarkanlah, \"Bagimu pekerjaanku…\"", "maka katakanlah, \"Bagimu pekerjaanku…\"", "maka katakanlah, \"Bagiku pekerjaanmu…\"", "maka katakanlah, \"Bagiku pekerjaanku…\""], correct: 4, hint: "Perhatikan kata فَقُلْ (maka katakanlah) dan لِيْ (bagiku)." },
    { q: "Diantara isi Q.S. Yūnus/10:40-41 adalah agar umat Islam mempunyai sikap ….", options: ["wira'i", "zuhud", "qana'ah", "samhah", "syaja'ah"], correct: 3, hint: "Sikap toleran dan lapang dada dalam bermuamalah." },
    { q: "Perhatikan ayat di bawah ini!\nوَاِنْ كَذَّبُوْكَ فَقُلْ لِّيْ عَمَلِيْ وَلَكُمْ عَمَلُكُمْ ۚاَنْتُمْ بَرِيْۤـُٔوْنَ مِمَّآ اَعْمَلُ وَاَنَا بَرِيْۤءٌ مِّمَّا تَعْمَلُوْنَ\nDari ayat yang digarisbawahi, bacaan tajwid yang benar dan urut adalah….", options: ["idzhar syafawi, ikhfa', ghunnah dan mad wajib munfasil", "ikhfa' syafawi, ikhfa', ghunnah, dan mad jaiz munfasil", "ikhfa, ikhfa' syafawi, mad jaiz munfasil, dan ghunnah", "mad wajib muttasil, ghunnah, ikhfa, ikhfa' syafawi", "ikhfa', idzhar syafawi, ghunnah, dan mad jaiz munfasil"], correct: 1, hint: "Perhatikan huruf dan hukum tajwid pada setiap kata." },
    { q: "Dalam Hadis Nabi Muhammad Saw., dari Abu Hurairah r.a., bahwa al-Thufail bin 'Amr menemui Nabi dan menceritakan bahwa Daus telah durhaka. Respon Nabi sesuai hadis tersebut adalah ….", options: ["Nabi berdoa, \"Ya Allah berilah azab kepada kabilah Daus dan datangkanlah (mereka) bersama orang yang binasa.\"", "Nabi berdoa, \"Ya Allah berilah azab kepada kabilah Daus dan datangkanlah (mereka) bersama orang yang kufur.\"", "Nabi berdoa, \"Ya Allah berilah petunjuk kepada kabilah Daus dan datangkanlah (mereka) bersama orang muslim (masuk Islam).\"", "Nabi berdoa, \"Ya Allah berilah petunjuk kepada kabilah Daus dan datangkanlah (mereka) bersama orang yang ahl al-ilmi.\"", "Nabi berdoa, \"Ya Allah berilah petunjuk kepada kabilah Daus dan datangkanlah (mereka) bersama pemimpin yang adil.\""], correct: 2, hint: "Nabi justru mendoakan hidayah, bukan kebinasaan." },
    { q: "مَنْ اَحْيَاهَا فَكَاَنَّمَا اَحْيَا النَّاسَ جَمِيْعًا\nTerjemahan yang tepat dari ayat di atas adalah ….", options: ["Barangsiapa memelihara kehidupan seorang manusia, maka seakan-akan dia telah memelihara kehidupan semua manusia", "Barangsiapa memelihara kehidupan seorang manusia, maka seakan-akan dia telah memelihara kehidupan banyak manusia", "Barangsiapa memelihara kehidupan yang ada di bumi, maka seakan-akan dia telah memelihara kehidupan semua makhluk", "Barangsiapa memelihara kehidupan seluruh makhluk, maka seakan-akan dia telah memelihara kehidupan di alam semesta", "Barangsiapa memelihara kehidupan banyak manusia, maka seakan-akan dia telah memelihara kehidupan seluruh manusia"], correct: 0, hint: "Frasa النَّاسَ جَمِيْعًا berarti 'manusia seluruhnya'." },
    { q: "Perhatikan Q.S. Al-Maidah/5:32 di bawah ini!\nمِنْ اَجْلِ ذٰلِكَ ۛ كَتَبْنَا عَلٰى بَنِيْٓ اِسْرَاۤءِيْلَ اَنَّهٗ مَنْ قَتَلَ نَفْسًاۢ بِغَيْرِ نَفْسٍ اَوْ فَسَادٍ فِى الْاَرْضِ فَكَاَنَّمَا قَتَلَ النَّاسَ جَمِيْعًا\nDari ayat di atas yang digarisbawahi mempunyai bacaan tajwid secara urut adalah ….", options: ["idzhar khalqi, qalqalah sughra, ikhfa', ghunnah, dan mad thabi'i", "idzhar khalqi, qalqalah kubra, ikhfa', ghunnah, dan mad thabi'i", "idzhar khalqi, qalqalah sughra, ikhfa' syafawi, ghunnah, dan mad thabi'i", "idzhar khalqi, qalqalah sughra, ikhfa', iqlab, dan mad thabi'i", "idzhar khalqi, qalqalah sughra, ikhfa', ghunnah, dan mad 'arid"], correct: 0, hint: "Perhatikan hukum nun sukun dan mad pada setiap kata." },
    { q: "Pernyataan di bawah ini yang merupakan penerapan dari Q.S. Al-Maidah/5:32 adalah ….", options: ["melaksanakan shalat lima waktu di awal waktu", "melaksanakan shalat tahajud pada sepertiga malam", "memberikan santunan kepada anak yatim piatu", "berpuasa sunah setiap hari senin dan kamis", "membaca al-Quran setiap hari di rumah dan masjid"], correct: 2, hint: "Ayat ini tentang memelihara kehidupan manusia." },
    { q: "Diriwayatkan dari 'Abdullah bin 'Amr, dari Nabi Saw., beliau bersabda: \"Barangsiapa yang membunuh mu'ahid tidak akan dapat mencium harumnya surga, padahal harumnya dapat dicium dari perjalanan …. ", options: ["sepuluh tahun", "dua puluh tahun", "tiga puluh tahun", "empat puluh tahun", "lima puluh tahun"], correct: 3, hint: "Jarak yang sangat jauh sebagai gambaran besar dosanya." },
    { q: "Dalam hadis riwayat Muslim, orang yang datang pada hari kiamat membawa shalat, puasa dan zakat, tetapi pernah mencaci si ini, menuduh si ini, makan harta si ini, menumpahkan darah si ini, disebut dengan orang yang …. ", options: ["al-mukhlis", "al-muflis", "al-muhsin", "al-dzalim", "al-'ashi"], correct: 1, hint: "Artinya orang yang bangkrut amalnya." }
  ],
  'pabp-bab7': [
    { q: "Dalam Hadis Nabi Muhammad Saw. yang diriwayatkan Al-Bukhāri, bahwa maksudnya kekayaan itu adalah …. ", options: ["kekayaan harta", "kekayaan hati", "kekayaan pikiran", "kekayaan materi", "kekayaan intelektual"], correct: 1, hint: "Kaya yang hakiki adalah kaya jiwa." },
    { q: "Perhatikan Q.S. Al-Ahzab/33:35! Ayat tersebut merupakan dalil naqli tentang salah satu cabang iman yaitu …. ", options: ["menjaga kehormatan", "ikhlas", "malu", "zuhud", "taqarrub"], correct: 0, hint: "Ayat menyebut الحَافِظِيْنَ فُرُوْجَهُمْ (orang yang menjaga kemaluannya)." },
    { q: "Di bawah ini yang merupakan pemahaman yang benar tentang sifat zuhud adalah …. ", options: ["tidak boleh memiliki harta karena akan melalaikan kepada Allah", "mencari harta dengan optimal untuk keluarga mumpung masih hidup", "mengesampingkan kewajiban kerja dengan selalu beribadah", "mencari nafkah sepanjang waktu dalam hidup karena waktu adalah uang", "menjadikan harta dunia untuk mengantarkan kebahagiaan di akhirat"], correct: 4, hint: "Zuhud bukan anti-dunia, tapi dunia sebagai wasilah akhirat." },
    { q: "Meninggalkan kenikmatan duniawi untuk mendapatkan kenikmatan akhirat merupakan salah satu ciri orang yang memiliki sifat zuhud. Ciri lainnya adalah …. ", options: ["senang mencela dan susah untuk memuji orang lain", "membenci orang yang memberikan celaan kepadanya", "marah-marah ketika mendapat pujian orang lain", "sangat senang akan pujian yang datang dari orang lain", "bersikap sederhana baik saat dipuji maupun saat dicela"], correct: 4, hint: "Zuhud membuat seseorang tidak terpengaruh pujian/celaan." },
    { q: "Di bawah ini merupakan tingkatan ikhlas dengan urut adalah …. ", options: ["awam, khas, dan khawasul khas", "awam, khawasul khawas, dan khawas", "awam, khawas, dan khawasul khawas", "awam, khas, dan khawasul khawas", "awam, khawas, dan khawasul khas"], correct: 2, hint: "Tingkatan dari rendah hingga paling tinggi." },
    { q: "Di bawah ini yang termasuk ciri-ciri orang ikhlas adalah …. ", options: ["malas beribadah jika sendirian dan rajin dihadapan banyak orang", "senantiasa beramal dan bersungguh-sungguh dalam beramal", "bergairah beribadah ketika dipuji dan tidak bersemangat jika dicela", "melakukan segala sesuatu yang dilarang oleh Allah Swt.", "membedakan antara amal yang rewardnya besar dan kecil"], correct: 1, hint: "Ikhlas berarti konsisten dalam beramal karena Allah." },
    { q: "Di bawah ini merupakan manfaat ikhlas adalah …. ", options: ["menambah kekayaan di dunia", "terhindar dari tipu daya setan", "menjadi orang yang terkenal", "mendapatkan pujian dari teman", "dicari banyak orang untuk dibantu"], correct: 1, hint: "Setan tidak bisa menggoda orang yang ikhlas." },
    { q: "Dalam Hadis Nabi Saw. riwayat Al-Tirmidzī, yang termasuk malu kepada Allah dengan sebenarnya adalah …. ", options: ["menjaga seluruh jiwanya dengan mengikutsertakan program asuransi", "menjaga harta benda yang dimilikinya dengan menabung di Bank Syari'ah", "menjaga seluruh anggota badan dari perbuatan yang dilarang oleh agama Islam", "menjaga seluruh keluarga dengan memasang CCTV di dalam dan di luar rumah", "menjaga lingkungan sekitar dengan melakukan jaga malam secara bergantian"], correct: 2, hint: "Malu kepada Allah berarti menjaga semua anggota tubuh dari maksiat." },
    { q: "Perhatikan pernyataan berikut!\n1) menghindari dari perbuatan maksiat\n2) menghantarkan hambanya melakukan kebaikan\n3) mengurangi rezeki\n4) lebih dekat dengan Allah Swt.\n5) tidak mendapatkan pekerjaan\nYang termasuk manfaat sikap malu sebagai cabang Iman adalah …. ", options: ["1), 2), dan 3)", "1), 3), dan 4)", "2), 3), dan 4)", "2), 4), dan 1)", "3), 5), dan 1)"], correct: 3, hint: "Malu menjauhkan dari maksiat, mendekatkan kepada Allah, dan mengantarkan pada kebaikan." },
    { q: "Malu merupakan tanda baik atau tidaknya iman seseorang. Salah satu penerapan sifat malu yang tepat di bawah ini adalah…. ", options: ["malu tidak mengerjakan tugas", "malu menghadiri pengajian umum", "malu diejek teman apabila berjilbab", "malu salat berjama'ah di masjid", "malu tidak mempunyai HP terbaru"], correct: 0, hint: "Malu karena meninggalkan kewajiban adalah malu yang terpuji." }
  ],
  'mtk-bab1': [
    { q: "Jika A = [[2,1],[3,4]], maka determinan A adalah...", options: ["5","8","11","-5"], correct: 0, hint: "det = (a·d) − (b·c)" },
    { q: "Hasil dari (2x + 3) bila x = 4 adalah...", options: ["10","11","14","9"], correct: 1, hint: "Substitusi nilai x langsung ke ekspresi." },
    { q: "Matriks identitas berordo 2×2 memiliki diagonal utama bernilai...", options: ["0","1","2","−1"], correct: 1, hint: "Matriks identitas berisi 1 di diagonal, 0 di tempat lain." },
    { q: "Jika f(x) = x² − 1 dan g(x) = 2x + 3, maka (g∘f)(2) = ...", options: ["6","9","11","12"], correct: 1, hint: "Hitung f(2) dulu, baru masukkan ke g." },
    { q: "Invers dari matriks 2×2 A=[[1,2],[3,4]] memiliki determinan...", options: ["−2","2","10","0"], correct: 0, hint: "1·4 − 2·3." }
  ],
  'ind-multimodal': [
    { q: "Teks multimodal adalah teks yang menggunakan lebih dari satu mode komunikasi. Manakah di bawah ini yang BUKAN merupakan contoh teks multimodal?", options: ["Infografis kesehatan","Video pembelajaran dengan narasi dan musik","Poster kampanye sosial","Novel tanpa ilustrasi","Presentasi PowerPoint"], correct: 3, hint: "Novel tanpa ilustrasi hanya mengandalkan satu mode yaitu tulisan." },
    { q: "Berikut adalah unsur-unsur multimodal, kecuali...", options: ["Unsur linguistik","Unsur visual","Unsur audio","Unsur metodologis","Unsur spasial"], correct: 3, hint: "Metodologis bukan termasuk unsur multimodal." },
    { q: "Fungsi dari unsur warna dalam sebuah poster multimodal adalah...", options: ["Memberikan informasi saja","Memperjelas pesan dan membangun emosi","Hanya untuk hiasan","Menunjukkan tanggal","Untuk menghemat kertas"], correct: 1, hint: "Warna berperan memperkuat pesan dan membangkitkan emosi pembaca." },
    { q: "Unsur yang menunjukkan gerakan tubuh atau ekspresi wajah dalam komunikasi multimodal adalah unsur...", options: ["Linguistik","Visual","Audio","Gestural","Spasial"], correct: 3, hint: "Gestural berkaitan dengan gerakan tubuh dan ekspresi." },
    { q: "Cara menganalisis teks multimodal yang benar adalah...", options: ["Hanya fokus pada tulisannya saja","Tentukan tujuan, identifikasi unsur, jelaskan fungsi setiap unsur","Lihat warnanya saja","Dengarkan audionya saja","Hitung jumlah gambar"], correct: 1, hint: "Analisis multimodal mencakup tujuan, unsur, dan fungsi setiap unsur." },
    { q: "Infografis termasuk teks multimodal karena...", options: ["Hanya menggunakan gambar","Hanya menggunakan tulisan","Menggabungkan teks dan visual","Menggunakan bahasa daerah","Berisi cerita fiksi"], correct: 2, hint: "Infografis memadukan teks dan elemen visual." },
    { q: "Video pembelajaran yang dilengkapi teks dan suara memanfaatkan unsur...", options: ["Linguistik, audio, dan visual","Linguistik saja","Audio saja","Visual saja","Spasial saja"], correct: 0, hint: "Video menggabungkan tiga moda: bahasa (teks/narasi), audio (suara), dan visual (gambar)." },
    { q: "Unsur spasial dalam teks multimodal berkaitan dengan...", options: ["Tata letak unsur-unsur pada media","Warna tulisan","Suara narator","Gerakan tubuh","Bahasa yang digunakan"], correct: 0, hint: "Spasial mengatur posisi dan jarak antar elemen." },
    { q: "Tujuan penggunaan gambar dalam teks multimodal adalah...", options: ["Mengurangi informasi","Memperjelas isi pesan","Menggantikan seluruh teks","Menambah biaya produksi","Menghilangkan fokus pembaca"], correct: 1, hint: "Gambar berfungsi memperjelas pesan yang disampaikan." },
    { q: "Contoh teks multimodal digital adalah...", options: ["Buku tulis kosong","Surat pribadi","Podcast tanpa gambar","Presentasi interaktif","Catatan harian"], correct: 3, hint: "Presentasi interaktif menggabungkan teks, gambar, audio, dan animasi." }
  ],
  'pwp-laravel': [
    { q: "Laravel diciptakan oleh...", options: ["Rasmus Lerdorf","Taylor Otwell","Guido van Rossum","Brendan Eich","James Gosling"], correct: 1, hint: "Taylor Otwell membuat Laravel." },
    { q: "Arsitektur yang digunakan oleh Laravel adalah...", options: ["MVVM","MVC","Microservices","Monolithic","Event-Driven"], correct: 1, hint: "Model, View, Controller." },
    { q: "File routing utama untuk aplikasi web pada Laravel terletak di...", options: ["routes/api.php","routes/web.php","app/Http/routes.php","config/app.php","routes/console.php"], correct: 1, hint: "routes/web.php menampung route web." },
    { q: "Perintah Artisan untuk menjalankan server lokal Laravel adalah...", options: ["php artisan start","php artisan run","php artisan serve","php artisan dev","php artisan launch"], correct: 2, hint: "php artisan serve" },
    { q: "Perintah Artisan untuk membuat migration baru adalah...", options: ["php artisan make:table","php artisan create:migration","php artisan make:migration","php artisan db:migrate","php artisan new:migration"], correct: 2, hint: "php artisan make:migration" },
  ]
};
