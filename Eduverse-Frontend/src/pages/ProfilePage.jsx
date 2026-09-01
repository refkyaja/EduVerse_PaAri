import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { Settings, ChevronRight, ChevronDown, ShieldCheck, Users, Swords, Flame, Trophy, Award, Zap, CheckCircle2, TrendingUp, AlertCircle, BookOpen, Target, Calendar, Plus, FolderPlus, FileText, Sparkles, RefreshCcw, History, Clock, UserCheck, KeyRound, Save, Trash2, ShieldAlert, BarChart3 } from 'lucide-react';
import { useAppState } from '../context/AppStateContext';
import { INITIAL_CLASSES } from '../data/mockData';
import ClassSettingsModal from '../components/ClassSettingsModal';
import ClassAnggotaPage from './ClassAnggotaPage';
import { apiService } from '../services/apiService';

export default function ProfilePage({ initialTab }) {
  const { classId: routeClassId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { appState, userProfile, getLevelInfo, showToast, currentUser, findClass } = useAppState();

  const getTabFromPath = () => {
    if (initialTab) return initialTab;
    const path = location.pathname;
    if (path.includes('/edit-info')) return 'settings';
    if (path.includes('/add-subject')) return 'add_subject';
    if (path.includes('/add-material')) return 'add_material';
    if (path.includes('/add-quiz')) return 'add_quiz';
    if (path.includes('/verification')) return 'verification';
    if (path.includes('/members')) return 'members';
    if (path.includes('/audit-log')) return 'audit_log';
    return searchParams.get('tab') || 'overview';
  };

  const classId = routeClassId || 'cls-101';
  const activeClass = findClass ? findClass(classId) : (INITIAL_CLASSES.find(c => c.id === classId) || INITIAL_CLASSES[0]);
  const isDemoClass = !routeClassId || routeClassId === 'cls-101' || routeClassId === 'cls-102' || routeClassId === 'cls-103';

  const [activeRole, setActiveRole] = useState('owner'); // owner, admin, member
  const [activeTab, setActiveTab] = useState(getTabFromPath());
  const [isManagementOpen, setIsManagementOpen] = useState(true);

  useEffect(() => {
    setActiveTab(getTabFromPath());
  }, [location.pathname, searchParams, initialTab]);

  const handleTabClick = (tabName, routePath) => {
    setActiveTab(tabName);
    const targetClass = routeClassId || 'cls-101';
    if (routePath) {
      navigate(`/class/${targetClass}/${routePath}`);
    } else {
      navigate(`/class/${targetClass}/profile`);
    }
  };

  // Class Info Edit State
  const [className, setClassName] = useState(activeClass?.name || 'Kelas Baru');
  const [classDesc, setClassDesc] = useState(activeClass?.description || '');
  const [classCode, setClassCode] = useState(activeClass?.code || 'EDU123');

  // Form States
  const [newSubjectName, setNewSubjectName] = useState('');
  const [newSubjectCode, setNewSubjectCode] = useState('');
  const [newSubjectGradient, setNewSubjectGradient] = useState('from-indigo-500 to-purple-600');

  const [newMaterialTitle, setNewMaterialTitle] = useState('');
  const [newMaterialSubject, setNewMaterialSubject] = useState('PWP');
  const [newMaterialContent, setNewMaterialContent] = useState('');

  const [newQuizTitle, setNewQuizTitle] = useState('');
  const [newQuizDay, setNewQuizDay] = useState('Senin');

  // Pending materials for Owner verification
  const [pendingMaterials, setPendingMaterials] = useState(isDemoClass ? [
    { id: 'pend-1', title: 'Implementasi Middleware di Express.js', subject: 'PWP', author: 'Ahmad (Admin)', createdAt: 'Hari ini 10:30' },
    { id: 'pend-2', title: 'Ringkasan Modul AWS Serverless', subject: 'CLOUD', author: 'Siti (Admin)', createdAt: 'Hari ini 09:15' },
  ] : []);

  // Audit Trail Logs
  const [auditLogs, setAuditLogs] = useState(isDemoClass ? [
    { id: 1, user: 'Refky Satria', role: 'Owner', action: 'Membuat Ulang Kode Kelas menjadi "RPL102"', time: 'Hari ini 11:15' },
    { id: 2, user: 'Refky Satria', role: 'Owner', action: 'Memverifikasi & menerbitkan materi "Teks Multimodal"', time: 'Hari ini 10:35' },
    { id: 3, user: 'Ahmad Subagja', role: 'Admin', action: 'Mengajukan materi baru "Implementasi Middleware Express.js"', time: 'Hari ini 10:30' },
    { id: 4, user: 'Refky Satria', role: 'Owner', action: 'Menerbitkan Kuis Baru "Ulangan Harian Matriks"', time: 'Hari ini 09:00' },
    { id: 5, user: 'Refky Satria', role: 'Owner', action: 'Mengangkat Siti Rahma menjadi Admin Kelas', time: 'Kemarin 16:45' },
  ] : [
    { id: 1, user: currentUser?.name || 'Owner', role: 'Owner', action: `Membuat Ruang Kelas "${activeClass?.name || 'Kelas Baru'}"`, time: 'Baru saja' }
  ]);

  // Load backend log_aktivitas on mount if available
  useEffect(() => {
    if (!isDemoClass && routeClassId) {
      apiService.getLogAktivitas(routeClassId)
        .then(logs => {
          if (Array.isArray(logs) && logs.length > 0) {
            setAuditLogs(logs.map(l => ({
              id: l.id,
              user: l.user?.name || 'User',
              role: l.peran_user || 'OWNER',
              action: l.deskripsi_aksi,
              time: new Date(l.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            })));
          }
        })
        .catch(err => console.warn("Notice: Log aktivitas backend tidak dimuat:", err.message));
    }
  }, [isDemoClass, routeClassId]);

  const displayXp = isDemoClass ? appState.xp : (currentUser?.xp || 0);
  const levelInfo = getLevelInfo(displayXp);
  const displayExams = isDemoClass ? appState.examsCompleted : 0;
  const displayAccuracy = (displayExams > 0 && appState.correctAnswers > 0)
    ? Math.round((appState.correctAnswers / (displayExams * 5)) * 100)
    : 0;
  const displayStreak = isDemoClass ? appState.streak : 0;

  const streakDays = [
    { day: 'Sen', active: isDemoClass },
    { day: 'Sel', active: isDemoClass },
    { day: 'Rab', active: isDemoClass },
    { day: 'Kam', active: isDemoClass },
    { day: 'Jum', active: isDemoClass },
    { day: 'Sab', active: isDemoClass },
    { day: 'Ming', active: isDemoClass },
  ];

  const badges = [
    { title: 'Master Matriks', desc: 'Selesaikan 10 Ujian Matriks', icon: Zap, color: 'text-warning bg-warning/15', unlocked: isDemoClass },
    { title: 'Kutu Buku', desc: 'Pelajari 20 Materi Belajar', icon: BookOpen, color: 'text-success bg-success/15', unlocked: isDemoClass },
    { title: 'Sniper Akademik', desc: 'Raih Skor 100% pada Ujian', icon: Target, color: 'text-brand-blue bg-brand-blue/15', unlocked: isDemoClass },
    { title: 'Serangan Fajar', desc: 'Belajar Sebelum Jam 6 Pagi', icon: Flame, color: 'text-rose-500 bg-rose-500/15', unlocked: false },
  ];

  const recentActivity = isDemoClass ? [
    { type: 'Ujian', title: 'Matematika - Matriks & Determinan', xp: '+120 XP', date: 'Hari Ini, 14:20', score: '90%' },
    { type: 'Materi', title: 'Bahasa Indonesia - Teks Multimodal', xp: '+30 XP', date: 'Kemarin, 19:45', score: 'Selesai' },
  ] : [];

  const topSubjects = isDemoClass ? [
    { name: 'Matematika (Matriks)', accuracy: 96 },
    { name: 'PABP', accuracy: 90 },
  ] : [];

  const weakSubjects = isDemoClass ? [
    { name: 'Bahasa Inggris', accuracy: 65 },
    { name: 'Cloud Computing', accuracy: 72 },
  ] : [];

  const handleSaveClassInfo = async (e) => {
    e.preventDefault();
    try {
      if (!isDemoClass && routeClassId) {
        await apiService.updateClass(routeClassId, { name: className, description: classDesc });
      }
      const newLog = {
        id: Date.now(),
        user: currentUser?.name || 'Refky Satria',
        role: activeRole.toUpperCase(),
        action: `Memperbarui nama kelas menjadi "${className}"`,
        time: 'Baru saja'
      };
      setAuditLogs([newLog, ...auditLogs]);
      showToast("Informasi kelas berhasil diperbarui!");
    } catch (err) {
      showToast(err.message || "Informasi kelas berhasil diperbarui!");
    }
  };

  const handleRegenCode = async () => {
    if (confirm("Apakah Anda yakin ingin membuat ulang kode kelas? Kode lama tidak akan berlaku lagi.")) {
      try {
        let newC = Math.random().toString(36).substring(2, 8).toUpperCase();
        if (!isDemoClass && routeClassId) {
          const res = await apiService.regenerateClassCode(routeClassId);
          if (res?.code) newC = res.code;
        }
        setClassCode(newC);
        const newLog = {
          id: Date.now(),
          user: currentUser?.name || 'Refky Satria',
          role: 'OWNER',
          action: `Membuat Ulang Kode Kelas menjadi "${newC}"`,
          time: 'Baru saja'
        };
        setAuditLogs([newLog, ...auditLogs]);
        showToast(`Kode kelas baru dibuat: "${newC}"`);
      } catch (err) {
        showToast(err.message || "Gagal meregenerasi kode kelas");
      }
    }
  };

  const handleCreateSubject = async (e) => {
    e.preventDefault();
    if (!newSubjectName.trim() || !newSubjectCode.trim()) return;

    try {
      if (!isDemoClass && routeClassId) {
        await apiService.createMapel(routeClassId, {
          nama: newSubjectName,
          kode: newSubjectCode,
          warna: newSubjectGradient
        });
      }
      const newLog = {
        id: Date.now(),
        user: currentUser?.name || 'Refky Satria',
        role: activeRole.toUpperCase(),
        action: `Menambahkan Mata Pelajaran Baru "${newSubjectName}" (${newSubjectCode.toUpperCase()})`,
        time: 'Baru saja'
      };

      setAuditLogs([newLog, ...auditLogs]);
      showToast(`Mata Pelajaran "${newSubjectName}" berhasil ditambahkan!`);
      setNewSubjectName('');
      setNewSubjectCode('');
      setActiveTab('overview');
    } catch (err) {
      showToast(err.message || "Gagal menambahkan mata pelajaran");
    }
  };

  const handleCreateMaterial = async (e) => {
    e.preventDefault();
    if (!newMaterialTitle.trim() || !newMaterialContent.trim()) return;

    const isOwner = activeRole === 'owner';
    try {
      if (!isDemoClass && routeClassId) {
        await apiService.createMateri(routeClassId, {
          judul: newMaterialTitle,
          isi: newMaterialContent
        });
      }
      const newLog = {
        id: Date.now(),
        user: currentUser?.name || 'Refky Satria',
        role: activeRole.toUpperCase(),
        action: isOwner
          ? `Membuat & menerbitkan materi "${newMaterialTitle}" (Terverifikasi)`
          : `Mengajukan materi baru "${newMaterialTitle}" (Menunggu Verifikasi)`,
        time: 'Baru saja'
      };

      setAuditLogs([newLog, ...auditLogs]);
      showToast(
        isOwner
          ? `Materi "${newMaterialTitle}" berhasil dipublikasikan!`
          : `Materi "${newMaterialTitle}" diajukan! Menunggu Verifikasi Owner.`
      );

      setNewMaterialTitle('');
      setNewMaterialContent('');
      setActiveTab('overview');
    } catch (err) {
      showToast(err.message || "Gagal membuat materi");
    }
  };

  const handleCreateQuiz = async (e) => {
    e.preventDefault();
    if (!newQuizTitle.trim()) return;

    try {
      if (!isDemoClass && routeClassId) {
        await apiService.createKuis(routeClassId, {
          judul: newQuizTitle,
          deskripsi: `Kuis jadwal hari ${newQuizDay}`
        });
      }
      const newLog = {
        id: Date.now(),
        user: currentUser?.name || 'Refky Satria',
        role: activeRole.toUpperCase(),
        action: `Menerbitkan Kuis Baru "${newQuizTitle}" untuk hari ${newQuizDay}`,
        time: 'Baru saja'
      };

      setAuditLogs([newLog, ...auditLogs]);
      showToast(`Kuis "${newQuizTitle}" berhasil diterbitkan pada hari ${newQuizDay}!`);
      setNewQuizTitle('');
      setActiveTab('overview');
    } catch (err) {
      showToast(err.message || "Gagal menerbitkan kuis");
    }
  };

  const handleApprovePending = async (id, title) => {
    setPendingMaterials(prev => prev.filter(p => p.id !== id));
    const newLog = {
      id: Date.now(),
      user: currentUser?.name || 'Refky Satria',
      role: 'OWNER',
      action: `Memverifikasi & menerbitkan materi "${title}"`,
      time: 'Baru saja'
    };
    setAuditLogs([newLog, ...auditLogs]);
    showToast(`Materi "${title}" berhasil diverifikasi & dipublikasikan!`);
  };

  const handleRejectPending = async (id, title) => {
    setPendingMaterials(prev => prev.filter(p => p.id !== id));
    const newLog = {
      id: Date.now(),
      user: currentUser?.name || 'Refky Satria',
      role: 'OWNER',
      action: `Menolak pengajuan materi "${title}" untuk perbaikan`,
      time: 'Baru saja'
    };
    setAuditLogs([newLog, ...auditLogs]);
    showToast(`Pengajuan materi "${title}" dikembalikan untuk perbaikan.`, 'warning');
  };

  const isOwner = activeRole === 'owner';
  const isAdmin = activeRole === 'admin';
  const canManage = isOwner || isAdmin;

  return (
    <section className="px-4 md:px-8 pt-6 space-y-6 animate-fade-in flex flex-col max-w-7xl mx-auto w-full pb-24">
      {/* Header Banner Identity (Twitter/X Style Cover Banner & Round Profile - Ultra Flattened Mobile Landscape) */}
      <div className="bg-card border border-border rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl">
        {/* 1. Banner Belakang (Gambar Banner Custom EduVerse - Landscape Ultra Gepeng di Mobile) */}
        <div className="relative w-full h-20 sm:h-32 md:h-48 bg-background select-none overflow-hidden">
          <img
            src="/assets/banner_eduverse2.png"
            alt="Banner EduVerse"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/10 pointer-events-none"></div>
        </div>

        {/* 2. Area Bawah (Foto Profil Bulat, Nama, Centang Emas & Badges) */}
        <div className="px-3.5 sm:px-6 pb-3.5 sm:pb-6 pt-0 relative bg-card">
          <div className="flex flex-wrap items-end justify-between gap-2.5 sm:gap-4">
            {/* FOTO PROFIL BULAT (Menggunakan <img> asli bulat sempurna menumpuk di atas banner) */}
            <div className="relative -mt-8 sm:-mt-12 md:-mt-18 z-20 shrink-0">
              <img 
                src={currentUser?.profile_photo || currentUser?.avatar || currentUser?.photo_url || currentUser?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400'} 
                alt="Foto Profil" 
                className="w-16 h-16 sm:w-24 sm:h-24 md:w-34 md:h-34 rounded-full object-cover border-4 border-card bg-muted shadow-2xl block hover:opacity-95 transition cursor-pointer"
              />
              <div className="absolute bottom-0 right-0 sm:bottom-1 sm:right-1 bg-gradient-to-br from-amber-300 via-xp-gold to-amber-500 text-black w-5 h-5 sm:w-7 sm:h-7 rounded-full flex items-center justify-center font-extrabold text-[9px] sm:text-xs shadow-lg border-2 border-card shrink-0">
                👑
              </div>
            </div>

            {/* Badges Role & Pangkat Level di Sebelah Kanan */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-3 pt-1">
              <span className="px-2 py-0.5 sm:px-3 sm:py-1 rounded-full bg-primary/10 text-primary text-[8px] sm:text-xs font-extrabold uppercase tracking-wider border border-primary/20 shrink-0">
                ROLE: {activeRole}
              </span>
              <div className="bg-background border border-border px-2.5 py-1 sm:px-3.5 sm:py-2 rounded-xl sm:rounded-2xl flex items-center gap-2 sm:gap-3 shadow-sm shrink-0">
                <div>
                  <p className="text-[7px] sm:text-[9px] font-extrabold uppercase tracking-widest text-muted-foreground leading-none">Pangkat Saat Ini</p>
                  <p className="text-[10px] sm:text-sm font-extrabold italic text-xp-gold mt-0.5">
                    Lv. {levelInfo.level} {levelInfo.level > 10 ? 'Master' : 'Pemula'}
                  </p>
                </div>
                <div className="w-6 h-6 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-gradient-to-br from-amber-300 via-xp-gold to-amber-500 text-black flex items-center justify-center font-extrabold text-[10px] sm:text-sm shadow-md border border-white/40 shrink-0">
                  {levelInfo.level}
                </div>
              </div>
            </div>
          </div>

          {/* Nama Akun & Username (Tanpa Email) */}
          <div className="mt-3 space-y-0.5">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-foreground tracking-tight leading-tight">
              {currentUser?.name || 'Refky Satria'}
            </h1>
            {currentUser?.username && (
              <p className="text-muted-foreground text-xs sm:text-sm font-semibold">
                @{currentUser.username}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Main 2-Column Sidebar & Dynamic Content View Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        
        {/* LEFT SIDEBAR NAVIGATION MENU */}
        <div className="md:col-span-4 lg:col-span-3 space-y-4 md:sticky md:top-20">
          


          {/* DYNAMIC SIDEBAR MENU */}
          <div className="bg-card border border-border rounded-3xl p-3 shadow-sm space-y-1">
            <span className="px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground block">
              Menu Navigasi
            </span>

            {/* Menu 1: Ringkasan & Statistik */}
            <button
              onClick={() => handleTabClick('overview', '')}
              className={`w-full p-3 rounded-2xl font-extrabold text-xs flex items-center gap-3 transition-all cursor-pointer text-left ${
                activeTab === 'overview'
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'bg-background hover:bg-muted text-foreground'
              }`}
            >
              <BarChart3 className="w-4 h-4 shrink-0" />
              <span className="flex-1">Ringkasan &amp; Statistik</span>
            </button>

            {/* Owner & Admin Management Menu List */}
            {canManage && (
              <div className="space-y-1">
                <button
                  onClick={() => setIsManagementOpen(!isManagementOpen)}
                  className="w-full pt-3 pb-1 px-3 border-t border-border flex items-center justify-between cursor-pointer group text-left"
                >
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-primary group-hover:opacity-90">
                    {isOwner ? 'Manajemen Owner' : 'Manajemen Admin'}
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 text-primary transition-transform duration-200 ${isManagementOpen ? 'rotate-180' : 'rotate-0'}`} />
                </button>

                {isManagementOpen && (
                  <div className="space-y-1 animate-fade-in">
                    {isOwner && (
                      <button
                        onClick={() => handleTabClick('settings', 'edit-info')}
                        className={`w-full p-3 rounded-2xl font-extrabold text-xs flex items-center gap-3 transition-all cursor-pointer text-left ${
                          activeTab === 'settings'
                            ? 'bg-primary text-primary-foreground shadow-md'
                            : 'bg-background hover:bg-muted text-foreground'
                        }`}
                      >
                        <Settings className="w-4 h-4 shrink-0" />
                        <span className="flex-1">Edit Info &amp; Kode Kelas</span>
                      </button>
                    )}

                    <button
                      onClick={() => handleTabClick('add_subject', 'add-subject')}
                      className={`w-full p-3 rounded-2xl font-extrabold text-xs flex items-center gap-3 transition-all cursor-pointer text-left ${
                        activeTab === 'add_subject'
                          ? 'bg-primary text-primary-foreground shadow-md'
                          : 'bg-background hover:bg-muted text-foreground'
                      }`}
                    >
                      <FolderPlus className="w-4 h-4 shrink-0" />
                      <span className="flex-1">Tambah Mapel Baru</span>
                    </button>

                    <button
                      onClick={() => handleTabClick('add_material', 'add-material')}
                      className={`w-full p-3 rounded-2xl font-extrabold text-xs flex items-center gap-3 transition-all cursor-pointer text-left ${
                        activeTab === 'add_material'
                          ? 'bg-primary text-primary-foreground shadow-md'
                          : 'bg-background hover:bg-muted text-foreground'
                      }`}
                    >
                      <FileText className="w-4 h-4 shrink-0" />
                      <span className="flex-1">Tambah Materi</span>
                    </button>

                    <button
                      onClick={() => handleTabClick('add_quiz', 'add-quiz')}
                      className={`w-full p-3 rounded-2xl font-extrabold text-xs flex items-center gap-3 transition-all cursor-pointer text-left ${
                        activeTab === 'add_quiz'
                          ? 'bg-primary text-primary-foreground shadow-md'
                          : 'bg-background hover:bg-muted text-foreground'
                      }`}
                    >
                      <Swords className="w-4 h-4 shrink-0" />
                      <span className="flex-1">Tambah Kuis / Ujian</span>
                    </button>

                    {isOwner && (
                      <button
                        onClick={() => handleTabClick('verification', 'verification')}
                        className={`w-full p-3 rounded-2xl font-extrabold text-xs flex items-center gap-3 transition-all cursor-pointer text-left ${
                          activeTab === 'verification'
                            ? 'bg-primary text-primary-foreground shadow-md'
                            : 'bg-background hover:bg-muted text-foreground'
                        }`}
                      >
                        <ShieldCheck className="w-4 h-4 shrink-0" />
                        <span className="flex-1">Verifikasi Materi Admin</span>
                        {pendingMaterials.length > 0 && (
                          <span className="bg-warning text-black text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                            {pendingMaterials.length}
                          </span>
                        )}
                      </button>
                    )}

                    <button
                      onClick={() => handleTabClick('members', 'members')}
                      className={`w-full p-3 rounded-2xl font-extrabold text-xs flex items-center gap-3 transition-all cursor-pointer text-left ${
                        activeTab === 'members'
                          ? 'bg-primary text-primary-foreground shadow-md'
                          : 'bg-background hover:bg-muted text-foreground'
                      }`}
                    >
                      <Users className="w-4 h-4 shrink-0" />
                      <span className="flex-1">Kelola Admin &amp; Anggota</span>
                    </button>

                    <button
                      onClick={() => handleTabClick('audit_log', 'audit-log')}
                      className={`w-full p-3 rounded-2xl font-extrabold text-xs flex items-center gap-3 transition-all cursor-pointer text-left ${
                        activeTab === 'audit_log'
                          ? 'bg-primary text-primary-foreground shadow-md'
                          : 'bg-background hover:bg-muted text-foreground'
                      }`}
                    >
                      <History className="w-4 h-4 shrink-0" />
                      <span className="flex-1">Riwayat Perubahan Log</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT MAIN CONTENT VIEW (CHANGES 100% BASED ON SIDEBAR SELECTION) */}
        <div className="md:col-span-8 lg:col-span-9 space-y-6">
          
          {/* VIEW 1: OVERVIEW & STATISTIK (ALL STATS WIDGETS) */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-fade-in">
              {/* 4 Quick Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
                <div className="bg-card border border-border rounded-2xl p-4 shadow-sm text-center">
                  <p className="text-2xl font-extrabold italic tabular-nums text-foreground">{displayXp.toLocaleString()}</p>
                  <p className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider mt-1">Total XP</p>
                </div>
                <div className="bg-card border border-border rounded-2xl p-4 shadow-sm text-center">
                  <p className="text-2xl font-extrabold italic tabular-nums text-foreground">{displayExams}</p>
                  <p className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider mt-1">Ujian Selesai</p>
                </div>
                <div className="bg-card border border-border rounded-2xl p-4 shadow-sm text-center">
                  <p className="text-2xl font-extrabold italic tabular-nums text-foreground">{displayAccuracy}%</p>
                  <p className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider mt-1">Akurasi Jawaban</p>
                </div>
                <div className="bg-card border border-border rounded-2xl p-4 shadow-sm text-center">
                  <p className="text-2xl font-extrabold italic tabular-nums text-foreground flex items-center justify-center gap-1">
                    🔥 {displayStreak}
                  </p>
                  <p className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider mt-1">Streak Hari Ini</p>
                </div>
              </div>

              {/* Streak Calendar */}
              <div className="bg-card border border-border rounded-3xl p-5 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-base flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-primary" /> Tracking Belajar Mingguan
                  </h3>
                  <span className="text-xs text-muted-foreground font-bold">🔥 {displayStreak} Hari Berturut-turut</span>
                </div>
                <div className="grid grid-cols-7 gap-2 text-center pt-1">
                  {streakDays.map((s, idx) => (
                    <div key={idx} className="flex flex-col items-center gap-1.5">
                      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-extrabold text-sm border ${
                        s.active
                          ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white border-amber-300 shadow-md'
                          : 'bg-muted/40 text-muted-foreground border-border'
                      }`}>
                        {s.active ? '🔥' : '✓'}
                      </div>
                      <span className="text-[10px] font-bold text-muted-foreground uppercase">{s.day}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Strengths & Weakness Analysis */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-card border border-border rounded-3xl p-5 shadow-sm space-y-3">
                  <div className="flex items-center gap-2 text-success">
                    <TrendingUp className="w-5 h-5" />
                    <h4 className="font-extrabold text-sm">Mata Pelajaran Terkuat</h4>
                  </div>
                  <div className="space-y-2">
                    {topSubjects.length > 0 ? (
                      topSubjects.map((sub, idx) => (
                        <div key={idx}>
                          <div className="flex justify-between text-xs font-bold mb-1">
                            <span>{sub.name}</span>
                            <span className="text-success">{sub.accuracy}% Akurasi</span>
                          </div>
                          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-success rounded-full" style={{ width: `${sub.accuracy}%` }}></div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-muted-foreground italic py-2">Belum ada analisis mata pelajaran terkuat.</p>
                    )}
                  </div>
                </div>

                <div className="bg-card border border-border rounded-3xl p-5 shadow-sm space-y-3">
                  <div className="flex items-center gap-2 text-warning">
                    <AlertCircle className="w-5 h-5" />
                    <h4 className="font-extrabold text-sm">Perlu Ditingkatkan</h4>
                  </div>
                  <div className="space-y-2">
                    {weakSubjects.length > 0 ? (
                      weakSubjects.map((sub, idx) => (
                        <div key={idx}>
                          <div className="flex justify-between text-xs font-bold mb-1">
                            <span>{sub.name}</span>
                            <span className="text-warning">{sub.accuracy}% Akurasi</span>
                          </div>
                          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-warning rounded-full" style={{ width: `${sub.accuracy}%` }}></div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-muted-foreground italic py-2">Belum ada data mata pelajaran yang perlu ditingkatkan.</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Achievement Badges */}
              <div className="bg-card border border-border rounded-3xl p-5 shadow-sm space-y-4">
                <h3 className="font-extrabold text-base flex items-center gap-2">
                  <Award className="w-4 h-4 text-xp-gold" /> Lencana Pencapaian
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {badges.map((b, idx) => {
                    const IconComp = b.icon;
                    return (
                      <div key={idx} className={`p-3.5 rounded-2xl border flex items-center gap-3 ${
                        b.unlocked
                          ? 'bg-background border-border shadow-sm'
                          : 'bg-muted/30 border-border opacity-50'
                      }`}>
                        <div className={`w-11 h-11 rounded-xl ${b.color} grid place-items-center shrink-0`}>
                          <IconComp className="w-5 h-5" strokeWidth={2.2} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="font-extrabold text-sm truncate">{b.title}</p>
                            {b.unlocked && <CheckCircle2 className="w-4 h-4 text-success shrink-0" />}
                          </div>
                          <p className="text-xs text-muted-foreground truncate">{b.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Activity Log */}
              <div className="bg-card border border-border rounded-3xl p-5 shadow-sm space-y-4">
                <h3 className="font-extrabold text-base">Riwayat Aktivitas Terbaru</h3>
                <div className="space-y-2.5">
                  {recentActivity.map((act, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3.5 bg-background rounded-2xl border border-border">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-extrabold text-xs">
                          {act.type === 'Ujian' ? '⚔' : act.type === 'Materi' ? '📚' : '🎁'}
                        </div>
                        <div>
                          <p className="font-extrabold text-sm">{act.title}</p>
                          <p className="text-xs text-muted-foreground">{act.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-extrabold text-xs text-primary">{act.xp}</span>
                        <p className="text-[10px] font-bold text-muted-foreground">{act.score}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* VIEW 2: EDIT INFO & KODE KELAS (OWNER) */}
          {activeTab === 'settings' && isOwner && (
            <div className="bg-card border border-border rounded-3xl p-6 shadow-sm space-y-6 animate-fade-in">
              <div className="border-b border-border pb-4">
                <h3 className="font-extrabold text-lg flex items-center gap-2">
                  <Settings className="w-5 h-5 text-primary" /> Pengaturan Identitas &amp; Kode Kelas
                </h3>
                <p className="text-xs text-muted-foreground mt-1">Ubah nama kelas, deskripsi, serta buat ulang kode masuk kelas privat.</p>
              </div>

              <form onSubmit={handleSaveClassInfo} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-muted-foreground mb-1">Nama Kelas</label>
                  <input
                    type="text"
                    required
                    value={className}
                    onChange={(e) => setClassName(e.target.value)}
                    className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-muted-foreground mb-1">Deskripsi Kelas</label>
                  <textarea
                    rows={3}
                    value={classDesc}
                    onChange={(e) => setClassDesc(e.target.value)}
                    className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="bg-primary text-primary-foreground font-extrabold px-5 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow-sm hover:scale-105 transition-all"
                >
                  <Save className="w-4 h-4" /> Simpan Perubahan Info Kelas
                </button>
              </form>

              {/* Kode Masuk Box */}
              <div className="bg-background border border-border rounded-2xl p-5 space-y-3">
                <h4 className="font-extrabold text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <KeyRound className="w-4 h-4 text-xp-gold" /> Kode Masuk Kelas Privasi
                </h4>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <p className="text-3xl font-mono font-extrabold text-xp-gold tracking-widest">{classCode}</p>
                    <p className="text-xs text-muted-foreground mt-1">Bagikan kode ini kepada siswa agar bisa bergabung ke kelas ini.</p>
                  </div>

                  <button
                    type="button"
                    onClick={handleRegenCode}
                    className="bg-primary/10 text-primary font-extrabold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 hover:bg-primary/20 transition-all shrink-0"
                  >
                    <RefreshCcw className="w-4 h-4" /> Regenerate Kode Baru
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* VIEW 3: FORM TAMBAH MAPEL BARU */}
          {activeTab === 'add_subject' && canManage && (
            <form onSubmit={handleCreateSubject} className="bg-card border border-border rounded-3xl p-6 shadow-sm space-y-4 animate-fade-in">
              <div className="border-b border-border pb-4">
                <h3 className="font-extrabold text-lg flex items-center gap-2">
                  <FolderPlus className="w-5 h-5 text-primary" /> Form Tambah Mata Pelajaran Baru
                </h3>
                <p className="text-xs text-muted-foreground mt-1">Tambahkan mata pelajaran baru untuk mengelompokkan materi di kelas {className}.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-muted-foreground mb-1">Nama Mata Pelajaran</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Fisika Terapan"
                    value={newSubjectName}
                    onChange={(e) => setNewSubjectName(e.target.value)}
                    className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-muted-foreground mb-1">Singkatan Kode Mapel</label>
                  <input
                    type="text"
                    required
                    maxLength="5"
                    placeholder="Contoh: FIS"
                    value={newSubjectCode}
                    onChange={(e) => setNewSubjectCode(e.target.value)}
                    className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm uppercase font-mono focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="submit"
                  className="bg-primary text-primary-foreground font-extrabold px-6 py-2.5 rounded-xl text-xs shadow-glow flex items-center gap-1.5 hover:scale-105 transition-all"
                >
                  <Sparkles className="w-4 h-4" /> Simpan Mata Pelajaran Baru
                </button>
              </div>
            </form>
          )}

          {/* VIEW 4: FORM TAMBAH MATERI BARU */}
          {activeTab === 'add_material' && canManage && (
            <form onSubmit={handleCreateMaterial} className="bg-card border border-border rounded-3xl p-6 shadow-sm space-y-4 animate-fade-in">
              <div className="border-b border-border pb-4">
                <h3 className="font-extrabold text-lg flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" /> Form Tambah Materi Pembelajaran
                </h3>
                <p className="text-xs text-muted-foreground mt-1">Upload bab materi pembelajaran baru. (Dibuat oleh {activeRole.toUpperCase()})</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-muted-foreground mb-1">Pilih Mata Pelajaran</label>
                  <select
                    value={newMaterialSubject}
                    onChange={(e) => setNewMaterialSubject(e.target.value)}
                    className="w-full bg-background text-foreground border border-border rounded-xl px-3.5 py-2 text-xs sm:text-sm focus:outline-none focus:border-primary cursor-pointer shadow-sm"
                  >
                    <option value="PWP" className="bg-card text-foreground font-medium text-xs py-1">PWP (Pemrograman Web)</option>
                    <option value="IND" className="bg-card text-foreground font-medium text-xs py-1">Bahasa Indonesia</option>
                    <option value="MTK" className="bg-card text-foreground font-medium text-xs py-1">Matematika</option>
                    <option value="PPAN" className="bg-card text-foreground font-medium text-xs py-1">Pendidikan Pancasila</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-muted-foreground mb-1">Judul Bab Materi</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Arsitektur MVC pada Framework Laravel"
                    value={newMaterialTitle}
                    onChange={(e) => setNewMaterialTitle(e.target.value)}
                    className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-muted-foreground mb-1">Isi Rangkuman / Poin Materi</label>
                <textarea
                  rows={5}
                  required
                  placeholder="Tuliskan rangkuman poin-poin materi di sini..."
                  value={newMaterialContent}
                  onChange={(e) => setNewMaterialContent(e.target.value)}
                  className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="submit"
                  className="bg-primary text-primary-foreground font-extrabold px-6 py-2.5 rounded-xl text-xs shadow-glow flex items-center gap-1.5 hover:scale-105 transition-all"
                >
                  <Sparkles className="w-4 h-4" /> {isOwner ? 'Publikasikan (Terverifikasi)' : 'Ajukan (Menunggu Verifikasi)'}
                </button>
              </div>
            </form>
          )}

          {/* VIEW 5: FORM TAMBAH KUIS BARU */}
          {activeTab === 'add_quiz' && canManage && (
            <form onSubmit={handleCreateQuiz} className="bg-card border border-border rounded-3xl p-6 shadow-sm space-y-4 animate-fade-in">
              <div className="border-b border-border pb-4">
                <h3 className="font-extrabold text-lg flex items-center gap-2">
                  <Swords className="w-5 h-5 text-primary" /> Form Tambah Kuis / Ujian Baru
                </h3>
                <p className="text-xs text-muted-foreground mt-1">Terbitkan kuis harian baru pada jadwal mata pelajaran yang sesuai.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-muted-foreground mb-1">Judul Kuis / Ujian</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Ulangan Harian Determinan Matriks"
                    value={newQuizTitle}
                    onChange={(e) => setNewQuizTitle(e.target.value)}
                    className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-muted-foreground mb-1">Jadwal Hari</label>
                  <select
                    value={newQuizDay}
                    onChange={(e) => setNewQuizDay(e.target.value)}
                    className="w-full bg-background text-foreground border border-border rounded-xl px-3.5 py-2 text-xs sm:text-sm focus:outline-none focus:border-primary cursor-pointer shadow-sm"
                  >
                    <option value="Senin" className="bg-card text-foreground font-medium text-xs py-1">Senin</option>
                    <option value="Selasa" className="bg-card text-foreground font-medium text-xs py-1">Selasa</option>
                    <option value="Rabu" className="bg-card text-foreground font-medium text-xs py-1">Rabu</option>
                    <option value="Kamis" className="bg-card text-foreground font-medium text-xs py-1">Kamis</option>
                    <option value="Jumat" className="bg-card text-foreground font-medium text-xs py-1">Jumat</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="submit"
                  className="bg-primary text-primary-foreground font-extrabold px-6 py-2.5 rounded-xl text-xs shadow-glow flex items-center gap-1.5 hover:scale-105 transition-all"
                >
                  <Sparkles className="w-4 h-4" /> Publikasikan Kuis
                </button>
              </div>
            </form>
          )}

          {/* VIEW 6: PANEL VERIFIKASI MATERI ADMIN (KHUSUS OWNER) */}
          {activeTab === 'verification' && isOwner && (
            <div className="bg-warning/10 border-2 border-warning/30 rounded-3xl p-6 space-y-4 animate-fade-in">
              <div className="border-b border-warning/20 pb-3">
                <h3 className="font-extrabold text-lg text-warning flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5" /> Panel Verifikasi Materi Admin (Khusus Owner)
                </h3>
                <p className="text-xs text-muted-foreground mt-1">Setujui atau minta perbaikan materi yang diajukan oleh Admin kelas.</p>
              </div>

              {pendingMaterials.length > 0 ? (
                <div className="space-y-3">
                  {pendingMaterials.map(item => (
                    <div key={item.id} className="bg-card border border-border rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-extrabold bg-primary/10 text-primary px-2 py-0.5 rounded-md">{item.subject}</span>
                          <h4 className="font-extrabold text-sm text-foreground">{item.title}</h4>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Diajukan oleh: <strong>{item.author}</strong> · {item.createdAt}</p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => handleRejectPending(item.id, item.title)}
                          className="bg-muted hover:bg-danger/20 hover:text-danger text-muted-foreground font-bold px-3.5 py-2 rounded-xl text-xs transition-colors"
                        >
                          Tolak
                        </button>
                        <button
                          onClick={() => handleApprovePending(item.id, item.title)}
                          className="bg-success text-white font-extrabold px-4 py-2 rounded-xl text-xs flex items-center gap-1 shadow-sm hover:scale-105 transition-all"
                        >
                          <CheckCircle2 className="w-4 h-4" /> Verifikasi &amp; Terbitkan
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-card border border-border rounded-2xl p-8 text-center text-xs text-muted-foreground">
                  Tidak ada pengajuan materi yang menunggu verifikasi saat ini.
                </div>
              )}
            </div>
          )}

          {/* VIEW 7: RIWAYAT PERUBAHAN LOG (AUDIT TRAIL LOG SAKRAL) */}
          {activeTab === 'audit_log' && (
            <div className="bg-card border border-border rounded-3xl p-6 shadow-sm space-y-4 animate-fade-in">
              <div className="border-b border-border pb-3">
                <h3 className="font-extrabold text-lg flex items-center gap-2">
                  <History className="w-5 h-5 text-primary" /> Riwayat Perubahan Kelas (Audit Trail Log)
                </h3>
                <p className="text-xs text-muted-foreground mt-1">Catatan kronologis siapa mengubah apa di dalam kelas {className}.</p>
              </div>

              <div className="space-y-3">
                {auditLogs.map(log => (
                  <div key={log.id} className="p-4 bg-background rounded-2xl border border-border flex items-start justify-between gap-4 shadow-xs">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0 mt-0.5">
                        <Clock className="w-4.5 h-4.5" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-sm text-foreground">{log.user}</span>
                          <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-primary/10 text-primary uppercase">
                            {log.role}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 font-medium leading-relaxed">{log.action}</p>
                      </div>
                    </div>

                    <span className="text-[10px] font-bold text-muted-foreground whitespace-nowrap shrink-0">{log.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VIEW 8: KELOLA ADMIN & ANGGOTA KELAS (DESAIN IN-PLACE SIDEBAR) */}
          {activeTab === 'members' && (
            <div className="bg-card border border-border rounded-3xl p-6 shadow-sm space-y-4 animate-fade-in">
              <ClassAnggotaPage
                currentRole={activeRole}
                onToggleAdmin={(id, newRole) => {
                  showToast(`Role anggota diperbarui menjadi ${newRole}`);
                }}
                onKickMember={(id) => {
                  showToast("Anggota telah dikeluarkan dari kelas.");
                }}
              />
            </div>
          )}

        </div>

      </div>

      <ClassSettingsModal
        isOpen={false}
        onClose={() => {}}
        cls={activeClass}
        currentRole="owner"
      />
    </section>
  );
}
