import React, { useState } from 'react';
import { History, ChevronDown, CheckCircle2, Clock } from 'lucide-react';

export default function MaterialVersionDropdown({ versions, activeVersion, onSelectVersion }) {
  const [isOpen, setIsOpen] = useState(false);

  if (!versions || versions.length === 0) return null;

  const currentVerObj = versions.find(v => v.version === activeVersion) || versions[0];

  return (
    <div className="relative inline-block text-left w-full sm:w-auto">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full sm:w-auto bg-card border border-border rounded-xl px-4 py-2.5 text-xs font-bold flex items-center justify-between gap-3 hover:border-primary/40 transition-all cursor-pointer shadow-sm"
      >
        <div className="flex items-center gap-2 text-primary">
          <History className="w-4 h-4" />
          <span>Versi {currentVerObj.version}</span>
          <span className="text-[10px] text-muted-foreground font-medium">({currentVerObj.updatedAt})</span>
        </div>
        <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div onClick={() => setIsOpen(false)} className="fixed inset-0 z-30" />
          <div className="absolute right-0 mt-2 w-full sm:w-72 bg-card border border-border rounded-2xl shadow-xl z-40 p-2 space-y-1 animate-scale-in">
            <p className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground px-3 py-1">
              Riwayat Versi Materi
            </p>
            {versions.map(v => {
              const isSelected = v.version === activeVersion;
              return (
                <button
                  key={v.version}
                  onClick={() => {
                    onSelectVersion(v.version);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-primary/10 text-primary font-bold'
                      : 'hover:bg-muted text-foreground'
                  }`}
                >
                  <div>
                    <p className="font-extrabold">Versi {v.version}</p>
                    <p className="text-[10px] text-muted-foreground">{v.updatedAt} · {v.updatedBy}</p>
                  </div>
                  {v.status === 'Terverifikasi' ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-success" />
                  ) : (
                    <Clock className="w-3.5 h-3.5 text-warning" />
                  )}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
