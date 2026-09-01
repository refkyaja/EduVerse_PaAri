import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Zap, Clock, Lightbulb, Target, Shield, Snowflake, CheckCircle2, XCircle, RotateCcw, Home, Eye, X, RefreshCcw, ScanSearch, FastForward, Dice6, Package, ChevronRight, ChevronLeft, Check, Square, CheckSquare, Sparkles, Trophy, FileText, AlertTriangle, LayoutGrid } from 'lucide-react';
import { ALL_EXAMS_QUESTIONS, SUBJECTS_DATA } from '../data/quizData';
import { useAppState } from '../context/AppStateContext';

const POWERUPS_DEFINITIONS = [
  { id: 'hint', name: 'Hint', Icon: Lightbulb, color: 'border-warning/40 bg-warning/10 text-warning hover:bg-warning/20' },
  { id: 'fifty', name: '50:50', Icon: Target, color: 'border-brand-blue/40 bg-brand-blue/10 text-brand-blue hover:bg-brand-blue/20' },
  { id: 'shield', name: 'Shield', Icon: Shield, color: 'border-success/40 bg-success/10 text-success hover:bg-success/20' },
  { id: 'freeze', name: 'Freeze', Icon: Snowflake, color: 'border-sky-500/40 bg-sky-500/10 text-sky-500 hover:bg-sky-500/20' },
  { id: 'second-chance', name: '2nd Chance', Icon: RefreshCcw, color: 'border-primary/40 bg-primary/10 text-primary hover:bg-primary/20' },
  { id: 'scanner', name: 'Scanner', Icon: ScanSearch, color: 'border-violet-500/40 bg-violet-500/10 text-violet-500 hover:bg-violet-500/20' },
  { id: 'skip', name: 'Skip', Icon: FastForward, color: 'border-orange-500/40 bg-orange-500/10 text-orange-500 hover:bg-orange-500/20' },
  { id: 'lucky', name: 'Lucky', Icon: Dice6, color: 'border-xp-gold/40 bg-xp-gold/10 text-xp-gold hover:bg-xp-gold/20' },
  { id: 'mystery', name: 'Mystery', Icon: Package, color: 'border-pink-500/40 bg-pink-500/10 text-pink-500 hover:bg-pink-500/20' },
];

const resolveExamMeta = (id) => {
  for (const [key, subj] of Object.entries(SUBJECTS_DATA)) {
    const foundCh = subj.chapters.find(ch => ch.id === id);
    if (foundCh) {
      return {
        subject: subj.name,
        chapter: `${foundCh.label} — ${foundCh.title}`
      };
    }
  }
  return { subject: "PABP", chapter: "Bab 6 — Mari Belajar" };
};

