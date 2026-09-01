import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, Lightbulb, Target, Shield, RefreshCcw, ScanSearch, FastForward, Dice6, Package } from 'lucide-react';

export default function PowerUpModal({ isOpen, onClose }) {
  const [maxHeightVh, setMaxHeightVh] = useState(55);
  const handleRef = useRef(null);

  useEffect(() => {
    setMaxHeightVh(55);
    if (isOpen) {
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
  }, [isOpen]);

  useEffect(() => {
    const handleEl = handleRef.current;
    if (!handleEl) return;

    let dragging = false;
    let startY = 0;
    let startH = maxHeightVh;

    const onTouchStart = (e) => {
      dragging = true;
      startY = e.touches ? e.touches[0].clientY : e.clientY;
      startH = maxHeightVh;
    };

    const onTouchMove = (e) => {
      if (!dragging) return;
      if (e.cancelable) e.preventDefault();
      const currentY = e.touches ? e.touches[0].clientY : e.clientY;
      const deltaY = startY - currentY;
      const deltaVh = (deltaY / window.innerHeight) * 100;
      const newVh = Math.min(88, Math.max(55, startH + deltaVh));
      setMaxHeightVh(newVh);
    };

    const onTouchEnd = () => {
      if (!dragging) return;
      dragging = false;
      setMaxHeightVh(prev => (prev >= 71.5 ? 88 : 55));
    };

    handleEl.addEventListener('touchstart', onTouchStart, { passive: false });
    handleEl.addEventListener('touchmove', onTouchMove, { passive: false });
    handleEl.addEventListener('touchend', onTouchEnd);
    handleEl.addEventListener('mousedown', onTouchStart);
    window.addEventListener('mousemove', onTouchMove);
    window.addEventListener('mouseup', onTouchEnd);

    return () => {
      handleEl.removeEventListener('touchstart', onTouchStart);
      handleEl.removeEventListener('touchmove', onTouchMove);
      handleEl.removeEventListener('touchend', onTouchEnd);
      handleEl.removeEventListener('mousedown', onTouchStart);
      window.removeEventListener('mousemove', onTouchMove);
      window.removeEventListener('mouseup', onTouchEnd);
    };
  }, [isOpen, maxHeightVh]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[55] flex items-end md:items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in p-0 md:p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        onTouchMove={(e) => e.preventDefault()}
        className="absolute inset-0 touch-none"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-full md:max-w-xl bg-card rounded-t-3xl md:rounded-3xl z-[60] flex flex-col max-h-[88vh] overflow-hidden shadow-2xl border border-border animate-slide-up-bottom md:animate-scale-in transition-all duration-300">
        {/* Handle bar (mobile drag to expand) */}
        <div
          ref={handleRef}
          className="flex justify-center pt-3.5 pb-2 shrink-0 md:hidden cursor-grab active:cursor-grabbing touch-none select-none"
        >
          <div className="w-12 h-1.5 rounded-full bg-border hover:bg-muted-foreground/40 transition-colors"></div>
        </div>

        {/* Header */}
        <div className="px-5 py-4 flex items-center justify-between border-b border-border shrink-0">
          <div>
            <h3 className="font-extrabold text-lg">Power Up</h3>
            <p className="text-xs text-muted-foreground mt-0.5">3 power-up diundi acak tiap ujian</p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Power-up list */}
        <div
          className="px-5 py-4 space-y-3 overflow-y-auto flex-1 transition-all duration-300"
          style={{ maxHeight: `${maxHeightVh}vh` }}
        >
          <div className="bg-background rounded-2xl border border-border p-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-warning/15 grid place-items-center shrink-0">
                <Lightbulb className="w-5 h-5 text-warning" strokeWidth={2.5} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="font-extrabold text-sm">Hint</p>
                  <span className="text-[10px] font-bold text-warning bg-warning/10 px-2 py-0.5 rounded-full">3 / sesi</span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">Menampilkan petunjuk soal. Diacak setiap ujian.</p>
              </div>
            </div>
          </div>

          <div className="bg-background rounded-2xl border border-border p-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-brand-blue/15 grid place-items-center shrink-0">
                <Target className="w-5 h-5 text-brand-blue" strokeWidth={2.5} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="font-extrabold text-sm">Fifty Fifty</p>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">Menghilangkan 2 pilihan jawaban yang salah secara otomatis.</p>
              </div>
            </div>
          </div>

          <div className="bg-background rounded-2xl border border-border p-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-success/15 grid place-items-center shrink-0">
                <Shield className="w-5 h-5 text-success" strokeWidth={2.5} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="font-extrabold text-sm">Shield</p>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">Jika salah, skor tidak akan berkurang. Perlindungan satu kali.</p>
              </div>
            </div>
          </div>

          <div className="bg-background rounded-2xl border border-border p-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-primary/15 grid place-items-center shrink-0">
                <RefreshCcw className="w-5 h-5 text-primary" strokeWidth={2.5} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="font-extrabold text-sm">Second Chance</p>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">Boleh mengulang 1 jawaban yang salah untuk mencoba kembali.</p>
              </div>
            </div>
          </div>

          <div className="bg-background rounded-2xl border border-border p-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-violet-500/15 grid place-items-center shrink-0">
                <ScanSearch className="w-5 h-5 text-violet-500" strokeWidth={2.5} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="font-extrabold text-sm">Answer Scanner</p>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">Menampilkan kemungkinan jawaban benar berdasarkan analisis soal.</p>
              </div>
            </div>
          </div>

          <div className="bg-background rounded-2xl border border-border p-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-orange-500/15 grid place-items-center shrink-0">
                <FastForward className="w-5 h-5 text-orange-500" strokeWidth={2.5} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="font-extrabold text-sm">Skip Question</p>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">Lewati soal sulit tanpa mengurangi poin.</p>
              </div>
            </div>
          </div>

          <div className="bg-background rounded-2xl border border-border p-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-xp-gold/15 grid place-items-center shrink-0">
                <Dice6 className="w-5 h-5 text-xp-gold" strokeWidth={2.5} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="font-extrabold text-sm">Lucky Guess</p>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">Jika salah, ada peluang jawaban tetap dianggap benar secara acak.</p>
              </div>
            </div>
          </div>

          <div className="bg-background rounded-2xl border border-border p-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-pink-500/15 grid place-items-center shrink-0">
                <Package className="w-5 h-5 text-pink-500" strokeWidth={2.5} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="font-extrabold text-sm">Kotak Misteri</p>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">Efek acak! Bisa dapat hint, eliminasi opsi, skip soal, atau bonus XP.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
