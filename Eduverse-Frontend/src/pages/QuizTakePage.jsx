import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Zap, Clock, Lightbulb, Target, Shield, Snowflake, CheckCircle2, XCircle, RotateCcw, Home, Eye, X } from 'lucide-react';
import { useAppState } from '../context/AppStateContext';

export default function QuizTakePage({ quizzes, onCompleteQuiz }) {
  const { classId, quizId } = useParams();
  const navigate = useNavigate();
  const { recordExamResult, showToast } = useAppState();

  const quiz = quizzes?.find(q => q.id === quizId) || quizzes?.[0] || {
    id: 'quiz-1',
    title: 'Kuis Evaluasi Pembelajaran',
    questions: [
      { q: "Apa fungsi utama arsitektur Model pada Laravel?", options: ["Mengelola logika tampilan", "Mengelola komunikasi data & database", "Mengelola rute HTTP", "Mengelola styling CSS"], correct: 1, hint: "Model berhubungan erat dengan Eloquent dan Database." },
      { q: "Perintah Artisan untuk membuat migration adalah...", options: ["make:model", "make:migration", "db:seed", "route:list"], correct: 1, hint: "Gunakan kata 'migration'." }
    ]
  };

  const questions = quiz.questions || [];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(1);
  const [lives, setLives] = useState(3);
  const [timer, setTimer] = useState(30);

  // Power-up states
  const [hintVisible, setHintVisible] = useState(false);
  const [disabledOptions, setDisabledOptions] = useState([]);
  const [shieldActive, setShieldActive] = useState(false);

  // History & Modals
  const [userAnswers, setUserAnswers] = useState([]);
  const [isFinished, setIsFinished] = useState(false);
  const [isConfirmExitOpen, setIsConfirmExitOpen] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);

  const currentQ = questions[currentIndex] || questions[0];

  useEffect(() => {
    if (isFinished || isAnswered) return;
    const interval = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          handleTimeOut();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [currentIndex, isAnswered, isFinished]);

  const handleTimeOut = () => {
    setIsAnswered(true);
    setCombo(1);
    if (!shieldActive) {
      setLives(l => Math.max(0, l - 1));
    } else {
      setShieldActive(false);
    }
    showToast("Waktu habis!");
    setUserAnswers(prev => [...prev, {
      questionIndex: currentIndex,
      selected: null,
      correct: currentQ.correct,
      isCorrect: false
    }]);
  };

  const handleSelectOption = (idx) => {
    if (isAnswered || disabledOptions.includes(idx)) return;
    setSelectedOption(idx);
  };

  const handleCheckAnswer = () => {
    if (selectedOption === null || isAnswered) return;

    setIsAnswered(true);
    const isCorrect = selectedOption === currentQ.correct;

    if (isCorrect) {
      const addedXp = 25 * combo;
      setScore(s => s + addedXp);
      setCombo(c => c + 1);
      showToast(`Benar! +${addedXp} XP`);
      setUserAnswers(prev => [...prev, {
        questionIndex: currentIndex,
        selected: selectedOption,
        correct: currentQ.correct,
        isCorrect: true
      }]);
    } else {
      setCombo(1);
      if (shieldActive) {
        setShieldActive(false);
        showToast("Perisai melindungi nyawamu!");
      } else {
        setLives(l => {
          const nextL = Math.max(0, l - 1);
          if (nextL === 0) {
            setTimeout(() => finishQuiz(score, userAnswers.length), 800);
          }
          return nextL;
        });
        showToast("Jawaban Salah!");
      }
      setUserAnswers(prev => [...prev, {
        questionIndex: currentIndex,
        selected: selectedOption,
        correct: currentQ.correct,
        isCorrect: false
      }]);
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex + 1 < questions.length && lives > 0) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setTimer(30);
      setHintVisible(false);
      setDisabledOptions([]);
    } else {
      finishQuiz(score, userAnswers.length);
    }
  };

  const finishQuiz = (finalScore) => {
    setIsFinished(true);
    const correctCount = userAnswers.filter(a => a.isCorrect).length;
    recordExamResult(finalScore, correctCount, questions.length);
    if (onCompleteQuiz) {
      onCompleteQuiz(quiz.id, finalScore);
    }
  };

  if (isFinished) {
    const correctCount = userAnswers.filter(a => a.isCorrect).length;
    const accuracy = userAnswers.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0;

    return (
      <div className="min-h-screen bg-background p-6 flex flex-col justify-between text-center animate-fade-in max-w-xl mx-auto">
        <div className="space-y-6 mt-8">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-primary-glow mx-auto flex items-center justify-center shadow-glow animate-pulse-glow">
            <Zap className="w-12 h-12 text-xp-gold fill-xp-gold" />
          </div>
          <div>
            <h2 className="text-3xl font-extrabold italic">Kuis Selesai!</h2>
            <p className="text-sm text-muted-foreground mt-1">{quiz.title}</p>
          </div>

          <div className="bg-card border border-border rounded-3xl p-6 shadow-sm space-y-4">
            <div className="grid grid-cols-3 gap-2">
              <div className="p-3 bg-muted/40 rounded-2xl">
                <p className="text-xl font-extrabold text-primary tabular-nums">+{score}</p>
                <p className="text-[10px] font-bold text-muted-foreground uppercase">XP Diperoleh</p>
              </div>
              <div className="p-3 bg-muted/40 rounded-2xl">
                <p className="text-xl font-extrabold text-success tabular-nums">{correctCount}/{questions.length}</p>
                <p className="text-[10px] font-bold text-muted-foreground uppercase">Benar</p>
              </div>
              <div className="p-3 bg-muted/40 rounded-2xl">
                <p className="text-xl font-extrabold text-warning tabular-nums">{accuracy}%</p>
                <p className="text-[10px] font-bold text-muted-foreground uppercase">Akurasi</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3 mt-8 pb-6">
          <button
            onClick={() => setIsReviewOpen(true)}
            className="w-full bg-card border border-border text-foreground font-bold py-3.5 rounded-2xl text-sm flex items-center justify-center gap-2 hover:border-primary/40 transition-colors"
          >
            <Eye className="w-4 h-4 text-primary" /> Review Jawaban
          </button>
          <button
            onClick={() => navigate(`/class/${classId || quiz.classId}/kuis`)}
            className="w-full bg-primary text-primary-foreground font-extrabold py-3.5 rounded-2xl text-sm shadow-glow flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" /> Kembali ke Kuis Kelas
          </button>
        </div>
      </div>
    );
  }

  const progressPercent = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 flex flex-col justify-between max-w-2xl mx-auto space-y-4 animate-fade-in">
      {/* Quiz Topbar */}
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={() => setIsConfirmExitOpen(true)}
          className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center hover:border-primary/40 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-muted-foreground" />
        </button>
        <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-primary-glow transition-all duration-300 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="flex items-center gap-1">
          {[1, 2, 3].map(h => (
            <Heart
              key={h}
              className={`w-5 h-5 ${h <= lives ? 'text-danger fill-danger' : 'text-muted-foreground/30'}`}
            />
          ))}
        </div>
      </div>

      {/* Sub Header */}
      <div className="flex items-center justify-between text-xs font-bold">
        <div className="flex items-center gap-1 bg-primary/10 text-primary px-3 py-1 rounded-full">
          <Zap className="w-3.5 h-3.5 fill-primary" />
          <span>Combo x{combo}</span>
        </div>
        <div className={`flex items-center gap-1 px-3 py-1 rounded-full ${timer <= 5 ? 'bg-danger/10 text-danger animate-pulse' : 'bg-muted text-muted-foreground'}`}>
          <Clock className="w-3.5 h-3.5" />
          <span className="font-mono">{timer}s</span>
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-card border border-border rounded-3xl p-6 shadow-sm space-y-5 flex-1 flex flex-col justify-between">
        <div className="space-y-4">
          <div className="flex justify-between items-center text-xs font-extrabold text-muted-foreground">
            <span>Soal {currentIndex + 1} dari {questions.length}</span>
            <span className="text-xp-gold font-bold">+{25 * combo} XP</span>
          </div>

          <h3 className="font-extrabold text-base md:text-lg leading-relaxed whitespace-pre-wrap">
            {currentQ.q}
          </h3>

          {hintVisible && currentQ.hint && (
            <div className="bg-warning/10 border border-warning/30 rounded-2xl p-4 flex items-start gap-2.5 animate-scale-in">
              <Lightbulb className="w-4 h-4 text-warning shrink-0 mt-0.5" />
              <p className="text-xs text-foreground/90 font-medium">{currentQ.hint}</p>
            </div>
          )}

          <div className="space-y-3 pt-2">
            {currentQ.options.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              let optionStyle = "bg-background border-border text-foreground hover:border-primary/40";

              if (isAnswered) {
                if (idx === currentQ.correct) {
                  optionStyle = "bg-success/15 border-2 border-success text-success font-extrabold";
                } else if (isSelected) {
                  optionStyle = "bg-danger/15 border-2 border-danger text-danger font-extrabold";
                } else {
                  optionStyle = "bg-background border-border opacity-50";
                }
              } else if (isSelected) {
                optionStyle = "bg-primary/10 border-2 border-primary text-primary font-bold";
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={isAnswered}
                  className={`w-full text-left p-4 rounded-2xl border transition-all text-sm flex items-center justify-between cursor-pointer ${optionStyle}`}
                >
                  <span className="leading-snug">{opt}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="pt-4">
          {!isAnswered ? (
            <button
              onClick={handleCheckAnswer}
              disabled={selectedOption === null}
              className={`w-full py-3.5 rounded-2xl font-extrabold text-sm shadow-md transition-all ${
                selectedOption !== null
                  ? 'bg-gradient-to-r from-primary to-primary-glow text-white shadow-glow active:scale-95 cursor-pointer'
                  : 'bg-muted text-muted-foreground cursor-not-allowed'
              }`}
            >
              PERIKSA JAWABAN
            </button>
          ) : (
            <button
              onClick={handleNextQuestion}
              className="w-full py-3.5 bg-gradient-to-r from-primary to-primary-glow text-white font-extrabold text-sm rounded-2xl shadow-glow active:scale-95 transition-all cursor-pointer"
            >
              {currentIndex + 1 < questions.length ? 'SOAL BERIKUTNYA' : 'LIHAT HASIL'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
