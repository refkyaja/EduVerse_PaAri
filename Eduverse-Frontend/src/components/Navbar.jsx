import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { GraduationCap, LogOut, Menu, X, User as UserIcon, Home } from 'lucide-react';
import RoleSwitcher from './RoleSwitcher';

export default function Navbar({ user, onRoleChange }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-extrabold bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
                EduVerse
              </span>
              <span className="block text-[10px] tracking-wider text-slate-400 uppercase font-semibold">
                Digital Classroom
              </span>
            </div>
          </Link>

          {/* Desktop Controls */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className={`flex items-center gap-2 text-sm font-semibold transition-colors ${
                location.pathname === '/' ? 'text-indigo-400' : 'text-slate-300 hover:text-white'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Halaman Utama</span>
            </Link>

            {/* Interactive Role Switcher */}
            <RoleSwitcher currentRole={user.activeRole} onRoleChange={onRoleChange} />

            {/* Profile Avatar & Stats */}
            <Link to="/profile" className="flex items-center gap-3 bg-slate-800/80 hover:bg-slate-800 p-1.5 pr-3 rounded-full border border-slate-700/60 transition-all">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-500/40"
              />
              <div className="text-left leading-tight hidden lg:block">
                <span className="block text-xs font-bold text-slate-200">{user.name}</span>
                <span className="text-[10px] text-amber-400 font-semibold">{user.totalXp} XP</span>
              </div>
            </Link>

            <Link
              to="/login"
              className="text-slate-400 hover:text-rose-400 p-2 rounded-lg transition-colors"
              title="Keluar"
            >
              <LogOut className="w-5 h-5" />
            </Link>
          </div>

          {/* Mobile Menu Trigger */}
          <div className="flex md:hidden items-center gap-3">
            <RoleSwitcher currentRole={user.activeRole} onRoleChange={onRoleChange} />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-400 hover:text-white rounded-lg bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 px-4 pt-3 pb-5 space-y-3 animate-fadeIn">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-200 font-medium hover:bg-slate-800"
          >
            <Home className="w-5 h-5 text-indigo-400" />
            <span>Halaman Utama</span>
          </Link>
          
          <Link
            to="/profile"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-200 font-medium hover:bg-slate-800"
          >
            <UserIcon className="w-5 h-5 text-purple-400" />
            <span>Profil ({user.name} - {user.totalXp} XP)</span>
          </Link>

          <Link
            to="/login"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-rose-400 font-medium hover:bg-rose-500/10"
          >
            <LogOut className="w-5 h-5" />
            <span>Keluar Akun</span>
          </Link>
        </div>
      )}
    </header>
  );
}
