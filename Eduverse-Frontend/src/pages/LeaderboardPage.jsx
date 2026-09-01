import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Crown, Trophy, Medal, Search } from 'lucide-react';
import { SCOPES_DATA } from '../data/leaderboardData';
import { useAppState } from '../context/AppStateContext';

export default function LeaderboardPage() {
  const { classId } = useParams();
  const { appState, currentUser, getClassXp } = useAppState();
  const [scope, setScope] = useState('Nasional');
  const [searchQuery, setSearchQuery] = useState('');

  const isDemoClass = !classId || classId === 'cls-101' || classId === 'cls-102' || classId === 'cls-103';
  const currentClassXp = isDemoClass ? appState.xp : (getClassXp ? getClassXp(classId) : 0);

  const rawData = isDemoClass
    ? (SCOPES_DATA[scope] || SCOPES_DATA['Nasional'])
    : [
        {
          rank: 1,
          name: currentUser?.name || 'Anda',
          avatar: currentUser?.profile_photo || '/assets/companion.png',
          xp: currentClassXp,
          school: 'Owner Kelas',
          badge: '👑 Owner',
          you: true,
        }
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

  const userInfo = fullData.find(p => p.you);
  const diff = top3[2] ? (top3[2].xp - (userInfo ? userInfo.xp : 0)) : 0;

  // Filter rest list by search query
  const filteredRest = rest.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.school && p.school.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <section className="px-4 md:px-8 pt-6 space-y-6 animate-fade-in flex flex-col max-w-7xl mx-auto w-full">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold italic tracking-tight">Peringkat &amp; Hall of Fame</h1>
          <p className="text-sm text-muted-foreground mt-1">Kumpulkan XP terbanyak minggu ini untuk merebut posisi podium!</p>
        </div>
        <div className="flex items-center gap-2 bg-card border border-border px-4 py-2 rounded-2xl shadow-sm self-start md:self-auto">
          <Trophy className="w-4 h-4 text-warning" />
          <span className="text-xs font-extrabold">Reset Mingguan: 2 Hari Lagi</span>
        </div>
      </div>

      {/* Main Desktop 2-Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 items-start">
        
        {/* Left Column: Scope Tabs + Podium Showcase + User Status Card */}
        <div className="md:col-span-5 lg:col-span-5 space-y-5 md:sticky md:top-20">
          {/* Scope Tabs */}
          <div className="flex gap-1.5 p-1.5 bg-muted rounded-2xl w-full shadow-inner">
            {['Kelas', 'Sekolah', 'Kota', 'Nasional'].map(tab => (
              <button
                key={tab}
                onClick={() => setScope(tab)}
                className={`leaderboard-tab flex-1 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                  scope === tab
                    ? 'bg-card text-primary shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Podium */}
          <div id="podium-container" className="bg-gradient-to-br from-primary via-primary to-primary-glow rounded-3xl p-6 pt-8 text-primary-foreground shadow-glow relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.25),transparent_60%)]"></div>
            <div className="relative grid grid-cols-3 gap-2 items-end">
              {/* Rank 2 */}
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/40 grid place-items-center font-extrabold text-lg">
                  {p2.name[0]}
                </div>
                <p className="text-xs font-extrabold mt-2 text-center truncate w-full">{p2.name.split(' ')[0]}</p>
                <p className="text-[10px] font-mono opacity-80">{p2.xp.toLocaleString()}</p>
                <div className="h-20 w-full mt-2 bg-white/15 backdrop-blur-sm rounded-t-2xl border-t-2 border-white/30 grid place-items-center font-extrabold italic text-2xl">2</div>
              </div>

              {/* Rank 1 */}
              <div className="flex flex-col items-center animate-bounce">
                <Crown className="w-6 h-6 text-xp-gold fill-xp-gold mb-1 drop-shadow" />
                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm border-2 border-xp-gold grid place-items-center font-extrabold text-lg">
                  {p1.name[0]}
                </div>
                <p className="text-xs font-extrabold mt-2 text-center truncate w-full">{p1.name.split(' ')[0]}</p>
                <p className="text-[10px] font-mono opacity-80">{p1.xp.toLocaleString()}</p>
                <div className="h-28 w-full mt-2 bg-white/15 backdrop-blur-sm rounded-t-2xl border-t-2 border-white/30 grid place-items-center font-extrabold italic text-2xl">1</div>
              </div>

              {/* Rank 3 */}
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/40 grid place-items-center font-extrabold text-lg">
                  {p3.name[0]}
                </div>
                <p className="text-xs font-extrabold mt-2 text-center truncate w-full">{p3.name.split(' ')[0]}</p>
                <p className="text-[10px] font-mono opacity-80">{p3.xp.toLocaleString()}</p>
                <div className="h-16 w-full mt-2 bg-white/15 backdrop-blur-sm rounded-t-2xl border-t-2 border-white/30 grid place-items-center font-extrabold italic text-2xl">3</div>
              </div>
            </div>
          </div>

          {/* Tip / User Rank Banner */}
          <div className="bg-card border border-primary/20 rounded-3xl p-5 flex gap-4 items-center shadow-sm relative overflow-hidden">
            <div className="w-12 h-12 rounded-2xl bg-warning/10 border border-warning/30 grid place-items-center shrink-0">
              <Medal className="w-6 h-6 text-warning animate-bounce" />
            </div>
            <div className="flex-1 min-w-0">
              <p id="leaderboard-tip" className="text-xs text-foreground leading-relaxed">
                {userInfo && userInfo.rank <= 3 ? (
                  <span>
                    <span className="font-extrabold">Hebat! Kamu di podium #{userInfo.rank}!</span> Pertahankan posisimu dari tantangan minggu ini.
                  </span>
                ) : (
                  <span>
                    <span className="font-extrabold">Kamu di posisi #{userInfo ? userInfo.rank : 4}!</span> Butuh{' '}
                    <span className="font-extrabold text-warning">{diff > 0 ? diff : 0} XP</span> lagi untuk masuk podium.
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Full Leaderboard List */}
        <div className="md:col-span-7 lg:col-span-7 space-y-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-muted-foreground absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari siswa atau sekolah..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-card border border-border rounded-2xl pl-11 pr-4 py-3 text-xs font-bold focus:outline-none focus:border-primary transition-all placeholder:text-muted-foreground/60 shadow-sm"
            />
          </div>

          {/* List ranks 4+ */}
          <div id="leaderboard-list" className="space-y-2">
            {filteredRest.map(p => {
              const isYou = p.you;
              return (
                <div
                  key={p.name}
                  className={`flex items-center gap-3 p-4 rounded-2xl border transition-all ${
                    isYou
                      ? 'bg-primary/5 border-primary shadow-glow animate-pulse'
                      : 'bg-card border-border hover:border-primary/30 shadow-sm'
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-xl grid place-items-center font-extrabold text-xs shrink-0 ${
                      isYou
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {p.rank}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`font-extrabold text-sm truncate ${isYou ? 'text-primary' : 'text-foreground'}`}>
                      {p.name} {isYou && <span className="text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded ml-1 font-bold">Kamu</span>}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">{p.school || 'SMKN 13 Bandung'}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-extrabold text-sm tabular-nums">{p.xp.toLocaleString()}</p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">XP</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
