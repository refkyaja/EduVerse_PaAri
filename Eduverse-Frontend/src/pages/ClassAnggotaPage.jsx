import React from 'react';
import { Users, ShieldCheck, UserCheck, User, UserX } from 'lucide-react';
import { useAppState } from '../context/AppStateContext';

export default function ClassAnggotaPage({ members, currentRole, onToggleAdmin, onKickMember }) {
  const { showToast } = useAppState();

  const isOwner = currentRole === 'owner';

  const handleAdminToggle = (mem) => {
    if (!isOwner) return;
    const newRole = mem.role === 'Admin' ? 'Member' : 'Admin';
    onToggleAdmin(mem.id, newRole);
    showToast(`Role ${mem.name} diperbarui menjadi ${newRole}`);
  };

  const handleKick = (mem) => {
    if (!isOwner) return;
    if (confirm(`Apakah Anda yakin ingin mengeluarkan ${mem.name} dari kelas?`)) {
      onKickMember(mem.id);
      showToast(`${mem.name} telah dikeluarkan dari kelas.`);
    }
  };

  const list = members || [
    { id: '1', name: 'Refky Satria', username: '@refky', role: 'Owner', avatar: '/assets/companion.png' },
    { id: '2', name: 'Budi Santoso', username: '@budi', role: 'Admin', avatar: '/assets/avatar.png' },
    { id: '3', name: 'Siti Rahma', username: '@siti', role: 'Member', avatar: '/assets/avatar.png' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-extrabold text-lg italic flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" /> Daftar Anggota Kelas
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">Total {list.length} anggota terdaftar dalam kelas ini.</p>
        </div>
      </div>

      <div className="space-y-3">
        {list.map(mem => {
          const isMemOwner = mem.role === 'Owner';
          const isMemAdmin = mem.role === 'Admin';

          return (
            <div
              key={mem.id}
              className="bg-card border border-border rounded-2xl p-4 flex items-center justify-between gap-3 shadow-sm hover:border-primary/30 transition-all"
            >
              <div className="flex items-center gap-3">
                <img
                  src={mem.avatar || '/assets/avatar.png'}
                  alt={mem.name}
                  className="w-10 h-10 rounded-full bg-muted object-cover"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-extrabold text-sm">{mem.name}</p>
                    {isMemOwner && (
                      <span className="bg-primary/10 text-primary text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" /> Owner
                      </span>
                    )}
                    {isMemAdmin && (
                      <span className="bg-brand-blue/10 text-brand-blue text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase flex items-center gap-1">
                        <UserCheck className="w-3 h-3" /> Admin
                      </span>
                    )}
                    {!isMemOwner && !isMemAdmin && (
                      <span className="bg-muted text-muted-foreground text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                        Member
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{mem.username}</p>
                </div>
              </div>

              {/* Owner Action Buttons */}
              {isOwner && !isMemOwner && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleAdminToggle(mem)}
                    className="bg-muted text-foreground font-bold px-3 py-1.5 rounded-xl text-xs hover:bg-muted/80 transition-colors"
                  >
                    {isMemAdmin ? 'Jadikan Member' : 'Jadikan Admin'}
                  </button>
                  <button
                    onClick={() => handleKick(mem)}
                    className="w-8 h-8 rounded-xl bg-danger/10 text-danger flex items-center justify-center hover:bg-danger/20 transition-colors"
                    title="Keluarkan Anggota"
                  >
                    <UserX className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
