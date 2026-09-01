import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Sparkles, Home, BookOpen, Swords, Trophy, User, LogOut, Settings, ShieldCheck } from 'lucide-react';
import RoleSwitcher from '../components/RoleSwitcher';
import Toast from '../components/Toast';
import { useAppState } from '../context/AppStateContext';

export default function MainLayout({ children, user, onRoleChange }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { appState, currentUser, logoutUser, toastMessage } = useAppState();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const currentPath = location.pathname;

  const navItems = [
    { label: 'Halaman Utama', path: '/', Icon: Home },
    { label: 'Profil Saya', path: '/profile', Icon: User },
  ];

  const userAvatar = currentUser?.profile_photo ||
                     currentUser?.avatar ||
                     currentUser?.photo_url ||
                     currentUser?.avatar_url ||
                     user?.profile_photo ||
                     user?.avatar ||
                     "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150";

  const isSettingsPage = currentPath === '/settings';
  const topRightImage = isSettingsPage ? '/assets/companion.png' : userAvatar;

  const handleLogout = async () => {
    setIsProfileMenuOpen(false);
    await logoutUser();
    navigate('/login');
  };

  return (
    <div className="min-h-screen w-full bg-[#f2f1f5] dark:bg-[#121016] text-foreground font-sans transition-colors">
      {/* Outer App Shell Container: Mobile max-w-md, Desktop/Laptop max-w-6xl */}
      <div className="min-h-screen w-full max-w-md md:max-w-4xl lg:max-w-6xl xl:max-w-7xl mx-auto bg-background relative shadow-2xl border-x border-border/40 flex flex-col md:my-6 md:rounded-3xl md:border overflow-hidden pb-20 md:pb-10">
        
        {/* Top Navbar */}
        <header className="sticky top-0 z-40 bg-background/90 backdrop-blur-xl border-b border-border/60 px-4 md:px-8 py-3.5 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src="/assets/companion.png"
              alt="EduVerse Logo"
              className="w-9 h-9 md:w-10 md:h-10 object-contain group-hover:scale-105 transition-transform"
            />
            <div>
              <span className="font-extrabold text-xl md:text-2xl tracking-tight bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                EduVerse
              </span>
              <span className="hidden md:inline-block ml-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest bg-muted px-2 py-0.5 rounded-full">
                Learning Platform
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-2">
            {navItems.map(item => {
              const isActive = item.path === '/' ? currentPath === '/' : currentPath.startsWith(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-4 py-2 rounded-xl font-extrabold text-xs flex items-center gap-2 transition-all ${
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }`}
                >
                  <item.Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Info & XP Badge */}
          <div className="flex items-center gap-3">
            <div className="bg-card border border-primary/20 rounded-full px-3 py-1.5 flex items-center gap-2 shadow-sm">
              <div className="w-3 h-3 bg-xp-gold rounded-full shadow-[0_0_8px_rgba(251,191,36,0.8)]"></div>
              <span className="font-bold text-xs tabular-nums text-foreground">
                {(appState?.xp || user?.totalXp || 3950).toLocaleString()} XP
              </span>
            </div>

            {/* Avatar Dropdown Trigger */}
            <div className="relative">
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center gap-2 group cursor-pointer focus:outline-none"
              >
                <img
                  src={topRightImage}
                  alt="User Profile"
                  className={`w-9 h-9 md:w-10 md:h-10 rounded-full cursor-pointer group-hover:scale-105 transition-transform ${
                    isSettingsPage ? 'object-contain' : 'object-cover bg-brand-soft outline outline-2 outline-card shadow-md'
                  }`}
                />
                <div className="hidden lg:block text-left">
                  <p className="font-extrabold text-xs leading-tight text-foreground">{currentUser?.name || user?.name || "Refky Satria"}</p>
                  <p className="text-[10px] text-muted-foreground capitalize font-bold">Role: {currentUser?.role || user?.activeRole || "Owner"}</p>
                </div>
              </button>

              {isProfileMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-30"
                    onClick={() => setIsProfileMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-60 bg-card border border-border rounded-3xl p-3 shadow-2xl z-40 animate-scale-up space-y-2">
                    <div className="flex items-center gap-3 p-2 bg-muted/40 rounded-2xl border border-border/50">
                      <img
                        src={userAvatar}
                        alt="User Avatar"
                        className="w-10 h-10 rounded-full object-cover border border-primary/30 shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="font-extrabold text-xs text-foreground truncate">{currentUser?.name || user?.name || "Refky Satria"}</p>
                        <p className="text-[11px] text-muted-foreground truncate">@{currentUser?.username || "refky"}</p>
                      </div>
                    </div>

                    <div className="space-y-1 pt-1">
                      <button
                        onClick={() => {
                          setIsProfileMenuOpen(false);
                          navigate('/settings');
                        }}
                        className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold hover:bg-primary/15 hover:text-primary transition-colors flex items-center gap-2.5 cursor-pointer"
                      >
                        <Settings className="w-4 h-4 text-primary shrink-0" />
                        <span>Settings</span>
                      </button>

                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold text-danger hover:bg-danger/10 transition-colors flex items-center gap-2.5 cursor-pointer mt-1 border-t border-border/60 pt-2"
                      >
                        <LogOut className="w-4 h-4 text-danger shrink-0" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Role Switcher Banner for previewing Owner/Admin/Member behavior */}
        {onRoleChange && (
          <div className="bg-muted/40 border-b border-border/40 px-4 md:px-8 py-2 flex items-center justify-between gap-4 flex-wrap text-xs">
            <div className="flex items-center gap-2 text-muted-foreground">
              <ShieldCheck className="w-4 h-4 text-primary" />
              <span className="font-semibold text-[11px]">Preview Permission Role:</span>
            </div>
            <RoleSwitcher activeRole={user?.activeRole || 'owner'} onRoleChange={onRoleChange} />
          </div>
        )}

        {/* Main Content Body */}
        <main className="flex-1 w-full max-w-full">
          {children}
        </main>

        {/* Mobile Bottom Navigation (Shown only on mobile screens < md) */}
        <nav className="md:hidden fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-card border-t border-border px-4 py-3 flex justify-between items-center z-50">
          <Link
            to="/"
            className={`flex flex-col items-center gap-1 transition-all ${
              currentPath === '/' ? 'text-primary font-bold' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Home className="w-5 h-5" strokeWidth={currentPath === '/' ? 2.5 : 2} />
            <span className="text-[10px]">Utama</span>
          </Link>

          <Link
            to="/profile"
            className={`flex flex-col items-center gap-1 transition-all ${
              currentPath === '/profile' ? 'text-primary font-bold' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <User className="w-5 h-5" strokeWidth={currentPath === '/profile' ? 2.5 : 2} />
            <span className="text-[10px]">Profil</span>
          </Link>

          <Link
            to="/login"
            className="flex flex-col items-center gap-1 transition-all text-muted-foreground hover:text-danger"
          >
            <LogOut className="w-5 h-5" strokeWidth={2} />
            <span className="text-[10px]">Keluar</span>
          </Link>
        </nav>

        <Toast message={toastMessage} />
      </div>
    </div>
  );
}
