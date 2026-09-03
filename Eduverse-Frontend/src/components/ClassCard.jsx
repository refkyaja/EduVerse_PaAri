import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Lock, Globe, ArrowRight } from 'lucide-react';
import { useAppState } from '../context/AppStateContext';

export default function ClassCard({ cls }) {
  const { currentUser } = useAppState();
  if (!cls) return null;

  const bannerImgSrc = cls.bannerImage || '/assets/banner_eduverse.png';
  const displayOwner = cls.owner?.name || cls.owner?.username || cls.ownerName || 'Pemilik Kelas';

  return (
    <div className="bg-card border border-border rounded-3xl shadow-sm hover:shadow-xl hover:border-primary/40 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden">
      {/* Header Banner with Background Image */}
      <div className="relative h-36 md:h-40 w-full overflow-hidden flex flex-col justify-between p-4 md:p-5 select-none">
        {/* Banner Image */}
        <img
          src={bannerImgSrc}
          alt={cls.name}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Gradient Overlay for text contrast */}
        <div
          className="absolute inset-0 z-0 bg-gradient-to-t from-slate-950/95 via-slate-900/60 to-slate-900/40"
        />

        {/* Class Title sitting directly OVER the background banner image */}
        <div className="relative z-10 pt-2">
          <h3 className="font-extrabold text-xl md:text-2xl italic text-white drop-shadow-md group-hover:text-primary-glow transition-colors truncate">
            {cls.name}
          </h3>
          <p className="text-xs text-white/80 font-medium truncate mt-0.5">
            Pembuat: {displayOwner}
          </p>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-5 md:p-6 pt-5 flex-1 flex flex-col justify-between space-y-4">
        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
          {cls.description}
        </p>

        <div className="pt-3 border-t border-border/60 space-y-3">
          <div className="flex items-center text-xs text-muted-foreground font-semibold">
            <span className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-primary" /> {cls.memberCount || 32} Anggota
            </span>
          </div>

          <Link
            to={`/class/${cls.id}`}
            className="w-full bg-gradient-to-r from-primary to-primary-glow text-primary-foreground font-extrabold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm hover:shadow-glow active:scale-95 transition-all block text-center cursor-pointer"
          >
            Masuk Kelas <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

