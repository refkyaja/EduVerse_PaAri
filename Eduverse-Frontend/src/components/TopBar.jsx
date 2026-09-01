import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Settings, LogOut, User, Sun, Moon } from 'lucide-react';
import { useAppState } from '../context/AppStateContext';
import { INITIAL_CLASSES } from '../data/mockData';

export default function TopBar() {
  const navigate = useNavigate();
  const { currentUser, logoutUser, getClassXp, findClass, appState, toggleDarkMode } = useAppState();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const location = useLocation();
  const currentPath = location.pathname;

  // Determine active class ID & route state
  const classMatch = currentPath.match(/\/class\/([^\/]+)/);
  const classId = classMatch ? classMatch[1] : null;
  const isInsideClass = Boolean(classId);
  const activeClass = classId && findClass ? findClass(classId) : null;
  const classXp = isInsideClass && getClassXp ? getClassXp(classId) : 0;
  const userAvatar = currentUser?.profile_photo ||
                     currentUser?.avatar ||
                     currentUser?.photo_url ||
                     currentUser?.avatar_url ||
                     'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150';

  const isSettingsPage = currentPath === '/settings';
  const topRightImage = isSettingsPage ? '/assets/companion.png' : userAvatar;

  const handleLogout = async () => {
    setIsProfileMenuOpen(false);
    await logoutUser();
    navigate('/login');
  };

  return (
    <nav id="global-topbar" className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border/60 px-4 md:px-8 py-3 flex items-center justify-between gap-3">
      <div className="flex items-center gap-3 min-w-0">
        {/* If inside a class or sub-page, show sleek single Back + Class Name Header */}
        {currentPath !== '/' ? (
          <Link
            to="/"
            className="flex items-center gap-2.5 group cursor-pointer min-w-0"
            title="Kembali ke Halaman Utama (Daftar Kelas)"
          >
            <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold border border-primary/20 group-hover:bg-primary group-hover:text-primary-foreground transition-all shadow-sm shrink-0">
              <ArrowLeft className="w-4 h-4" />
            </div>
            <div className="flex flex-col min-w-0 leading-tight">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-primary truncate">
                {currentPath === '/settings' ? 'Pengaturan Akun' : 'EduVerse • Kelas'}
              </span>
              <span className="font-extrabold text-sm md:text-base text-foreground truncate max-w-[160px] sm:max-w-[240px]">
                {currentPath === '/settings' ? 'Akun Utama' : (activeClass ? activeClass.name : 'Kelas')}
              </span>
            </div>
          </Link>
        ) : (
          <Link to="/" className="flex items-center gap-2.5 group">
            <img src="/assets/companion.png" alt="EduQuest" className="w-9 h-9 md:w-10 md:h-10 object-contain group-hover:scale-105 transition-transform" />
            <div>
              <span className="font-extrabold text-xl md:text-2xl tracking-tight bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                EduQuest
              </span>
            </div>
          </Link>
        )}
      </div>

      <div className="flex items-center gap-2.5 shrink-0">
        {/* XP Pill is ONLY displayed inside a class and shows class-specific XP */}
        {isInsideClass && (
          <div className="bg-card border border-primary/20 rounded-full px-3 py-1.5 flex items-center gap-1.5 shadow-sm animate-fade-in">
            <div className="w-3 h-3 bg-xp-gold rounded-full shadow-[0_0_8px_rgba(251,191,36,0.8)]"></div>
            <span className="font-bold text-xs md:text-sm tabular-nums">{classXp.toLocaleString()} XP</span>
          </div>
        )}

        {/* Profile Avatar / Logo & Interactive Dropdown Menu */}
        <div className="relative">
          <button
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            title={currentUser ? `Menu Akun (${currentUser.name})` : "Menu Akun"}
            className="rounded-full focus:outline-none cursor-pointer shrink-0 block"
          >
            <img
              src={topRightImage}
              alt={currentUser?.name || "EduVerse Header Icon"}
              loading="lazy"
              className={`w-9 h-9 md:w-10 md:h-10 rounded-full cursor-pointer hover:scale-105 transition-transform ${
                isSettingsPage ? 'object-contain' : 'object-cover bg-brand-soft outline outline-2 outline-card shadow-md'
              }`}
            />
          </button>

          {isProfileMenuOpen && (
            <>
              {/* Overlay Backdrop to Close Dropdown */}
              <div
                className="fixed inset-0 z-30"
                onClick={() => setIsProfileMenuOpen(false)}
              />

              {/* Profile Dropdown Menu */}
              <div className="absolute right-0 mt-2 w-64 bg-card border border-border rounded-3xl p-3 shadow-2xl z-40 animate-scale-up space-y-2.5">
                {/* User Header Info */}
                <div className="flex items-center gap-3 p-2 bg-muted/40 rounded-2xl border border-border/50">
                  <img
                    src={userAvatar}
                    alt={currentUser?.name || "User Avatar"}
                    className="w-9 h-9 rounded-full object-cover border border-primary/30 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-extrabold text-xs text-foreground truncate">{currentUser?.name || "Refky Satria"}</p>
                    <p className="text-[11px] text-muted-foreground truncate">@{currentUser?.username || "refky"}</p>
                  </div>
                </div>

                {/* Light mode / Dark mode Segmented Toggle (Below User Info) */}
                <div className="bg-muted/80 border border-border/60 rounded-2xl p-1 flex items-center gap-1">
                  <button
                    onClick={() => {
                      if (appState?.darkMode) toggleDarkMode();
                    }}
                    className={`flex-1 py-1.5 px-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      !appState?.darkMode
                        ? 'bg-card text-foreground font-extrabold shadow-sm border border-border/40'
                        : 'text-muted-foreground font-bold hover:text-foreground'
                    }`}
                  >
                    <Sun className="w-3.5 h-3.5 text-warning shrink-0" />
                    <span>Light mode</span>
                  </button>

                  <button
                    onClick={() => {
                      if (!appState?.darkMode) toggleDarkMode();
                    }}
                    className={`flex-1 py-1.5 px-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      appState?.darkMode
                        ? 'bg-card text-foreground font-extrabold shadow-sm border border-border/40'
                        : 'text-muted-foreground font-bold hover:text-foreground'
                    }`}
                  >
                    <Moon className="w-3.5 h-3.5 text-primary-glow shrink-0" />
                    <span>Dark mode</span>
                  </button>
                </div>

                {/* Actions */}
                <div className="space-y-1 pt-1 border-t border-border/50">
                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      navigate('/settings');
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold hover:bg-primary/15 hover:text-primary transition-colors flex items-center gap-2.5 cursor-pointer"
                  >
                    <Settings className="w-4 h-4 text-primary shrink-0" />
                    <span>Settings</span>
                  </button>

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-danger hover:bg-danger/10 transition-colors flex items-center gap-2.5 cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 text-danger shrink-0" />
                    <span>Sign out</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
