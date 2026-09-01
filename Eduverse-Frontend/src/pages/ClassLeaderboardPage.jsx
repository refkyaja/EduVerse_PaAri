import React from 'react';
import { Crown, Trophy, Medal } from 'lucide-react';
import { useAppState } from '../context/AppStateContext';

export default function ClassLeaderboardPage({ leaderboardData }) {
  const { appState } = useAppState();

  const data = leaderboardData || [
    { rank: 1, name: "Refky Satria (Kamu)", xp: appState.xp || 3950, role: "Owner", isCurrentUser: true },
    { rank: 2, name: "Budi Santoso", xp: 3420, role: "Admin", isCurrentUser: false },
    { rank: 3, name: "Siti Rahma", xp: 2980, role: "Member", isCurrentUser: false },
    { rank: 4, name: "Andi Wijaya", xp: 2650, role: "Member", isCurrentUser: false },
    { rank: 5, name: "Dewi Lestari", xp: 2100, role: "Member", isCurrentUser: false },
  ];

  const p1 = data[0] || { name: '-', xp: 0 };
  const p2 = data[1] || { name: '-', xp: 0 };
  const p3 = data[2] || { name: '-', xp: 0 };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-extrabold text-lg italic flex items-center gap-2">
            <Trophy className="w-5 h-5 text-xp-gold fill-xp-gold" /> Papan Peringkat Kelas
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">Peringkat anggota berdasarkan total perolehan XP.</p>
        </div>
      </div>

      {/* Podium */}
      <div className="bg-gradient-to-br from-primary via-primary to-primary-glow rounded-3xl p-6 text-primary-foreground shadow-glow relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.25),transparent_60%)]"></div>
        <div className="relative grid grid-cols-3 gap-2 items-end">
          {/* Rank 2 */}
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/40 grid place-items-center font-extrabold text-lg">
              {p2.name[0]}
            </div>
            <p className="text-xs font-extrabold mt-2 text-center truncate w-full">{p2.name.split(' ')[0]}</p>
            <p className="text-[10px] font-mono opacity-80">{p2.xp.toLocaleString()} XP</p>
            <div className="h-20 w-full mt-2 bg-white/15 backdrop-blur-sm rounded-t-2xl border-t-2 border-white/30 grid place-items-center font-extrabold italic text-2xl">2</div>
          </div>

          {/* Rank 1 */}
          <div className="flex flex-col items-center animate-bounce">
            <Crown className="w-6 h-6 text-xp-gold fill-xp-gold mb-1 drop-shadow" />
            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm border-2 border-xp-gold grid place-items-center font-extrabold text-lg">
              {p1.name[0]}
            </div>
            <p className="text-xs font-extrabold mt-2 text-center truncate w-full">{p1.name.split(' ')[0]}</p>
            <p className="text-[10px] font-mono opacity-80">{p1.xp.toLocaleString()} XP</p>
            <div className="h-28 w-full mt-2 bg-white/15 backdrop-blur-sm rounded-t-2xl border-t-2 border-white/30 grid place-items-center font-extrabold italic text-2xl">1</div>
          </div>

          {/* Rank 3 */}
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/40 grid place-items-center font-extrabold text-lg">
              {p3.name[0]}
            </div>
            <p className="text-xs font-extrabold mt-2 text-center truncate w-full">{p3.name.split(' ')[0]}</p>
            <p className="text-[10px] font-mono opacity-80">{p3.xp.toLocaleString()} XP</p>
            <div className="h-16 w-full mt-2 bg-white/15 backdrop-blur-sm rounded-t-2xl border-t-2 border-white/30 grid place-items-center font-extrabold italic text-2xl">3</div>
          </div>
        </div>
      </div>

      {/* Ranks List */}
      <div className="space-y-2">
        {data.map((p, idx) => (
          <div
            key={p.name + idx}
            className={`flex items-center gap-3 p-3.5 rounded-2xl border transition-all ${
              p.isCurrentUser
                ? 'bg-primary/5 border-primary shadow-glow'
                : 'bg-card border-border'
            }`}
          >
            <div
              className={`w-9 h-9 rounded-xl grid place-items-center font-extrabold text-sm ${
                p.isCurrentUser ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              }`}
            >
              {idx + 1}
            </div>
            <div className="flex-1 min-w-0">
              <p className={`font-extrabold text-sm truncate ${p.isCurrentUser ? 'text-primary' : ''}`}>
                {p.name}
              </p>
              <p className="text-[10px] text-muted-foreground uppercase font-bold">Role: {p.role}</p>
            </div>
            <div className="text-right">
              <p className="font-extrabold text-sm tabular-nums text-primary">{p.xp.toLocaleString()}</p>
              <p className="text-[10px] text-muted-foreground uppercase font-bold">XP</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
