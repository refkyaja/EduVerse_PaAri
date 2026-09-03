import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ChevronRight, FileText, Plus, BookOpen, Library, BookOpenCheck, ShieldAlert } from 'lucide-react';
import MateriModal from '../components/MateriModal';
import VerificationBadge from '../components/VerificationBadge';
import MaterialVersionDropdown from '../components/MaterialVersionDropdown';
import { useAppState } from '../context/AppStateContext';
import { apiService } from '../services/apiService';

export default function MateriPage({ currentRole }) {
  const { classId } = useParams();
  const { findClass, materiList, currentUser } = useAppState();
  const [selectedMateriId, setSelectedMateriId] = useState(null);
  const [apiMaterials, setApiMaterials] = useState([]);

  const activeClass = classId && findClass ? findClass(classId) : null;
  const isApiClass = Boolean(classId && !String(classId).startsWith('cls-') && !isNaN(Number(classId)));
  const userRole = String(currentRole || activeClass?.role || currentUser?.activeRole || 'member').toLowerCase();
  const canManage = userRole === 'owner' || userRole === 'admin';

  useEffect(() => {
    if (isApiClass && classId) {
      apiService.getMateri(classId).then(data => {
        if (Array.isArray(data)) {
          setApiMaterials(data.map(item => ({
            id: item.id,
            classId: classId,
            subject: item.mapel?.kode || 'MATERI',
            subjectName: item.mapel?.nama || 'Mata Pelajaran',
            title: item.judul,
            content: item.isi || item.versi_aktif?.isi || '',
            num: '01',
            status: item.versi_aktif?.status || 'verified',
            version: item.versi_aktif?.versi || 1
          })));
        }
      }).catch(() => {});
    }
  }, [isApiClass, classId]);

  if (classId && !activeClass && !isApiClass) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 space-y-4 animate-fade-in max-w-md mx-auto py-12">
        <div className="w-16 h-16 rounded-3xl bg-danger/10 text-danger flex items-center justify-center shadow-inner">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h2 className="text-xl font-extrabold italic text-foreground">Akses Ditolak / Kelas Tidak Ditemukan</h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Ruang kelas dengan ID <code className="text-primary font-mono bg-muted px-1.5 py-0.5 rounded">{classId}</code> tidak ditemukan atau Anda tidak terdaftar sebagai anggota di kelas ini.
          </p>
        </div>
        <div className="pt-2">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground font-extrabold text-xs rounded-xl shadow-glow hover:scale-105 transition-all"
          >
            <span>Kembali ke Beranda</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  // Filter materials for current class or global + combine API materials
  const localFiltered = (materiList || []).filter(m => {
    if (!classId) return true;
    return m.classId === classId || m.classId === 'global';
  });
  const filteredMaterials = [...apiMaterials, ...localFiltered];

  const subjectsMap = {};
  filteredMaterials.forEach((m) => {
    const code = (m.subject || m.code || 'MATERI').toUpperCase();
    if (!subjectsMap[code]) {
      subjectsMap[code] = {
        code: code,
        name: m.subjectName || m.subject || code,
        gradient: 'from-indigo-500 to-purple-600',
        chapters: []
      };
    }
    subjectsMap[code].chapters.push({
      id: m.id,
      num: String(subjectsMap[code].chapters.length + 1).padStart(2, '0'),
      title: m.title,
      desc: 'Ringkasan · Materi Belajar',
      content: m.content,
      status: m.status || 'verified',
      version: m.version || 1
    });
  });

  const subjects = Object.values(subjectsMap);
  const totalMaterials = subjects.reduce((acc, s) => acc + (s.chapters?.length || 0), 0);
  const selectedMateriObj = filteredMaterials.find(m => m.id === selectedMateriId) || null;

  return (
    <section className="px-4 md:px-8 pt-6 space-y-6 animate-fade-in flex flex-col max-w-7xl mx-auto w-full pb-24">
      {/* Header Title Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-4 bg-gradient-to-r from-card via-card to-primary/10 border border-border rounded-2xl md:rounded-3xl p-3.5 sm:p-4 md:p-6 shadow-sm">
        <div className="flex items-center gap-3 md:gap-4">
          <div className="w-11 h-11 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-2xl bg-primary/10 border border-primary/30 grid place-items-center text-primary shrink-0 shadow-sm">
            <BookOpenCheck className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
          </div>
          <div>
            <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[9px] sm:text-[10px] font-extrabold uppercase tracking-widest border border-primary/20">Pusat Pembelajaran</span>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold italic tracking-tight text-foreground mt-0.5 leading-tight">Materi Belajar</h1>
            <p className="text-[11px] sm:text-xs md:text-sm text-muted-foreground mt-0.5 leading-tight">Rangkuman terstruktur &amp; materi pembelajaran interaktif per mata pelajaran.</p>
          </div>
        </div>
      </div>

      {/* 2 Metrics Showcase Grid - 2 columns side-by-side even on mobile */}
      <div className="grid grid-cols-2 gap-3 md:gap-4 items-stretch">
        <div className="bg-card border border-border hover:border-primary/40 rounded-2xl md:rounded-3xl p-3.5 sm:p-4 md:p-5 shadow-sm transition-all flex items-center gap-3 md:gap-4 group min-w-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-xl sm:rounded-2xl bg-primary/10 border border-primary/30 grid place-items-center text-primary shrink-0 group-hover:scale-110 transition-transform">
            <Library className="w-4.5 h-4.5 sm:w-5 sm:h-5 md:w-6 md:h-6" />
          </div>
          <div className="min-w-0">
            <p className="text-xl sm:text-2xl md:text-3xl font-extrabold italic tabular-nums text-foreground tracking-tight leading-none">{subjects.length}</p>
            <p className="text-[9px] sm:text-[10px] md:text-xs font-extrabold text-muted-foreground uppercase tracking-wider mt-1 leading-tight truncate">Mata Pelajaran</p>
          </div>
        </div>

        <div className="bg-card border border-border hover:border-primary/40 rounded-2xl md:rounded-3xl p-3.5 sm:p-4 md:p-5 shadow-sm transition-all flex items-center gap-3 md:gap-4 group min-w-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-xl sm:rounded-2xl bg-brand-blue/10 border border-brand-blue/30 grid place-items-center text-brand-blue shrink-0 group-hover:scale-110 transition-transform">
            <BookOpen className="w-4.5 h-4.5 sm:w-5 sm:h-5 md:w-6 md:h-6" />
          </div>
          <div className="min-w-0">
            <p className="text-xl sm:text-2xl md:text-3xl font-extrabold italic tabular-nums text-foreground tracking-tight leading-none">{totalMaterials}</p>
            <p className="text-[9px] sm:text-[10px] md:text-xs font-extrabold text-muted-foreground uppercase tracking-wider mt-1 leading-tight truncate">Total Materi Belajar</p>
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
                      <MaterialVersionDropdown
                        versions={[{ version: ch.version || 1, updatedAt: 'Terbaru', updatedBy: 'Owner', status: ch.status }]}
                        activeVersion={ch.version || 1}
                        onSelectVersion={() => {}}
                      />
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
          {canManage && (
            <div className="pt-2">
              <Link
                to={classId ? `/class/${classId}/profile` : "/profile"}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground font-extrabold text-xs rounded-2xl shadow-glow hover:scale-105 transition-all"
              >
                <span>Kelola &amp; Tambah Materi</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      )}

      <MateriModal
        materi={selectedMateriObj}
        materiId={selectedMateriId}
        onClose={() => setSelectedMateriId(null)}
      />
    </section>
  );
}
