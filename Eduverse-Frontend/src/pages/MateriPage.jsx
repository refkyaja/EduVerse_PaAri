import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { BookOpen, Layers, Clock, Award, BookOpenCheck, ChevronRight } from 'lucide-react';
import MateriModal from '../components/MateriModal';
import VerificationBadge from '../components/VerificationBadge';
import MaterialVersionDropdown from '../components/MaterialVersionDropdown';
import { useAppState } from '../context/AppStateContext';

export default function MateriPage() {
  const { classId } = useParams();
  const { findClass } = useAppState();
  const [selectedMateriId, setSelectedMateriId] = useState(null);

  const activeClass = classId && findClass ? findClass(classId) : null;
  const isDemoClass = !classId || classId === 'cls-101' || classId === 'cls-102' || classId === 'cls-103';

  const subjects = isDemoClass ? [
    {
      code: 'PABP',
      name: 'PABP',
      gradient: 'from-emerald-600 to-green-700',
      chapters: [
        { id: 'pabp-buku', num: '01', title: 'Buku Paket PABP', desc: 'Ringkasan · Materi', status: 'verified', version: 2 },
      ]
    },
    {
      code: 'IND',
      name: 'Bahasa Indonesia',
      gradient: 'from-orange-500 to-pink-600',
      chapters: [
        { id: 'ind-iklan', num: '01', title: 'Teks Iklan & Slogan', desc: 'Ringkasan · Materi', status: 'verified', version: 1 },
        { id: 'ind-berita', num: '02', title: 'Teks Berita', desc: 'Ringkasan · Materi', status: 'verified', version: 2 },
        { id: 'ind-multimodal', num: '03', title: 'Teks Multimodal', desc: 'Ringkasan · Materi', status: 'verified', version: 1 },
      ]
    },
    {
      code: 'PWP',
      name: 'PWP (Pemrograman Web & Perangkat Bergerak)',
      gradient: 'from-rose-500 to-red-600',
      chapters: [
        { id: 'pwp-laravel', num: '01', title: 'Pengenalan Arsitektur MVC pada Laravel', desc: 'Ringkasan · Materi', status: 'verified', version: 3 },
      ]
    },
    {
      code: 'PPAN',
      name: 'Pendidikan Pancasila',
      gradient: 'from-amber-500 to-yellow-600',
      chapters: [
        { id: 'ppan-bab3', num: '01', title: 'Harmoni dalam Keberagaman', desc: 'Ringkasan · Materi', status: 'verified', version: 1 },
        { id: 'ppan-bab4', num: '02', title: 'Wawasan Nusantara', desc: 'Ringkasan · Materi', status: 'verified', version: 1 },
      ]
    },
    {
      code: 'MTK',
      name: 'Matematika',
      gradient: 'from-violet-500 to-purple-600',
      chapters: [
        { id: 'mtk-matriks', num: '01', title: 'Matriks & Determinan', desc: 'Ringkasan · Materi', status: 'verified', version: 2 },
        { id: 'mtk-transformasi', num: '02', title: 'Transformasi Geometri', desc: 'Ringkasan · Materi', status: 'verified', version: 1 },
      ]
    },
  ] : [];

  return (
    <section className="px-4 md:px-8 pt-6 space-y-6 animate-fade-in flex flex-col max-w-7xl mx-auto w-full pb-24">
      {/* Header Title Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-card via-card to-primary/10 border border-border rounded-3xl p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/30 grid place-items-center text-primary shrink-0 shadow-sm">
            <BookOpenCheck className="w-7 h-7" />
          </div>
          <div>
            <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-extrabold uppercase tracking-widest border border-primary/20">Pusat Pembelajaran</span>
            <h1 className="text-2xl md:text-3xl font-extrabold italic tracking-tight text-foreground mt-0.5">Materi Belajar</h1>
            <p className="text-xs md:text-sm text-muted-foreground mt-0.5">Ringkasan ringkas + flashcard interaktif otomatis di setiap bab.</p>
          </div>
        </div>
      </div>

      {/* 4 Metrics Showcase Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <div className="bg-card border border-border hover:border-primary/40 rounded-2xl p-4 shadow-sm transition-all flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/30 grid place-items-center text-primary shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <p className="text-2xl font-extrabold italic tabular-nums text-foreground">24</p>
            <p className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider">Materi Dibaca</p>
          </div>
        </div>

        <div className="bg-card border border-border hover:border-primary/40 rounded-2xl p-4 shadow-sm transition-all flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-blue/10 border border-brand-blue/30 grid place-items-center text-brand-blue shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <p className="text-2xl font-extrabold italic tabular-nums text-foreground">128</p>
            <p className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider">Flashcard Aktif</p>
          </div>
        </div>

        <div className="bg-card border border-border hover:border-primary/40 rounded-2xl p-4 shadow-sm transition-all flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-warning/10 border border-warning/30 grid place-items-center text-warning shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-2xl font-extrabold italic tabular-nums text-foreground">4.5h</p>
            <p className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider">Total Waktu Baca</p>
          </div>
        </div>

        <div className="bg-card border border-border hover:border-primary/40 rounded-2xl p-4 shadow-sm transition-all flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 grid place-items-center text-emerald-500 shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <p className="text-2xl font-extrabold italic tabular-nums text-foreground">92%</p>
            <p className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider">Tingkat Pemahaman</p>
          </div>
        </div>
      </div>

      {/* Subject Chapters with Verification Badges & Version Dropdown or Empty State */}
      {subjects.length > 0 ? (
        <div className="space-y-8">
          {subjects.map(s => (
            <section key={s.code} className="space-y-3">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${s.gradient} grid place-items-center text-white font-extrabold text-[10px] shadow-md`}>
                  {s.code}
                </div>
                <h3 className="font-extrabold text-base">{s.name}</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {s.chapters.map((ch, idx) => (
                  <div
                    key={ch.id || idx}
                    className="bg-card border border-border rounded-2xl p-4 shadow-sm hover:border-primary/30 transition-all flex flex-col justify-between gap-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-lg bg-muted grid place-items-center text-xs font-extrabold text-muted-foreground shrink-0">
                          {ch.num}
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-bold text-xs truncate">{ch.title}</h4>
                          <p className="text-[10px] text-muted-foreground">{ch.desc}</p>
                        </div>
                      </div>
                      <VerificationBadge status={ch.status || 'verified'} />
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-border/50 text-[10px]">
                      <MaterialVersionDropdown material={ch} />
                      <button
                        onClick={() => setSelectedMateriId(ch.id)}
                        className="text-primary font-bold hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        Buka Materi <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <div className="bg-card rounded-3xl p-10 text-center space-y-3 shadow-sm border border-border">
          <BookOpen className="w-12 h-12 text-muted-foreground mx-auto" />
          <h3 className="font-extrabold text-lg">Belum Ada Materi Pelajaran</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            Owner atau Admin belum menambahkan materi pelajaran untuk kelas ini.
          </p>
          <div className="pt-2">
            <Link
              to={classId ? `/class/${classId}/profile` : "/profile"}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground font-extrabold text-xs rounded-2xl shadow-glow hover:scale-105 transition-all"
            >
              <span>Kelola &amp; Tambah Materi</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}

      <MateriModal
        materiId={selectedMateriId}
        onClose={() => setSelectedMateriId(null)}
      />
    </section>
  );
}
