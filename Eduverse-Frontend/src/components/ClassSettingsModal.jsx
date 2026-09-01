import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Settings, RefreshCcw, Save, Trash2, ShieldAlert, KeyRound } from 'lucide-react';
import { useAppState } from '../context/AppStateContext';

export default function ClassSettingsModal({ isOpen, onClose, cls, currentRole, onUpdateClassInfo, onRegenerateCode, onDeleteClass }) {
  const { showToast } = useAppState();
  const [name, setName] = useState(cls?.name || 'XI RPL 1');
  const [description, setDescription] = useState(cls?.description || '');
  const [code, setCode] = useState(cls?.code || 'RPL101');

  if (!isOpen || !cls) return null;

  const isOwner = currentRole === 'owner';

  const handleSaveInfo = (e) => {
    e.preventDefault();
    onUpdateClassInfo?.(cls.id, { name, description });
    showToast("Informasi kelas berhasil diperbarui!");
    onClose();
  };

  const handleRegenCode = () => {
    if (confirm("Apakah Anda yakin ingin membuat ulang kode kelas? Kode lama tidak akan berlaku lagi.")) {
      const newCode = onRegenerateCode?.(cls.id) || Math.random().toString(36).substring(2, 8).toUpperCase();
      setCode(newCode);
      showToast(`Kode kelas baru dibuat: "${newCode}"`);
    }
  };

  const handleDelete = () => {
    if (confirm(`PERINGATAN: Apakah Anda yakin ingin menghapus kelas "${cls.name}" secara permanen? Seluruh data kelas akan dihapus.`)) {
      onDeleteClass?.(cls.id);
      showToast(`Kelas "${cls.name}" telah dihapus.`);
      onClose();
      window.location.href = '/';
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="relative w-full max-w-lg bg-card rounded-3xl overflow-hidden shadow-2xl border border-border flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-border flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg">Pengaturan Kelas</h3>
              <p className="text-xs text-muted-foreground">Kelola informasi, kode akses, dan status kelas</p>
            </div>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSaveInfo} className="p-5 space-y-5 overflow-y-auto">
          {/* Info Edit */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-xs uppercase tracking-wider text-muted-foreground">Informasi Utama Kelas</h4>
            <div>
              <label className="block text-xs font-bold text-muted-foreground mb-1">Nama Kelas</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-muted-foreground mb-1">Deskripsi Kelas</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary resize-none"
              />
            </div>
            <button
              type="submit"
              className="bg-primary text-primary-foreground font-extrabold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-sm hover:scale-105 active:scale-95 transition-all"
            >
              <Save className="w-4 h-4" /> Simpan Informasi Kelas
            </button>
          </div>

          {/* Regenerate Code Box */}
          <div className="bg-background border border-border rounded-2xl p-4 space-y-2">
            <h4 className="font-extrabold text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <KeyRound className="w-4 h-4 text-xp-gold" /> Kode Masuk Kelas
            </h4>
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xl font-mono font-extrabold text-xp-gold tracking-widest">{code}</p>
                <p className="text-[10px] text-muted-foreground">Anggota butuh kode ini untuk bergabung ke kelas privat.</p>
              </div>
              {isOwner && (
                <button
                  type="button"
                  onClick={handleRegenCode}
                  className="bg-primary/10 text-primary font-extrabold px-3 py-2 rounded-xl text-xs flex items-center gap-1 hover:bg-primary/20 transition-all"
                >
                  <RefreshCcw className="w-3.5 h-3.5" /> Regenerate Kode
                </button>
              )}
            </div>
          </div>

          {/* Danger Zone for Owner */}
          {isOwner && (
            <div className="bg-danger/10 border border-danger/30 rounded-2xl p-4 space-y-2">
              <h4 className="font-extrabold text-xs uppercase tracking-wider text-danger flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4" /> Danger Zone (Khusus Owner)
              </h4>
              <p className="text-xs text-muted-foreground">Menghapus kelas akan menghapus seluruh materi, kuis, dan data anggota secara permanen.</p>
              <button
                type="button"
                onClick={handleDelete}
                className="bg-danger text-white font-extrabold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-sm hover:bg-danger/90 transition-all"
              >
                <Trash2 className="w-4 h-4" /> Hapus Kelas Ini Permanen
              </button>
            </div>
          )}
        </form>
      </div>
    </div>,
    document.body
  );
}
