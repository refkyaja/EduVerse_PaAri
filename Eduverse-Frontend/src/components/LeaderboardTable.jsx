import { Trophy, Award, Medal, Zap } from 'lucide-react';

export default function LeaderboardTable({ leaderboardData }) {
  const getRankBadge = (rank) => {
    switch (rank) {
      case 1:
        return (
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-200 text-slate-950 flex items-center justify-center font-black shadow-lg shadow-amber-500/20">
            <Trophy className="w-4 h-4 text-slate-950" />
          </div>
        );
      case 2:
        return (
          <div className="w-8 h-8 rounded-full bg-slate-300 text-slate-950 flex items-center justify-center font-black shadow-md">
            <Award className="w-4 h-4 text-slate-900" />
          </div>
        );
      case 3:
        return (
          <div className="w-8 h-8 rounded-full bg-amber-700/80 text-amber-200 flex items-center justify-center font-black shadow-sm">
            <Medal className="w-4 h-4" />
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center font-bold text-xs">
            #{rank}
          </div>
        );
    }
  };

  return (
    <div className="glass-card overflow-hidden">
      <div className="p-4 sm:p-6 border-b border-slate-800 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            <span>Leaderboard Kelas (XP)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Peringkat anggota berdasarkan perolehan XP kuis & aktivitas belajar.
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
          <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
          <span>Sistem XP EduVerse</span>
        </div>
      </div>

      <div className="divide-y divide-slate-800/60">
        {leaderboardData.map((item) => (
          <div
            key={item.id}
            className={`p-4 flex items-center justify-between transition-colors ${
              item.isCurrentUser
                ? 'bg-indigo-600/15 border-l-4 border-indigo-500'
                : 'hover:bg-slate-800/40'
            }`}
          >
            <div className="flex items-center gap-3 sm:gap-4">
              {getRankBadge(item.rank)}
              
              <img
                src={item.avatar}
                alt={item.name}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-700"
              />

              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-200 text-sm sm:text-base">
                    {item.name}
                  </span>
                  {item.isCurrentUser && (
                    <span className="text-[10px] bg-indigo-500 text-white font-extrabold px-1.5 py-0.5 rounded">
                      Anda
                    </span>
                  )}
                </div>
                <span className="text-xs text-slate-400 font-mono">@{item.username}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800">
              <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span className="font-black text-amber-400 text-sm sm:text-base">{item.xp} XP</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
