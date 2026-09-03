import React, { useState } from 'react';
import { Users, ShieldCheck, UserCheck, UserX } from 'lucide-react';
import { useAppState } from '../context/AppStateContext';
import ConfirmModal from '../components/ConfirmModal';

export default function ClassAnggotaPage({ members, currentRole, onToggleAdmin, onKickMember }) {
  const { showToast } = useAppState();
  const [memberToKick, setMemberToKick] = useState(null);

  const isOwner = currentRole === 'owner';

  const handleAdminToggle = (mem) => {
    if (!isOwner) return;
    const newRole = mem.role === 'Admin' || mem.role === 'admin' ? 'Member' : 'Admin';
    onToggleAdmin(mem.id, newRole);
  };

  const handleKickClick = (mem) => {
    if (!isOwner) return;
    setMemberToKick(mem);
  };

  const confirmKick = () => {
    if (memberToKick) {
      onKickMember(memberToKick.id);
      setMemberToKick(null);
    }
  };

  const list = members || [];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between border-b border-border pb-3">
        <div>
          <h3 className="font-extrabold text-base sm:text-lg flex items-center gap-2 text-foreground">
            <Users className="w-5 h-5 text-primary shrink-0" /> Daftar Anggota Kelas
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">Total {list.length} anggota terdaftar dalam kelas ini.</p>
        </div>
      </div>

      <div className="space-y-2.5">
        {list.map(mem => {
          const isMemOwner = mem.role === 'Owner' || mem.role === 'owner';
          const isMemAdmin = mem.role === 'Admin' || mem.role === 'admin';

          return (
            <div
              key={mem.id}
              className="bg-card border border-border rounded-2xl p-3.5 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs hover:border-primary/30 transition-all overflow-hidden"
            >
              {/* Member Info */}
              <div className="flex items-center gap-3 min-w-0 flex-1 w-full sm:w-auto">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center text-primary font-bold text-sm shrink-0 overflow-hidden shadow-xs">
                  {mem.avatar ? (
                    <img
                      src={mem.avatar}
                      alt={mem.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <span>{mem.name ? mem.name.charAt(0).toUpperCase() : 'U'}</span>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-extrabold text-sm text-foreground truncate">{mem.name}</p>
                    {isMemOwner && (
                      <span className="bg-primary/15 text-primary text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase flex items-center gap-1 shrink-0">
                        <ShieldCheck className="w-3 h-3" /> Owner
                      </span>
                    )}
                    {isMemAdmin && (
                      <span className="bg-brand-blue/15 text-brand-blue text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase flex items-center gap-1 shrink-0">
                        <UserCheck className="w-3 h-3" /> Admin
                      </span>
                    )}
                    {!isMemOwner && !isMemAdmin && (
                      <span className="bg-muted text-muted-foreground text-[10px] font-bold px-2 py-0.5 rounded-full uppercase shrink-0">
                        Member
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground font-medium mt-0.5 truncate">{mem.username}</p>
                </div>
              </div>

              {/* Owner Action Buttons */}
              {isOwner && !isMemOwner && (
                <div className="flex items-center justify-end gap-2 shrink-0 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-0 border-border/50">
                  <button
                    onClick={() => handleAdminToggle(mem)}
                    className="bg-muted hover:bg-muted/80 text-foreground font-bold px-3 py-1.5 rounded-xl text-xs transition-colors whitespace-nowrap cursor-pointer"
                  >
                    {isMemAdmin ? 'Jadikan Member' : 'Jadikan Admin'}
                  </button>
                  <button
                    onClick={() => handleKickClick(mem)}
                    className="w-8 h-8 rounded-xl bg-danger/10 text-danger hover:bg-danger/20 flex items-center justify-center transition-colors shrink-0 cursor-pointer"
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

      <ConfirmModal
        isOpen={Boolean(memberToKick)}
        onClose={() => setMemberToKick(null)}
        onConfirm={confirmKick}
        title="Keluarkan Anggota?"
        description={`Apakah Anda yakin ingin mengeluarkan "${memberToKick?.name}" dari kelas ini?`}
        confirmText="Ya, Keluarkan"
        cancelText="Batal"
        variant="danger"
      />
    </div>
  );
}

