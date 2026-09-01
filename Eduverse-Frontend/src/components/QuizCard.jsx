import React from 'react';
import { Link } from 'react-router-dom';
import { Swords, Clock, HelpCircle, Play, CheckCircle2 } from 'lucide-react';

export default function QuizCard({ quiz, classId }) {
  if (!quiz) return null;

  return (
    <div className="bg-card border border-border rounded-3xl p-5 shadow-sm hover:shadow-md hover:border-primary/40 transition-all flex flex-col justify-between group space-y-4">
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-primary bg-primary/10 px-2.5 py-0.5 rounded-full">
            Kuis
          </span>
          <span className="text-[10px] font-bold text-muted-foreground bg-muted px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <Clock className="w-3 h-3 text-warning" /> {quiz.timeLimit || 30} Menit
          </span>
        </div>

        <div>
          <h3 className="font-extrabold text-base md:text-lg italic text-foreground group-hover:text-primary transition-colors">
            {quiz.title}
          </h3>
          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-3 font-semibold">
            <span className="flex items-center gap-1"><HelpCircle className="w-3.5 h-3.5 text-primary" /> {quiz.questionsCount || quiz.questions?.length || 5} Soal</span>
            <span>•</span>
            <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-success" /> {quiz.attemptsCount || 1}x Dikerjakan</span>
          </p>
        </div>
      </div>

      <div className="pt-3 border-t border-border/60">
        <Link
          to={`/class/${classId || quiz.classId}/quiz/${quiz.id}`}
          className="w-full bg-gradient-to-r from-primary to-primary-glow text-primary-foreground font-extrabold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm hover:shadow-glow active:scale-95 transition-all block text-center"
        >
          <Play className="w-4 h-4 fill-current" /> Mulai Kerjakan Kuis
        </Link>
      </div>
    </div>
  );
}
