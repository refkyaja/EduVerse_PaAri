import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Plus, ChevronRight, Sparkles, CheckCircle2, Clock, AlertCircle, XCircle, FileText } from 'lucide-react';
import { useAppState } from '../context/AppStateContext';

const statusBadgeMap = {
  'Terverifikasi': { color: 'bg-success/15 text-success border-success/30', Icon: CheckCircle2 },
  'Menunggu Verifikasi': { color: 'bg-warning/15 text-warning border-warning/30', Icon: Clock },
  'Draft': { color: 'bg-muted text-muted-foreground border-border', Icon: FileText },
  'Perlu Perbaikan': { color: 'bg-amber-500/15 text-amber-500 border-amber-500/30', Icon: AlertCircle },
  'Ditolak': { color: 'bg-danger/15 text-danger border-danger/30', Icon: XCircle },
};

export default function ClassMateriPage({ cls, materials, currentRole, onCreateMaterial }) {
  const { showToast } = useAppState();
  const [isCreating, setIsCreating] = useState(false);
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');

  const canCreate = currentRole === 'owner' || currentRole === 'admin';
  const classMaterials = materials?.filter(m => m.classId === cls?.id) || materials || [];

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const initialStatus = currentRole === 'owner' ? 'Terverifikasi' : 'Menunggu Verifikasi';

    onCreateMaterial({
      title: title.trim(),
      summary: summary.trim() || 'Ringkasan materi baru',
      content: content.trim() || '<p>Isi materi pembelajaran baru.</p>',
      status: initialStatus,
      createdBy: currentRole === 'owner' ? 'Refky Satria (Owner)' : 'Budi Santoso (Admin)',
      creatorRole: currentRole,
    });

    showToast(`Materi "${title}" berhasil dibuat! Status: ${initialStatus}`);
    setTitle('');
    setSummary('');
    setContent('');
    setIsCreating(false);
  };

  return (
    <div className="space-y-6">
      {/* Create Material Section */}
      {canCreate && (
        <div className="bg-card border border-border rounded-3xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-primary font-extrabold text-sm">
              <BookOpen className="w-4 h-4" />
              <span>Manajemen Materi Kelas</span>
            </div>

            {!isCreating && (
              <button
                onClick={() => setIsCreating(true)}
                className="bg-primary text-primary-foreground font-extrabold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-sm hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Buat Materi Baru
              </button>
            )}
          </div>

          {isCreating && (
            <form onSubmit={handleCreateSubmit} className="space-y-4 pt-2 animate-fade-in">
              <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
                  Judul Materi <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Pengenalan OOP & Class"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
                  Ringkasan Singkat
                </label>
                <input
                  type="text"
                  placeholder="Ringkasan poin-poin utama materi..."
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
                  Isi Materi (HTML / Teks)
                </label>
                <textarea
                  rows={4}
                  placeholder="Tuliskan konten materi pembelajaran..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary resize-none font-mono text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="bg-muted text-muted-foreground font-bold px-4 py-2 rounded-xl text-xs hover:bg-muted/80"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-primary to-primary-glow text-white font-extrabold px-5 py-2 rounded-xl text-xs shadow-glow flex items-center gap-1"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Simpan Materi
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Materials List */}
      <div className="space-y-4">
        <h3 className="font-extrabold text-lg italic flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-primary" /> Daftar Materi Pembelajaran
        </h3>

        {classMaterials.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {classMaterials.map((mat) => {
              const badge = statusBadgeMap[mat.status] || statusBadgeMap['Draft'];
              const BadgeIcon = badge.Icon;

              return (
                <Link
                  key={mat.id}
                  to={`/class/${cls.id}/materi/${mat.id}`}
                  className="bg-card border border-border rounded-3xl p-5 shadow-sm hover:shadow-md hover:border-primary/40 transition-all active:scale-[0.98] block space-y-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-primary bg-primary/10 px-2.5 py-0.5 rounded-full">
                      Materi
                    </span>
                    <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border flex items-center gap-1 ${badge.color}`}>
                      <BadgeIcon className="w-3 h-3" /> {mat.status}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-extrabold text-base text-foreground leading-snug">{mat.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{mat.summary || mat.description}</p>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-2 border-t border-border/60">
                    <span>Oleh: <strong className="text-foreground">{mat.createdBy}</strong></span>
                    <span className="text-primary font-bold flex items-center gap-0.5">
                      Versi {mat.activeVersion || 1} <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="bg-card border border-border rounded-3xl p-8 text-center text-muted-foreground text-xs">
            Belum ada materi di kelas ini.
          </div>
        )}
      </div>
    </div>
  );
}
