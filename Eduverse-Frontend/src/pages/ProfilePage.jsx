import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Settings, ChevronRight, ShieldCheck, Users, Swords, Flame, Trophy, Award, Zap, CheckCircle2, TrendingUp, AlertCircle, BookOpen, Target, Calendar, Plus, FolderPlus, FileText, Sparkles, RefreshCcw, History, Clock, UserCheck, KeyRound, Save, Trash2, ShieldAlert, BarChart3 } from 'lucide-react';
import { useAppState } from '../context/AppStateContext';
import { INITIAL_CLASSES } from '../data/mockData';
import ClassSettingsModal from '../components/ClassSettingsModal';
import ClassAnggotaPage from './ClassAnggotaPage';

export default function ProfilePage() {
  const { classId: routeClassId } = useParams();
  const { appState, userProfile, getLevelInfo, showToast, currentUser, findClass } = useAppState();
  
  const classId = routeClassId || 'cls-101';
  const activeClass = findClass ? findClass(classId) : (INITIAL_CLASSES.find(c => c.id === classId) || INITIAL_CLASSES[0]);
  const isDemoClass = !routeClassId || routeClassId === 'cls-101' || routeClassId === 'cls-102' || routeClassId === 'cls-103';

  const [activeRole, setActiveRole] = useState('owner'); // owner, admin, member
  const [activeTab, setActiveTab] = useState('overview'); // overview, settings, add_subject, add_material, add_quiz, verification, audit_log

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

  const levelInfo = getLevelInfo(appState.xp);
  const accuracy = appState.correctAnswers > 0
    ? Math.round((appState.correctAnswers / (appState.examsCompleted * 5)) * 100)
    : 78;

  const streakDays = [
    { day: 'Sen', active: true },
    { day: 'Sel', active: true },
    { day: 'Rab', active: true },
    { day: 'Kam', active: true },
    { day: 'Jum', active: true },
    { day: 'Sab', active: true },
    { day: 'Ming', active: true },
  ];

  const badges = [
    { title: 'Master Matriks', desc: 'Selesaikan 10 Ujian Matriks', icon: Zap, color: 'text-warning bg-warning/15', unlocked: true },
    { title: 'Kutu Buku', desc: 'Pelajari 20 Materi Belajar', icon: BookOpen, color: 'text-success bg-success/15', unlocked: true },
    { title: 'Sniper Akademik', desc: 'Raih Skor 100% pada Ujian', icon: Target, color: 'text-brand-blue bg-brand-blue/15', unlocked: true },
    { title: 'Serangan Fajar', desc: 'Belajar Sebelum Jam 6 Pagi', icon: Flame, color: 'text-rose-500 bg-rose-500/15', unlocked: false },
  ];

  const recentActivity = [
    { type: 'Ujian', title: 'Matematika - Matriks & Determinan', xp: '+120 XP', date: 'Hari Ini, 14:20', score: '90%' },
    { type: 'Materi', title: 'Bahasa Indonesia - Teks Multimodal', xp: '+30 XP', date: 'Kemarin, 19:45', score: 'Selesai' },
    { type: 'Quest', title: 'Misi Harian: Math Wizard', xp: '+50 XP', date: 'Kemarin, 10:15', score: 'Klaim' },
  ];

  const handleSaveClassInfo = (e) => {
    e.preventDefault();
    const newLog = {
      id: Date.now(),
      user: 'Refky Satria',
      role: activeRole.toUpperCase(),
      action: `Memperbarui nama kelas menjadi "${className}"`,
      time: 'Baru saja'
    };
    setAuditLogs([newLog, ...auditLogs]);
    showToast("Informasi kelas berhasil diperbarui!");
  };

  const handleRegenCode = () => {
    if (confirm("Apakah Anda yakin ingin membuat ulang kode kelas? Kode lama tidak akan berlaku lagi.")) {
      const newC = Math.random().toString(36).substring(2, 8).toUpperCase();
      setClassCode(newC);
      const newLog = {
        id: Date.now(),
        user: 'Refky Satria',
        role: 'OWNER',
        action: `Membuat Ulang Kode Kelas menjadi "${newC}"`,
        time: 'Baru saja'
      };
      setAuditLogs([newLog, ...auditLogs]);
      showToast(`Kode kelas baru dibuat: "${newC}"`);
    }
  };

  const handleCreateSubject = (e) => {
    e.preventDefault();
    if (!newSubjectName.trim() || !newSubjectCode.trim()) return;

    const newLog = {
      id: Date.now(),
      user: 'Refky Satria',
      role: activeRole.toUpperCase(),
      action: `Menambahkan Mata Pelajaran Baru "${newSubjectName}" (${newSubjectCode.toUpperCase()})`,
      time: 'Baru saja'
    };

    setAuditLogs([newLog, ...auditLogs]);
    showToast(`Mata Pelajaran "${newSubjectName}" berhasil ditambahkan!`);
    setNewSubjectName('');
    setNewSubjectCode('');
    setActiveTab('overview');
  };

  const handleCreateMaterial = (e) => {
    e.preventDefault();
    if (!newMaterialTitle.trim() || !newMaterialContent.trim()) return;

    const isOwner = activeRole === 'owner';
    const newLog = {
      id: Date.now(),
      user: 'Refky Satria',
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
  };

  const handleCreateQuiz = (e) => {
    e.preventDefault();
    if (!newQuizTitle.trim()) return;

    const newLog = {
      id: Date.now(),
      user: 'Refky Satria',
      role: activeRole.toUpperCase(),
      action: `Menerbitkan Kuis Baru "${newQuizTitle}" untuk hari ${newQuizDay}`,
      time: 'Baru saja'
    };

    setAuditLogs([newLog, ...auditLogs]);
    showToast(`Kuis "${newQuizTitle}" berhasil diterbitkan pada hari ${newQuizDay}!`);
    setNewQuizTitle('');
    setActiveTab('overview');
  };

  const handleApprovePending = (id, title) => {
    setPendingMaterials(prev => prev.filter(p => p.id !== id));
    const newLog = {
      id: Date.now(),
      user: 'Refky Satria',
      role: 'OWNER',
      action: `Memverifikasi & menerbitkan materi "${title}"`,
      time: 'Baru saja'
    };
    setAuditLogs([newLog, ...auditLogs]);
    showToast(`Materi "${title}" berhasil diverifikasi & dipublikasikan!`);
  };

  const handleRejectPending = (id, title) => {
    setPendingMaterials(prev => prev.filter(p => p.id !== id));
    const newLog = {
      id: Date.now(),
      user: 'Refky Satria',
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
      {/* Header Banner Identity */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-primary via-primary to-primary-glow rounded-3xl p-6 text-primary-foreground shadow-glow">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={currentUser?.profile_photo || currentUser?.avatar || currentUser?.photo_url || currentUser?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
              alt="Profile Avatar"
              className="w-16 h-16 rounded-full bg-white/20 outline outline-4 outline-white/30 object-cover shadow-lg"
            />
            <div className="absolute -bottom-1 -right-1 bg-xp-gold text-foreground w-6 h-6 rounded-full flex items-center justify-center font-extrabold text-[10px] shadow-md border-2 border-card">
              👑
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold italic">
                {currentUser ? `${currentUser.name} (@${currentUser.username})` : 'Refky Satria (EduQuest)'}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-[10px] font-extrabold uppercase border border-white/30">
                Role: {activeRole}
              </span>
            </div>
            <p className="text-xs text-primary-foreground/90 mt-0.5">
              {currentUser ? currentUser.email : `Kelas ${className} · SMKN 13 Bandung`}
            </p>
          </div>
        </div>

        {/* Level Badge */}
        <div className="bg-black/20 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20 flex items-center gap-3 shrink-0">
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-widest text-white/80">Pangkat Saat Ini</p>
            <p className="text-sm font-extrabold italic text-xp-gold">Lv. {levelInfo.level} Master</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-xp-gold text-black flex items-center justify-center font-extrabold text-sm shadow-md">
            {levelInfo.level}
          </div>
        </div>
      </div>

      {/* Main 2-Column Sidebar & Dynamic Content View Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        
        {/* LEFT SIDEBAR NAVIGATION MENU */}
        <div className="md:col-span-4 lg:col-span-3 space-y-4 md:sticky md:top-20">
          
          {/* Simulated Role Toggle Widget */}
          <div className="bg-card border border-border rounded-2xl p-3 space-y-2 shadow-sm">
            <span className="text-[11px] font-extrabold text-muted-foreground uppercase tracking-wider block">Simulasi Role Kelas</span>
            <div className="flex flex-col gap-1">
              <button
                onClick={() => setActiveRole('owner')}
                className={`w-full py-1.5 px-3 rounded-xl font-extrabold text-xs flex items-center justify-between transition-all ${
                  activeRole === 'owner' ? 'bg-primary text-primary-foreground shadow-sm' : 'bg-background hover:bg-muted text-muted-foreground'
                }`}
              >
                <span>🛡️ Owner Mode</span>
                {activeRole === 'owner' && <span>✓</span>}
              </button>
              <button
                onClick={() => setActiveRole('admin')}
                className={`w-full py-1.5 px-3 rounded-xl font-extrabold text-xs flex items-center justify-between transition-all ${
                  activeRole === 'admin' ? 'bg-brand-blue text-white shadow-sm' : 'bg-background hover:bg-muted text-muted-foreground'
                }`}
              >
                <span>👤 Admin Mode</span>
                {activeRole === 'admin' && <span>✓</span>}
              </button>
              <button
                onClick={() => setActiveRole('member')}
                className={`w-full py-1.5 px-3 rounded-xl font-extrabold text-xs flex items-center justify-between transition-all ${
                  activeRole === 'member' ? 'bg-success text-white shadow-sm' : 'bg-background hover:bg-muted text-muted-foreground'
                }`}
              >
                <span>🎓 Member Mode</span>
                {activeRole === 'member' && <span>✓</span>}
              </button>
            </div>
          </div>

          {/* DYNAMIC SIDEBAR MENU */}
          <div className="bg-card border border-border rounded-3xl p-3 shadow-sm space-y-1">
            <span className="px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground block">
              Menu Navigasi
            </span>

            {/* Menu 1: Ringkasan & Statistik */}
            <button
              onClick={() => setActiveTab('overview')}
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
              <>
                <div className="pt-2 pb-1 px-3 border-t border-border">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-primary">
                    {isOwner ? 'Manajemen Owner' : 'Manajemen Admin'}
                  </span>
                </div>

                {isOwner && (
                  <button
                    onClick={() => setActiveTab('settings')}
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
                  onClick={() => setActiveTab('add_subject')}
                  className={`w-full p-3 rounded-2xl font-extrabold text-xs flex items-center gap-3 transition-all cursor-pointer text-left ${
                    activeTab === 'add_subject'
                      ? 'bg-primary text-primary-foreground shadow-md'
                      : 'bg-background hover:bg-muted text-foreground'
                  }`}
                >
                  <FolderPlus className="w-4 h-4 shrink-0" />
                  <span className="flex-1">+ Tambah Mapel Baru</span>
                </button>

                <button
                  onClick={() => setActiveTab('add_material')}
                  className={`w-full p-3 rounded-2xl font-extrabold text-xs flex items-center gap-3 transition-all cursor-pointer text-left ${
                    activeTab === 'add_material'
                      ? 'bg-primary text-primary-foreground shadow-md'
                      : 'bg-background hover:bg-muted text-foreground'
                  }`}
                >
                  <FileText className="w-4 h-4 shrink-0" />
                  <span className="flex-1">+ Tambah Materi</span>
                </button>

                <button
                  onClick={() => setActiveTab('add_quiz')}
                  className={`w-full p-3 rounded-2xl font-extrabold text-xs flex items-center gap-3 transition-all cursor-pointer text-left ${
                    activeTab === 'add_quiz'
                      ? 'bg-primary text-primary-foreground shadow-md'
                      : 'bg-background hover:bg-muted text-foreground'
                  }`}
                >
                  <Swords className="w-4 h-4 shrink-0" />
                  <span className="flex-1">+ Tambah Kuis / Ujian</span>
                </button>

                {isOwner && (
                  <button
                    onClick={() => setActiveTab('verification')}
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
                  onClick={() => setActiveTab('members')}
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
                  onClick={() => setActiveTab('audit_log')}
                  className={`w-full p-3 rounded-2xl font-extrabold text-xs flex items-center gap-3 transition-all cursor-pointer text-left ${
                    activeTab === 'audit_log'
                      ? 'bg-primary text-primary-foreground shadow-md'
                      : 'bg-background hover:bg-muted text-foreground'
                  }`}
                >
                  <History className="w-4 h-4 shrink-0" />
                  <span className="flex-1">Riwayat Perubahan Log</span>
                </button>
              </>
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
                  <p className="text-2xl font-extrabold italic tabular-nums text-foreground">{appState.xp.toLocaleString()}</p>
                  <p className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider mt-1">Total XP</p>
                </div>
                <div className="bg-card border border-border rounded-2xl p-4 shadow-sm text-center">
                  <p className="text-2xl font-extrabold italic tabular-nums text-foreground">{appState.examsCompleted}</p>
                  <p className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider mt-1">Ujian Selesai</p>
                </div>
                <div className="bg-card border border-border rounded-2xl p-4 shadow-sm text-center">
                  <p className="text-2xl font-extrabold italic tabular-nums text-foreground">{accuracy}%</p>
                  <p className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider mt-1">Akurasi Jawaban</p>
                </div>
                <div className="bg-card border border-border rounded-2xl p-4 shadow-sm text-center">
                  <p className="text-2xl font-extrabold italic tabular-nums text-foreground flex items-center justify-center gap-1">
                    🔥 {appState.streak}
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
                  <span className="text-xs text-muted-foreground font-bold">🔥 {appState.streak} Hari Berturut-turut</span>
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
                    <div>
                      <div className="flex justify-between text-xs font-bold mb-1">
                        <span>Matematika (Matriks)</span>
                        <span className="text-success">96% Akurasi</span>
                      </div>
                      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-success rounded-full" style={{ width: '96%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs font-bold mb-1">
                        <span>PABP</span>
                        <span className="text-success">90% Akurasi</span>
                      </div>
                      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-success rounded-full" style={{ width: '90%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-card border border-border rounded-3xl p-5 shadow-sm space-y-3">
                  <div className="flex items-center gap-2 text-warning">
                    <AlertCircle className="w-5 h-5" />
                    <h4 className="font-extrabold text-sm">Perlu Ditingkatkan</h4>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between text-xs font-bold mb-1">
                        <span>Bahasa Inggris</span>
                        <span className="text-warning">65% Akurasi</span>
                      </div>
                      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-warning rounded-full" style={{ width: '65%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs font-bold mb-1">
                        <span>Cloud Computing</span>
                        <span className="text-warning">72% Akurasi</span>
                      </div>
                      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-warning rounded-full" style={{ width: '72%' }}></div>
                      </div>
                    </div>
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
                    className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary"
                  >
                    <option value="PWP">PWP (Pemrograman Web)</option>
                    <option value="IND">Bahasa Indonesia</option>
                    <option value="MTK">Matematika</option>
                    <option value="PPAN">Pendidikan Pancasila</option>
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
                    className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary"
                  >
                    <option value="Senin">Senin</option>
                    <option value="Selasa">Selasa</option>
                    <option value="Rabu">Rabu</option>
                    <option value="Kamis">Kamis</option>
                    <option value="Jumat">Jumat</option>
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
