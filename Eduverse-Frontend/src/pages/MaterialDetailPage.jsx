import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Clock, AlertCircle, XCircle, Edit3, Sparkles, User, History } from 'lucide-react';
import MaterialVersionDropdown from '../components/MaterialVersionDropdown';
import { useAppState } from '../context/AppStateContext';

export default function MaterialDetailPage({ materials, currentRole, onUpdateMaterialStatus, onEditMaterialContent }) {
  const { classId, materialId } = useParams();
  const navigate = useNavigate();
  const { showToast } = useAppState();

  const material = materials?.find(m => m.id === materialId) || materials?.[0];

  const [selectedVersion, setSelectedVersion] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState('');

  if (!material) {
    return (
      <div className="p-8 text-center space-y-4">
        <p className="text-muted-foreground text-sm">Materi tidak ditemukan.</p>
        <button onClick={() => navigate(-1)} className="bg-primary text-white font-bold px-4 py-2 rounded-xl text-xs">
          Kembali
        </button>
      </div>
    );
  }

  const isOwner = currentRole === 'owner';
  const versions = material.versions || [
    {
      version: material.activeVersion || 1,
      updatedAt: 'Baru saja',
      updatedBy: material.createdBy,
      status: material.status,
      content: material.content,
    }
  ];

  const activeVer = selectedVersion || material.activeVersion || versions[0]?.version || 1;
  const currentVerObj = versions.find(v => v.version === activeVer) || versions[0];

  const handleStartEdit = () => {
    setEditContent(currentVerObj.content || '');
    setIsEditing(true);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editContent.trim()) return;

    onEditMaterialContent(material.id, editContent.trim(), currentRole);
    showToast(isOwner ? "Versi baru berhasil diterbitkan & terverifikasi!" : "Versi baru dibuat! Menunggu verifikasi Owner.");
    setIsEditing(false);
  };

  const handleOwnerAction = (newStatus) => {
    onUpdateMaterialStatus(material.id, newStatus);
    showToast(`Status materi diperbarui menjadi: ${newStatus}`);
  };

  return (
    <div className="px-4 md:px-8 py-6 space-y-6 animate-fade-in max-w-4xl mx-auto">
      {/* Back Button */}
      <button
        onClick={() => navigate(`/class/${classId || material.classId}/materi`)}
        className="flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" /> Kembali ke Daftar Materi
      </button>

      {/* Header Info */}
      <div className="bg-card border border-border rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <span className="text-xs font-extrabold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full">
            Materi
          </span>

          <MaterialVersionDropdown
            versions={versions}
            activeVersion={activeVer}
            onSelectVersion={(v) => setSelectedVersion(v)}
          />
        </div>

        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold italic text-foreground leading-tight">
            {material.title}
          </h1>
          <p className="text-xs md:text-sm text-muted-foreground mt-2 leading-relaxed">
            {material.summary}
          </p>
        </div>

        <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground pt-3 border-t border-border flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-primary" />
            <span>Dibuat oleh: <strong className="text-foreground">{currentVerObj.reviewer?.name || currentVerObj.creator?.name || currentVerObj.updatedBy || material.createdBy || 'Kontributor'}</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] bg-muted px-2.5 py-1 rounded-lg">
              Status: <strong className="text-primary">{currentVerObj.status || material.status}</strong>
            </span>
          </div>
        </div>

        {/* Owner Verification Action Bar (If status is pending verification) */}
        {isOwner && material.status === 'Menunggu Verifikasi' && (
          <div className="bg-warning/10 border border-warning/30 rounded-2xl p-4 space-y-2 animate-scale-in">
            <p className="text-xs font-extrabold text-warning flex items-center gap-1.5">
              <Clock className="w-4 h-4" /> Perhatian Owner: Materi ini Menunggu Verifikasi
            </p>
            <p className="text-xs text-muted-foreground">
              Materi dibuat atau diubah oleh Admin. Pilih tindakan verifikasi untuk menyetujui versi ini:
            </p>
            <div className="flex gap-2 pt-1 flex-wrap">
              <button
                onClick={() => handleOwnerAction('Terverifikasi')}
                className="bg-success text-white font-extrabold px-4 py-2 rounded-xl text-xs shadow-sm flex items-center gap-1 cursor-pointer"
              >
                <CheckCircle2 className="w-3.5 h-3.5" /> Setujui (Terverifikasi)
              </button>
              <button
                onClick={() => handleOwnerAction('Perlu Perbaikan')}
                className="bg-amber-500 text-white font-extrabold px-4 py-2 rounded-xl text-xs shadow-sm flex items-center gap-1 cursor-pointer"
              >
                <AlertCircle className="w-3.5 h-3.5" /> Minta Perbaikan
              </button>
              <button
                onClick={() => handleOwnerAction('Ditolak')}
                className="bg-danger text-white font-extrabold px-4 py-2 rounded-xl text-xs shadow-sm flex items-center gap-1 cursor-pointer"
              >
                <XCircle className="w-3.5 h-3.5" /> Tolak
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Edit Form or Display Content */}
      <div className="bg-card border border-border rounded-3xl p-6 md:p-8 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-primary" />
            <h3 className="font-extrabold text-base">Konten Materi (Versi {currentVerObj.version})</h3>
          </div>

          {!isEditing && (isOwner || currentRole === 'admin') && (
            <button
              onClick={handleStartEdit}
              className="bg-primary/10 text-primary font-extrabold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1 hover:bg-primary/20 transition-colors cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" /> Edit / Buat Versi Baru
            </button>
          )}
        </div>

        {isEditing ? (
          <form onSubmit={handleSaveEdit} className="space-y-4 pt-2">
            <p className="text-xs text-muted-foreground">
              Perubahan pada materi terverifikasi akan secara otomatis membuat <strong>Versi {versions.length + 1}</strong>.
            </p>
            <textarea
              rows={10}
              required
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full bg-background border border-border rounded-2xl p-4 font-mono text-xs leading-relaxed focus:outline-none focus:border-primary resize-none"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="bg-muted text-muted-foreground font-bold px-4 py-2 rounded-xl text-xs"
              >
                Batal
              </button>
              <button
                type="submit"
                className="bg-gradient-to-r from-primary to-primary-glow text-white font-extrabold px-5 py-2 rounded-xl text-xs shadow-glow flex items-center gap-1"
              >
                Terbitkan Versi Baru
              </button>
            </div>
          </form>
        ) : (
          <div
            className="prose dark:prose-invert max-w-none text-sm leading-relaxed space-y-4 text-foreground/90"
            dangerouslySetInnerHTML={{ __html: currentVerObj.content || '<p>Konten belum tersedia.</p>' }}
          />
        )}
      </div>
    </div>
  );
}
