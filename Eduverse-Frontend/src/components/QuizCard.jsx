import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export function getQuizCode(title) {
  if (!title) return 'KUIS';
  const cleanTitle = title.trim();
  const lower = cleanTitle.toLowerCase();

  if (lower.includes('laravel')) return 'LAR';
  if (lower.includes('matriks') || lower.includes('matematika')) return 'MTK';
  if (lower.includes('inggris')) return 'ING';
  if (lower.includes('indonesia')) return 'IND';
  if (lower.includes('pancasila')) return 'PPAN';
  if (lower.includes('cloud')) return 'CLOUD';
  if (lower.includes('pwp') || lower.includes('web')) return 'PWP';
  if (lower.includes('pabp')) return 'PABP';

  const words = cleanTitle.split(/\s+/).filter(w => !['&', 'dan', 'yang', 'di', 'pada', 'atau', 'kuis', 'ulangan', 'harian', 'ujian'].includes(w.toLowerCase()));
  if (words.length >= 3) {
    return words.slice(0, 4).map(w => w[0].toUpperCase()).join('');
  } else if (words.length === 2) {
    return (words[0].substring(0, 2) + words[1].substring(0, 2)).toUpperCase();
  } else if (words.length === 1) {
    return words[0].substring(0, 4).toUpperCase();
  }
  return 'KUIS';
}

const GRADIENTS = [
  'from-violet-500 to-purple-600',
  'from-rose-500 to-red-600',
  'from-teal-400 to-emerald-600',
  'from-fuchsia-500 to-purple-700',
  'from-sky-400 to-indigo-500',
  'from-orange-500 to-pink-600',
];

export default function QuizCard({ quiz, classId }) {
  if (!quiz) return null;

  const questionsCount = quiz.questionsCount || quiz.questions?.length || 5;
  const quizCode = quiz.code || getQuizCode(quiz.title);
  
  const charSum = (quiz.title || '').split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const bgGradient = GRADIENTS[charSum % GRADIENTS.length];

  return (
    <Link
      to={`/quiz/play?quizId=${quiz.id}`}
      className="group bg-card border border-border hover:border-primary/50 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all text-left flex items-center justify-between cursor-pointer w-full"
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${bgGradient} flex items-center justify-center text-white font-extrabold text-xs shadow-md shrink-0`}>
          {quizCode}
        </div>
        <div className="min-w-0">
          <h3 className="font-extrabold text-sm text-foreground group-hover:text-primary transition-colors truncate">
            {quiz.title}
          </h3>
          <p className="text-[10px] text-muted-foreground font-medium">
            {questionsCount} Soal • Klik untuk mulai pengerjaan
          </p>
        </div>
      </div>
      <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" />
    </Link>
  );
}
