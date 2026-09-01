import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ChevronRight, Lightbulb, Target, Shield, Snowflake, Calculator, BookOpen, School, ArrowLeft } from 'lucide-react';
import { useAppState } from '../context/AppStateContext';
import PowerUpModal from '../components/PowerUpModal';

const iconMap = {
  calculator: Calculator,
  'book-open': BookOpen,
  target: Target,
};

export default function HomePage() {
  const { classId } = useParams();
  const { appState, completeQuest, getLevelInfo, findClass, getClassXp } = useAppState();
  const [isPowerUpOpen, setIsPowerUpOpen] = useState(false);

  const activeClass = classId && findClass ? findClass(classId) : null;
  const isDemoClass = !classId || classId === 'cls-101' || classId === 'cls-102' || classId === 'cls-103';
  const classXp = isDemoClass ? appState.xp : (getClassXp ? getClassXp(classId) : 0);

  const levelInfo = getLevelInfo(classXp);
  const progressPercent = Math.min(100, Math.max(0, (levelInfo.progress / levelInfo.max) * 100));

  return (
    <section className="px-4 md:px-8 pt-6 space-y-6 animate-fade-in flex flex-col max-w-7xl mx-auto w-full">
      {/* Grid for Hero Card & Boss Battle on larger screens */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        {/* Hero Level Card */}
        <div className="bg-gradient-to-br from-primary via-primary to-primary-glow rounded-3xl p-6 text-primary-foreground shadow-glow relative overflow-hidden flex flex-col justify-between">
          <div className="absolute -right-8 -top-8 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -left-4 -bottom-12 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          <div className="relative z-10">
            <p className="text-primary-foreground/80 text-xs font-bold uppercase tracking-widest">Pangkat Saat Ini</p>
            <h2 className="text-3xl font-extrabold mt-1 italic">
              {levelInfo.level > 10 ? 'Master Akademik' : 'Pemula EduVerse'}
            </h2>
          </div>
          <div className="relative z-10 mt-5">
            <div className="flex justify-between text-xs mb-1.5 font-bold italic">
              <span id="home-level-label">LEVEL {levelInfo.level}</span>
              <span id="home-xp-label" className="tabular-nums">{levelInfo.progress} / {levelInfo.max} XP</span>
            </div>
            <div className="w-full h-3 bg-black/20 rounded-full overflow-hidden">
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
          <div className="bg-dark-surface rounded-3xl p-6 text-white border-2 border-brand-blue/30 relative overflow-hidden shadow-blue-glow flex flex-col justify-between">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(139,92,246,0.25),transparent_60%)]"></div>
            <div className="relative z-10">
              <div className="flex justify-between items-start">
                <div>
                  <span className="bg-danger text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-widest animate-pulse inline-block">⚔ Boss Battle</span>
                  <h3 className="text-xl font-extrabold mt-2 italic">Dreadlord Matriks</h3>
                </div>
                <div className="bg-white/10 px-3 py-1 rounded-lg text-xs font-mono backdrop-blur-sm border border-white/10">HP 450/500</div>
              </div>
              <div className="mt-4 flex gap-4 items-center">
                <img src="/assets/boss-matrices.png" alt="Boss" className="w-20 h-20 md:w-24 md:h-24 object-contain animate-float drop-shadow-[0_0_20px_rgba(139,92,246,0.6)]" />
                <div className="flex-1">
                  <p className="text-xs text-white/80 italic mb-3">"Determinanku tak akan pernah bisa kau pecahkan!"</p>
                  <Link to="/quiz/play" className="inline-block w-full text-center bg-gradient-to-r from-primary to-primary-glow hover:scale-105 active:scale-95 text-white font-extrabold py-2.5 rounded-xl text-xs shadow-glow transition-all">
                    MASUKI ARENA
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-card rounded-3xl p-6 border border-border flex flex-col justify-center items-center text-center space-y-2">
            <Shield className="w-10 h-10 text-muted-foreground" />
            <h4 className="font-extrabold text-sm">Belum Ada Boss Battle Aktif</h4>
            <p className="text-xs text-muted-foreground max-w-xs">Owner atau Admin belum menambahkan kuis tantangan boss di kelas ini.</p>
          </div>
        )}
      </div>

      {/* Daily Quests Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-lg">Misi Harian</h3>
          <span className="text-xs text-muted-foreground font-bold">
            {isDemoClass ? '1/3 Selesai' : '0 Misi'}
          </span>
        </div>

        {isDemoClass ? (
          <div id="quests-container" className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {appState.quests.map(q => {
              const IconComp = iconMap[q.icon] || BookOpen;
              const isDone = q.done;
              const opacClass = isDone ? 'opacity-60' : 'hover:border-primary/30 hover:shadow-md cursor-pointer';
              const xpText = isDone ? '✓' : `+${q.xp} XP`;
              const xpColor = isDone ? 'text-success' : 'text-primary';

              return (
                <div
                  key={q.id}
                  onClick={() => !isDone && completeQuest(q.id)}
                  className={`bg-card p-4 rounded-2xl border border-border shadow-sm flex items-center gap-4 transition-all ${opacClass}`}
                >
                  <div className={`w-12 h-12 rounded-xl ${q.color} flex items-center justify-center shrink-0`}>
                    <IconComp className="w-6 h-6" strokeWidth={2.2} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm">{q.title}</p>
                    <p className="text-xs text-muted-foreground truncate">{q.desc}</p>
                  </div>
                  <span className={`font-extrabold text-sm tabular-nums ${xpColor}`}>{xpText}</span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-card rounded-2xl p-6 border border-border text-center space-y-1">
            <p className="font-bold text-xs">Belum ada misi harian di kelas ini.</p>
            <p className="text-[11px] text-muted-foreground">Misi akan otomatis tampil ketika kuis atau materi baru ditambahkan oleh Owner/Admin.</p>
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
          <Link to="/materi" className="text-primary text-xs font-bold flex items-center gap-0.5 hover:underline">
            Lihat Semua <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
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
      </div>

      <PowerUpModal isOpen={isPowerUpOpen} onClose={() => setIsPowerUpOpen(false)} />
    </section>
  );
}
