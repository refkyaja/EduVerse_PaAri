import React from 'react';
import { Link } from 'react-router-dom';
import { LogIn, Sparkles, Shield, BookOpen, Users, HelpCircle, ChevronRight, CheckCircle2, Award, Zap } from 'lucide-react';
import { useAppState } from '../context/AppStateContext';

export default function AboutPage() {
  const { currentUser, logoutUser } = useAppState();

  return (
    <div className="w-full min-h-screen bg-background text-foreground animate-fade-in pb-20">
      {/* Header Navigation Bar (Mirrors WhatsApp About Navbar) */}
      <header className="sticky top-0 z-40 w-full bg-card/90 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2.5 group">
              <img src="/assets/companion.png" alt="EduVerse Logo" className="w-9 h-9 object-contain group-hover:scale-105 transition-transform" />
              <span className="font-extrabold text-xl tracking-tight text-foreground">
                EduVerse
              </span>
            </Link>

            {/* Sub-nav Links */}
            <nav className="hidden md:flex items-center gap-6 text-xs font-bold text-muted-foreground">
              <a href="#fitur" className="hover:text-primary transition-colors">Fitur</a>
              <a href="#privasi" className="hover:text-primary transition-colors">Privasi</a>
              <a href="#aplikasi" className="hover:text-primary transition-colors">Aplikasi</a>
              <a href="#bantuan" className="hover:text-primary transition-colors">Pusat Bantuan ↗</a>
              <a href="#sekolah" className="hover:text-primary transition-colors">Untuk Sekolah ↗</a>
            </nav>
          </div>

          {/* Top Right Action: Login Page Navigation Button */}
          <div className="flex items-center gap-2">
            {currentUser ? (
              <>
                <button
                  onClick={() => logoutUser()}
                  className="bg-danger/10 text-danger font-extrabold px-3 py-2 rounded-full text-xs hover:bg-danger/20 transition-all cursor-pointer"
                  title="Logout Akun"
                >
                  Logout ({currentUser.name})
                </button>
                <Link
                  to="/"
                  className="bg-primary text-primary-foreground font-extrabold px-4 py-2 rounded-full text-xs flex items-center gap-1 shadow-glow hover:scale-105 transition-all"
                >
                  <span>Buka Dashboard</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="bg-card hover:bg-muted border border-border rounded-full px-4 py-2 text-xs font-extrabold text-foreground transition-all shadow-sm"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-primary text-primary-foreground hover:scale-105 rounded-full px-4 py-2 text-xs font-extrabold flex items-center gap-1 shadow-glow transition-all"
                >
                  <span>Daftar</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Container Content */}
      <main className="max-w-4xl mx-auto px-6 pt-10 md:pt-16 space-y-12">
        
        {/* Main Title Section */}
        <section className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
            Tentang EduVerse
          </h1>
          <p className="text-lg md:text-xl font-medium text-muted-foreground leading-relaxed">
            Platform pembelajaran sekolah berbasis gamifikasi interaktif yang dirancang untuk mengubah kegiatan belajar menjadi petualangan seru dan terukur.
          </p>
        </section>

        <hr className="border-border" />

        {/* Section 1: Aplikasi Kami */}
        <section id="aplikasi" className="space-y-4">
          <h2 className="text-2xl md:text-3xl font-extrabold text-foreground">
            Aplikasi Kami
          </h2>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            EduVerse digunakan oleh ribuan siswa dan pengajar di berbagai sekolah untuk tetap terhubung, belajar materi pelajaran interaktif, dan mengukur kemampuan akademik melalui ujian berkonsep RPG Boss Battle.
          </p>
          <p className="text-xs text-muted-foreground italic">
            ¹ EduVerse dirancang khusus untuk memadukan kurikulum pendidikan nasional dengan mekanik game RPG modern.
          </p>
          <p className="text-xs text-muted-foreground italic">
            ² Bebas diakses melalui browser ponsel maupun komputer tanpa biaya berlangganan dasar.
          </p>
        </section>

        {/* Section 2: Misi Kami */}
        <section className="space-y-4">
          <h2 className="text-2xl md:text-3xl font-extrabold text-foreground">
            Misi Kami
          </h2>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            Misi utama EduVerse adalah menjadikan pendidikan lebih menyenangkan, transparan, dan dapat diakses oleh siapa saja. Kami percaya bahwa setiap siswa memiliki potensi besar ketika proses belajar disampaikan melalui media yang interaktif, kompetitif secara sehat, dan menghargai setiap progres kecil.
          </p>
        </section>

        {/* Section 3: Fitur Utama */}
        <section id="fitur" className="space-y-6 pt-4">
          <h2 className="text-2xl md:text-3xl font-extrabold text-foreground">
            Fitur Unggulan
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-card border border-border rounded-3xl p-6 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary grid place-items-center font-bold">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-base">Materi &amp; Flashcard</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Rangkuman materi pelajaran yang dilengkapi flashcard hafalan otomatis di setiap bab.
              </p>
            </div>

            <div className="bg-card border border-border rounded-3xl p-6 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-warning/10 text-warning grid place-items-center font-bold">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-base">Boss Battle Quiz</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Ujian harian berkonsep pertarungan boss yang melatih ketelitian dan kecepatan berpikir.
              </p>
            </div>

            <div className="bg-card border border-border rounded-3xl p-6 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-success/10 text-success grid place-items-center font-bold">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-base">Hall of Fame Podium</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Papan peringkat real-time untuk memotivasi pencapaian prestasi akademik siswa.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Banner to Login/Register Page */}
        <section className="bg-gradient-to-r from-primary to-primary-glow rounded-3xl p-8 text-primary-foreground shadow-glow text-center space-y-4">
          <h2 className="text-2xl md:text-3xl font-extrabold italic">Mulai Petualangan Belajarmu Sekarang!</h2>
          <p className="text-xs md:text-sm text-primary-foreground/90 max-w-xl mx-auto">
            Daftarkan akun atau masuk menggunakan kredensial Anda untuk terhubung ke database Laravel EduVerse.
          </p>
          <div className="flex justify-center gap-3">
            {currentUser ? (
              <Link
                to="/"
                className="bg-white text-primary font-extrabold px-8 py-3 rounded-full text-sm shadow-lg hover:scale-105 transition-transform inline-flex items-center gap-2"
              >
                Masuk ke Ruang Kelas ➔
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="bg-white/20 text-white font-extrabold px-6 py-3 rounded-full text-sm hover:bg-white/30 transition-all inline-flex items-center gap-2 border border-white/30"
                >
                  <LogIn className="w-4 h-4" /> Masuk Akun
                </Link>
                <Link
                  to="/register"
                  className="bg-white text-primary font-extrabold px-6 py-3 rounded-full text-sm shadow-lg hover:scale-105 transition-transform inline-flex items-center gap-2"
                >
                  Daftar Akun Baru ➔
                </Link>
              </>
            )}
          </div>
        </section>

      </main>
    </div>
  );
}
