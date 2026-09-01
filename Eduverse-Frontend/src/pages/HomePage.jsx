import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ChevronRight, Lightbulb, Target, Shield, Snowflake, School, ArrowLeft, BookOpen } from 'lucide-react';
import { useAppState } from '../context/AppStateContext';
import PowerUpModal from '../components/PowerUpModal';

export default function HomePage() {
  const { classId } = useParams();
  const { appState, getLevelInfo, findClass, getClassXp } = useAppState();
  const [isPowerUpOpen, setIsPowerUpOpen] = useState(false);

  const activeClass = classId && findClass ? findClass(classId) : null;
  const isDemoClass = !classId || classId === 'cls-101' || classId === 'cls-102' || classId === 'cls-103';
  const classXp = isDemoClass ? appState.xp : (getClassXp ? getClassXp(classId) : 0);

  const levelInfo = getLevelInfo(classXp);
  const progressPercent = Math.min(100, Math.max(0, (levelInfo.progress / levelInfo.max) * 100));

  return (
    <section className="px-4 md:px-8 pt-6 space-y-6 animate-fade-in flex flex-col max-w-7xl mx-auto w-full">
      {/* Grid for Hero Card & Boss Battle - 2 columns side-by-side even on mobile */}
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

        {/* Boss Battle */}
        {isDemoClass ? (
          <div className="bg-dark-surface rounded-2xl md:rounded-3xl p-3.5 sm:p-4 md:p-5 text-white border-2 border-brand-blue/30 relative overflow-hidden shadow-blue-glow flex flex-col justify-between">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(139,92,246,0.25),transparent_60%)]"></div>
            <div className="relative z-10">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-1">
                <div>
                  <span className="bg-danger text-white text-[8px] sm:text-[9px] md:text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-widest animate-pulse inline-block">⚔ Boss Battle</span>
                  <h3 className="text-xs sm:text-base md:text-lg font-extrabold mt-0.5 sm:mt-1 italic">Dreadlord Matriks</h3>
                </div>
                <div className="bg-white/10 px-1.5 py-0.5 md:px-2.5 md:py-1 rounded-lg text-[9px] md:text-xs font-mono backdrop-blur-sm border border-white/10 shrink-0">HP 450/500</div>
              </div>
              <div className="mt-1.5 sm:mt-2.5 md:mt-3 flex gap-2 md:gap-3 items-center">
                <img src="/assets/boss-matrices.png" alt="Boss" className="w-9 h-9 sm:w-12 sm:h-12 md:w-16 md:h-16 object-contain animate-float drop-shadow-[0_0_20px_rgba(139,92,246,0.6)]" />
                <div className="flex-1">
                  <p className="text-[9px] sm:text-[10px] md:text-xs text-white/80 italic mb-1 hidden sm:block">"Determinanku tak akan pernah bisa kau pecahkan!"</p>
                  <Link to="/quiz/play" className="inline-block w-full text-center bg-gradient-to-r from-primary to-primary-glow hover:scale-105 active:scale-95 text-white font-extrabold py-1.5 md:py-2 rounded-xl text-[9px] sm:text-[10px] md:text-xs shadow-glow transition-all">
                    MASUKI ARENA
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-card rounded-2xl md:rounded-3xl p-3.5 sm:p-4 md:p-5 border border-border flex flex-col justify-center items-center text-center space-y-1 sm:space-y-1.5">
            <Shield className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-muted-foreground" />
            <h4 className="font-extrabold text-xs sm:text-sm leading-snug">Belum Ada Boss Battle Aktif</h4>
            <p className="text-[9px] sm:text-[10px] md:text-xs text-muted-foreground max-w-xs leading-tight">Owner atau Admin belum menambahkan kuis tantangan boss di kelas ini.</p>
          </div>
        )}
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
          {isDemoClass && (
            <Link to="/materi" className="text-primary text-xs font-bold flex items-center gap-0.5 hover:underline">
              Lihat Semua <ChevronRight className="w-3 h-3" />
            </Link>
          )}
        </div>
        {isDemoClass ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
            <Link to="/materi" className="bg-card border border-border rounded-2xl p-4 flex gap-4 items-center shadow-sm hover:shadow-md hover:border-primary/30 transition-all active:scale-[0.98] block">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500 to-red-600 grid place-items-center text-white font-extrabold text-xs shadow-md shrink-0">PWP</div>
              <div className="flex-1 min-w-0">
                <h4 className="font-extrabold italic truncate">Pwp</h4>
                <p className="text-xs text-muted-foreground truncate">Kewirausahaan &amp; Produk Kreatif</p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
            </Link>
            <Link to="/materi" className="bg-card border border-border rounded-2xl p-4 flex gap-4 items-center shadow-sm hover:shadow-md hover:border-primary/30 transition-all active:scale-[0.98] block">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-600 grid place-items-center text-white font-extrabold text-xs shadow-md shrink-0">PPAN</div>
              <div className="flex-1 min-w-0">
                <h4 className="font-extrabold italic truncate">Ppan</h4>
                <p className="text-xs text-muted-foreground truncate">Pendidikan Pancasila</p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
            </Link>
            <Link to="/materi" className="bg-card border border-border rounded-2xl p-4 flex gap-4 items-center shadow-sm hover:shadow-md hover:border-primary/30 transition-all active:scale-[0.98] block">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 grid place-items-center text-white font-extrabold text-xs shadow-md shrink-0">MTK</div>
              <div className="flex-1 min-w-0">
                <h4 className="font-extrabold italic truncate">Matematika</h4>
                <p className="text-xs text-muted-foreground truncate">Matriks &amp; Determinan</p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
            </Link>
          </div>
        ) : (
          <div className="bg-card rounded-3xl p-8 md:p-10 border border-border flex flex-col items-center justify-center text-center space-y-2 shadow-sm">
            <BookOpen className="w-8 h-8 text-muted-foreground/60" />
            <p className="font-extrabold text-sm text-foreground">Tidak ada pelajaran</p>
            <p className="text-xs text-muted-foreground max-w-xs">Materi pelajaran belum ditambahkan oleh Owner atau Admin di kelas ini.</p>
          </div>
        )}
      </div>

      <PowerUpModal isOpen={isPowerUpOpen} onClose={() => setIsPowerUpOpen(false)} />
    </section>
  );
}
