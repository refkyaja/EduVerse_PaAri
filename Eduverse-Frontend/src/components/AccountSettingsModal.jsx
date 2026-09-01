import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { X, User, Settings, Lock, Moon, Sun, LogOut, Shield, Check, Sparkles, Mail } from 'lucide-react';
import { useAppState } from '../context/AppStateContext';

export default function AccountSettingsModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const { showToast } = useAppState();
  const [activeTab, setActiveTab] = useState('profile'); // 'profile', 'edit', 'settings'
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Edit form state
  const [name, setName] = useState('Refky Satria');
  const [username, setUsername] = useState('refky');
  const [email, setEmail] = useState('refky.satria@eduverse.id');
  const [bio, setBio] = useState('Pelajar & Tech Enthusiast | Suka kuis & kompetisi');

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

  const handleSaveProfile = (e) => {
    e.preventDefault();
    showToast('Profil dan informasi akun berhasil diperbarui!');
    setActiveTab('profile');
  };

  const handleLogout = () => {
    onClose();
    showToast('Berhasil keluar dari akun.');
    navigate('/login');
  };

  return createPortal(
    <div className="fixed inset-0 z-[60] flex items-end md:items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in p-0 md:p-4">
      {/* Backdrop */}
      <div onClick={onClose} onTouchMove={(e) => e.preventDefault()} className="absolute inset-0 touch-none" />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-full md:max-w-lg bg-card rounded-t-3xl md:rounded-3xl z-[65] flex flex-col max-h-[90vh] overflow-hidden shadow-2xl border border-border animate-scale-in">
        {/* Mobile handle */}
        <div className="flex justify-center pt-3 pb-1 shrink-0 md:hidden">
          <div className="w-12 h-1.5 rounded-full bg-border"></div>
        </div>

        {/* Modal Header */}
        <div className="px-5 py-4 flex items-center justify-between border-b border-border shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg">Pengaturan Akun</h3>
              <p className="text-xs text-muted-foreground">Kelola profil dan preferensi EduVerse</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher Bar */}
        <div className="px-5 py-2.5 border-b border-border bg-muted/20 flex gap-2 shrink-0 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'profile'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <User className="w-3.5 h-3.5" /> Ringkasan Profil
          </button>
          <button
            onClick={() => setActiveTab('edit')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'edit'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Settings className="w-3.5 h-3.5" /> Edit Akun
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'settings'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Shield className="w-3.5 h-3.5" /> Preferensi
          </button>
        </div>

        {/* Modal Content Body */}
        <div className="p-5 space-y-4 overflow-y-auto flex-1">
          {activeTab === 'profile' && (
            <div className="space-y-4">
              {/* User Avatar Card */}
              <div className="bg-background border border-border rounded-2xl p-4 flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center p-1.5 shrink-0 shadow-sm">
                  <img src="/assets/companion.png" alt="Avatar" className="w-full h-full object-contain" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-extrabold text-base truncate">{name}</h4>
                    <span className="text-[10px] font-extrabold text-xp-gold bg-xp-gold/10 px-2 py-0.5 rounded-full border border-xp-gold/20">
                      LVL 12
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground font-semibold">@{username}</p>
                  <p className="text-xs text-muted-foreground mt-1 truncate">{email}</p>
                </div>
              </div>

              {/* Bio & Role info */}
              <div className="bg-card border border-border rounded-2xl p-4 space-y-2 text-xs">
                <p className="font-bold text-muted-foreground uppercase tracking-wider text-[10px]">Bio Pengguna</p>
                <p className="text-foreground leading-relaxed italic">"{bio}"</p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={() => setActiveTab('edit')}
                  className="w-full bg-primary text-primary-foreground font-extrabold py-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm hover:scale-[1.01] active:scale-95 transition-all cursor-pointer"
                >
                  <Settings className="w-4 h-4" /> Edit Informasi Akun
                </button>

                <button
                  onClick={() => {
                    onClose();
                    navigate('/profile');
                  }}
                  className="w-full bg-muted text-foreground font-extrabold py-3 rounded-xl text-xs flex items-center justify-center gap-2 hover:bg-muted/80 transition-colors cursor-pointer"
                >
                  <User className="w-4 h-4 text-primary" /> Lihat Halaman Profil Lengkap
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full bg-danger/10 text-danger border border-danger/20 font-extrabold py-3 rounded-xl text-xs flex items-center justify-center gap-2 hover:bg-danger/20 transition-colors cursor-pointer mt-3"
                >
                  <LogOut className="w-4 h-4" /> Keluar dari Akun
                </button>
              </div>
            </div>
          )}

          {activeTab === 'edit' && (
            <form onSubmit={handleSaveProfile} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
                  Username
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">@</span>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s+/g, ''))}
                    className="w-full bg-background border border-border rounded-xl pl-8 pr-4 py-2.5 text-xs focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
                  Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-background border border-border rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
                  Bio / Deskripsi Profil
                </label>
                <textarea
                  rows={2}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-primary transition-colors resize-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-primary to-primary-glow text-primary-foreground font-extrabold py-3 rounded-xl text-xs shadow-glow active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Check className="w-4 h-4" /> Simpan Perubahan
                </button>
              </div>
            </form>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-3">
              {/* Dark mode toggle */}
              <div className="bg-background border border-border rounded-2xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                    {isDarkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                  </div>
                  <div>
                    <p className="font-extrabold text-xs">Mode Gelap (Dark Mode)</p>
                    <p className="text-[11px] text-muted-foreground">Tampilan tema utama EduVerse</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className={`w-12 h-6 rounded-full p-1 transition-colors cursor-pointer ${
                    isDarkMode ? 'bg-primary' : 'bg-muted'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      isDarkMode ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Password change dummy */}
              <div className="bg-background border border-border rounded-2xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-warning/10 text-warning flex items-center justify-center font-bold">
                    <Lock className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-extrabold text-xs">Kata Sandi (Password)</p>
                    <p className="text-[11px] text-muted-foreground">Terakhir diubah 30 hari lalu</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => showToast('Tautan ubah kata sandi dikirim ke email.')}
                  className="text-xs font-extrabold text-primary hover:underline cursor-pointer"
                >
                  Ubah
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
