import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ChevronRight, HelpCircle, BookOpen, Swords, ShieldAlert } from 'lucide-react';
import ChapterModal from '../components/ChapterModal';
import QuizCard from '../components/QuizCard';
import { useAppState } from '../context/AppStateContext';
import { apiService } from '../services/apiService';

export default function QuizPickerPage({ currentRole }) {
  const { classId } = useParams();
  const { findClass, quizList, currentUser } = useAppState();
  const [selectedSubjectId, setSelectedSubjectId] = useState(null);
  const [apiQuizzes, setApiQuizzes] = useState([]);

  const activeClass = classId && findClass ? findClass(classId) : null;
  const isApiClass = Boolean(classId && !String(classId).startsWith('cls-') && !isNaN(Number(classId)));
  const userRole = String(currentRole || activeClass?.role || currentUser?.activeRole || 'member').toLowerCase();
  const canManage = userRole === 'owner' || userRole === 'admin';

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

  useEffect(() => {
    if (isApiClass) {
      apiService.getKuis(classId)
        .then(res => {
          if (res?.data && Array.isArray(res.data)) {
            setApiQuizzes(res.data);
          }
        })
        .catch(err => console.warn("Backend quizzes fetch notice:", err));
    }
  }, [isApiClass, classId]);

  const localQuizzes = (quizList || []).filter(q => {
    if (!classId) return true;
    return q.classId === classId;
  }) || [];
  const allQuizzes = isApiClass
    ? apiQuizzes.map(q => ({
        id: q.id,
        classId: classId,
        title: q.judul,
        timeLimit: q.batas_waktu || 30,
        questionsCount: q.jumlah_soal || q.soal_count || 5,
        attemptsCount: 0,
      }))
    : localQuizzes;
  

  return (
    <section className="px-4 md:px-8 pt-6 space-y-6 animate-fade-in flex flex-col max-w-7xl mx-auto w-full pb-24">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold italic">Pilih Ujian &amp; Kuis</h1>
        <p className="text-sm text-muted-foreground mt-1">Kerjakan ulangan untuk dapatkan XP, naik level, dan tingkatkan pemahaman.</p>
      </div>

      {/* List Kuis Terbitan Baru / Diterbitkan di Kelas ini */}
      {allQuizzes.length > 0 ? (
        <div className="space-y-3">
          <h2 className="text-sm font-extrabold uppercase tracking-widest text-primary flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary"></span>
            Daftar Kuis Diterbitkan ({allQuizzes.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {allQuizzes.map((quiz) => (
              <QuizCard key={quiz.id} quiz={quiz} classId={classId} />
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-card rounded-3xl p-10 text-center space-y-3 shadow-sm border border-border">
          <BookOpen className="w-12 h-12 text-muted-foreground mx-auto" />
          <h3 className="font-extrabold text-lg">Belum Ada Kuis di Kelas Ini</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            Owner atau Admin belum membuat kuis atau ujian harian untuk kelas ini.
          </p>
          {canManage && (
            <div className="pt-2">
              <Link
                to={classId ? `/class/${classId}/add-quiz` : "/profile"}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground font-extrabold text-xs rounded-2xl shadow-glow hover:scale-105 transition-all"
              >
                <span>Kelola &amp; Buat Kuis Baru</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