export default function QuizPlayPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { recordExamResult, showToast } = useAppState();

  const examId = searchParams.get('exam') || 'pabp-bab6';
  const questions = ALL_EXAMS_QUESTIONS[examId] || ALL_EXAMS_QUESTIONS['pabp-bab6'];
  const meta = resolveExamMeta(examId);
  const isBossBattle = examId.includes('matriks') || examId.includes('bab1');

  // Quiz phase: 'start' | 'rolling' | 'playing' | 'finished'
  const [quizPhase, setQuizPhase] = useState('start');
  const [unlockedPowerups, setUnlockedPowerups] = useState([]);
  const [rollItems, setRollItems] = useState(['hint', 'fifty', 'shield']);

  // Playing state
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [markedDoubt, setMarkedDoubt] = useState({});
  const [usedPowerups, setUsedPowerups] = useState([]);

  // Active power-up effects for questions
  const [hintShownForQuestion, setHintShownForQuestion] = useState({});
  const [eliminatedOptionsForQuestion, setEliminatedOptionsForQuestion] = useState({});
  const [scannerForQuestion, setScannerForQuestion] = useState({});
  const [secondChanceForQuestion, setSecondChanceForQuestion] = useState({});
  const [skippedQuestions, setSkippedQuestions] = useState({});
  const [mysteryBonusXp, setMysteryBonusXp] = useState(0);

  // Boss HP & Timer
  const [bossHp, setBossHp] = useState(500);

  // Modals
  const [isConfirmExitOpen, setIsConfirmExitOpen] = useState(false);
  const [isReviewOverlayOpen, setIsReviewOverlayOpen] = useState(false);

  useEffect(() => {
    if (isConfirmExitOpen || isReviewOverlayOpen) {
      document.documentElement.classList.add('overflow-hidden');
      document.body.classList.add('overflow-hidden', 'touch-none');
      return () => {
        document.documentElement.classList.remove('overflow-hidden');
        document.body.classList.remove('overflow-hidden', 'touch-none');
      };
    }
  }, [isConfirmExitOpen, isReviewOverlayOpen]);

  const currentQ = questions[currentQuestionIdx] || questions[0];

  // ─── START RAFFLE ANIMATION ────────────────────────────────────
  const startPowerupRaffle = () => {
    setQuizPhase('rolling');
    setUnlockedPowerups([]);

    const powerupIds = POWERUPS_DEFINITIONS.map(p => p.id);
    const raffleInterval = setInterval(() => {
      setRollItems([
        powerupIds[Math.floor(Math.random() * powerupIds.length)],
        powerupIds[Math.floor(Math.random() * powerupIds.length)],
        powerupIds[Math.floor(Math.random() * powerupIds.length)],
      ]);
    }, 80);

    setTimeout(() => {
      clearInterval(raffleInterval);
      const shuffled = [...powerupIds].sort(() => Math.random() - 0.5);
      const chosen = shuffled.slice(0, 3);
      setUnlockedPowerups(chosen);
      setRollItems(chosen);

      setTimeout(() => {
        setQuizPhase('playing');
      }, 1400);
    }, 2200);
  };

  const selectQuizOption = (idx) => {
    setUserAnswers(prev => ({ ...prev, [currentQuestionIdx]: idx }));
    if (isBossBattle && idx === currentQ.correct) {
      setBossHp(hp => Math.max(0, hp - 50));
    }
  };

  const toggleQuizQuestionDoubt = () => {
    setMarkedDoubt(prev => ({ ...prev, [currentQuestionIdx]: !prev[currentQuestionIdx] }));
  };

  const prevQuizQuestion = () => {
    if (currentQuestionIdx > 0) setCurrentQuestionIdx(idx => idx - 1);
  };

  const nextQuizQuestion = () => {
    if (currentQuestionIdx < questions.length - 1) {
      setCurrentQuestionIdx(idx => idx + 1);
    }
  };

  const useActiveQuizPowerup = (powerupId) => {
    if (usedPowerups.includes(powerupId)) return;
    setUsedPowerups(prev => [...prev, powerupId]);

    const q = questions[currentQuestionIdx];

    if (powerupId === 'hint') {
      setHintShownForQuestion(prev => ({ ...prev, [currentQuestionIdx]: true }));
      showToast("Petunjuk ditampilkan!");
    } else if (powerupId === 'fifty') {
      const wrongOpts = q.options
        .map((_, i) => i)
        .filter(i => i !== q.correct)
        .sort(() => Math.random() - 0.5)
        .slice(0, 2);
      setEliminatedOptionsForQuestion(prev => ({ ...prev, [currentQuestionIdx]: wrongOpts }));
      showToast("50:50 diaktifkan! 2 opsi dieliminasi.");
    } else if (powerupId === 'shield') {
      setUserAnswers(prev => ({ ...prev, [currentQuestionIdx]: q.correct }));
      showToast("Perisai melindungi jawabanmu!");
    } else if (powerupId === 'second-chance') {
      setSecondChanceForQuestion(prev => ({ ...prev, [currentQuestionIdx]: true }));
      showToast("Second Chance aktif! Boleh coba lagi.");
    } else if (powerupId === 'scanner') {
      setScannerForQuestion(prev => ({ ...prev, [currentQuestionIdx]: true }));
      showToast("Answer Scanner aktif!");
    } else if (powerupId === 'skip') {
      setSkippedQuestions(prev => ({ ...prev, [currentQuestionIdx]: true }));
      setUserAnswers(prev => ({ ...prev, [currentQuestionIdx]: q.correct }));
      showToast("Soal dilewati tanpa minus!");
      if (currentQuestionIdx < questions.length - 1) {
        setCurrentQuestionIdx(idx => idx + 1);
      }
    } else if (powerupId === 'lucky') {
      setUserAnswers(prev => ({ ...prev, [currentQuestionIdx]: q.correct }));
      showToast("Lucky Guess! Memilih jawaban benar.");
    } else if (powerupId === 'mystery') {
      setMysteryBonusXp(prev => prev + 15);
      showToast("Kotak Misteri! Bonus +15 XP!");
    }
  };

  const submitQuizFinished = () => {
    setIsReviewOverlayOpen(false);
    let correctCount = 0;
    let earnedXp = 0;

    questions.forEach((q, idx) => {
      if (skippedQuestions[idx] || userAnswers[idx] === q.correct) {
        correctCount++;
        earnedXp += 10;
      }
    });

    earnedXp += mysteryBonusXp;
    recordExamResult(earnedXp, correctCount, questions.length);
    setQuizPhase('finished');
  };

  // ─── 1. START INTRO SCREEN ── 100% Reference HTML Port (quiz-play.html lines 586-617) ───
  if (quizPhase === 'start') {
    return (
      <div id="quiz-wrapper" className="min-h-screen w-full bg-background relative flex flex-col overflow-x-hidden">
        <header className="px-4 py-3 flex items-center">
          <button
            onClick={() => navigate('/quiz')}
            className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5 text-foreground" />
          </button>
        </header>

        <main className="flex-1 px-6 flex flex-col justify-center text-center animate-fade-in my-auto">
          <div className="w-40 h-40 mx-auto grid place-items-center">
            <img src="/assets/companion.png" alt="EduQuest" className="w-full h-full object-contain" />
          </div>

          <p className="text-[11px] font-extrabold uppercase tracking-widest text-primary mt-6">
            {meta.subject}
          </p>

          <h1 className="text-3xl font-extrabold italic mt-1 text-balance">
            {meta.chapter}
          </h1>

          <p className="text-sm text-muted-foreground mt-3 max-w-xs mx-auto">
            Saat masuk arena, 3 power-up akan diundi secara acak. Hanya 3 itu yang bisa kamu pakai!
          </p>

          <div className="grid grid-cols-2 gap-2 mt-8 max-w-xs mx-auto w-full">
            <div className="bg-card border border-border rounded-2xl p-3 text-center">
              <p className="text-xl font-extrabold italic tabular-nums">{questions.length}</p>
              <p className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider">SOAL</p>
            </div>
            <div className="bg-card border border-border rounded-2xl p-3 text-center">
              <p className="text-xl font-extrabold italic tabular-nums">3</p>
              <p className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider">POWER</p>
            </div>
          </div>

          <button
            onClick={startPowerupRaffle}
            className="mt-10 w-full max-w-xs mx-auto py-4 rounded-2xl bg-gradient-to-r from-primary to-primary-glow text-primary-foreground font-extrabold shadow-glow active:scale-95 transition-all cursor-pointer"
          >
            Mulai Ujian →
          </button>

          <button
            onClick={() => navigate('/quiz')}
            className="mt-2 text-sm font-bold text-muted-foreground py-3 block w-full text-center hover:text-foreground cursor-pointer"
          >
            Batal
          </button>
        </main>
      </div>
    );
  }

  // ─── 2. ROLLING SLOT MACHINE ANIMATION SCREEN ─────────────────
  if (quizPhase === 'rolling') {
    const isDone = unlockedPowerups.length > 0;
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-dark-surface via-primary to-dark-surface text-primary-foreground flex flex-col items-center justify-center p-6 overflow-hidden relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.15),transparent_60%)]"></div>
        <div className="relative text-center z-10 max-w-md w-full">
          <p className="text-xs font-extrabold uppercase tracking-[0.3em] text-white/70">
            {isDone ? 'Power-up kamu' : 'Mengundi power-up...'}
          </p>
          <h1 className="text-3xl font-extrabold italic mt-2">
            {isDone ? 'Siap Tempur!' : 'Putar Roda Takdir'}
          </h1>
          <div className="flex gap-4 mt-10 justify-center">
            {rollItems.map((id, idx) => {
              const pu = POWERUPS_DEFINITIONS.find(p => p.id === id) || POWERUPS_DEFINITIONS[0];
              const IconComp = pu.Icon;
              return (
                <div
                  key={idx}
                  className={`w-24 h-24 rounded-3xl bg-white/10 backdrop-blur-xl border-2 ${
                    isDone ? 'border-xp-gold shadow-[0_0_30px_rgba(252,211,77,0.6)] animate-scale-in' : 'border-white/30'
                  } flex flex-col items-center justify-center gap-1.5 transition-all`}
                >
                  <IconComp className="w-8 h-8 text-white" strokeWidth={2.4} />
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-white">{pu.name}</span>
                </div>
              );
            })}
          </div>
          {isDone && <p className="text-sm text-white/80 mt-10 animate-fade-in">Memasuki arena...</p>}
        </div>
      </div>
    );
  }

  // ─── 3. PLAYING QUESTION ARENA PHASE ───────────────────────────
  if (quizPhase === 'playing') {
    const isDoubt = markedDoubt[currentQuestionIdx];
    const isHintShown = hintShownForQuestion[currentQuestionIdx];
    const isScanned = scannerForQuestion[currentQuestionIdx];
    const hasSecondChance = secondChanceForQuestion[currentQuestionIdx];
    const isSkipped = skippedQuestions[currentQuestionIdx];
    const elim = eliminatedOptionsForQuestion[currentQuestionIdx] || [];
    const progressPercent = ((currentQuestionIdx + 1) / questions.length) * 100;
    const answeredCount = Object.keys(userAnswers).length;

    return (
      <div id="quiz-wrapper" className="min-h-screen w-full bg-background relative flex flex-col justify-between max-w-4xl mx-auto p-4 md:py-8 space-y-4">
        {/* Header Bar */}
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={() => setIsConfirmExitOpen(true)}
            className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center hover:border-primary/40 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>

          {/* Progress Bar */}
          <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-primary-glow transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <button
            onClick={() => setIsReviewOverlayOpen(true)}
            className="bg-card border border-border/80 hover:border-primary/30 transition-all rounded-full px-3 py-1.5 flex items-center gap-2 shadow-sm cursor-pointer"
          >
            <LayoutGrid className="w-4 h-4 text-foreground" />
            <span className="text-xs font-bold font-mono leading-none">{currentQuestionIdx + 1}/{questions.length}</span>
          </button>
        </div>

        {/* Boss HP Bar if Boss Battle */}
        {isBossBattle && (
          <div className="bg-dark-surface border border-brand-blue/30 rounded-2xl p-3 text-white flex items-center justify-between gap-3 shadow-blue-glow">
            <div className="flex items-center gap-2">
              <img src="/assets/boss-matrices.png" alt="Boss" className="w-10 h-10 object-contain animate-float" />
              <div>
                <p className="text-xs font-extrabold text-danger uppercase tracking-wider">Boss Battle</p>
                <p className="text-sm font-extrabold italic">Dreadlord Matriks</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-24 h-2 bg-black/40 rounded-full overflow-hidden">
                <div className="h-full bg-danger rounded-full transition-all duration-300" style={{ width: `${(bossHp / 500) * 100}%` }}></div>
              </div>
              <span className="text-xs font-mono font-bold">{bossHp}/500</span>
            </div>
          </div>
        )}

        {/* Main Question Box */}
        <div className="bg-card border border-border rounded-3xl p-5 md:p-8 shadow-sm space-y-5 flex-1 flex flex-col justify-between">
          <div className="space-y-4">
            {/* Active Status Badges */}
            <div className="flex items-center gap-2 flex-wrap">
              {isScanned && <span className="px-2.5 py-1 bg-violet-500/10 text-violet-500 rounded-full text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1"><ScanSearch className="w-3 h-3" /> Scanned</span>}
              {hasSecondChance && <span className="px-2.5 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1"><RefreshCcw className="w-3 h-3" /> 2nd Chance</span>}
              {isSkipped && <span className="px-2.5 py-1 bg-orange-500/10 text-orange-500 rounded-full text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1"><FastForward className="w-3 h-3" /> Skipped</span>}
            </div>

            <h3 className="font-extrabold text-base md:text-lg leading-relaxed whitespace-pre-wrap text-foreground">
              {currentQ.q}
            </h3>

            {/* Hint Box */}
            {isHintShown && currentQ.hint && (
              <div className="bg-warning/10 border border-warning/30 rounded-2xl p-4 flex items-start gap-3 animate-fade-in">
                <Lightbulb className="w-5 h-5 text-warning shrink-0 mt-0.5" />
                <p className="text-xs md:text-sm text-foreground/90 font-medium">{currentQ.hint}</p>
              </div>
            )}

            {/* Scanner Box */}
            {isScanned && (
              <div className="bg-violet-500/10 border border-violet-500/30 rounded-2xl p-4 flex items-start gap-3 animate-fade-in">
                <ScanSearch className="w-5 h-5 text-violet-500 shrink-0 mt-0.5" />
                <p className="text-xs md:text-sm text-foreground/90 font-medium">
                  Kemungkinan jawaban: <span className="font-extrabold">{String.fromCharCode(65 + currentQ.correct)}. {currentQ.options[currentQ.correct]}</span>
                </p>
              </div>
            )}

            {/* Options List */}
            <div className="space-y-3 pt-2">
              {currentQ.options.map((opt, idx) => {
                const removed = elim.includes(idx);
                const selected = userAnswers[currentQuestionIdx] === idx;
                const disabled = removed || isSkipped;

                let btnClass = "bg-card border-border hover:border-primary/40";
                let badgeClass = "bg-muted text-muted-foreground";
                let textClass = "";

                if (removed) {
                  btnClass = "opacity-30 line-through bg-muted border-border cursor-not-allowed";
                } else if (selected) {
                  btnClass = "border-primary bg-primary/5 shadow-glow";
                  badgeClass = "bg-primary text-primary-foreground";
                  textClass = "text-primary font-bold";
                }

                return (
                  <button
                    key={idx}
                    disabled={disabled}
                    onClick={() => selectQuizOption(idx)}
                    className={`w-full p-4 text-left rounded-2xl border-2 transition-all flex items-center gap-3 cursor-pointer ${btnClass}`}
                  >
                    <span className={`w-8 h-8 rounded-lg grid place-items-center text-xs font-extrabold shrink-0 ${badgeClass}`}>
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className={`text-sm md:text-base leading-snug ${textClass}`}>{opt}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Footer: Power-Ups Dock & Navigation Controls */}
          <div className="mt-8 space-y-4 w-full">
            {/* Unlocked Power-Ups Dock */}
            <div className="space-y-2">
              <p className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest">Power-Up</p>
              <div className="flex gap-2.5 overflow-x-auto pb-1">
                {POWERUPS_DEFINITIONS.filter(pu => unlockedPowerups.includes(pu.id)).map(pu => {
                  const used = usedPowerups.includes(pu.id);
                  const IconComp = pu.Icon;
                  return (
                    <button
                      key={pu.id}
                      disabled={used}
                      onClick={() => useActiveQuizPowerup(pu.id)}
                      className={`relative shrink-0 w-16 h-16 rounded-2xl border-2 flex flex-col items-center justify-center gap-1 transition-all ${pu.color} ${
                        used ? 'opacity-20 grayscale cursor-not-allowed' : 'active:scale-90 cursor-pointer'
                      }`}
                    >
                      <IconComp className="w-5 h-5" strokeWidth={2.4} />
                      <span className="text-[9px] font-extrabold uppercase">{pu.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Navigation Row: [Prev] [Ragu-ragu] [Selanjutnya / Selesai] */}
            <div className="flex gap-3 pt-2 items-center">
              <button
                disabled={currentQuestionIdx === 0}
                onClick={prevQuizQuestion}
                className="w-12 h-12 rounded-2xl bg-card border border-border text-foreground flex items-center justify-center shrink-0 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all hover:border-primary/20 cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                onClick={toggleQuizQuestionDoubt}
                className="flex-1 h-12 rounded-2xl border-2 border-warning bg-card text-warning flex items-center justify-center gap-2 font-bold text-xs active:scale-95 transition-all shadow-sm cursor-pointer"
              >
                {isDoubt ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
                Ragu-ragu
              </button>

              {currentQuestionIdx === questions.length - 1 ? (
                <button
                  onClick={submitQuizFinished}
                  className="flex-1 h-12 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center gap-1.5 font-bold text-xs active:scale-95 transition-all shadow-glow shadow-emerald-500/20 cursor-pointer"
                >
                  Selesai <ChevronRight className="w-4 h-4 text-white" />
                </button>
              ) : (
                <button
                  onClick={nextQuizQuestion}
                  className="flex-1 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/60 flex items-center justify-center gap-1.5 font-bold text-xs active:scale-95 transition-all hover:bg-emerald-200/80 cursor-pointer"
                >
                  Selanjutnya <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Review Grid Overlay Modal */}
        {isReviewOverlayOpen && createPortal(
          <div className="fixed inset-0 z-[55] flex items-end md:items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in p-0 md:p-4">
            <div onClick={() => setIsReviewOverlayOpen(false)} className="absolute inset-0" />
            <div className="relative w-full max-w-full md:max-w-xl bg-card rounded-t-3xl md:rounded-3xl z-[60] flex flex-col max-h-[85vh] overflow-hidden shadow-2xl border border-border animate-scale-in text-left">
              <div className="px-5 py-4 flex items-center justify-between border-b border-border shrink-0">
                <h2 className="font-extrabold text-lg">Navigasi Soal</h2>
                <button onClick={() => setIsReviewOverlayOpen(false)} className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="px-5 py-4 space-y-4 overflow-y-auto flex-1">
                <div className="grid grid-cols-5 gap-2.5">
                  {questions.map((_, idx) => {
                    const hasAns = userAnswers[idx] !== undefined;
                    const isDbt = markedDoubt[idx];
                    let btnClass = isDbt
                      ? "bg-warning/20 border-warning text-warning"
                      : hasAns
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-card border-border text-muted-foreground";

                    return (
                      <button
                        key={idx}
                        onClick={() => {
                          setCurrentQuestionIdx(idx);
                          setIsReviewOverlayOpen(false);
                        }}
                        className={`aspect-square rounded-xl font-extrabold text-sm border-2 transition-all grid place-items-center cursor-pointer ${btnClass}`}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>
                <div className="space-y-2 text-xs text-muted-foreground pt-2">
                  <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-primary"></div><span>Dijawab</span></div>
                  <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-warning"></div><span>Ragu-ragu</span></div>
                  <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-card border border-border"></div><span>Belum dijawab</span></div>
                </div>
                <p className="text-center text-sm text-muted-foreground pt-2">
                  Sudah menjawab <span className="font-extrabold text-foreground">{answeredCount}/{questions.length}</span> soal
                </p>
                <button
                  onClick={submitQuizFinished}
                  className="w-full py-4 rounded-2xl bg-primary text-primary-foreground font-extrabold text-sm shadow-glow active:scale-95 hover:scale-[1.01] transition-all cursor-pointer"
                >
                  Kumpulkan Ujian
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

        {/* Confirm Exit Modal */}
        {isConfirmExitOpen && createPortal(
          <div className="fixed inset-0 z-[55] flex items-end md:items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in p-0 md:p-4">
            <div onClick={() => setIsConfirmExitOpen(false)} className="absolute inset-0" />
            <div className="relative w-full max-w-full md:max-w-md bg-card rounded-t-3xl md:rounded-3xl z-[60] p-6 space-y-4 text-center border border-border shadow-2xl animate-scale-in">
              <div className="w-12 h-12 rounded-full bg-danger/10 text-danger flex items-center justify-center mx-auto">
                <AlertTriangle className="w-6 h-6 text-danger" />
              </div>
              <div>
                <h3 className="font-extrabold text-lg">Keluar Ujian?</h3>
                <p className="text-xs text-muted-foreground mt-1">Progres ujian ini tidak akan disimpan.</p>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setIsConfirmExitOpen(false)}
                  className="flex-1 py-3.5 rounded-2xl bg-card border border-border font-bold text-sm hover:bg-muted transition-all cursor-pointer"
                >
                  Batal
                </button>
                <button
                  onClick={() => navigate('/quiz')}
                  className="flex-1 py-3.5 rounded-2xl bg-danger text-white font-extrabold text-sm shadow-lg cursor-pointer"
                >
                  Ya, Keluar
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
      </div>
    );
  }

  // ─── 4. FINISHED & PEMBAHASAN SOAL PHASE ───────────────────────
  let correctCount = 0;
  let earnedXp = 0;
  questions.forEach((q, idx) => {
    if (skippedQuestions[idx] || userAnswers[idx] === q.correct) {
      correctCount++;
      earnedXp += 10;
    }
  });
  const wrongCount = questions.length - correctCount;
  const accuracy = Math.round((correctCount / questions.length) * 100);
  earnedXp += mysteryBonusXp;

  const labelLetters = ['A', 'B', 'C', 'D', 'E'];

  return (
    <div className="px-4 md:px-8 py-6 space-y-6 max-w-7xl mx-auto w-full animate-fade-in">
      {/* Result Header Banner */}
      <div className="bg-gradient-to-br from-primary via-primary to-primary-glow rounded-3xl p-6 md:p-8 text-primary-foreground shadow-glow relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(255,255,255,0.2),transparent_60%)]"></div>
        <div className="relative flex flex-col md:flex-row items-center gap-5">
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl md:rounded-3xl bg-white/15 backdrop-blur-md border border-white/25 flex items-center justify-center p-2.5 shrink-0 shadow-sm">
            <img src="/assets/companion.png" alt="EduQuest" className="w-full h-full object-contain drop-shadow-md" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold italic">
              {accuracy >= 80 ? 'Hebat Sekali! 🎉' : accuracy >= 50 ? 'Bagus! Tetap Semangat! 👍' : 'Selesai! Terus Berlatih! 💪'}
            </h1>
            <p className="text-xs md:text-sm text-primary-foreground/90 mt-1">Kamu telah menyelesaikan ulangan harian ini dengan hasil tercatat.</p>
          </div>
        </div>

        <div className="relative shrink-0 flex gap-2">
          <button
            onClick={() => setQuizPhase('start')}
            className="px-5 py-3 bg-white text-primary font-extrabold text-xs md:text-sm rounded-2xl shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            Main Lagi
          </button>
          <button
            onClick={() => navigate('/quiz')}
            className="px-5 py-3 bg-white/20 backdrop-blur-md text-white font-extrabold text-xs md:text-sm rounded-2xl border border-white/40 hover:bg-white/30 active:scale-95 transition-all cursor-pointer"
          >
            Pilih Ujian
          </button>
        </div>
      </div>

      {/* Desktop 2-Column Result Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* Left Column: Score Stats Card */}
        <div className="md:col-span-5 lg:col-span-4 space-y-5 md:sticky md:top-6">
          <div className="bg-card border border-border rounded-3xl p-6 shadow-sm space-y-6 text-center">
            {/* Accuracy Circle Display */}
            <div className="relative inline-flex flex-col items-center justify-center">
              <div className={`w-32 h-32 rounded-full border-8 ${
                accuracy >= 80 ? 'border-emerald-500 bg-emerald-500/10' : accuracy >= 50 ? 'border-amber-500 bg-amber-500/10' : 'border-danger bg-danger/10'
              } flex flex-col items-center justify-center shadow-inner`}>
                <span className={`text-3xl font-extrabold italic tabular-nums ${
                  accuracy >= 80 ? 'text-emerald-500' : accuracy >= 50 ? 'text-amber-500' : 'text-danger'
                }`}>{accuracy}%</span>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">Akurasi</span>
              </div>
            </div>

            {/* 3 Stats Cards */}
            <div className="grid grid-cols-3 gap-2 pt-2">
              <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 rounded-2xl p-3 text-center">
                <p className="text-xl font-extrabold italic tabular-nums text-emerald-600 dark:text-emerald-400">{correctCount}</p>
                <p className="text-[9px] font-extrabold text-emerald-600/80 dark:text-emerald-400/80 uppercase tracking-wider mt-0.5">Benar</p>
              </div>
              <div className="bg-danger/5 border border-danger/20 rounded-2xl p-3 text-center">
                <p className="text-xl font-extrabold italic tabular-nums text-danger">{wrongCount}</p>
                <p className="text-[9px] font-extrabold text-danger/80 uppercase tracking-wider mt-0.5">Salah</p>
              </div>
              <div className="bg-xp-gold/10 border border-xp-gold/30 rounded-2xl p-3 text-center">
                <p className="text-xl font-extrabold italic tabular-nums text-xp-gold">+{earnedXp}</p>
                <p className="text-[9px] font-extrabold text-xp-gold/80 uppercase tracking-wider mt-0.5">XP</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-2 pt-2">
              <button
                onClick={() => setQuizPhase('start')}
                className="w-full py-3 bg-primary text-primary-foreground font-extrabold text-xs rounded-2xl shadow-glow block text-center active:scale-95 transition-all cursor-pointer"
              >
                Ulangi Ujian Ini
              </button>
              <button
                onClick={() => navigate('/leaderboard')}
                className="w-full py-3 bg-muted hover:bg-muted/80 text-foreground font-extrabold text-xs rounded-2xl block text-center transition-all cursor-pointer"
              >
                Cek Peringkat Leaderboard 🏆
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Pembahasan Soal */}
        <div className="md:col-span-7 lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="font-extrabold text-base flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary" />
              <span>Pembahasan Soal ({questions.length} Soal)</span>
            </h3>
            <span className="text-xs font-bold text-muted-foreground">Kunci &amp; Penjelasan</span>
          </div>

          <div className="space-y-4">
            {questions.map((q, idx) => {
              const userAns = userAnswers[idx];
              const isCorrect = userAns === q.correct || skippedQuestions[idx];

              return (
                <div key={idx} className={`bg-card border border-border rounded-2xl p-5 space-y-3.5 shadow-sm transition-all hover:border-primary/30 ${
                  !isCorrect && userAns !== undefined ? 'border-danger/40 bg-danger/5' : ''
                }`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2.5">
                      <span className={`w-7 h-7 rounded-xl ${isCorrect ? 'bg-emerald-500 text-white' : 'bg-danger text-white'} grid place-items-center text-xs font-extrabold shrink-0 mt-0.5 shadow-sm`}>
                        {isCorrect ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                      </span>
                      <div>
                        <span className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest">Soal #{idx + 1}</span>
                        <h4 className="text-sm font-extrabold leading-snug text-foreground mt-0.5">{q.q}</h4>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5 pt-1">
                    {q.options.map((opt, oi) => {
                      const isUserAnswer = userAns === oi;
                      const isCorrectAnswer = q.correct === oi;
                      let optClass = 'bg-background border-border text-muted-foreground';
                      if (isCorrectAnswer) optClass = 'bg-emerald-500/10 border-emerald-500/50 text-emerald-600 dark:text-emerald-400 font-bold shadow-sm';
                      else if (isUserAnswer && !isCorrect) optClass = 'bg-danger/10 border-danger/50 text-danger font-bold';

                      return (
                        <div key={oi} className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl border text-xs ${optClass}`}>
                          <span className="w-5 h-5 rounded-md bg-muted grid place-items-center text-[10px] font-extrabold shrink-0">{labelLetters[oi]}</span>
                          <span className="flex-1">{opt}</span>
                          {isCorrectAnswer && <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500 text-white flex items-center gap-1"><Check className="w-3 h-3" /> Benar</span>}
                          {isUserAnswer && !isCorrect && <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-danger text-white flex items-center gap-1"><X className="w-3 h-3" /> Pilihanmu</span>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
