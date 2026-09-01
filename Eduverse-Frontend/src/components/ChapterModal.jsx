import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { X, ChevronRight } from 'lucide-react';
import { SUBJECTS_DATA } from '../data/quizData';

export default function ChapterModal({ subjectId, onClose }) {
  const navigate = useNavigate();
  const [maxHeightVh, setMaxHeightVh] = useState(55);
  const isDraggingRef = useRef(false);
  const startYRef = useRef(0);
  const startHRef = useRef(55);

  useEffect(() => {
    setMaxHeightVh(55);
    if (subjectId) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';

      return () => {
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [subjectId]);

  if (!subjectId || !SUBJECTS_DATA[subjectId]) return null;

  const subject = SUBJECTS_DATA[subjectId];

  const handleSelectChapter = (examId) => {
    onClose();
    navigate(`/quiz/play?exam=${examId}`);
  };

  const handleTouchStart = (e) => {
    isDraggingRef.current = true;
    startYRef.current = e.touches ? e.touches[0].clientY : e.clientY;
    startHRef.current = maxHeightVh;
  };

  const handleTouchMove = (e) => {
    if (!isDraggingRef.current) return;
    const currentY = e.touches ? e.touches[0].clientY : e.clientY;
    const deltaY = startYRef.current - currentY;
    const deltaVh = (deltaY / window.innerHeight) * 100;
    const newVh = Math.min(88, Math.max(55, startHRef.current + deltaVh));
    setMaxHeightVh(newVh);
  };

  const handleTouchEnd = () => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    if (maxHeightVh >= 71.5) {
      setMaxHeightVh(88);
    } else {
      setMaxHeightVh(55);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[55] flex items-end md:items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in p-0 md:p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        onTouchMove={(e) => e.preventDefault()}
        className="absolute inset-0 touch-none"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-full md:max-w-xl bg-card rounded-t-3xl md:rounded-3xl z-[60] flex flex-col max-h-[88vh] overflow-hidden shadow-2xl border border-border animate-scale-in transition-all duration-300">
        {/* Handle bar (mobile drag to expand) */}
        <div
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleTouchStart}
          className="flex justify-center pt-3 pb-1 shrink-0 md:hidden cursor-grab active:cursor-grabbing touch-none select-none"
        >
          <div className="w-12 h-1.5 rounded-full bg-border hover:bg-muted-foreground/40 transition-colors"></div>
        </div>

        {/* Header */}
        <div className="px-5 py-4 flex items-center justify-between border-b border-border shrink-0">
          <div>
            <h3 className="font-extrabold text-lg">{subject.name}</h3>
            <p className="text-xs text-muted-foreground mt-0.5">{subject.fullName}</p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chapters list */}
        <div
          className="px-5 py-4 space-y-2 overflow-y-auto pb-10 flex-1 transition-all duration-300"
          style={{ maxHeight: `${maxHeightVh}vh` }}
        >
          {subject.chapters.map((ch, i) => (
            <button
              key={ch.id}
              onClick={() => handleSelectChapter(ch.id)}
              className="w-full text-left flex items-center gap-4 p-4 bg-background rounded-2xl border border-border hover:border-primary/30 hover:shadow-sm transition-all active:scale-[0.98] cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-muted grid place-items-center text-xs font-extrabold text-muted-foreground shrink-0">
                {String(i + 1).padStart(2, '0')}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-extrabold text-sm">{ch.label}</p>
                <p className="text-xs text-muted-foreground">{ch.soal || 5} Soal</p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
            </button>
          ))}
        </div>
      </div>
    </div>,
    document.body
  );
}
