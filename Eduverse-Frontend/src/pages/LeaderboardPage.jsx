import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Crown, Trophy, Search, X } from 'lucide-react';
import { SCOPES_DATA } from '../data/leaderboardData';
import { useAppState } from '../context/AppStateContext';

export default function LeaderboardPage() {
  const { classId } = useParams();
  const { appState, currentUser, getClassXp } = useAppState();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const isDemoClass = !classId || classId === 'cls-101' || classId === 'cls-102' || classId === 'cls-103';
  const currentClassXp = isDemoClass ? appState.xp : (getClassXp ? getClassXp(classId) : 0);

  const rawData = isDemoClass
    ? SCOPES_DATA['Nasional']
    : [
        {
          rank: 1,
          name: currentUser?.name || 'Refky Satria (Kamu)',
          avatar: currentUser?.profile_photo || '/assets/companion.png',
          xp: currentClassXp || 3950,
          school: 'Owner Kelas',
          badge: '👑 Owner',
          you: true,
        },
        { rank: 2, name: "Budi Santoso", xp: 3420, school: "SMKN 13 Bandung", badge: "👤 Admin", you: false },
        { rank: 3, name: "Siti Rahma", xp: 2980, school: "SMKN 13 Bandung", badge: "🎓 Member", you: false },
        { rank: 4, name: "Andi Wijaya", xp: 2650, school: "SMKN 13 Bandung", badge: "🎓 Member", you: false },
        { rank: 5, name: "Dewi Lestari", xp: 2100, school: "SMKN 13 Bandung", badge: "🎓 Member", you: false },
        { rank: 6, name: "Fajar Pratama", xp: 1850, school: "SMKN 13 Bandung", badge: "🎓 Member", you: false },
        { rank: 7, name: "Rina Marlina", xp: 1600, school: "SMKN 13 Bandung", badge: "🎓 Member", you: false },
      ];
  
  // Clone data and update user XP dynamically
  const fullData = rawData.map(item => {
    if (item.you) {
      return { ...item, name: currentUser?.name || item.name, xp: currentClassXp };
    }
    return item;
  });

  // Sort by XP descending and re-assign ranks
  fullData.sort((a, b) => b.xp - a.xp);
  fullData.forEach((p, i) => p.rank = i + 1);

  const top3 = fullData.slice(0, 3);
  const rest  = fullData.slice(3);

  const p1 = top3[0] || { name: '-', xp: 0 };
  const p2 = top3[1] || { name: '-', xp: 0 };
  const p3 = top3[2] || { name: '-', xp: 0 };

  // Filter rest list by student name search query only
  const filteredRest = rest.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section className="px-4 md:px-8 pt-6 space-y-6 animate-fade-in flex flex-col max-w-7xl mx-auto w-full">
      {/* Header Banner with Search Icon & Reset Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold italic tracking-tight">Peringkat &amp; Hall of Fame</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">Kumpulkan XP terbanyak minggu ini untuk merebut posisi podium!</p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          {/* Collapsible Search Icon Button */}
          {isSearchOpen ? (
            <div className="flex items-center gap-2 bg-card border border-primary rounded-2xl px-3 py-1.5 shadow-sm animate-scale-in">
              <Search className="w-4 h-4 text-primary shrink-0" />
              <input
                type="text"
                autoFocus
                placeholder="Cari nama siswa..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent text-xs font-bold focus:outline-none w-32 sm:w-48 placeholder:text-muted-foreground/60"
              />
              <button
                onClick={() => { setIsSearchOpen(false); setSearchQuery(''); }}
                className="w-5 h-5 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground text-xs cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 sm:px-3 sm:py-2 rounded-2xl bg-card border border-border hover:border-primary/40 text-muted-foreground hover:text-foreground transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
              title="Cari Siswa"
            >
              <Search className="w-4 h-4" />
              <span className="text-xs font-bold hidden sm:inline">Cari</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Desktop 2-Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 lg:gap-8 items-start">
        
        {/* Left Column: Compact Sticky Podium Showcase */}
        <div className="md:col-span-5 lg:col-span-5 md:sticky md:top-24 self-start">
          {/* Compact Podium */}
          <div id="podium-container" className="bg-gradient-to-br from-primary via-primary to-primary-glow rounded-2xl md:rounded-3xl p-4 sm:p-5 md:p-6 text-primary-foreground shadow-glow relative overflow-hidden flex flex-col justify-between">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.25),transparent_60%)]"></div>
            <div className="relative grid grid-cols-3 gap-2 items-end flex-1 pt-2">
              {/* Rank 2 */}
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/40 grid place-items-center font-extrabold text-xs sm:text-sm">
                  {p2.name[0]}
                </div>
                <p className="text-[10px] sm:text-xs font-extrabold mt-1.5 text-center truncate w-full">{p2.name.split(' ')[0]}</p>
                <p className="text-[9px] font-mono opacity-80">{p2.xp.toLocaleString()}</p>
                <div className="h-14 sm:h-16 md:h-18 w-full mt-2 bg-white/15 backdrop-blur-sm rounded-t-xl sm:rounded-t-2xl border-t-2 border-white/30 grid place-items-center font-extrabold italic text-lg sm:text-xl">2</div>
              </div>

              {/* Rank 1 */}
              <div className="flex flex-col items-center">
                <Crown className="w-5 h-5 sm:w-6 sm:h-6 text-xp-gold fill-xp-gold mb-1 drop-shadow" />
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/20 backdrop-blur-sm border-2 border-xp-gold grid place-items-center font-extrabold text-xs sm:text-sm">
                  {p1.name[0]}
                </div>
                <p className="text-[10px] sm:text-xs font-extrabold mt-1.5 text-center truncate w-full">{p1.name.split(' ')[0]}</p>
                <p className="text-[9px] font-mono opacity-80">{p1.xp.toLocaleString()}</p>
                <div className="h-22 sm:h-24 md:h-28 w-full mt-2 bg-white/15 backdrop-blur-sm rounded-t-xl sm:rounded-t-2xl border-t-2 border-white/30 grid place-items-center font-extrabold italic text-lg sm:text-xl">1</div>
              </div>

              {/* Rank 3 */}
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/40 grid place-items-center font-extrabold text-xs sm:text-sm">
                  {p3.name[0]}
                </div>
                <p className="text-[10px] sm:text-xs font-extrabold mt-1.5 text-center truncate w-full">{p3.name.split(' ')[0]}</p>
                <p className="text-[9px] font-mono opacity-80">{p3.xp.toLocaleString()}</p>
                <div className="h-10 sm:h-12 md:h-14 w-full mt-2 bg-white/15 backdrop-blur-sm rounded-t-xl sm:rounded-t-2xl border-t-2 border-white/30 grid place-items-center font-extrabold italic text-lg sm:text-xl">3</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Full Leaderboard List */}
        <div className="md:col-span-7 lg:col-span-7 space-y-2">
          {/* List ranks 4+ */}
          <div id="leaderboard-list" className="space-y-2">
            {filteredRest.length > 0 ? (
              filteredRest.map(p => {
                const isYou = p.you;
                return (
                  <div
                    key={p.name}
                    className={`flex items-center gap-3 p-3.5 sm:p-4 rounded-2xl border transition-all ${
                      isYou
                        ? 'bg-primary/5 border-primary shadow-glow animate-pulse'
                        : 'bg-card border-border hover:border-primary/30 shadow-sm'
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
                    <div className="flex-1 min-w-0">
                      <p className={`font-extrabold text-xs sm:text-sm truncate ${isYou ? 'text-primary' : 'text-foreground'}`}>
                        {p.name} {isYou && <span className="text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded ml-1 font-bold">Kamu</span>}
                      </p>
                      <p className="text-[10px] sm:text-xs text-muted-foreground truncate">{p.badge || 'Siswa'}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-extrabold text-xs sm:text-sm tabular-nums">{p.xp.toLocaleString()}</p>
                      <p className="text-[9px] text-muted-foreground uppercase tracking-wider font-bold">XP</p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="bg-card border border-border rounded-2xl p-6 text-center text-xs text-muted-foreground italic shadow-sm">
                {searchQuery ? `Tidak ada siswa yang cocok dengan "${searchQuery}"` : 'Belum ada data peringkat selanjutnya.'}
              </div>
            )}
          </div>
        </div>

      </div>
    </section>
  );
}
