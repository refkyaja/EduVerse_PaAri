import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Crown, Trophy, Search, X, ShieldAlert, ChevronRight, Loader2 } from 'lucide-react';
import { useAppState } from '../context/AppStateContext';
import { apiService } from '../services/apiService';

export default function LeaderboardPage() {
  const { classId } = useParams();
  const { appState, currentUser, getClassXp, findClass } = useAppState();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [leaderboardList, setLeaderboardList] = useState([]);
  const [loading, setLoading] = useState(true);

  const activeClass = classId && findClass ? findClass(classId) : null;
  const isApiClass = Boolean(classId && !String(classId).startsWith('cls-') && !isNaN(Number(classId)));

  const currentClassXp = getClassXp ? getClassXp(classId) : (currentUser?.xp || appState?.xp || 0);

  useEffect(() => {
    let isMounted = true;
    const loadLeaderboard = async () => {
      setLoading(true);
      if (isApiClass && classId) {
        try {
          const members = await apiService.getMembers(classId);
          if (isMounted && Array.isArray(members) && members.length > 0) {
            const formatted = members.map(m => {
              const memName = m.name || m.user?.name || 'Anggota Kelas';
              const memAvatar = (m.profile_photo || m.avatar || m.user?.avatar) && !String(m.profile_photo || m.avatar || m.user?.avatar).includes('unsplash')
                ? (m.profile_photo || m.avatar || m.user?.avatar)
                : `https://ui-avatars.com/api/?name=${encodeURIComponent(memName)}&background=8b5cf6&color=ffffff&bold=true&size=256`;

              const isYou = String(m.id || m.user_id) === String(currentUser?.id);
              const totalXp = m.xp ?? m.user?.xp ?? (isYou ? currentClassXp : 0);

              return {
                id: m.id || m.user_id,
                name: memName,
                avatar: memAvatar,
                xp: Number(totalXp) || 0,
                school: activeClass?.name || 'Ruang Kelas',
                badge: (m.role === 'owner' || m.role === 'Owner') ? '👑 Owner' : (m.role === 'admin' || m.role === 'Admin') ? '🛡️ Admin' : '⭐ Siswa',
                you: isYou
              };
            });

            // Sort by XP descending
            formatted.sort((a, b) => b.xp - a.xp);
            formatted.forEach((p, i) => p.rank = i + 1);
            setLeaderboardList(formatted);
            setLoading(false);
            return;
          }
        } catch (e) {
          console.error("Failed to load leaderboard members:", e);
        }
      }

      if (isMounted) {
        const fallbackUser = {
          id: currentUser?.id || 'me',
          name: currentUser?.name || 'Kamu',
          avatar: (currentUser?.profile_photo || currentUser?.avatar) && !String(currentUser?.profile_photo || currentUser?.avatar).includes('unsplash')
            ? (currentUser.profile_photo || currentUser.avatar)
            : `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.name || 'User')}&background=8b5cf6&color=ffffff&bold=true&size=256`,
          xp: Number(currentClassXp) || 0,
          school: activeClass?.name || 'Kelas Saya',
          badge: '👑 Owner',
          you: true
        };
        setLeaderboardList([fallbackUser]);
        setLoading(false);
      }
    };

    loadLeaderboard();
    return () => { isMounted = false; };
  }, [classId, isApiClass, currentUser, currentClassXp, activeClass]);

  if (classId && !activeClass && !isApiClass) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 space-y-4 animate-fade-in max-w-md mx-auto py-12">
        <div className="w-16 h-16 rounded-3xl bg-danger/10 text-danger flex items-center justify-center shadow-inner">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h2 className="text-xl font-extrabold italic text-foreground">Akses Ditolak / Kelas Tidak Ditemukan</h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Ruang kelas dengan ID <code className="text-primary font-mono bg-muted px-1.5 py-0.5 rounded">{classId}</code> tidak ditemukan atau Anda tidak terdaftar sebagai anggota di kelas ini.
          </p>
        </div>
        <div className="pt-2">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground font-extrabold text-xs rounded-xl shadow-glow hover:scale-105 transition-all"
          >
            <span>Kembali ke Beranda</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  // Podium top 3 ALWAYS reflects true class ranks (never changes during search)
  const top3 = leaderboardList.slice(0, 3);
  const p1 = top3[0] || null;
  const p2 = top3[1] || null;
  const p3 = top3[2] || null;

  // Filter list on the right column only
  const displayList = searchQuery.trim()
    ? leaderboardList.filter(p => 
        p.name.toLowerCase().includes(searchQuery.trim().toLowerCase()) ||
        (p.badge && p.badge.toLowerCase().includes(searchQuery.trim().toLowerCase()))
      )
    : leaderboardList;

  return (
    <section className="px-4 md:px-8 pt-6 space-y-6 animate-fade-in flex flex-col max-w-7xl mx-auto w-full">
      {/* Header Banner with Search Icon & Reset Badge */}
      <div className="space-y-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold italic tracking-tight">Peringkat &amp; Hall of Fame</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">Kumpulkan XP terbanyak minggu ini untuk merebut posisi podium!</p>
        </div>

        {/* Search button aligned to the right below description text */}
        <div className="flex justify-end pt-0.5">
          {isSearchOpen ? (
            <div className="flex items-center gap-2 bg-card border border-primary rounded-2xl px-3 py-1.5 shadow-sm animate-scale-in">
              <Search className="w-4 h-4 text-primary shrink-0" />
              <input
                type="text"
                autoFocus
                placeholder="Cari nama siswa..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent text-xs font-bold focus:outline-none w-36 sm:w-48 placeholder:text-muted-foreground/60 text-foreground"
              />
              <button
                onClick={() => { setIsSearchOpen(false); setSearchQuery(''); }}
                className="w-5 h-5 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground text-xs cursor-pointer shrink-0"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsSearchOpen(true)}
              className="w-9 h-9 sm:w-auto sm:h-auto p-2 sm:px-3 sm:py-2 rounded-2xl bg-card border border-border hover:border-primary/40 text-muted-foreground hover:text-foreground transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer shrink-0"
              title="Cari Siswa"
            >
              <Search className="w-4 h-4" />
              <span className="text-xs font-bold hidden sm:inline">Cari</span>
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <p className="text-xs text-muted-foreground font-bold">Memuat peringkat anggota kelas...</p>
        </div>
      ) : (
        /* Main Desktop 2-Column Grid */
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 lg:gap-8 items-start">
          
          {/* Left Column: Compact Sticky Podium Showcase */}
          <div className="md:col-span-5 lg:col-span-5 md:sticky md:top-24 self-start">
            {/* Compact Podium */}
            <div id="podium-container" className="bg-gradient-to-br from-primary via-primary to-primary-glow rounded-2xl md:rounded-3xl p-4 sm:p-5 md:p-6 text-primary-foreground shadow-glow relative overflow-hidden flex flex-col justify-between">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.25),transparent_60%)]"></div>
              <div className="relative grid grid-cols-3 gap-2 items-end flex-1 pt-2">
                {/* Rank 2 (Left - Medium Height) */}
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/40 grid place-items-center font-extrabold text-xs sm:text-sm overflow-hidden shrink-0 shadow-md">
                    {p2?.avatar ? (
                      <img src={p2.avatar} alt={p2.name} className="w-full h-full object-cover" />
                    ) : (
                      <span>{p2?.name ? p2.name.charAt(0).toUpperCase() : '-'}</span>
                    )}
                  </div>
                  <p className="text-[10px] sm:text-xs font-extrabold mt-1.5 text-center truncate w-full">
                    {p2 ? p2.name.split(' ')[0] : '-'}
                  </p>
                  <p className="text-[9px] font-mono opacity-80">{p2 ? p2.xp.toLocaleString() : 0} XP</p>
                  <div className="h-16 sm:h-20 md:h-24 w-full mt-2 bg-white/15 backdrop-blur-sm rounded-t-xl sm:rounded-t-2xl border-t-2 border-white/30 grid place-items-center font-extrabold italic text-lg sm:text-xl">2</div>
                </div>

                {/* Rank 1 (Center - Tallest Height) */}
                <div className="flex flex-col items-center">
                  <Crown className="w-5 h-5 sm:w-6 sm:h-6 text-xp-gold fill-xp-gold mb-1 drop-shadow" />
                  <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-white/20 backdrop-blur-sm border-2 border-xp-gold grid place-items-center font-extrabold text-xs sm:text-sm overflow-hidden shrink-0 shadow-lg">
                    {p1?.avatar ? (
                      <img src={p1.avatar} alt={p1.name} className="w-full h-full object-cover" />
                    ) : (
                      <span>{p1?.name ? p1.name.charAt(0).toUpperCase() : '-'}</span>
                    )}
                  </div>
                  <p className="text-[10px] sm:text-xs font-extrabold mt-1.5 text-center truncate w-full">
                    {p1 ? p1.name.split(' ')[0] : '-'}
                  </p>
                  <p className="text-[9px] font-mono opacity-80">{p1 ? p1.xp.toLocaleString() : 0} XP</p>
                  <div className="h-24 sm:h-28 md:h-32 w-full mt-2 bg-white/15 backdrop-blur-sm rounded-t-xl sm:rounded-t-2xl border-t-2 border-white/30 grid place-items-center font-extrabold italic text-xl sm:text-2xl">1</div>
                </div>

                {/* Rank 3 (Right - Shortest Height) */}
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/40 grid place-items-center font-extrabold text-xs sm:text-sm overflow-hidden shrink-0 shadow-md">
                    {p3?.avatar ? (
                      <img src={p3.avatar} alt={p3.name} className="w-full h-full object-cover" />
                    ) : (
                      <span>{p3?.name ? p3.name.charAt(0).toUpperCase() : '-'}</span>
                    )}
                  </div>
                  <p className="text-[10px] sm:text-xs font-extrabold mt-1.5 text-center truncate w-full">
                    {p3 ? p3.name.split(' ')[0] : '-'}
                  </p>
                  <p className="text-[9px] font-mono opacity-80">{p3 ? p3.xp.toLocaleString() : 0} XP</p>
                  <div className="h-12 sm:h-14 md:h-16 w-full mt-2 bg-white/15 backdrop-blur-sm rounded-t-xl sm:rounded-t-2xl border-t-2 border-white/30 grid place-items-center font-extrabold italic text-base sm:text-lg">3</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Full Leaderboard List */}
          <div className="md:col-span-7 lg:col-span-7 space-y-2">
            {/* List ranks 4+ or all top 3 fallback */}
            <div id="leaderboard-list" className="space-y-2">
              {displayList.length > 0 ? (
                displayList.map(p => {
                  const isYou = p.you;
                  return (
                    <div
                      key={p.id || p.name}
                      className={`flex items-center gap-3 p-3.5 sm:p-4 rounded-2xl border transition-all ${
                        isYou
                          ? 'bg-primary/10 border-primary shadow-sm'
                          : 'bg-card border-border hover:border-primary/30 shadow-xs'
                      }`}
                    >
                      <div
                        className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl grid place-items-center font-extrabold text-xs shrink-0 ${
                          isYou
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {p.rank}
                      </div>

                      <img
                        src={p.avatar}
                        alt={p.name}
                        className="w-9 h-9 rounded-full object-cover border border-border shrink-0"
                      />

                      <div className="flex-1 min-w-0">
                        <p className={`font-extrabold text-xs sm:text-sm truncate ${isYou ? 'text-primary' : 'text-foreground'}`}>
                          {p.name} {isYou && <span className="text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded ml-1 font-bold">Kamu</span>}
                        </p>
                        <p className="text-[10px] sm:text-xs text-muted-foreground truncate">{p.badge || 'Siswa'}</p>
                      </div>

                      <div className="text-right shrink-0">
                        <p className="font-extrabold text-xs sm:text-sm tabular-nums text-primary">{p.xp.toLocaleString()}</p>
                        <p className="text-[9px] text-muted-foreground uppercase tracking-wider font-bold">XP</p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="bg-card border border-border rounded-2xl p-6 text-center text-xs text-muted-foreground italic shadow-sm">
                  {searchQuery ? `Tidak ada siswa yang cocok dengan "${searchQuery}"` : 'Belum ada data anggota.'}
                </div>
              )}
            </div>
          </div>

        </div>
      )}
    </section>
  );
}
