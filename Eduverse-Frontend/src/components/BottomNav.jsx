import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, BookOpen, Swords, Trophy, User } from 'lucide-react';
import { useAppState } from '../context/AppStateContext';

export default function BottomNav() {
  const location = useLocation();
  const currentPath = location.pathname;
  const { classList } = useAppState();

  // Extract active class ID if in a class route, otherwise use user's first class
  const classMatch = currentPath.match(/\/class\/([^\/]+)/);
  const activeClassId = classMatch ? classMatch[1] : (classList?.[0]?.id || null);

  const pages = [
    { id: 'home',        Icon: Home,       label: 'Home',    path: activeClassId ? `/class/${activeClassId}` : '/' },
    { id: 'materi',      Icon: BookOpen,   label: 'Materi',  path: activeClassId ? `/class/${activeClassId}/materi` : '/materi' },
    { id: 'quiz',        Icon: Swords,     label: 'Main',    path: activeClassId ? `/class/${activeClassId}/kuis` : '/quiz', isCenter: true },
    { id: 'leaderboard', Icon: Trophy,     label: 'Ranking', path: activeClassId ? `/class/${activeClassId}/leaderboard` : '/leaderboard' },
    { id: 'profile',     Icon: User,       label: 'Akun',    path: activeClassId ? `/class/${activeClassId}/profile` : '/profile' },
  ];

  return (
    <nav id="global-bottomnav" className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md md:max-w-2xl lg:max-w-4xl bg-card border-t md:border-x border-border md:rounded-t-2xl px-4 md:px-8 py-3 flex justify-between items-center z-50 shadow-lg">
      {pages.map(p => {
        const isActive = currentPath === p.path ||
                         (p.id === 'home' && (currentPath === `/class/${activeClassId}` || currentPath === '/')) ||
                         (p.id === 'materi' && (currentPath.includes('/materi'))) ||
                         (p.id === 'quiz' && (currentPath.includes('/kuis') || currentPath.includes('/quiz'))) ||
                         (p.id === 'leaderboard' && (currentPath.includes('/leaderboard'))) ||
                         (p.id === 'profile' && (currentPath.includes('/profile')));

        if (p.isCenter) {
          return (
            <Link key={p.id} to={p.path} id={`nav-btn-${p.id}`} className="-mt-10 flex flex-col items-center">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-glow rounded-full flex items-center justify-center shadow-glow border-4 border-card text-primary-foreground animate-pulse-glow hover:scale-105 transition-transform duration-200">
                <p.Icon className="w-7 h-7" strokeWidth={2.5} />
              </div>
              <span className="text-[10px] font-bold text-primary mt-1">{p.label}</span>
            </Link>
          );
        }

        const activeClass   = 'flex flex-col items-center gap-1 transition-all text-primary';
        const inactiveClass = 'flex flex-col items-center gap-1 transition-all text-muted-foreground hover:text-foreground';
        const sw = isActive ? 2.5 : 2;
        const spanClass = isActive ? 'text-[10px] font-bold' : 'text-[10px] font-semibold';

        return (
          <Link key={p.id} to={p.path} id={`nav-btn-${p.id}`} className={isActive ? activeClass : inactiveClass}>
            <p.Icon className="w-5 h-5" strokeWidth={sw} />
            <span className={spanClass}>{p.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
