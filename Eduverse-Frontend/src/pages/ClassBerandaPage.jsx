import React, { useState } from 'react';
import { Megaphone, Plus, Clock, User, Sparkles } from 'lucide-react';
import { useAppState } from '../context/AppStateContext';

export default function ClassBerandaPage({ cls, announcements, currentRole, onAddAnnouncement }) {
  const { showToast } = useAppState();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const canPost = currentRole === 'owner' || currentRole === 'admin';
  const classAncs = announcements?.filter(a => a.classId === cls?.id) || announcements || [];

  const handlePostAnnouncement = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    onAddAnnouncement({
      title: title.trim(),
      content: content.trim(),
    });

    showToast("Pengumuman baru berhasil dipublikasikan!");
    setTitle('');
    setContent('');
    setIsAdding(false);
  };

  return (
    <div className="space-y-6">
      {/* Post Announcement Trigger for Owner/Admin */}
      {canPost && (
        <div className="bg-card border border-border rounded-3xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-primary font-extrabold text-sm">
              <Megaphone className="w-4 h-4" />
              <span>Buat Pengumuman Kelas</span>
            </div>

            {!isAdding && (
              <button
                onClick={() => setIsAdding(true)}
                className="bg-primary/10 text-primary font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1 hover:bg-primary/20 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Tambah Pengumuman
              </button>
            )}
          </div>

          {isAdding && (
            <form onSubmit={handlePostAnnouncement} className="space-y-3 pt-2 animate-fade-in">
              <input
                type="text"
                required
                placeholder="Judul Pengumuman..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary"
              />
              <textarea
                rows={3}
                required
                placeholder="Tuliskan isi pengumuman untuk anggota kelas..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary resize-none"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="bg-muted text-muted-foreground font-bold px-4 py-2 rounded-xl text-xs hover:bg-muted/80"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-primary text-white font-extrabold px-4 py-2 rounded-xl text-xs shadow-glow flex items-center gap-1"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Publikasikan
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Announcements Feed */}
      <div className="space-y-4">
        <h3 className="font-extrabold text-lg italic flex items-center gap-2">
          <Megaphone className="w-5 h-5 text-primary" /> Pengumuman Terbaru
        </h3>

        {classAncs.length > 0 ? (
          <div className="space-y-4">
            {classAncs.map((anc) => (
              <div key={anc.id} className="bg-card border border-border rounded-3xl p-5 md:p-6 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={anc.authorAvatar || "/assets/companion.png"}
                      alt={anc.authorName}
                      className="w-10 h-10 rounded-full bg-muted object-cover"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-foreground">{anc.authorName}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary uppercase">
                          {anc.authorRole}
                        </span>
                      </div>
                      <span className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3" /> {anc.createdAt}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-1">
                  <h4 className="font-extrabold text-base text-foreground leading-snug">{anc.title}</h4>
                  <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed whitespace-pre-wrap">
                    {anc.content}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-card border border-border rounded-3xl p-8 text-center text-muted-foreground text-xs">
            Belum ada pengumuman di kelas ini.
          </div>
        )}
      </div>
    </div>
  );
}
