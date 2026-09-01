import React from 'react';
import { Sparkles } from 'lucide-react';

export default function Toast({ message }) {
  if (!message) return null;

  return (
    <div className="fixed top-5 inset-x-0 z-[9999] flex justify-center items-center pointer-events-none px-4">
      <div className="bg-gradient-to-r from-primary to-primary-glow text-white font-bold py-3 px-6 rounded-full shadow-2xl animate-scale-in flex items-center gap-2.5 max-w-md md:max-w-xl text-center text-xs md:text-sm border border-white/20">
        <Sparkles className="w-5 h-5 text-xp-gold fill-xp-gold shrink-0" />
        <span>{message}</span>
      </div>
    </div>
  );
}
