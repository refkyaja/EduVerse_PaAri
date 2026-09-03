import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, LogIn, KeyRound } from 'lucide-react';
import { useAppState } from '../context/AppStateContext';

export default function JoinClassModal({ isOpen, onClose, onJoinClass }) {
  const { showToast, fetchUserClasses } = useAppState();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
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

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!code.trim() || loading) return;

    setLoading(true);
    try {
      const success = await onJoinClass(code.trim());
      if (success) {
        if (fetchUserClasses) await fetchUserClasses();
        showToast(`Berhasil bergabung ke kelas dengan kode "${code.toUpperCase()}"!`);
        setCode('');
        onClose();
      } else {
        showToast("Kode kelas tidak ditemukan. Coba periksa kembali!");
      }
    } catch (err) {
      showToast(err.message || "Gagal bergabung ke kelas. Coba periksa kembali kode kelas!");
    } finally {
      setLoading(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[55] flex items-end md:items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in p-0 md:p-4">
      {/* Backdrop */}
      <div onClick={onClose} onTouchMove={(e) => e.preventDefault()} className="absolute inset-0 touch-none" />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-full md:max-w-md bg-card rounded-t-3xl md:rounded-3xl z-[60] flex flex-col max-h-[90vh] overflow-hidden shadow-2xl border border-border animate-scale-in">
        {/* Mobile handle */}
        <div className="flex justify-center pt-3 pb-1 shrink-0 md:hidden">
          <div className="w-12 h-1.5 rounded-full bg-border"></div>
        </div>

        {/* Header */}
        <div className="p-5 border-b border-border flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-brand-blue/10 text-brand-blue flex items-center justify-center font-bold">
              <LogIn className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg">Gabung Kelas</h3>
              <p className="text-xs text-muted-foreground">Masukkan kode unik kelas dari Owner/Admin</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <KeyRound className="w-4 h-4 text-primary" /> Kode Kelas <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              required
              maxLength={8}
              placeholder="Contoh: ABCD123"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              className="w-full bg-background border border-border rounded-xl px-4 py-3 font-mono font-bold text-center text-xl tracking-widest text-primary focus:outline-none focus:border-primary transition-colors uppercase shadow-inner"
            />
            <p className="text-[11px] text-muted-foreground mt-2 leading-relaxed text-center">
              Minta kode unik kelas (contoh: <span className="font-mono font-bold text-foreground">ABCD123</span>) dari pembuat kelas.
            </p>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={!code.trim()}
              className={`w-full font-extrabold py-3.5 rounded-xl text-sm shadow-md transition-all flex items-center justify-center gap-2 ${
                code.trim()
                  ? 'bg-gradient-to-r from-primary to-primary-glow text-primary-foreground shadow-glow active:scale-95 cursor-pointer'
                  : 'bg-muted text-muted-foreground cursor-not-allowed'
              }`}
            >
              Gabung Kelas Sekarang
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
