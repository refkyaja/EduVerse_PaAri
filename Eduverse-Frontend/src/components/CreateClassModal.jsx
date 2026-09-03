import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Plus, Sparkles, Globe, Lock } from 'lucide-react';
import { useAppState } from '../context/AppStateContext';

export default function CreateClassModal({ isOpen, onClose, onCreateClass }) {
  const { showToast, currentUser, fetchUserClasses } = useAppState();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(true);
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
    if (!name.trim() || loading) return;

    setLoading(true);
    try {
      await onCreateClass({
        name,
        description,
        isPublic,
        bannerImage: '/assets/banner_eduverse.png',
      }, currentUser);
      if (fetchUserClasses) await fetchUserClasses();
      showToast(`Kelas "${name}" berhasil dibuat!`);
      setName('');
      setDescription('');
      onClose();
    } catch (err) {
      showToast(err.message || "Gagal membuat kelas");
    } finally {
      setLoading(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[55] flex items-end md:items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in p-0 md:p-4">
      {/* Backdrop */}
      <div onClick={onClose} onTouchMove={(e) => e.preventDefault()} className="absolute inset-0 touch-none" />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-full md:max-w-lg bg-card rounded-t-3xl md:rounded-3xl z-[60] flex flex-col max-h-[90vh] overflow-hidden shadow-2xl border border-border animate-scale-in">
        {/* Mobile handle */}
        <div className="flex justify-center pt-3 pb-1 shrink-0 md:hidden">
          <div className="w-12 h-1.5 rounded-full bg-border"></div>
        </div>

        {/* Header */}
        <div className="p-5 border-b border-border flex items-center justify-between shrink-0">
          <div>
            <h3 className="font-extrabold text-lg">Buat Kelas Baru</h3>
            <p className="text-xs text-muted-foreground">Buat ruang belajar digital untuk grup kamu</p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto">
          <div>
            <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5">
              Nama Kelas <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: XI RPL 1 atau Belajar React & Tailwind"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5">
              Deskripsi Kelas
            </label>
            <textarea
              rows={3}
              placeholder="Tuliskan tujuan belajar atau deskripsi singkat..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors resize-none"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-primary to-primary-glow text-primary-foreground font-extrabold py-3.5 rounded-xl text-sm shadow-glow active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              Buat Kelas Sekarang
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
