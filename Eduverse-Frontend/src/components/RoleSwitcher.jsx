import React from 'react';
import { ShieldCheck, UserCheck, User } from 'lucide-react';

export default function RoleSwitcher({ activeRole = 'owner', onRoleChange }) {
  return (
    <div className="flex items-center gap-1 bg-card p-1 rounded-full border border-border text-xs">
      <button
        type="button"
        onClick={() => onRoleChange('owner')}
        className={`flex items-center gap-1 px-3 py-1 rounded-full font-extrabold text-[11px] transition-all cursor-pointer ${
          activeRole === 'owner'
            ? 'bg-primary text-primary-foreground shadow-sm'
            : 'text-muted-foreground hover:text-foreground'
        }`}
        title="Owner Mode - Akses penuh termasuk Pengaturan Kelas"
      >
        <ShieldCheck className="w-3.5 h-3.5" />
        <span>Owner</span>
      </button>
      <button
        type="button"
        onClick={() => onRoleChange('admin')}
        className={`flex items-center gap-1 px-3 py-1 rounded-full font-extrabold text-[11px] transition-all cursor-pointer ${
          activeRole === 'admin'
            ? 'bg-brand-blue text-white shadow-sm'
            : 'text-muted-foreground hover:text-foreground'
        }`}
        title="Admin Mode - Membuat & mengedit materi/kuis"
      >
        <UserCheck className="w-3.5 h-3.5" />
        <span>Admin</span>
      </button>
      <button
        type="button"
        onClick={() => onRoleChange('member')}
        className={`flex items-center gap-1 px-3 py-1 rounded-full font-extrabold text-[11px] transition-all cursor-pointer ${
          activeRole === 'member'
            ? 'bg-success text-white shadow-sm'
            : 'text-muted-foreground hover:text-foreground'
        }`}
        title="Member Mode - Belajar & mengerjakan kuis"
      >
        <User className="w-3.5 h-3.5" />
        <span>Member</span>
      </button>
    </div>
  );
}
