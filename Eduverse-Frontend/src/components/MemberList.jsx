import { Shield, UserCheck, User, Trash2 } from 'lucide-react';

export default function MemberList({ members, currentRole, onToggleAdmin, onKickMember }) {
  const getRoleBadge = (role) => {
    switch (role) {
      case 'Owner':
        return (
          <span className="badge badge-owner">
            <Shield className="w-3 h-3" /> Owner
          </span>
        );
      case 'Admin':
        return (
          <span className="badge badge-admin">
            <UserCheck className="w-3 h-3" /> Admin
          </span>
        );
      case 'Member':
      default:
        return (
          <span className="badge badge-member">
            <User className="w-3 h-3" /> Member
          </span>
        );
    }
  };

  return (
    <div className="glass-card overflow-hidden">
      <div className="p-4 sm:p-6 border-b border-slate-800 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <User className="w-5 h-5 text-indigo-400" />
            <span>Daftar Anggota Kelas ({members.length})</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Anggota yang terdaftar dalam kelas ini.
          </p>
        </div>
      </div>

      <div className="divide-y divide-slate-800/60">
        {members.map((member) => (
          <div key={member.id} className="p-4 flex items-center justify-between hover:bg-slate-800/40 transition-colors">
            <div className="flex items-center gap-3">
              <img
                src={member.avatar}
                alt={member.name}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-700"
              />
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-200 text-sm">{member.name}</span>
                  {getRoleBadge(member.role)}
                </div>
                <span className="text-xs text-slate-400 font-mono">@{member.username} · Bergabung {member.joinedAt}</span>
              </div>
            </div>

            {/* Owner Actions */}
            {currentRole === 'owner' && member.role !== 'Owner' && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onToggleAdmin && onToggleAdmin(member.id)}
                  className={`btn btn-sm ${
                    member.role === 'Admin' ? 'btn-secondary text-amber-300' : 'btn-secondary text-blue-400'
                  }`}
                  title={member.role === 'Admin' ? 'Jadikan Member Biasa' : 'Jadikan Admin Kelas'}
                >
                  {member.role === 'Admin' ? 'Turunkan Admin' : 'Jadikan Admin'}
                </button>

                <button
                  onClick={() => onKickMember && onKickMember(member.id)}
                  className="btn btn-sm btn-danger p-2"
                  title="Keluarkan dari kelas"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
