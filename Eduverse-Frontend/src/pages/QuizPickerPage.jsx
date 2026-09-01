import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ChevronRight, HelpCircle, BookOpen } from 'lucide-react';
import ChapterModal from '../components/ChapterModal';
import { useAppState } from '../context/AppStateContext';

export default function QuizPickerPage() {
  const { classId } = useParams();
  const { findClass } = useAppState();
  const [selectedSubjectId, setSelectedSubjectId] = useState(null);

  const activeClass = classId && findClass ? findClass(classId) : null;
  const isDemoClass = !classId || classId === 'cls-101' || classId === 'cls-102' || classId === 'cls-103';

  const days = isDemoClass ? [
    {
      day: 'Senin',
      subjects: [
        { id: 'inggris', code: 'ING', name: 'Bahasa Inggris', gradient: 'from-teal-400 to-emerald-600' },
        { id: 'mtk-diskrit', code: 'DISK', name: 'Matematika Diskrit', gradient: 'from-fuchsia-500 to-purple-700' },
      ]
    },
    {
      day: 'Selasa',
      subjects: [
        { id: 'pabp', code: 'PABP', name: 'PABP', gradient: 'from-emerald-600 to-green-700' },
        { id: 'ind', code: 'IND', name: 'Bahasa Indonesia', gradient: 'from-orange-500 to-pink-600' },
      ]
    },
    {
      day: 'Rabu',
      subjects: [
        { id: 'pwp', code: 'PWP', name: 'PWP', gradient: 'from-rose-500 to-red-600' },
        { id: 'ppan', code: 'PPAN', name: 'Pendidikan Pancasila', gradient: 'from-amber-500 to-yellow-600' },
      ]
    },
    {
      day: 'Kamis',
      subjects: [
        { id: 'mtk', code: 'MTK', name: 'Matematika', gradient: 'from-violet-500 to-purple-600' },
        { id: 'pbt', code: 'PBT', name: 'PBT', gradient: 'from-cyan-500 to-blue-600' },
      ]
    },
    {
      day: 'Jumat',
      subjects: [
        { id: 'cloud', code: 'CLOUD', name: 'Cloud Computing', gradient: 'from-sky-400 to-indigo-500' },
        { id: 'sejarah', code: 'SJH', name: 'Sejarah Indonesia', gradient: 'from-stone-500 to-amber-700' },
      ]
    },
  ] : [];

  return (
    <section className="px-4 md:px-8 pt-6 space-y-6 animate-fade-in flex flex-col max-w-7xl mx-auto w-full pb-24">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold italic">Pilih Ujian</h1>
        <p className="text-sm text-muted-foreground mt-1">Kerjakan ulangan untuk dapatkan XP, naik level, dan tantang boss.</p>
      </div>

      {days.length > 0 ? (
        <div className="space-y-6">
          {days.map((d) => (
            <div key={d.day} className="space-y-3">
              <h2 className="text-sm font-extrabold uppercase tracking-widest text-primary flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary"></span>
                Jadwal {d.day}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {d.subjects.map((sub) => (
                  <button
                    key={sub.id}
                    onClick={() => setSelectedSubjectId(sub.id)}
                    className="group bg-card border border-border hover:border-primary/50 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all text-left flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${sub.gradient} flex items-center justify-center text-white font-extrabold text-xs shadow-md shrink-0`}>
                        {sub.code}
                      </div>
                      <div>
                        <h3 className="font-extrabold text-sm text-foreground group-hover:text-primary transition-colors">{sub.name}</h3>
                        <p className="text-[10px] text-muted-foreground font-medium">Klik untuk memilih bab kuis</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-card rounded-3xl p-10 text-center space-y-3 shadow-sm border border-border">
          <BookOpen className="w-12 h-12 text-muted-foreground mx-auto" />
          <h3 className="font-extrabold text-lg">Belum Ada Kuis di Kelas Ini</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            Owner atau Admin belum membuat kuis atau ujian harian untuk kelas ini.
          </p>
          <div className="pt-2">
            <Link
              to={classId ? `/class/${classId}/profile` : "/profile"}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground font-extrabold text-xs rounded-2xl shadow-glow hover:scale-105 transition-all"
            >
              <span>Kelola &amp; Buat Kuis Baru</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}

      <ChapterModal
        subjectId={selectedSubjectId}
        onClose={() => setSelectedSubjectId(null)}
      />
    </section>
  );
}
