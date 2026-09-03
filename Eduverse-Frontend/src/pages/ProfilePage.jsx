import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { Settings, ChevronRight, ChevronDown, ShieldCheck, Users, Swords, Flame, Trophy, Award, Zap, CheckCircle2, TrendingUp, AlertCircle, BookOpen, Target, Calendar, Plus, FolderPlus, FileText, Sparkles, RefreshCcw, History, Clock, UserCheck, KeyRound, Save, Trash2, Pencil, X, ShieldAlert, BarChart3, Copy, Check, Eye } from 'lucide-react';
import { useAppState } from '../context/AppStateContext';
import { INITIAL_CLASSES } from '../data/mockData';
import ClassSettingsModal from '../components/ClassSettingsModal';
import ClassAnggotaPage from './ClassAnggotaPage';
import ConfirmModal from '../components/ConfirmModal';
import { apiService } from '../services/apiService';

export default function ProfilePage({ initialTab }) {
  const { classId: routeClassId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { appState, userProfile, getLevelInfo, showToast, currentUser, findClass, updateClassInfo, addMateri, addQuiz } = useAppState();

  const getTabFromPath = () => {
    if (initialTab) return initialTab;
    const path = location.pathname;
    if (path.includes('/edit-info')) return 'settings';
    if (path.includes('/add-subject')) return 'add_subject';
    if (path.includes('/add-material')) return 'add_material';
    if (path.includes('/add-quiz')) return 'add_quiz';
    if (path.includes('/verification')) return 'verification';
    if (path.includes('/members')) return 'members';
    if (path.includes('/anggota')) return 'members_view';
    if (path.includes('/audit-log')) return 'audit_log';
    return searchParams.get('tab') || 'overview';
  };

  const activeClass = routeClassId && findClass ? findClass(routeClassId) : null;
  const isApiClass = Boolean(routeClassId && !String(routeClassId).startsWith('cls-') && !isNaN(Number(routeClassId)));
  const isDemoClass = !isApiClass;

  const activeRole = activeClass?.role || currentUser?.activeRole || 'owner';
  const [activeTab, setActiveTab] = useState(getTabFromPath());
  const [isManagementOpen, setIsManagementOpen] = useState(true);

  useEffect(() => {
    setActiveTab(getTabFromPath());
  }, [location.pathname, searchParams, initialTab]);

  const handleTabClick = (tabName, routePath) => {
    setActiveTab(tabName);
    const targetClassId = routeClassId || activeClass?.id;
    if (targetClassId) {
      const targetUrl = routePath ? `/class/${targetClassId}/${routePath}` : `/class/${targetClassId}/profile`;
      window.history.replaceState(null, '', targetUrl);
    } else {
      window.history.replaceState(null, '', '/profile');
    }
  };

  // Class Info Edit State
  const [className, setClassName] = useState(activeClass?.name || 'Kelas Baru');
  const [classDesc, setClassDesc] = useState(activeClass?.description || '');
  const [classCode, setClassCode] = useState(activeClass?.code || 'EDU123');

  useEffect(() => {
    if (activeClass) {
      setClassName(activeClass.name || 'Kelas Baru');
      setClassDesc(activeClass.description || '');
      if (activeClass.code) {
        setClassCode(activeClass.code);
      }
    }
  }, [activeClass?.id, activeClass?.name, activeClass?.description, activeClass?.code]);

  // DB Mapel & Materi Dynamic States
  const [dbMapelList, setDbMapelList] = useState([
    { id: 1, kode: 'PWP', nama: 'PWP (Pemrograman Web)', warna: 'from-indigo-500 to-purple-600' },
    { id: 2, kode: 'IND', nama: 'Bahasa Indonesia', warna: 'from-blue-500 to-cyan-500' },
    { id: 3, kode: 'MTK', nama: 'Matematika', warna: 'from-amber-500 to-orange-500' },
    { id: 4, kode: 'PPAN', nama: 'Pendidikan Pancasila', warna: 'from-emerald-500 to-teal-500' }
  ]);
  const [isCreateSubjectOpen, setIsCreateSubjectOpen] = useState(false);

  const [dbMateriList, setDbMateriList] = useState([]);
  const [isCreateMaterialOpen, setIsCreateMaterialOpen] = useState(false);

  // Edit Material State (Creating v2, v3...)
  const [editingMaterial, setEditingMaterial] = useState(null);
  const [editMaterialTitle, setEditMaterialTitle] = useState('');
  const [editMaterialSubject, setEditMaterialSubject] = useState('PWP');
  const [editMaterialContent, setEditMaterialContent] = useState('');

  // Side-by-side Verification Preview State
  const [verifyingMaterial, setVerifyingMaterial] = useState(null);

  // Form States
  const [newSubjectName, setNewSubjectName] = useState('');
  const [newSubjectCode, setNewSubjectCode] = useState('');
  const [newSubjectGradient, setNewSubjectGradient] = useState('from-indigo-500 to-purple-600');

  const [newMaterialTitle, setNewMaterialTitle] = useState('');
  const [newMaterialSubject, setNewMaterialSubject] = useState('PWP');
  const [newMaterialContent, setNewMaterialContent] = useState('');

  const [newQuizTitle, setNewQuizTitle] = useState('');
  const [newQuizDesc, setNewQuizDesc] = useState('');
  const [newQuizSubject, setNewQuizSubject] = useState('PWP');
  const [quizInputMode, setQuizInputMode] = useState('manual');

  const PROMPT_TEMPLATE = `Buatkan [jumlah] soal pilihan ganda tentang [topik] (bisa opsi A hingga E), masing-masing dengan format persis seperti contoh ini:

1. Apa ibu kota Indonesia?
A. Bandung
B. Jakarta
C. Surabaya
D. Medan
E. Yogyakarta
Jawaban: B
Pembahasan: Jakarta adalah ibu kota Indonesia

Pisahkan tiap soal dengan baris kosong. Jangan pakai markdown (bold/italic), jangan kasih judul atau intro di awal, dan jangan tambahkan teks lain di luar format itu.`;
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  // Load Mapel from DB
  useEffect(() => {
    if (isApiClass && routeClassId) {
      apiService.getMapel(routeClassId)
        .then(list => {
          if (Array.isArray(list) && list.length > 0) {
            setDbMapelList(list.map(m => ({
              id: m.id,
              kode: m.kode || 'MAPEL',
              nama: m.nama || 'Mata Pelajaran',
              warna: m.warna || 'from-indigo-500 to-purple-600'
            })));
            setNewMaterialSubject(list[0].kode);
            setNewQuizSubject(list[0].kode);
          }
        })
        .catch(() => {});
    }
  }, [isApiClass, routeClassId]);

  // Load Materi from DB
  useEffect(() => {
    if (isApiClass && routeClassId) {
      apiService.getMateri(routeClassId)
        .then(list => {
          if (Array.isArray(list)) {
            setDbMateriList(list.map(m => ({
              id: m.id,
              subject: m.mapel?.kode || 'MATERI',
              subjectName: m.mapel?.nama || 'Mata Pelajaran',
              title: m.judul,
              content: m.versi_aktif?.isi || m.isi || '',
              version: m.versi_aktif?.nomor_versi || 1,
              status: m.versi_aktif?.status || 'terverifikasi',
              createdAt: m.created_at ? new Date(m.created_at).toLocaleDateString() : 'Hari ini',
              author: m.creator?.name || 'Owner',
              versions: m.versi || []
            })));
          }
        })
        .catch(() => {});
    }
  }, [isApiClass, routeClassId]);

  // Load Members from DB
  const [dbMemberList, setDbMemberList] = useState([]);

  useEffect(() => {
    const fetchMembers = async () => {
      if (isApiClass && routeClassId) {
        try {
          const list = await apiService.getMembers(routeClassId);
          if (Array.isArray(list) && list.length > 0) {
            setDbMemberList(list.map(m => ({
              id: m.id || m.user_id,
              name: m.user?.name || m.name || 'Anggota Kelas',
              username: m.user?.email ? `@${m.user.email.split('@')[0]}` : (m.username || '@user'),
              email: m.user?.email || m.email,
              role: m.role || 'member',
              avatar: m.user?.avatar || m.avatar
            })));
            return;
          }
        } catch (e) {
          console.error("Failed to load members from API:", e);
        }
      }
      // Real member data from active class or API only (NO DUMMY DATA!)
      if (activeClass && Array.isArray(activeClass.members) && activeClass.members.length > 0) {
        setDbMemberList(activeClass.members);
      } else {
        setDbMemberList(currentUser ? [{
          id: currentUser.id || 'usr-owner',
          name: currentUser.name || activeClass?.ownerName || 'Pembuat Kelas',
          username: currentUser.email ? `@${currentUser.email.split('@')[0]}` : `@${currentUser.username || 'owner'}`,
          email: currentUser.email,
          role: activeRole || 'owner',
          avatar: currentUser.avatar
        }] : []);
      }
    };
    fetchMembers();
  }, [isApiClass, routeClassId, activeClass, currentUser, activeRole]);

  const handleToggleAdminMember = async (userId, newRole) => {
    try {
      if (isApiClass && routeClassId) {
        if (newRole === 'Admin' || newRole === 'admin') {
          await apiService.promoteMember(routeClassId, userId);
        } else {
          await apiService.demoteAdmin(routeClassId, userId);
        }
      }
      setDbMemberList(prev => prev.map(mem => mem.id === userId ? { ...mem, role: newRole } : mem));
      showToast(`Role anggota berhasil diubah menjadi ${newRole}`);
    } catch (err) {
      showToast(err.message || 'Gagal mengubah role anggota', 'error');
    }
  };

  const handleKickMemberItem = async (userId) => {
    try {
      if (isApiClass && routeClassId) {
        await apiService.kickMember(routeClassId, userId);
      }
      setDbMemberList(prev => prev.filter(mem => mem.id !== userId));
      showToast('Anggota berhasil dikeluarkan dari kelas.');
    } catch (err) {
      showToast(err.message || 'Gagal mengeluarkan anggota', 'error');
    }
  };

  const [rawSoalText, setRawSoalText] = useState('');
  const [parsedSoalList, setParsedSoalList] = useState([]);
  const [isParsingSoal, setIsParsingSoal] = useState(false);

  // Edit parsed soal state
  const [editingSoalId, setEditingSoalId] = useState(null);
  const [editPertanyaan, setEditPertanyaan] = useState('');
  const [editOpsi, setEditOpsi] = useState([]);
  const [editJawabanHuruf, setEditJawabanHuruf] = useState('A');
  const [editPembahasan, setEditPembahasan] = useState('');

  const [manualPertanyaan, setManualPertanyaan] = useState('');
  const [manualOpsiList, setManualOpsiList] = useState([
    { huruf: 'A', teks_opsi: '' },
    { huruf: 'B', teks_opsi: '' }
  ]);
  const [manualJawaban, setManualJawaban] = useState('A');
  const [manualPembahasan, setManualPembahasan] = useState('');

  // Manual questions list state
  const [manualSoalList, setManualSoalList] = useState([]);
  const [editingManualIdx, setEditingManualIdx] = useState(null);

  // Pending materials for Owner verification
  const [pendingMaterials, setPendingMaterials] = useState([]);

  // Audit Trail Logs
  const [auditLogs, setAuditLogs] = useState([
    { id: 1, user: currentUser?.name || 'Owner', role: 'OWNER', action: `Membuat Ruang Kelas "${activeClass?.name || 'Kelas Baru'}"`, time: 'Baru saja' }
  ]);

  // Load backend log_aktivitas on mount if available
  useEffect(() => {
    if (isApiClass && routeClassId) {
      apiService.getLogAktivitas(routeClassId)
        .then(logs => {
          if (Array.isArray(logs) && logs.length > 0) {
            setAuditLogs(logs.map(l => ({
              id: l.id,
              user: l.user?.name || l.user?.username || 'User',
              role: l.peran_user || 'OWNER',
              action: l.deskripsi_aksi,
              time: new Date(l.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            })));
          }
        })
        .catch(err => console.warn("Notice: Log aktivitas backend tidak dimuat:", err.message));
    }
  }, [isApiClass, routeClassId]);

  // Load backend pending materials for verification tab
  useEffect(() => {
    if (isApiClass && routeClassId) {
      apiService.getMateri(routeClassId)
        .then(list => {
          if (Array.isArray(list)) {
            const pending = list.filter(m => m.versi_aktif?.status === 'menunggu_verifikasi');
            setPendingMaterials(pending.map(m => {
              const prevV = m.versi ? m.versi.find(v => v.nomor_versi === (m.versi_aktif?.nomor_versi || 1) - 1) : null;
              return {
                id: m.id,
                versiId: m.versi_aktif?.id,
                subject: m.mapel?.kode || 'MATERI',
                title: m.judul,
                author: m.creator?.name || m.creator?.username || 'Admin',
                createdAt: m.created_at ? new Date(m.created_at).toLocaleDateString() : 'Hari ini',
                prevVersion: prevV ? {
                  version: prevV.nomor_versi,
                  title: m.judul,
                  content: prevV.isi,
                  status: 'terverifikasi',
                  author: 'Owner'
                } : null,
                newVersion: {
                  version: m.versi_aktif?.nomor_versi || 1,
                  title: m.judul,
                  content: m.versi_aktif?.isi || '',
                  status: 'menunggu_verifikasi',
                  author: m.creator?.name || 'Admin'
                }
              };
            }));
          }
        })
        .catch(() => {});
    }
  }, [isApiClass, routeClassId]);

  const handleApprovePending = async (materiId, versiId, title) => {
    try {
      if (isApiClass && routeClassId && versiId) {
        await apiService.verifyMateriVersi(routeClassId, versiId, { status: 'terverifikasi' });
      }
      setPendingMaterials(prev => prev.filter(m => m.id !== materiId));
      showToast(`Materi "${title}" berhasil diverifikasi & diterbitkan!`);
    } catch (err) {
      showToast(err.message || "Gagal memverifikasi materi");
    }
  };

  const handleRejectPending = async (materiId, versiId, title) => {
    try {
      if (isApiClass && routeClassId && versiId) {
        await apiService.verifyMateriVersi(routeClassId, versiId, { status: 'ditolak' });
      }
      setPendingMaterials(prev => prev.filter(m => m.id !== materiId));
      showToast(`Materi "${title}" ditolak.`);
    } catch (err) {
      showToast(err.message || "Gagal menolak materi");
    }
  };

  const displayXp = currentUser?.xp ?? appState?.xp ?? 0;
  const levelInfo = getLevelInfo(displayXp);
  const displayExams = currentUser?.exams_completed ?? appState?.examsCompleted ?? 0;
  const displayAccuracy = currentUser?.accuracy !== undefined
    ? currentUser.accuracy
    : ((displayExams > 0 && (appState?.correctAnswers ?? 0) > 0)
        ? Math.round((appState.correctAnswers / (displayExams * 5)) * 100)
        : 0);
  const displayStreak = currentUser?.streak ?? appState?.streak ?? 0;

  const streakDays = [
    { day: 'Sen', active: false },
    { day: 'Sel', active: false },
    { day: 'Rab', active: false },
    { day: 'Kam', active: false },
    { day: 'Jum', active: false },
    { day: 'Sab', active: false },
    { day: 'Min', active: false },
  ];

  const badges = [
    { title: 'Master Matriks', desc: 'Selesaikan 10 Ujian Matriks', icon: Zap, color: 'text-warning bg-warning/15', unlocked: false },
    { title: 'Kutu Buku', desc: 'Pelajari 20 Materi Belajar', icon: BookOpen, color: 'text-success bg-success/15', unlocked: false },
    { title: 'Sniper Akademik', desc: 'Raih Skor 100% pada Ujian', icon: Target, color: 'text-brand-blue bg-brand-blue/15', unlocked: false },
    { title: 'Serangan Fajar', desc: 'Belajar Sebelum Jam 6 Pagi', icon: Flame, color: 'text-rose-500 bg-rose-500/15', unlocked: false },
  ];

  const recentActivity = [];
  const topSubjects = [];
  const weakSubjects = [];

  const handleSaveClassInfo = async (e) => {
    e.preventDefault();
    try {
      let updatedRes;
      if (isApiClass && routeClassId) {
        updatedRes = await apiService.updateClass(routeClassId, { name: className, description: classDesc });
      }
      const finalCode = updatedRes?.code || classCode;
      if (updatedRes?.code) {
        setClassCode(updatedRes.code);
      }
      if (updateClassInfo) {
        updateClassInfo(routeClassId || activeClass?.id, { name: className, description: classDesc, code: finalCode });
      }
      const newLog = {
        id: Date.now(),
        user: currentUser?.name || 'Owner',
        role: activeRole.toUpperCase(),
        action: `Memperbarui nama kelas menjadi "${className}"`,
        time: 'Baru saja'
      };
      setAuditLogs([newLog, ...auditLogs]);
      showToast("Informasi kelas berhasil diperbarui!");
    } catch (err) {
      if (updateClassInfo) {
        updateClassInfo(routeClassId || activeClass?.id, { name: className, description: classDesc, code: classCode });
      }
      showToast("Informasi kelas berhasil diperbarui!");
    }
  };

  const [isRegenConfirmOpen, setIsRegenConfirmOpen] = useState(false);

  const executeRegenCode = async () => {
    try {
      let newC = Math.random().toString(36).substring(2, 8).toUpperCase();
      if (isApiClass && routeClassId) {
        const res = await apiService.regenerateClassCode(routeClassId);
        if (res?.code) newC = res.code;
      }
      setClassCode(newC);
      if (updateClassInfo) {
        updateClassInfo(routeClassId || activeClass?.id, { code: newC });
      }
      const newLog = {
        id: Date.now(),
        user: currentUser?.name || 'Owner',
        role: 'OWNER',
        action: `Membuat Ulang Kode Kelas menjadi "${newC}"`,
        time: 'Baru saja'
      };
      setAuditLogs([newLog, ...auditLogs]);
      showToast(`Kode kelas baru dibuat: "${newC}"`);
    } catch (err) {
      showToast(err.message || "Gagal meregenerasi kode kelas");
    }
  };

  const handleRegenCode = () => {
    setIsRegenConfirmOpen(true);
  };

  const handleCreateSubject = async (e) => {
    e.preventDefault();
    if (!newSubjectName.trim() || !newSubjectCode.trim()) return;

    try {
      let created;
      if (isApiClass && routeClassId) {
        created = await apiService.createMapel(routeClassId, {
          nama: newSubjectName,
          kode: newSubjectCode,
          warna: newSubjectGradient
        });
      }
      const newMapelObj = created ? {
        id: created.id,
        kode: created.kode || newSubjectCode.toUpperCase(),
        nama: created.nama || newSubjectName,
        warna: created.warna || newSubjectGradient
      } : {
        id: `mapel-${Date.now()}`,
        nama: newSubjectName,
        kode: newSubjectCode.toUpperCase(),
        warna: newSubjectGradient
      };

      setDbMapelList(prev => [...prev, newMapelObj]);

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
      setIsCreateSubjectOpen(false);
    } catch (err) {
      showToast(err.message || "Gagal menambahkan mata pelajaran");
    }
  };

  const handleCreateMaterial = async (e) => {
    e.preventDefault();
    if (!newMaterialTitle.trim() || !newMaterialContent.trim()) return;

    const isOwner = activeRole === 'owner';
    try {
      let createdApi;
      if (isApiClass && routeClassId) {
        const selectedMapelObj = dbMapelList.find(m => m.kode === newMaterialSubject || m.id === newMaterialSubject);
        createdApi = await apiService.createMateri(routeClassId, {
          judul: newMaterialTitle,
          isi: newMaterialContent,
          mapel_id: selectedMapelObj?.id || null
        });
      }

      const materiObject = {
        id: createdApi?.id || `mat-${Date.now()}`,
        classId: routeClassId || activeClass?.id || 'global',
        subject: newMaterialSubject || 'PWP',
        subjectName: newMaterialSubject || 'Mata Pelajaran',
        title: newMaterialTitle.trim(),
        content: newMaterialContent.trim(),
        num: '01',
        status: isOwner ? 'terverifikasi' : 'menunggu_verifikasi',
        version: 1,
        author: currentUser?.name || 'Owner',
        createdAt: 'Baru saja'
      };

      if (addMateri) {
        addMateri(materiObject);
      }
      setDbMateriList(prev => [materiObject, ...prev]);

      const newLog = {
        id: Date.now(),
        user: currentUser?.name || 'Owner',
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
      setIsCreateMaterialOpen(false);
    } catch (err) {
      showToast(err.message || "Gagal membuat materi");
    }
  };

  const handleOpenEditMaterial = (materi) => {
    setEditingMaterial(materi);
    setEditMaterialTitle(materi.title || materi.judul || '');
    setEditMaterialSubject(materi.subject || materi.mapel?.kode || 'PWP');
    setEditMaterialContent(materi.content || materi.isi || '');
    setIsCreateMaterialOpen(false);
  };

  const handleUpdateExistingMaterial = async (e) => {
    e.preventDefault();
    if (!editingMaterial || !editMaterialTitle.trim() || !editMaterialContent.trim()) return;

    const isOwner = activeRole === 'owner';
    const nextVer = (editingMaterial.version || 1) + 1;
    const newStatus = isOwner ? 'terverifikasi' : 'menunggu_verifikasi';

    try {
      if (isApiClass && routeClassId) {
        const selectedMapelObj = dbMapelList.find(m => m.kode === editMaterialSubject || m.id === editMaterialSubject);
        await apiService.updateMateri(routeClassId, editingMaterial.id, {
          judul: editMaterialTitle,
          isi: editMaterialContent,
          mapel_id: selectedMapelObj?.id || null
        });
      }

      setDbMateriList(prev => prev.map(m => {
        if (m.id === editingMaterial.id) {
          return {
            ...m,
            title: editMaterialTitle.trim(),
            subject: editMaterialSubject,
            content: isOwner ? editMaterialContent.trim() : m.content,
            version: isOwner ? nextVer : m.version,
            status: isOwner ? 'terverifikasi' : m.status,
          };
        }
        return m;
      }));

      if (!isOwner) {
        setPendingMaterials(prev => [
          {
            id: editingMaterial.id,
            materiId: editingMaterial.id,
            subject: editMaterialSubject,
            title: editMaterialTitle.trim(),
            author: currentUser?.name || 'Admin',
            createdAt: 'Baru saja',
            prevVersion: {
              version: editingMaterial.version || 1,
              title: editingMaterial.title,
              content: editingMaterial.content,
              status: 'terverifikasi',
              author: editingMaterial.author || 'Owner'
            },
            newVersion: {
              version: nextVer,
              title: editMaterialTitle.trim(),
              content: editMaterialContent.trim(),
              status: 'menunggu_verifikasi',
              author: currentUser?.name || 'Admin'
            }
          },
          ...prev
        ]);
      }

      const newLog = {
        id: Date.now(),
        user: currentUser?.name || 'Admin',
        role: activeRole.toUpperCase(),
        action: isOwner
          ? `Memperbarui materi "${editMaterialTitle}" ke v${nextVer} (Terverifikasi)`
          : `Mengajukan pembaruan versi v${nextVer} untuk materi "${editMaterialTitle}" (Menunggu Verifikasi)`,
        time: 'Baru saja'
      };

      setAuditLogs([newLog, ...auditLogs]);
      showToast(
        isOwner
          ? `Materi "${editMaterialTitle}" berhasil diperbarui ke v${nextVer}!`
          : `Versi v${nextVer} materi "${editMaterialTitle}" diajukan! Menunggu Verifikasi Owner.`
      );

      setEditingMaterial(null);
    } catch (err) {
      showToast(err.message || "Gagal memperbarui materi");
    }
  };

  const parseLocally = (rawText) => {
    if (!rawText.trim()) return [];
    const blocks = rawText.split(/\n\s*\n/).map(b => b.trim()).filter(Boolean);
    return blocks.map(block => {
      const lines = block.split('\n').map(l => l.trim()).filter(Boolean);
      let pertanyaan = '';
      const opsi = [];
      let jawabanHuruf = '';
      let pembahasan = '';
      let status = 'valid';
      let errorMessage = '';

      lines.forEach(line => {
        const matchOpsi = line.match(/^([A-E])[\.\)]\s*(.*)/i);
        const matchKunci = line.match(/^(jawaban|kunci):\s*([A-E])/i);
        const matchBahas = line.match(/^pembahasan:\s*(.*)/i);

        if (matchOpsi) {
          const huruf = matchOpsi[1].toUpperCase();
          opsi.push({ huruf, teks_opsi: matchOpsi[2], benar: false });
        } else if (matchKunci) {
          jawabanHuruf = matchKunci[2].toUpperCase();
        } else if (matchBahas) {
          pembahasan = matchBahas[1];
        } else {
          if (opsi.length === 0 && !jawabanHuruf && !pembahasan) {
            pertanyaan += (pertanyaan ? ' ' : '') + line;
          } else if (pembahasan) {
            pembahasan += ' ' + line;
          }
        }
      });

      pertanyaan = pertanyaan.replace(/^\d+[\.\)]\s*/, '');

      if (jawabanHuruf) {
        opsi.forEach(opt => {
          if (opt.huruf === jawabanHuruf) opt.benar = true;
        });
      }

      if (!pertanyaan) {
        status = 'error';
        errorMessage = 'Pertanyaan tidak ditemukan';
      } else if (opsi.length < 2) {
        status = 'error';
        errorMessage = 'Opsi pilihan ganda minimal 2 (A, B, ...)';
      } else if (!jawabanHuruf) {
        status = 'error';
        errorMessage = 'Jawaban benar belum ditentukan (contoh: Jawaban: B)';
      } else if (!opsi.some(o => o.huruf === jawabanHuruf)) {
        status = 'error';
        errorMessage = `Kunci jawaban (${jawabanHuruf}) tidak cocok dengan opsi yang ada`;
      }

      return {
        id: Date.now() + Math.random(),
        status,
        error_message: errorMessage,
        pertanyaan,
        jenis_soal: 'pilihan_ganda',
        pembahasan,
        jawaban_benar: jawabanHuruf,
        opsi,
      };
    });
  };

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(PROMPT_TEMPLATE);
    setCopiedPrompt(true);
    showToast('Prompt AI berhasil disalin!');
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  const handleParseSoal = async (isAppend = true) => {
    if (!rawSoalText.trim()) {
      showToast('Masukkan teks soal yang akan diparse');
      return;
    }
    setIsParsingSoal(true);
    try {
      let hasil = [];
      if (isApiClass && routeClassId) {
        hasil = await apiService.parseSoalTeks(routeClassId, rawSoalText);
      } else {
        hasil = parseLocally(rawSoalText);
      }

      if (!hasil || hasil.length === 0) {
        showToast('Tidak ada soal yang berhasil terdeteksi dari teks');
        return;
      }

      const formattedHasil = hasil.map((item, idx) => ({
        ...item,
        id: item.id || (Date.now() + Math.random() + idx)
      }));

      if (isAppend && parsedSoalList.length > 0) {
        setParsedSoalList(prev => [...prev, ...formattedHasil]);
        showToast(`${formattedHasil.length} soal baru ditambahkan! Total preview: ${parsedSoalList.length + formattedHasil.length} soal`);
      } else {
        setParsedSoalList(formattedHasil);
        showToast(`${formattedHasil.length} soal berhasil diparse! Periksa preview di bawah`);
      }
      setRawSoalText('');
    } catch (err) {
      const fallback = parseLocally(rawSoalText);
      const formattedFallback = fallback.map((item, idx) => ({
        ...item,
        id: item.id || (Date.now() + Math.random() + idx)
      }));

      if (isAppend && parsedSoalList.length > 0) {
        setParsedSoalList(prev => [...prev, ...formattedFallback]);
        showToast(`${formattedFallback.length} soal baru ditambahkan via parser lokal!`);
      } else {
        setParsedSoalList(formattedFallback);
        showToast(`${formattedFallback.length} soal diparse via parser lokal`);
      }
      setRawSoalText('');
    } finally {
      setIsParsingSoal(false);
    }
  };

  const handleRemoveParsedSoal = (id) => {
    setParsedSoalList(prev => prev.filter(item => item.id !== id));
    if (editingSoalId === id) setEditingSoalId(null);
  };

  const handleStartEditParsedSoal = (item) => {
    if (!item) return;
    setEditingSoalId(item.id);
    setEditPertanyaan(item.pertanyaan || '');
    let defaultOpsi = [];
    if (Array.isArray(item.opsi) && item.opsi.length > 0) {
      defaultOpsi = item.opsi.map((o, i) => {
        if (typeof o === 'string') {
          return { huruf: String.fromCharCode(65 + i), teks_opsi: o, benar: i === 0 };
        }
        return {
          huruf: o.huruf || String.fromCharCode(65 + i),
          teks_opsi: o.teks_opsi || o.teks || '',
          benar: Boolean(o.benar)
        };
      });
    } else {
      defaultOpsi = [
        { huruf: 'A', teks_opsi: '', benar: true },
        { huruf: 'B', teks_opsi: '', benar: false },
        { huruf: 'C', teks_opsi: '', benar: false },
        { huruf: 'D', teks_opsi: '', benar: false }
      ];
    }
    setEditOpsi(defaultOpsi);
    const correctOpt = defaultOpsi.find(o => o.benar);
    setEditJawabanHuruf(correctOpt ? correctOpt.huruf : (item.jawaban_benar || 'A'));
    setEditPembahasan(item.pembahasan || '');
  };

  const handleSaveEditParsedSoal = (id) => {
    if (!editPertanyaan.trim()) {
      showToast('Pertanyaan soal tidak boleh kosong');
      return;
    }
    if (editOpsi.length < 2 || editOpsi.length > 5) {
      showToast('Opsi pilihan ganda harus 2 hingga 5 pilihan');
      return;
    }
    for (let i = 0; i < editOpsi.length; i++) {
      if (!editOpsi[i].teks_opsi.trim()) {
        const h = editOpsi[i].huruf || String.fromCharCode(65 + i);
        showToast(`Teks Opsi ${h} tidak boleh kosong`);
        return;
      }
    }
    if (!editJawabanHuruf || !editOpsi.some((o, i) => (o.huruf || String.fromCharCode(65 + i)) === editJawabanHuruf)) {
      showToast('Jawaban benar belum dipilih');
      return;
    }

    const updatedOpsi = editOpsi.map((o, idx) => {
      const huruf = o.huruf || String.fromCharCode(65 + idx);
      return {
        huruf,
        teks_opsi: o.teks_opsi.trim(),
        benar: huruf === editJawabanHuruf
      };
    });

    setParsedSoalList(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          status: 'valid',
          error_message: '',
          pertanyaan: editPertanyaan.trim(),
          opsi: updatedOpsi,
          jawaban_benar: editJawabanHuruf,
          pembahasan: editPembahasan.trim()
        };
      }
      return item;
    }));

    setManualSoalList(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          status: 'valid',
          error_message: '',
          pertanyaan: editPertanyaan.trim(),
          opsi: updatedOpsi,
          jawaban_benar: editJawabanHuruf,
          pembahasan: editPembahasan.trim()
        };
      }
      return item;
    }));

    setEditingSoalId(null);
    showToast('Soal berhasil diperbarui!');
  };

  const handleCancelEditParsedSoal = () => {
    setEditingSoalId(null);
  };

  const handleAddNewBlankParsedSoal = () => {
    const newId = Date.now() + Math.random();
    const newBlankItem = {
      id: newId,
      status: 'valid',
      error_message: '',
      pertanyaan: '',
      jenis_soal: 'pilihan_ganda',
      pembahasan: '',
      jawaban_benar: 'A',
      opsi: [
        { huruf: 'A', teks_opsi: '', benar: true },
        { huruf: 'B', teks_opsi: '', benar: false }
      ]
    };
    setParsedSoalList(prev => [...prev, newBlankItem]);
    handleStartEditParsedSoal(newBlankItem);
    showToast(`Soal #${parsedSoalList.length + 1} ditambahkan di paling bawah! Silakan isi pertanyaan.`);
  };

  const handleAddEditOption = () => {
    if (editOpsi.length >= 5) {
      showToast('Maksimal 5 opsi pilihan ganda');
      return;
    }
    const nextHuruf = String.fromCharCode(65 + editOpsi.length);
    setEditOpsi([...editOpsi, { huruf: nextHuruf, teks_opsi: '', benar: false }]);
  };

  const handleRemoveEditOption = () => {
    if (editOpsi.length <= 2) {
      showToast('Minimal 2 opsi pilihan ganda');
      return;
    }
    const lastOption = editOpsi[editOpsi.length - 1];
    const filtered = editOpsi.slice(0, -1);
    setEditOpsi(filtered);
    if (editJawabanHuruf === lastOption.huruf) {
      setEditJawabanHuruf(filtered[filtered.length - 1]?.huruf || 'A');
    }
  };

  const handleAddManualOption = () => {
    if (manualOpsiList.length >= 5) {
      showToast('Maksimal 5 opsi pilihan ganda');
      return;
    }
    const nextHuruf = String.fromCharCode(65 + manualOpsiList.length);
    setManualOpsiList(prev => [...prev, { huruf: nextHuruf, teks_opsi: '' }]);
  };

  const handleRemoveManualOption = () => {
    if (manualOpsiList.length <= 2) {
      showToast('Minimal 2 opsi pilihan ganda');
      return;
    }
    const lastOption = manualOpsiList[manualOpsiList.length - 1];
    const newList = manualOpsiList.slice(0, -1);
    setManualOpsiList(newList);
    if (manualJawaban === lastOption.huruf) {
      setManualJawaban('');
    }
  };

  const handleManualOptionChange = (idx, text) => {
    setManualOpsiList(prev => prev.map((o, i) => i === idx ? { ...o, teks_opsi: text } : o));
  };

  const handleResetManualForm = () => {
    setEditingManualIdx(null);
    setManualPertanyaan('');
    setManualOpsiList([
      { huruf: 'A', teks_opsi: '' },
      { huruf: 'B', teks_opsi: '' }
    ]);
    setManualJawaban('A');
    setManualPembahasan('');
  };

  const handleAddManualSoal = () => {
    if (!manualPertanyaan.trim()) {
      showToast('Pertanyaan soal harus diisi');
      return;
    }
    if (manualOpsiList.length < 2 || manualOpsiList.length > 5) {
      showToast('Jumlah opsi harus antara 2 hingga 5 opsi');
      return;
    }
    for (let i = 0; i < manualOpsiList.length; i++) {
      if (!manualOpsiList[i].teks_opsi.trim()) {
        showToast(`Teks Opsi ${manualOpsiList[i].huruf} tidak boleh kosong`);
        return;
      }
    }
    if (!manualJawaban || !manualOpsiList.some(o => o.huruf === manualJawaban)) {
      showToast('Jawaban benar belum dipilih');
      return;
    }

    const opsiArr = manualOpsiList.map(o => ({
      huruf: o.huruf,
      teks_opsi: o.teks_opsi.trim(),
      benar: o.huruf === manualJawaban
    }));

    const newSoalObj = {
      id: Date.now() + Math.random(),
      status: 'valid',
      error_message: '',
      pertanyaan: manualPertanyaan.trim(),
      jenis_soal: 'pilihan_ganda',
      pembahasan: manualPembahasan.trim() || null,
      jawaban_benar: manualJawaban,
      opsi: opsiArr
    };

    if (editingManualIdx !== null) {
      setManualSoalList(prev => prev.map((item, idx) => idx === editingManualIdx ? newSoalObj : item));
      showToast(`Soal #${editingManualIdx + 1} berhasil diperbarui!`);
      setEditingManualIdx(null);
    } else {
      setManualSoalList(prev => [...prev, newSoalObj]);
      showToast(`Soal #${manualSoalList.length + 1} berhasil ditambahkan ke daftar!`);
    }

    handleResetManualForm();
  };

  const handleEditManualSoal = (index) => {
    const target = manualSoalList[index];
    if (!target) return;
    setEditingManualIdx(index);
    setManualPertanyaan(target.pertanyaan || '');
    let opts = [];
    if (Array.isArray(target.opsi) && target.opsi.length > 0) {
      opts = target.opsi.map((o, i) => ({
        huruf: o.huruf || String.fromCharCode(65 + i),
        teks_opsi: o.teks_opsi || o.teks || ''
      }));
    } else {
      opts = [
        { huruf: 'A', teks_opsi: '' },
        { huruf: 'B', teks_opsi: '' }
      ];
    }
    setManualOpsiList(opts);
    const correctLetter = target.jawaban_benar || (target.opsi ? target.opsi.find(o => o.benar)?.huruf : 'A');
    if (opts.some(o => o.huruf === correctLetter)) {
      setManualJawaban(correctLetter);
    } else {
      setManualJawaban('');
    }
    setManualPembahasan(target.pembahasan || '');
  };

  const handleRemoveManualSoal = (index) => {
    setManualSoalList(prev => prev.filter((_, i) => i !== index));
    if (editingManualIdx === index) {
      handleResetManualForm();
    }
    showToast('Soal dihapus dari daftar');
  };

  const handleCancelEditManualSoal = () => {
    handleResetManualForm();
  };

  const handleCreateQuiz = async (e) => {
    e.preventDefault();
    if (!newQuizTitle.trim()) {
      showToast('Judul Kuis harus diisi');
      return;
    }

    let soalPayload = [];
    if (quizInputMode === 'paste') {
      const validSoal = parsedSoalList.filter(s => s.status === 'valid');
      if (validSoal.length === 0) {
        showToast('Belum ada soal valid hasil parse untuk diterbitkan');
        return;
      }
      soalPayload = validSoal.map(s => ({
        pertanyaan: s.pertanyaan,
        jenis_soal: 'pilihan_ganda',
        pembahasan: s.pembahasan || null,
        opsi: s.opsi.map(o => ({ teks_opsi: o.teks_opsi, benar: o.benar }))
      }));
    } else {
      let finalManualList = [...manualSoalList];
      if (manualPertanyaan.trim()) {
        let isOpsiValid = manualOpsiList.length >= 2 && manualOpsiList.every(o => o.teks_opsi.trim() !== '');
        if (!isOpsiValid) {
          showToast('Teks opsi pada form soal saat ini tidak boleh ada yang kosong');
          return;
        }
        if (!manualJawaban || !manualOpsiList.some(o => o.huruf === manualJawaban)) {
          showToast('Jawaban benar pada form soal saat ini belum dipilih');
          return;
        }
        const currentSoalObj = {
          pertanyaan: manualPertanyaan.trim(),
          jenis_soal: 'pilihan_ganda',
          pembahasan: manualPembahasan.trim() || null,
          jawaban_benar: manualJawaban,
          opsi: manualOpsiList.map(o => ({
            huruf: o.huruf,
            teks_opsi: o.teks_opsi.trim(),
            benar: o.huruf === manualJawaban
          }))
        };

        if (editingManualIdx !== null) {
          finalManualList[editingManualIdx] = currentSoalObj;
        } else {
          finalManualList.push(currentSoalObj);
        }
      }

      if (finalManualList.length === 0) {
        showToast('Minimal tambahkan 1 soal manual ke dalam daftar');
        return;
      }

      soalPayload = finalManualList;
    }

    try {
      if (isApiClass && routeClassId) {
        await apiService.imporSoalBatch(routeClassId, soalPayload);
        await apiService.createKuis(routeClassId, {
          judul: newQuizTitle,
          deskripsi: newQuizDesc || 'Kuis Baru'
        });
      }
      const quizObject = {
        id: `quiz-${Date.now()}`,
        classId: routeClassId || activeClass?.id || (classList && classList[0]?.id) || 'global',
        title: newQuizTitle.trim(),
        description: newQuizDesc || 'Kuis Baru',
        code: newQuizSubject,
        subject: newQuizSubject,
        questionsCount: soalPayload.length,
        attemptsCount: 0,
        active: true,
        questions: soalPayload.map(s => ({
          q: s.pertanyaan,
          options: s.opsi.map(o => o.teks_opsi),
          correct: s.opsi.findIndex(o => o.benar) >= 0 ? s.opsi.findIndex(o => o.benar) : 0,
          hint: s.pembahasan || ''
        }))
      };
      if (addQuiz) {
        addQuiz(quizObject);
      }

      const newLog = {
        id: Date.now(),
        user: currentUser?.name || 'Refky Satria',
        role: activeRole.toUpperCase(),
        action: `Menerbitkan Kuis Baru "${newQuizTitle}" dengan ${soalPayload.length} Soal`,
        time: 'Baru saja'
      };

      setAuditLogs([newLog, ...auditLogs]);
      showToast(`Kuis "${newQuizTitle}" berhasil diterbitkan!`);
      setNewQuizTitle('');
      setNewQuizDesc('');
      setRawSoalText('');
      setParsedSoalList([]);
      setManualSoalList([]);
      handleResetManualForm();
      setActiveTab('overview');
    } catch (err) {
      showToast(err.message || 'Gagal menerbitkan kuis');
    }
  };

  const isOwner = activeRole === 'owner';
  const isAdmin = activeRole === 'admin';
  const canManage = isOwner || isAdmin;

  // Security Protection 1: Class Not Found / Not Enrolled Check
  if (routeClassId && !activeClass && !isApiClass) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 space-y-4 animate-fade-in max-w-md mx-auto py-12">
        <div className="w-16 h-16 rounded-3xl bg-danger/10 text-danger flex items-center justify-center shadow-inner">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h2 className="text-xl font-extrabold italic text-foreground">Akses Ditolak / Kelas Tidak Ditemukan</h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Ruang kelas dengan ID <code className="text-primary font-mono bg-muted px-1.5 py-0.5 rounded">{routeClassId}</code> tidak ditemukan atau Anda tidak terdaftar sebagai anggota di kelas ini.
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

  // Security Protection 2: Owner/Admin Role Protection
  if (activeTab !== 'overview' && activeTab !== 'members_view' && activeRole !== 'owner' && activeRole !== 'admin') {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 space-y-4 animate-fade-in max-w-md mx-auto py-12">
        <div className="w-16 h-16 rounded-3xl bg-warning/10 text-warning flex items-center justify-center shadow-inner">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h2 className="text-xl font-extrabold italic text-foreground">Akses Terbatas (Owner &amp; Admin Only)</h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Anda terdaftar sebagai anggota biasa di kelas ini. Hanya Owner atau Admin yang diizinkan mengelola materi, kuis, dan verifikasi kelas.
          </p>
        </div>
        <div className="pt-2">
          <button
            onClick={() => setActiveTab('overview')}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground font-extrabold text-xs rounded-xl shadow-glow hover:scale-105 transition-all cursor-pointer"
          >
            <span>Kembali ke Ringkasan Kelas</span>
          </button>
        </div>
      </div>
    );
  }

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

            {/* Menu 2: Anggota (Khusus untuk semua role) */}
            <button
              onClick={() => handleTabClick('members_view', 'anggota')}
              className={`w-full p-3 rounded-2xl font-extrabold text-xs flex items-center gap-3 transition-all cursor-pointer text-left ${
                activeTab === 'members_view'
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'bg-background hover:bg-muted text-foreground'
              }`}
            >
              <Users className="w-4 h-4 shrink-0" />
              <span className="flex-1">Anggota Kelas</span>
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
                      <span className="flex-1">Mapel</span>
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
                      <span className="flex-1">Materi</span>
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
        <div className="md:col-span-8 lg:col-span-9 space-y-6" id="management-content-area">
          
          {/* Breadcrumb Header Bar for Management Navigation */}
          {activeTab !== 'overview' && (
            <div className="bg-card border border-border rounded-2xl p-4 shadow-sm flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground flex-wrap">
                <Link to="/" className="hover:text-primary transition-colors">EduVerse</Link>
                <ChevronRight className="w-3.5 h-3.5" />
                <span className="text-foreground">{activeClass?.name || 'Ruang Kelas'}</span>
                <ChevronRight className="w-3.5 h-3.5 text-primary" />
                <span className="text-primary font-extrabold uppercase tracking-wider">
                  {activeTab === 'add_quiz' && 'Tambah Kuis & Bank Soal'}
                  {activeTab === 'add_material' && 'Materi Pembelajaran'}
                  {activeTab === 'add_subject' && 'Mata Pelajaran (Mapel)'}
                  {activeTab === 'settings' && 'Edit Informasi & Kode Kelas'}
                  {activeTab === 'members_view' && 'Anggota Kelas'}
                  {activeTab === 'members' && 'Kelola Admin & Anggota'}
                  {activeTab === 'verification' && 'Verifikasi Materi Admin'}
                  {activeTab === 'audit_log' && 'Riwayat Log Aktivitas'}
                </span>
              </div>
            </div>
          )}
          
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

          {/* VIEW 3: DAFTAR MAPEL & FORM TAMBAH MAPEL */}
          {activeTab === 'add_subject' && canManage && (
            <div className="space-y-6 animate-fade-in">
              {/* Header Bar Mapel */}
              <div className="bg-card border border-border rounded-3xl p-5 shadow-sm flex items-center justify-between gap-4 flex-wrap">
                <div>
                  <h3 className="font-extrabold text-lg flex items-center gap-2 text-foreground">
                    <FolderPlus className="w-5 h-5 text-primary" /> Daftar Mata Pelajaran (Mapel)
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Kelola daftar mata pelajaran di kelas {className}.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsCreateSubjectOpen(!isCreateSubjectOpen)}
                  className="bg-primary text-primary-foreground font-extrabold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow-sm hover:scale-105 transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>{isCreateSubjectOpen ? 'Tutup Form' : 'Tambah Mapel Baru'}</span>
                </button>
              </div>

              {/* Form Tambah Mapel (Toggleable) */}
              {isCreateSubjectOpen && (
                <form onSubmit={handleCreateSubject} className="bg-card border border-border rounded-3xl p-6 shadow-sm space-y-4 animate-fade-in">
                  <div className="border-b border-border pb-3">
                    <h4 className="font-extrabold text-sm flex items-center gap-2 text-primary">
                      Form Tambah Mata Pelajaran Baru
                    </h4>
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
                      type="button"
                      onClick={() => setIsCreateSubjectOpen(false)}
                      className="bg-muted text-muted-foreground font-extrabold px-4 py-2 rounded-xl text-xs hover:bg-muted/80 transition-all cursor-pointer"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="bg-primary text-primary-foreground font-extrabold px-6 py-2 rounded-xl text-xs shadow-glow flex items-center gap-1.5 hover:scale-105 transition-all cursor-pointer"
                    >
                      Simpan Mapel Baru
                    </button>
                  </div>
                </form>
              )}

              {/* Tabel Daftar Mapel */}
              <div className="bg-card border border-border rounded-3xl p-6 shadow-sm space-y-4">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-border text-muted-foreground font-extrabold uppercase tracking-wider text-[10px]">
                        <th className="pb-3 px-3">Kode Mapel</th>
                        <th className="pb-3 px-3">Nama Mata Pelajaran</th>
                        <th className="pb-3 px-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {dbMapelList.map((mapel, idx) => (
                        <tr key={mapel.id || idx} className="hover:bg-muted/30 transition-colors">
                          <td className="py-3 px-3">
                            <span className="font-mono font-extrabold bg-primary/10 text-primary px-2.5 py-1 rounded-lg">
                              {mapel.kode}
                            </span>
                          </td>
                          <td className="py-3 px-3 font-bold text-foreground text-sm">
                            {mapel.nama}
                          </td>
                          <td className="py-3 px-3">
                            <span className="bg-success/15 text-success font-extrabold text-[10px] px-2.5 py-0.5 rounded-full">
                              Aktif
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* VIEW 4: DAFTAR MATERI & KELOLA VERSI MATERI */}
          {activeTab === 'add_material' && canManage && (
            <div className="space-y-6 animate-fade-in">
              {/* Header Bar Materi */}
              <div className="bg-card border border-border rounded-3xl p-5 shadow-sm flex items-center justify-between gap-4 flex-wrap">
                <div>
                  <h3 className="font-extrabold text-lg flex items-center gap-2 text-foreground">
                    <FileText className="w-5 h-5 text-primary" /> Daftar Materi Pembelajaran
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Kelola materi pembelajaran dan sistem versioning (v1, v2, v3...).
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setEditingMaterial(null);
                    setIsCreateMaterialOpen(!isCreateMaterialOpen);
                  }}
                  className="bg-primary text-primary-foreground font-extrabold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow-sm hover:scale-105 transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>{isCreateMaterialOpen ? 'Tutup Form' : 'Tambah Materi Baru'}</span>
                </button>
              </div>

              {/* Form Create / Edit Material */}
              {(isCreateMaterialOpen || editingMaterial) && (
                <form
                  onSubmit={editingMaterial ? handleUpdateExistingMaterial : handleCreateMaterial}
                  className="bg-card border border-border rounded-3xl p-6 shadow-sm space-y-4 animate-fade-in"
                >
                  <div className="border-b border-border pb-3 flex items-center justify-between">
                    <div>
                      <h4 className="font-extrabold text-sm text-primary flex items-center gap-2">
                        {editingMaterial ? (
                          <span className="flex items-center gap-1.5 text-amber-500">
                            <Pencil className="w-4 h-4" /> Edit Materi: {editingMaterial.title} (Draft Versi v{(editingMaterial.version || 1) + 1})
                          </span>
                        ) : (
                          <span>Form Tambah Materi Pembelajaran (Versi v1)</span>
                        )}
                      </h4>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        {editingMaterial
                          ? (isOwner ? 'Perubahan akan langsung diterbitkan (v' + ((editingMaterial.version || 1) + 1) + ')' : 'Perubahan akan diajukan ke Owner untuk verifikasi (v' + ((editingMaterial.version || 1) + 1) + ')')
                          : (isOwner ? 'Materi baru langsung terverifikasi.' : 'Materi baru memerlukan verifikasi Owner.')}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-muted-foreground mb-1">Pilih Mata Pelajaran</label>
                      <select
                        value={editingMaterial ? editMaterialSubject : newMaterialSubject}
                        onChange={(e) => editingMaterial ? setEditMaterialSubject(e.target.value) : setNewMaterialSubject(e.target.value)}
                        className="w-full bg-background text-foreground border border-border rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-primary cursor-pointer shadow-sm"
                      >
                        {dbMapelList.map(m => (
                          <option key={m.id || m.kode} value={m.kode} className="bg-card text-foreground font-medium text-xs py-1">
                            {m.kode} - {m.nama}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-muted-foreground mb-1">Judul Bab Materi</label>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: Arsitektur MVC pada Framework Laravel"
                        value={editingMaterial ? editMaterialTitle : newMaterialTitle}
                        onChange={(e) => editingMaterial ? setEditMaterialTitle(e.target.value) : setNewMaterialTitle(e.target.value)}
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
                      value={editingMaterial ? editMaterialContent : newMaterialContent}
                      onChange={(e) => editingMaterial ? setEditMaterialContent(e.target.value) : setNewMaterialContent(e.target.value)}
                      className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary resize-none"
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIsCreateMaterialOpen(false);
                        setEditingMaterial(null);
                      }}
                      className="bg-muted text-muted-foreground font-extrabold px-4 py-2 rounded-xl text-xs hover:bg-muted/80 transition-all cursor-pointer"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="bg-primary text-primary-foreground font-extrabold px-6 py-2.5 rounded-xl text-xs shadow-glow flex items-center gap-1.5 hover:scale-105 transition-all cursor-pointer"
                    >
                      {editingMaterial
                        ? (isOwner ? `Simpan & Terbitkan v${(editingMaterial.version || 1) + 1}` : `Ajukan Pembaruan v${(editingMaterial.version || 1) + 1}`)
                        : (isOwner ? 'Publikasikan (Terverifikasi)' : 'Ajukan (Menunggu Verifikasi)')}
                    </button>
                  </div>
                </form>
              )}

              {/* Tabel Daftar Materi */}
              <div className="bg-card border border-border rounded-3xl p-6 shadow-sm space-y-4">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-border text-muted-foreground font-extrabold uppercase tracking-wider text-[10px]">
                        <th className="pb-3 px-3">Mapel</th>
                        <th className="pb-3 px-3">Judul Materi</th>
                        <th className="pb-3 px-3">Versi</th>
                        <th className="pb-3 px-3">Status</th>
                        <th className="pb-3 px-3 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {dbMateriList.length > 0 ? (
                        dbMateriList.map((materi, idx) => (
                          <tr key={materi.id || idx} className="hover:bg-muted/30 transition-colors">
                            <td className="py-3 px-3">
                              <span className="font-mono font-extrabold bg-primary/10 text-primary px-2 py-0.5 rounded-md text-[11px]">
                                {materi.subject}
                              </span>
                            </td>
                            <td className="py-3 px-3">
                              <p className="font-bold text-foreground text-sm">{materi.title}</p>
                              <p className="text-[11px] text-muted-foreground line-clamp-1">{materi.content}</p>
                            </td>
                            <td className="py-3 px-3">
                              <span className="bg-muted text-foreground font-extrabold font-mono text-[10px] px-2 py-0.5 rounded-full border border-border">
                                v{materi.version || 1}
                              </span>
                            </td>
                            <td className="py-3 px-3">
                              {materi.status === 'terverifikasi' || materi.status === 'verified' ? (
                                <span className="bg-success/15 text-success font-extrabold text-[10px] px-2.5 py-0.5 rounded-full flex items-center gap-1 w-fit">
                                  <CheckCircle2 className="w-3 h-3" /> Terverifikasi
                                </span>
                              ) : (
                                <span className="bg-warning/20 text-warning font-extrabold text-[10px] px-2.5 py-0.5 rounded-full flex items-center gap-1 w-fit">
                                  <Clock className="w-3 h-3" /> Menunggu Verifikasi
                                </span>
                              )}
                            </td>
                            <td className="py-3 px-3 text-right">
                              <button
                                type="button"
                                onClick={() => handleOpenEditMaterial(materi)}
                                className="bg-primary/10 hover:bg-primary/20 text-primary font-extrabold px-3 py-1.5 rounded-xl text-xs transition-all cursor-pointer inline-flex items-center gap-1"
                                title="Edit & Ciptakan Versi Baru"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                                <span>Edit (v{(materi.version || 1) + 1})</span>
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="py-6 text-center text-muted-foreground italic">
                            Belum ada materi pembelajaran di kelas ini.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* VIEW 5: FORM TAMBAH KUIS & BANK SOAL BARU */}
          {activeTab === 'add_quiz' && canManage && (
            <div className="bg-card border border-border rounded-3xl p-6 shadow-sm space-y-6 animate-fade-in">
              <div className="border-b border-border pb-4 flex items-center justify-between gap-4 flex-wrap">
                <div>
                  <h3 className="font-extrabold text-lg flex items-center gap-2">
                    <Swords className="w-5 h-5 text-primary" /> Form Tambah Kuis &amp; Bank Soal
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">Terbitkan kuis baru dan impor soal ke Bank Soal kelas.</p>
                </div>
                <div className="flex items-center gap-1.5 bg-muted p-1 rounded-2xl border border-border">
                  <button
                    type="button"
                    onClick={() => setQuizInputMode('manual')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer ${
                      quizInputMode === 'manual' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5" /> Input Manual
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuizInputMode('paste')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer ${
                      quizInputMode === 'paste' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Tempel Teks (AI)
                  </button>
                </div>
              </div>

              <form onSubmit={handleCreateQuiz} className="space-y-5">
                {/* General Quiz Information */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-background p-4 rounded-2xl border border-border">
                  <div>
                    <label className="block text-xs font-bold text-muted-foreground mb-1">Judul Kuis / Ujian</label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Ulangan Harian Negosiasi"
                      value={newQuizTitle}
                      onChange={(e) => setNewQuizTitle(e.target.value)}
                      className="w-full bg-card border border-border rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-muted-foreground mb-1">Mata Pelajaran</label>
                    <select
                      value={newQuizSubject}
                      onChange={(e) => setNewQuizSubject(e.target.value)}
                      className="w-full bg-card border border-border rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-primary cursor-pointer"
                    >
                      {dbMapelList.map(m => (
                        <option key={m.id || m.kode} value={m.kode}>
                          {m.kode} - {m.nama}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-muted-foreground mb-1">Deskripsi / Petunjuk (Opsional)</label>
                    <input
                      type="text"
                      placeholder="Contoh: Kerjakan dengan jujur, 10 soal."
                      value={newQuizDesc}
                      onChange={(e) => setNewQuizDesc(e.target.value)}
                      className="w-full bg-card border border-border rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                {/* MODE 1: TEMPEL TEKS AI */}
                {quizInputMode === 'paste' && (
                  <div className="space-y-4">
                    {/* Prompt Template Box for AI */}
                    <div className="p-4 bg-primary/10 border border-primary/20 rounded-2xl space-y-2.5">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-2 text-primary font-extrabold text-xs">
                          Belum punya soal? Salin prompt ini untuk AI
                        </div>
                        <button
                          type="button"
                          onClick={handleCopyPrompt}
                          className="bg-primary text-primary-foreground font-extrabold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 hover:scale-105 transition-all cursor-pointer shadow-xs"
                        >
                          {copiedPrompt ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                          {copiedPrompt ? 'Tersalin!' : 'Salin Prompt'}
                        </button>
                      </div>
                      <textarea
                        readOnly
                        rows={9}
                        value={PROMPT_TEMPLATE}
                        className="w-full text-xs font-mono bg-card/70 p-3 rounded-xl border border-border text-foreground leading-relaxed focus:outline-none resize-none"
                      />
                      <p className="text-[11px] text-muted-foreground font-medium">
                        💡 <span className="font-bold text-foreground">Tips:</span> Ganti <code className="bg-muted px-1.5 py-0.5 rounded text-primary font-mono font-bold">[jumlah]</code> dan <code className="bg-muted px-1.5 py-0.5 rounded text-primary font-mono font-bold">[topik]</code> sebelum dikirim ke ChatGPT / Claude.
                      </p>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-muted-foreground mb-1">Tempelkan Teks Hasil Generate AI (ChatGPT / Claude)</label>
                      <textarea
                        rows={7}
                        placeholder="Paste teks daftar soal di sini..."
                        value={rawSoalText}
                        onChange={(e) => setRawSoalText(e.target.value)}
                        className="w-full bg-background border border-border rounded-xl p-3.5 text-xs font-mono focus:outline-none focus:border-primary resize-y"
                      />
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        type="button"
                        onClick={() => handleParseSoal(true)}
                        disabled={isParsingSoal || !rawSoalText.trim()}
                        className="bg-primary text-primary-foreground font-extrabold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 hover:scale-105 transition-all disabled:opacity-50 cursor-pointer shadow-sm"
                      >
                        <Plus className="w-4 h-4" />
                        {isParsingSoal
                          ? 'Memproses Parsing...'
                          : (parsedSoalList.length > 0
                              ? `+ Parse & Tambah ke Daftar (Soal #${parsedSoalList.length + 1} dst.)`
                              : 'Parse Teks Soal')}
                      </button>

                      {parsedSoalList.length > 0 && (
                        <button
                          type="button"
                          onClick={() => {
                            setParsedSoalList([]);
                            setEditingSoalId(null);
                            showToast('Daftar preview soal dibersihkan');
                          }}
                          className="bg-muted text-muted-foreground font-extrabold px-4 py-2.5 rounded-xl text-xs hover:bg-danger/10 hover:text-danger transition-all cursor-pointer"
                        >
                          Reset / Bersihkan Preview
                        </button>
                      )}
                    </div>

                    {/* Preview List Soal Hasil Parsing */}
                    {parsedSoalList.length > 0 && (
                      <div className="space-y-3 pt-3 border-t border-border">
                        <div className="flex items-center justify-between">
                          <h4 className="font-extrabold text-sm flex items-center gap-2">
                            Preview Soal ({parsedSoalList.filter(s => s.status === 'valid').length} Valid, {parsedSoalList.filter(s => s.status === 'error').length} Error)
                          </h4>
                        </div>

                        <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                          {parsedSoalList.map((item, index) => (
                            <div
                              key={item.id || index}
                              className={`p-4 rounded-2xl border text-xs space-y-2 transition-all ${
                                item.status === 'valid'
                                  ? 'bg-card border-success/30'
                                  : 'bg-danger/10 border-danger/40'
                              }`}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-extrabold text-foreground">Soal #{index + 1}</span>
                                  {item.status === 'valid' ? (
                                    <span className="bg-success/20 text-success font-extrabold text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1">
                                      <CheckCircle2 className="w-3 h-3" /> Valid
                                    </span>
                                  ) : (
                                    <span className="bg-danger text-white font-extrabold text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1">
                                      <AlertCircle className="w-3 h-3" /> Error: {item.error_message}
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-1">
                                  <button
                                    type="button"
                                    onClick={() => handleStartEditParsedSoal(item)}
                                    className="text-muted-foreground hover:text-primary p-1.5 rounded-lg transition-colors cursor-pointer"
                                    title="Edit Soal Ini"
                                  >
                                    <Pencil className="w-4 h-4" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveParsedSoal(item.id)}
                                    className="text-muted-foreground hover:text-danger p-1.5 rounded-lg transition-colors cursor-pointer"
                                    title="Hapus Soal dari Preview"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>

                              {editingSoalId === item.id ? (
                                <div className="space-y-3 pt-2 bg-background/80 p-4 rounded-xl border border-primary/40 text-left">
                                  <div className="space-y-1">
                                    <label className="block text-[11px] font-bold text-muted-foreground">Pertanyaan Soal #{index + 1}</label>
                                    <textarea
                                      rows={2}
                                      value={editPertanyaan}
                                      onChange={(e) => setEditPertanyaan(e.target.value)}
                                      className="w-full bg-card border border-border rounded-xl p-2.5 text-xs focus:outline-none focus:border-primary text-foreground font-semibold resize-y"
                                      placeholder="Tuliskan pertanyaan..."
                                    />
                                  </div>

                                  <div className="space-y-2">
                                    <div className="flex items-center justify-between flex-wrap gap-2">
                                      <label className="block text-[11px] font-bold text-muted-foreground flex items-center gap-1.5">
                                        Opsi Pilihan Ganda ({editOpsi.length} Opsi)
                                        {!editJawabanHuruf && (
                                          <span className="text-[10px] font-extrabold text-danger bg-danger/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                                            <AlertCircle className="w-3 h-3" /> Jawaban belum dipilih
                                          </span>
                                        )}
                                      </label>
                                      <div className="flex items-center gap-2">
                                        {(editOpsi || []).length > 2 && (
                                          <button
                                            type="button"
                                            onClick={handleRemoveEditOption}
                                            className="text-xs font-extrabold text-danger bg-danger/10 hover:bg-danger/20 px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1"
                                            title={`Hapus Opsi Terakhir (${editOpsi[editOpsi.length - 1]?.huruf || String.fromCharCode(64 + editOpsi.length)})`}
                                          >
                                            <Trash2 className="w-3 h-3" /> Hapus Opsi {editOpsi[editOpsi.length - 1]?.huruf || String.fromCharCode(64 + editOpsi.length)}
                                          </button>
                                        )}
                                        {(editOpsi || []).length < 5 && (
                                          <button
                                            type="button"
                                            onClick={handleAddEditOption}
                                            className="text-xs font-extrabold text-primary bg-primary/10 hover:bg-primary/20 px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1"
                                            title="Tambah Opsi Berikutnya"
                                          >
                                            <Plus className="w-3 h-3" /> Tambah Opsi {String.fromCharCode(65 + editOpsi.length)}
                                          </button>
                                        )}
                                      </div>
                                    </div>

                                    <div className="space-y-2">
                                      {(editOpsi || []).map((opt, oIdx) => {
                                        const huruf = opt.huruf || String.fromCharCode(65 + oIdx);
                                        const isCorrect = editJawabanHuruf === huruf;
                                        const isLast = oIdx === editOpsi.length - 1;
                                        return (
                                          <div key={oIdx} className="flex items-center gap-2">
                                            <button
                                              type="button"
                                              onClick={() => setEditJawabanHuruf(huruf)}
                                              className={`w-7 h-7 rounded-lg text-xs font-extrabold flex items-center justify-center shrink-0 border transition-all cursor-pointer ${
                                                isCorrect
                                                  ? 'bg-success text-white border-success shadow-xs'
                                                  : 'bg-muted text-muted-foreground border-border hover:border-primary/40'
                                              }`}
                                              title={isCorrect ? 'Kunci Jawaban Benar' : 'Klik untuk jadikan Kunci Jawaban'}
                                            >
                                              {huruf}
                                            </button>
                                            <input
                                              type="text"
                                              value={opt.teks_opsi || ''}
                                              onChange={(e) => {
                                                const val = e.target.value;
                                                setEditOpsi(prev => (prev || []).map((o, i) => i === oIdx ? { ...o, teks_opsi: val } : o));
                                              }}
                                              placeholder={`Pilihan ${huruf}...`}
                                              className={`flex-1 bg-card border rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-primary ${
                                                isCorrect ? 'border-success/60 text-success font-bold bg-success/5' : 'border-border text-foreground'
                                              }`}
                                            />
                                            {isCorrect && (
                                              <span className="text-[10px] font-extrabold text-success bg-success/15 px-2 py-0.5 rounded-full shrink-0">
                                                Kunci
                                              </span>
                                            )}
                                            {isLast && (editOpsi || []).length > 2 && (
                                              <button
                                                type="button"
                                                onClick={handleRemoveEditOption}
                                                className="text-muted-foreground hover:text-danger p-1 rounded-lg shrink-0 cursor-pointer"
                                                title={`Hapus Opsi ${huruf}`}
                                              >
                                                <X className="w-3.5 h-3.5" />
                                              </button>
                                            )}
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>

                                  <div className="space-y-1">
                                    <label className="block text-[11px] font-bold text-muted-foreground">Pilih Jawaban Benar (Menyesuaikan {editOpsi.length} Opsi)</label>
                                    <select
                                      value={editJawabanHuruf}
                                      onChange={(e) => setEditJawabanHuruf(e.target.value)}
                                      className="w-full bg-card border border-border rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-primary text-foreground font-extrabold cursor-pointer"
                                    >
                                      <option value="" disabled>-- Pilih Jawaban Benar --</option>
                                      {(editOpsi || []).map((o, i) => {
                                        const h = o.huruf || String.fromCharCode(65 + i);
                                        return (
                                          <option key={h} value={h}>Opsi {h}</option>
                                        );
                                      })}
                                    </select>
                                  </div>

                                  <div className="space-y-1">
                                    <label className="block text-[11px] font-bold text-muted-foreground">Pembahasan (Opsional)</label>
                                    <input
                                      type="text"
                                      value={editPembahasan}
                                      onChange={(e) => setEditPembahasan(e.target.value)}
                                      className="w-full bg-card border border-border rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-primary text-foreground"
                                      placeholder="Penjelasan pembahasan..."
                                    />
                                  </div>

                                  <div className="flex justify-end gap-2 pt-2 border-t border-border">
                                    <button
                                      type="button"
                                      onClick={handleCancelEditParsedSoal}
                                      className="px-3 py-1.5 bg-muted text-muted-foreground font-extrabold text-xs rounded-xl hover:bg-muted/80 transition-all cursor-pointer"
                                    >
                                      Batal
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleSaveEditParsedSoal(item.id)}
                                      className="px-4 py-1.5 bg-primary text-primary-foreground font-extrabold text-xs rounded-xl hover:scale-105 transition-all cursor-pointer shadow-xs flex items-center gap-1.5"
                                    >
                                      <Save className="w-3.5 h-3.5" /> Simpan
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <>
                                  <p className="font-bold text-foreground text-sm">{item.pertanyaan || '(Pertanyaan kosong)'}</p>

                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
                                    {item.opsi.map((opt, oIdx) => (
                                      <div
                                        key={oIdx}
                                        className={`px-3 py-1.5 rounded-xl border text-xs font-medium flex items-center gap-2 ${
                                          opt.benar
                                            ? 'bg-success/15 border-success text-success font-bold'
                                            : 'bg-background border-border text-foreground'
                                        }`}
                                      >
                                        <span className="font-extrabold">{opt.huruf}.</span>
                                        <span>{opt.teks_opsi}</span>
                                      </div>
                                    ))}
                                  </div>

                                  {item.pembahasan && (
                                    <p className="text-[11px] text-muted-foreground pt-1 border-t border-border/50">
                                      <span className="font-bold text-foreground">Pembahasan:</span> {item.pembahasan}
                                    </p>
                                  )}
                                </>
                              )}
                            </div>
                          ))}
                        </div>

                        {/* Button at the bottom to add a new blank question directly */}
                        <button
                          type="button"
                          onClick={handleAddNewBlankParsedSoal}
                          className="w-full py-3 bg-card border-2 border-dashed border-primary/40 hover:border-primary text-primary font-extrabold text-xs rounded-2xl flex items-center justify-center gap-2 hover:bg-primary/5 active:scale-[0.99] transition-all cursor-pointer shadow-xs"
                        >
                          <Plus className="w-4 h-4 text-primary" />
                          <span>Tambah Soal Baru di Paling Bawah (Soal #{parsedSoalList.length + 1})</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* MODE 2: INPUT MANUAL SATU-SATU BERTAHAP */}
                {quizInputMode === 'manual' && (
                  <div className="space-y-5">
                    {/* Form Question Box */}
                    <div className="space-y-4 bg-background p-4 md:p-5 rounded-2xl border border-border">
                      <div className="flex items-center justify-between gap-2 border-b border-border pb-3 flex-wrap">
                        <h4 className="font-extrabold text-xs uppercase tracking-wider text-primary flex items-center gap-2">
                          {editingManualIdx !== null ? (
                            <span className="flex items-center gap-1.5 text-amber-500">
                              <Pencil className="w-3.5 h-3.5" /> Edit Pertanyaan Soal #{editingManualIdx + 1}
                            </span>
                          ) : (
                            <span>Form Input Pertanyaan — Soal #{manualSoalList.length + 1}</span>
                          )}
                        </h4>
                        <span className="text-[11px] font-bold text-muted-foreground bg-muted px-2.5 py-1 rounded-full">
                          Total Soal Tersimpan: {manualSoalList.length}
                        </span>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-muted-foreground mb-1">
                          Pertanyaan Soal #{editingManualIdx !== null ? editingManualIdx + 1 : manualSoalList.length + 1}
                        </label>
                        <textarea
                          rows={3}
                          placeholder="Tuliskan pertanyaan soal..."
                          value={manualPertanyaan}
                          onChange={(e) => setManualPertanyaan(e.target.value)}
                          className="w-full bg-card border border-border rounded-xl p-3 text-xs focus:outline-none focus:border-primary text-foreground font-semibold"
                        />
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <label className="block text-xs font-bold text-muted-foreground">
                            Opsi Pilihan Ganda ({manualOpsiList.length} Opsi)
                          </label>
                          <div className="flex items-center gap-2">
                            {manualOpsiList.length > 2 && (
                              <button
                                type="button"
                                onClick={handleRemoveManualOption}
                                className="text-xs font-extrabold text-danger bg-danger/10 hover:bg-danger/20 px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1"
                                title={`Hapus Opsi Terakhir (${manualOpsiList[manualOpsiList.length - 1].huruf})`}
                              >
                                <Trash2 className="w-3.5 h-3.5" /> Hapus Opsi {manualOpsiList[manualOpsiList.length - 1].huruf}
                              </button>
                            )}
                            {manualOpsiList.length < 5 && (
                              <button
                                type="button"
                                onClick={handleAddManualOption}
                                className="text-xs font-extrabold text-primary bg-primary/10 hover:bg-primary/20 px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1"
                                title="Tambah Opsi Berikutnya"
                              >
                                <Plus className="w-3.5 h-3.5" /> Tambah Opsi {String.fromCharCode(65 + manualOpsiList.length)}
                              </button>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {manualOpsiList.map((opt, idx) => (
                            <div key={opt.huruf}>
                              <label className="block text-xs font-bold text-muted-foreground mb-1">
                                Opsi {opt.huruf} {idx < 2 ? '(Wajib)' : '(Opsional)'}
                              </label>
                              <input
                                type="text"
                                placeholder={`Pilihan ${opt.huruf}`}
                                value={opt.teks_opsi}
                                onChange={(e) => handleManualOptionChange(idx, e.target.value)}
                                className="w-full bg-card border border-border rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-primary text-foreground"
                              />
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="block text-xs font-bold text-muted-foreground">Jawaban Benar</label>
                            {!manualJawaban && (
                              <span className="text-[10px] font-extrabold text-danger bg-danger/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" /> Belum dipilih
                              </span>
                            )}
                          </div>
                          <select
                            value={manualJawaban}
                            onChange={(e) => setManualJawaban(e.target.value)}
                            className={`w-full bg-card text-foreground border rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-primary cursor-pointer ${
                              !manualJawaban ? 'border-danger/60 bg-danger/5' : 'border-border'
                            }`}
                          >
                            <option value="" disabled className="bg-card text-foreground">-- Pilih Jawaban Benar --</option>
                            {manualOpsiList.map(opt => (
                              <option key={opt.huruf} value={opt.huruf} className="bg-card text-foreground">
                                Opsi {opt.huruf}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-muted-foreground mb-1">Pembahasan (Opsional)</label>
                          <input
                            type="text"
                            placeholder="Penjelasan jawaban..."
                            value={manualPembahasan}
                            onChange={(e) => setManualPembahasan(e.target.value)}
                            className="w-full bg-card border border-border rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-primary text-foreground"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 pt-2 border-t border-border">
                        {editingManualIdx !== null && (
                          <button
                            type="button"
                            onClick={handleCancelEditManualSoal}
                            className="bg-muted text-muted-foreground font-extrabold px-4 py-2 rounded-xl text-xs hover:bg-muted/80 transition-all cursor-pointer"
                          >
                            Batal Edit
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={handleAddManualSoal}
                          className="bg-primary/10 text-primary border border-primary/30 font-extrabold px-5 py-2 rounded-xl text-xs hover:bg-primary hover:text-primary-foreground transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          {editingManualIdx !== null
                            ? `Simpan Perubahan Soal #${editingManualIdx + 1}`
                            : `Tambah Soal #${manualSoalList.length + 1} ke Daftar`}
                        </button>
                      </div>
                    </div>

                    {/* List Preview of Manual Questions Added */}
                    {manualSoalList.length > 0 && (
                      <div className="space-y-3 pt-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-extrabold text-sm flex items-center gap-2">
                            Daftar Soal Manual Terbuat ({manualSoalList.length} Soal)
                          </h4>
                        </div>

                        <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                          {manualSoalList.map((item, index) => (
                            <div key={item.id || index} className="p-4 rounded-2xl border border-border bg-card text-xs space-y-2 transition-all">
                              <div className="flex items-start justify-between gap-2">
                                <span className="font-extrabold text-foreground text-xs bg-primary/10 text-primary px-2.5 py-0.5 rounded-full">
                                  Soal #{index + 1}
                                </span>
                                <div className="flex items-center gap-1">
                                  <button
                                    type="button"
                                    onClick={() => handleStartEditParsedSoal(item)}
                                    className="text-muted-foreground hover:text-primary p-1.5 rounded-lg transition-colors cursor-pointer"
                                    title="Edit Soal Ini"
                                  >
                                    <Pencil className="w-4 h-4" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveManualSoal(index)}
                                    className="text-muted-foreground hover:text-danger p-1.5 rounded-lg transition-colors cursor-pointer"
                                    title="Hapus Soal Ini"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>

                              {editingSoalId === item.id ? (
                                <div className="space-y-3 pt-2 bg-background/80 p-4 rounded-xl border border-primary/40 text-left">
                                  <div className="space-y-1">
                                    <label className="block text-[11px] font-bold text-muted-foreground">Pertanyaan Soal #{index + 1}</label>
                                    <textarea
                                      rows={2}
                                      value={editPertanyaan}
                                      onChange={(e) => setEditPertanyaan(e.target.value)}
                                      className="w-full bg-card border border-border rounded-xl p-2.5 text-xs focus:outline-none focus:border-primary text-foreground font-semibold resize-y"
                                      placeholder="Tuliskan pertanyaan..."
                                    />
                                  </div>

                                  <div className="space-y-2">
                                    <div className="flex items-center justify-between flex-wrap gap-2">
                                      <label className="block text-[11px] font-bold text-muted-foreground flex items-center gap-1.5">
                                        Opsi Pilihan Ganda ({editOpsi.length} Opsi)
                                        {!editJawabanHuruf && (
                                          <span className="text-[10px] font-extrabold text-danger bg-danger/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                                            <AlertCircle className="w-3 h-3" /> Jawaban belum dipilih
                                          </span>
                                        )}
                                      </label>
                                      <div className="flex items-center gap-2">
                                        {(editOpsi || []).length > 2 && (
                                          <button
                                            type="button"
                                            onClick={handleRemoveEditOption}
                                            className="text-xs font-extrabold text-danger bg-danger/10 hover:bg-danger/20 px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1"
                                            title={`Hapus Opsi Terakhir (${editOpsi[editOpsi.length - 1]?.huruf || String.fromCharCode(64 + editOpsi.length)})`}
                                          >
                                            <Trash2 className="w-3 h-3" /> Hapus Opsi {editOpsi[editOpsi.length - 1]?.huruf || String.fromCharCode(64 + editOpsi.length)}
                                          </button>
                                        )}
                                        {(editOpsi || []).length < 5 && (
                                          <button
                                            type="button"
                                            onClick={handleAddEditOption}
                                            className="text-xs font-extrabold text-primary bg-primary/10 hover:bg-primary/20 px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1"
                                            title="Tambah Opsi Berikutnya"
                                          >
                                            <Plus className="w-3 h-3" /> Tambah Opsi {String.fromCharCode(65 + editOpsi.length)}
                                          </button>
                                        )}
                                      </div>
                                    </div>

                                    <div className="space-y-2">
                                      {(editOpsi || []).map((opt, oIdx) => {
                                        const huruf = opt.huruf || String.fromCharCode(65 + oIdx);
                                        const isCorrect = editJawabanHuruf === huruf;
                                        const isLast = oIdx === editOpsi.length - 1;
                                        return (
                                          <div key={oIdx} className="flex items-center gap-2">
                                            <button
                                              type="button"
                                              onClick={() => setEditJawabanHuruf(huruf)}
                                              className={`w-7 h-7 rounded-lg text-xs font-extrabold flex items-center justify-center shrink-0 border transition-all cursor-pointer ${
                                                isCorrect
                                                  ? 'bg-success text-white border-success shadow-xs'
                                                  : 'bg-muted text-muted-foreground border-border hover:border-primary/40'
                                              }`}
                                              title={isCorrect ? 'Kunci Jawaban Benar' : 'Klik untuk jadikan Kunci Jawaban'}
                                            >
                                              {huruf}
                                            </button>
                                            <input
                                              type="text"
                                              value={opt.teks_opsi || ''}
                                              onChange={(e) => {
                                                const val = e.target.value;
                                                setEditOpsi(prev => (prev || []).map((o, i) => i === oIdx ? { ...o, teks_opsi: val } : o));
                                              }}
                                              placeholder={`Pilihan ${huruf}...`}
                                              className={`flex-1 bg-card border rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-primary ${
                                                isCorrect ? 'border-success/60 text-success font-bold bg-success/5' : 'border-border text-foreground'
                                              }`}
                                            />
                                            {isCorrect && (
                                              <span className="text-[10px] font-extrabold text-success bg-success/15 px-2 py-0.5 rounded-full shrink-0">
                                                Kunci
                                              </span>
                                            )}
                                            {isLast && (editOpsi || []).length > 2 && (
                                              <button
                                                type="button"
                                                onClick={handleRemoveEditOption}
                                                className="text-muted-foreground hover:text-danger p-1 rounded-lg shrink-0 cursor-pointer"
                                                title={`Hapus Opsi ${huruf}`}
                                              >
                                                <X className="w-3.5 h-3.5" />
                                              </button>
                                            )}
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>

                                  <div className="space-y-1">
                                    <label className="block text-[11px] font-bold text-muted-foreground">Pembahasan (Opsional)</label>
                                    <input
                                      type="text"
                                      value={editPembahasan}
                                      onChange={(e) => setEditPembahasan(e.target.value)}
                                      className="w-full bg-card border border-border rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-primary text-foreground"
                                      placeholder="Penjelasan pembahasan..."
                                    />
                                  </div>

                                  <div className="flex justify-end gap-2 pt-2 border-t border-border">
                                    <button
                                      type="button"
                                      onClick={handleCancelEditParsedSoal}
                                      className="px-3 py-1.5 bg-muted text-muted-foreground font-extrabold text-xs rounded-xl hover:bg-muted/80 transition-all cursor-pointer"
                                    >
                                      Batal
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleSaveEditParsedSoal(item.id)}
                                      className="px-4 py-1.5 bg-primary text-primary-foreground font-extrabold text-xs rounded-xl hover:scale-105 transition-all cursor-pointer shadow-xs flex items-center gap-1.5"
                                    >
                                      <Save className="w-3.5 h-3.5" /> Simpan
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <>
                                  <p className="font-bold text-foreground text-sm">{item.pertanyaan}</p>

                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
                                    {item.opsi.map((opt, oIdx) => (
                                      <div
                                        key={oIdx}
                                        className={`px-3 py-1.5 rounded-xl border text-xs font-medium flex items-center gap-2 ${
                                          opt.benar
                                            ? 'bg-success/15 border-success text-success font-bold'
                                            : 'bg-background border-border text-foreground'
                                        }`}
                                      >
                                        <span className="font-extrabold">{opt.huruf}.</span>
                                        <span>{opt.teks_opsi}</span>
                                        {opt.benar && <span className="text-[10px] ml-auto bg-success text-white px-1.5 py-0.5 rounded font-extrabold">Kunci</span>}
                                      </div>
                                    ))}
                                  </div>

                                  {item.pembahasan && (
                                    <p className="text-[11px] text-muted-foreground pt-1 border-t border-border/50">
                                      <span className="font-bold text-foreground">Pembahasan:</span> {item.pembahasan}
                                    </p>
                                  )}
                                </>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="submit"
                    className="bg-primary text-primary-foreground font-extrabold px-6 py-2.5 rounded-xl text-xs shadow-glow flex items-center gap-1.5 hover:scale-105 transition-all cursor-pointer"
                  >
                    Simpan Soal &amp; Terbitkan Kuis
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* VIEW 6: PANEL VERIFIKASI MATERI ADMIN (KHUSUS OWNER) */}
          {activeTab === 'verification' && isOwner && (
            <div className="bg-warning/10 border-2 border-warning/30 rounded-3xl p-6 space-y-6 animate-fade-in">
              <div className="border-b border-warning/20 pb-3">
                <h3 className="font-extrabold text-lg text-warning flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5" /> Panel Verifikasi Materi Admin (Khusus Owner)
                </h3>
                <p className="text-xs text-muted-foreground mt-1">Setujui atau minta perbaikan materi yang diajukan oleh Admin kelas.</p>
              </div>

              {/* Side-by-Side Preview Comparison Modal / Box */}
              {verifyingMaterial && (
                <div className="bg-card border border-border rounded-3xl p-6 shadow-xl space-y-4 animate-fade-in">
                  <div className="flex items-center justify-between border-b border-border pb-3 flex-wrap gap-2">
                    <div>
                      <span className="text-[10px] font-extrabold bg-primary/10 text-primary px-2.5 py-1 rounded-md uppercase">
                        {verifyingMaterial.subject}
                      </span>
                      <h4 className="font-extrabold text-base text-foreground mt-1">{verifyingMaterial.title}</h4>
                      <p className="text-xs text-muted-foreground">Perbandingan Versi Sebelumnya vs Versi Baru Pengajuan Admin</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setVerifyingMaterial(null)}
                      className="p-1.5 rounded-xl bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* 2-Column Grid Comparison */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* LEFT COLUMN: Versi Sebelumnya */}
                    <div className="p-4 rounded-2xl border border-border bg-background space-y-3">
                      <div className="flex items-center justify-between border-b border-border/60 pb-2">
                        <span className="font-extrabold text-xs text-muted-foreground flex items-center gap-1.5">
                          <History className="w-4 h-4 text-muted-foreground" />
                          Versi Sebelumnya ({verifyingMaterial.prevVersion?.version ? `v${verifyingMaterial.prevVersion.version}` : 'Versi Awal'})
                        </span>
                        <span className="bg-success/15 text-success font-extrabold text-[10px] px-2 py-0.5 rounded-full">
                          Terverifikasi
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        <p className="font-semibold">Pembuat: <strong>{verifyingMaterial.prevVersion?.author || 'Owner'}</strong></p>
                      </div>
                      <div className="p-3 rounded-xl bg-card border border-border/50 text-xs leading-relaxed text-foreground min-h-[120px]">
                        {verifyingMaterial.prevVersion?.content ? (
                          <div dangerouslySetInnerHTML={{ __html: verifyingMaterial.prevVersion.content }} />
                        ) : (
                          <p className="italic text-muted-foreground">Ini adalah versi pertama (Belum ada versi sebelumnya untuk dibandingkan).</p>
                        )}
                      </div>
                    </div>

                    {/* RIGHT COLUMN: Versi Baru (Pengajuan Admin) */}
                    <div className="p-4 rounded-2xl border-2 border-warning/40 bg-warning/5 space-y-3">
                      <div className="flex items-center justify-between border-b border-warning/20 pb-2">
                        <span className="font-extrabold text-xs text-warning flex items-center gap-1.5">
                          <FileText className="w-4 h-4 text-warning" />
                          Versi Baru (v{verifyingMaterial.newVersion?.version || 2})
                        </span>
                        <span className="bg-warning/20 text-warning font-extrabold text-[10px] px-2 py-0.5 rounded-full">
                          Menunggu Verifikasi
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        <p className="font-semibold">Diajukan Oleh Admin: <strong>{verifyingMaterial.author}</strong></p>
                      </div>
                      <div className="p-3 rounded-xl bg-card border border-warning/30 text-xs leading-relaxed text-foreground min-h-[120px]">
                        {verifyingMaterial.newVersion?.content ? (
                          <div dangerouslySetInnerHTML={{ __html: verifyingMaterial.newVersion.content }} />
                        ) : (
                          <p className="italic text-muted-foreground">(Isi rangkuman baru kosong)</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions inside Preview */}
                  <div className="flex justify-end gap-3 pt-3 border-t border-border">
                    <button
                      onClick={() => {
                        handleRejectPending(verifyingMaterial.id, verifyingMaterial.versiId, verifyingMaterial.title);
                        setVerifyingMaterial(null);
                      }}
                      className="bg-muted hover:bg-danger/20 hover:text-danger text-muted-foreground font-bold px-4 py-2 rounded-xl text-xs transition-colors cursor-pointer"
                    >
                      Tolak Pengajuan
                    </button>
                    <button
                      onClick={() => {
                        handleApprovePending(verifyingMaterial.id, verifyingMaterial.versiId, verifyingMaterial.title);
                        setVerifyingMaterial(null);
                      }}
                      className="bg-success text-white font-extrabold px-5 py-2 rounded-xl text-xs flex items-center gap-1 shadow-sm hover:scale-105 transition-all cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Verifikasi &amp; Terbitkan (Setujui)
                    </button>
                  </div>
                </div>
              )}

              {/* Pending List */}
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

                      <div className="flex items-center gap-2 shrink-0 flex-wrap">
                        <button
                          onClick={() => setVerifyingMaterial(item)}
                          className="bg-primary/10 text-primary font-extrabold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1 hover:bg-primary/20 transition-all cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" /> Pratinjau &amp; Bandingkan Versi
                        </button>
                        <button
                          onClick={() => handleRejectPending(item.id, item.versiId, item.title)}
                          className="bg-muted hover:bg-danger/20 hover:text-danger text-muted-foreground font-bold px-3.5 py-2 rounded-xl text-xs transition-colors cursor-pointer"
                        >
                          Tolak
                        </button>
                        <button
                          onClick={() => handleApprovePending(item.id, item.versiId, item.title)}
                          className="bg-success text-white font-extrabold px-4 py-2 rounded-xl text-xs flex items-center gap-1 shadow-sm hover:scale-105 transition-all cursor-pointer"
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

          {/* VIEW 8: ANGGOTA KELAS & KELOLA ADMIN */}
          {activeTab === 'members_view' && (
            <div className="bg-card border border-border rounded-3xl p-6 shadow-sm space-y-4 animate-fade-in">
              <ClassAnggotaPage
                members={dbMemberList}
                currentRole={activeRole}
                isManagementMode={false}
              />
            </div>
          )}

          {activeTab === 'members' && (
            <div className="bg-card border border-border rounded-3xl p-6 shadow-sm space-y-4 animate-fade-in">
              <ClassAnggotaPage
                members={dbMemberList}
                currentRole={activeRole}
                isManagementMode={true}
                onToggleAdmin={handleToggleAdminMember}
                onKickMember={handleKickMemberItem}
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

      <ConfirmModal
        isOpen={isRegenConfirmOpen}
        onClose={() => setIsRegenConfirmOpen(false)}
        onConfirm={executeRegenCode}
        title="Buat Ulang Kode Kelas?"
        description="Apakah Anda yakin ingin membuat ulang kode kelas? Kode lama tidak akan berlaku lagi untuk siswa yang ingin bergabung."
        confirmText="Ya, Buat Kode Baru"
        cancelText="Batal"
        variant="primary"
      />
    </section>
  );
}
