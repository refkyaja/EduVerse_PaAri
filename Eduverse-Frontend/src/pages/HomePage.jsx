import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ChevronRight, Lightbulb, Target, Shield, Snowflake, BookOpen, ShieldAlert } from 'lucide-react';
import { useAppState } from '../context/AppStateContext';
import PowerUpModal from '../components/PowerUpModal';

export default function HomePage() {
  const { classId } = useParams();
  const { appState, getLevelInfo, findClass, getClassXp } = useAppState();
  const [isPowerUpOpen, setIsPowerUpOpen] = useState(false);

  const activeClass = classId && findClass ? findClass(classId) : null;
  const isApiClass = Boolean(classId && !String(classId).startsWith('cls-') && !isNaN(Number(classId)));

  if (classId && !activeClass && !isApiClass) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 space-y-4 animate-fade-in max-w-md mx-auto py-12">
        <div className="w-16 h-16 rounded-3xl bg-danger/10 text-danger flex items-center justify-center shadow-inner">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h2 className="text-xl font-extrabold italic text-foreground">Akses Ditolak / Kelas Tidak Ditemukan</h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Ruang kelas dengan ID <code className="text-primary font-mono bg-muted px-1.5 py-0.5 rounded">{classId}</code> tidak ditemukan atau Anda tidak terdaftar sebagai anggota di kelas ini.
          </p>
        </div>
        <div className="pt-2">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground font-extrabold text-xs rounded-xl shadow-glow hover:scale-105 transition-all"
          >
            <span>Kembali ke Beranda</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  const classXp = classId && getClassXp ? getClassXp(classId) : appState.xp;
  const levelInfo = getLevelInfo(classXp);
  const progressPercent = Math.min(100, Math.max(0, (levelInfo.progress / levelInfo.max) * 100));

  return (
    <section className="px-4 md:px-8 pt-6 space-y-6 animate-fade-in flex flex-col max-w-7xl mx-auto w-full pb-24">
      {/* Grid for Hero Card & Status - 2 columns side-by-side even on mobile */}
      <div className="grid grid-cols-2 gap-3 md:gap-6 items-stretch">
        {/* Hero Level Card */}
        <div className="bg-gradient-to-br from-primary via-primary to-primary-glow rounded-2xl md:rounded-3xl p-3.5 sm:p-4 md:p-5 text-primary-foreground shadow-glow relative overflow-hidden flex flex-col justify-between">
          <div className="absolute -right-8 -top-8 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -left-4 -bottom-12 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          <div className="relative z-10">
            <p className="text-primary-foreground/80 text-[9px] sm:text-[10px] md:text-xs font-bold uppercase tracking-widest">Pangkat Saat Ini</p>
            <h2 className="text-sm sm:text-xl md:text-2xl font-extrabold mt-0.5 sm:mt-1 italic leading-tight">
              {levelInfo.level > 10 ? 'Master Akademik' : 'Pemula EduVerse'}
            </h2>
          </div>
          <div className="relative z-10 mt-2 sm:mt-3 md:mt-4">
            <div className="flex justify-between text-[9px] sm:text-[10px] md:text-xs mb-1 font-bold italic">
              <span id="home-level-label">LEVEL {levelInfo.level}</span>
              <span id="home-xp-label" className="tabular-nums">{levelInfo.progress} / {levelInfo.max} XP</span>
            </div>
            <div className="w-full h-2 md:h-2.5 bg-black/20 rounded-full overflow-hidden">
              <div
                id="home-level-progress-bar"
                className="h-full bg-gradient-to-r from-xp-gold to-white rounded-full shadow-[0_0_12px_rgba(255,255,255,0.6)] transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Status Card */}
        <div className="bg-card rounded-2xl md:rounded-3xl p-3.5 sm:p-4 md:p-5 border border-border flex flex-col justify-center items-center text-center space-y-1 sm:space-y-1.5 shadow-sm">
          <Shield className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-muted-foreground" />
          <h4 className="font-extrabold text-xs sm:text-sm leading-snug">Status Kelas Active</h4>
          <p className="text-[9px] sm:text-[10px] md:text-xs text-muted-foreground max-w-xs leading-tight">
            {activeClass ? activeClass.name : 'Ruang Pembelajaran EduVerse'}
          </p>
        </div>
      </div>

      {/* Power-Up Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-lg">Power Up</h3>
          <button onClick={() => setIsPowerUpOpen(true)} className="text-primary text-xs font-bold flex items-center gap-0.5 hover:underline">
            Lihat Semua <ChevronRight className="w-3 h-3" />
          </button>
        </div>
        <div className="grid grid-cols-4 gap-3 md:gap-4">
          <button onClick={() => setIsPowerUpOpen(true)} className="p-4 md:py-6 bg-card rounded-2xl border border-border flex flex-col items-center justify-center gap-1.5 hover:border-primary/40 hover:scale-105 transition-all">
            <Lightbulb className="w-6 h-6 text-warning" strokeWidth={2.2} />
            <span className="text-[9px] md:text-xs font-extrabold text-muted-foreground uppercase tracking-wider">Hint</span>
          </button>
          <button onClick={() => setIsPowerUpOpen(true)} className="p-4 md:py-6 bg-card rounded-2xl border border-border flex flex-col items-center justify-center gap-1.5 hover:border-primary/40 hover:scale-105 transition-all">
            <Target className="w-6 h-6 text-brand-blue" strokeWidth={2.2} />
            <span className="text-[9px] md:text-xs font-extrabold text-muted-foreground uppercase tracking-wider">50:50</span>
          </button>
          <button onClick={() => setIsPowerUpOpen(true)} className="p-4 md:py-6 bg-card rounded-2xl border border-border flex flex-col items-center justify-center gap-1.5 hover:border-primary/40 hover:scale-105 transition-all">
            <Shield className="w-6 h-6 text-success" strokeWidth={2.2} />
            <span className="text-[9px] md:text-xs font-extrabold text-muted-foreground uppercase tracking-wider">Shield</span>
          </button>
          <button onClick={() => setIsPowerUpOpen(true)} className="p-4 md:py-6 bg-card rounded-2xl border border-border flex flex-col items-center justify-center gap-1.5 hover:border-primary/40 hover:scale-105 transition-all">
            <Snowflake className="w-6 h-6 text-sky-500" strokeWidth={2.2} />
            <span className="text-[9px] md:text-xs font-extrabold text-muted-foreground uppercase tracking-wider">Freeze</span>
          </button>
        </div>
      </div>

      {/* Subjects Showcase */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-lg">Mata Pelajaran</h3>
        </div>
        <div className="bg-card rounded-3xl p-8 md:p-10 border border-border flex flex-col items-center justify-center text-center space-y-2 shadow-sm">
          <BookOpen className="w-8 h-8 text-muted-foreground/60" />
          <p className="font-extrabold text-sm text-foreground">Tidak Ada Pelajaran</p>
          <p className="text-xs text-muted-foreground max-w-xs">Materi pelajaran belum ditambahkan oleh Owner atau Admin di kelas ini.</p>
        </div>
      </div>

      <PowerUpModal isOpen={isPowerUpOpen} onClose={() => setIsPowerUpOpen(false)} />
    </section>
  );
}
