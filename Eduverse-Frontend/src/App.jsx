import React, { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AppStateProvider } from './context/AppStateContext';
import AppRoutes from './routes/AppRoutes';
import {
  INITIAL_USER,
  INITIAL_CLASSES,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_MATERIALS,
  INITIAL_QUIZZES,
  INITIAL_MEMBERS,
  INITIAL_LEADERBOARD,
} from './data/mockData';

export default function App() {
  const [user, setUser] = useState(INITIAL_USER);
  const [classes, setClasses] = useState(() => {
    try {
      const stored = localStorage.getItem('eduverse_classes');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error('Failed to parse classes:', e);
    }
    return INITIAL_CLASSES;
  });

  const [userClasses, setUserClasses] = useState(() => {
    try {
      const stored = localStorage.getItem('eduverse_user_classes');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error('Failed to parse userClasses:', e);
    }
    return [];
  });

  // Sync classes to localStorage
  React.useEffect(() => {
    try {
      localStorage.setItem('eduverse_classes', JSON.stringify(classes));
    } catch (e) {}
  }, [classes]);

  React.useEffect(() => {
    try {
      localStorage.setItem('eduverse_user_classes', JSON.stringify(userClasses));
    } catch (e) {}
  }, [userClasses]);

  const [announcements, setAnnouncements] = useState(INITIAL_ANNOUNCEMENTS);
  const [materials, setMaterials] = useState(INITIAL_MATERIALS);
  const [quizzes, setQuizzes] = useState(INITIAL_QUIZZES);
  const [members, setMembers] = useState(INITIAL_MEMBERS);
  const [leaderboard, setLeaderboard] = useState(INITIAL_LEADERBOARD);

  const handleRoleChange = (newRole) => {
    setUser(prev => ({ ...prev, activeRole: newRole }));
  };

  const handleCreateClass = (clsData, currentUser) => {
    const creatorName = currentUser?.name || currentUser?.username || user.name;
    const newClass = {
      id: `cls-${Date.now()}`,
      name: clsData.name,
      description: clsData.description || 'Kelas baru di EduVerse',
      code: Math.random().toString(36).substring(2, 8).toUpperCase(),
      memberCount: 1,
      bannerImage: clsData.bannerImage || '/assets/banner_eduverse.png',
      bannerBg: 'linear-gradient(135deg, #b23be7 0%, #3b82f6 100%)',
      role: 'owner',
      ownerName: creatorName,
      ownerId: currentUser?.id || 'usr-local',
      createdAt: new Date().toISOString().split('T')[0],
    };
    setClasses(prev => [newClass, ...prev]);
    setUserClasses(prev => [newClass, ...prev]);
    return newClass;
  };

  const handleJoinClass = (code) => {
    const found = classes.find(c => c.code === code.toUpperCase());
    if (found) {
      setClasses(prev => prev.map(c => c.id === found.id ? { ...c, memberCount: c.memberCount + 1 } : c));
      setUserClasses(prev => [...prev, found]);
      return true;
    }
    return false;
  };

  const handleAddAnnouncement = (ancData, classId) => {
    const newAnc = {
      id: `anc-${Date.now()}`,
      classId: classId || 'cls-101',
      authorName: user.name,
      authorRole: user.activeRole === 'owner' ? 'Owner' : 'Admin',
      authorAvatar: user.avatar,
      title: ancData.title,
      content: ancData.content,
      createdAt: 'Baru saja',
    };
    setAnnouncements(prev => [newAnc, ...prev]);
  };

  const handleCreateMaterial = (matData, classId) => {
    const newMat = {
      id: `mat-${Date.now()}`,
      classId: classId || 'cls-101',
      title: matData.title,
      createdBy: matData.createdBy || user.name,
      creatorRole: matData.creatorRole || user.activeRole,
      status: matData.status || (user.activeRole === 'owner' ? 'Terverifikasi' : 'Menunggu Verifikasi'),
      activeVersion: 1,
      summary: matData.summary || 'Ringkasan materi',
      content: matData.content || '<p>Isi materi</p>',
      versions: [
        {
          version: 1,
          updatedAt: 'Hari ini',
          updatedBy: user.name,
          status: matData.status || (user.activeRole === 'owner' ? 'Terverifikasi' : 'Menunggu Verifikasi'),
          content: matData.content || '<p>Isi materi</p>',
        }
      ]
    };
    setMaterials(prev => [newMat, ...prev]);
  };

  const handleUpdateMaterialStatus = (materialId, newStatus) => {
    setMaterials(prev => prev.map(m => {
      if (m.id === materialId) {
        const updatedVersions = (m.versions || []).map(v => v.version === m.activeVersion ? { ...v, status: newStatus } : v);
        return { ...m, status: newStatus, versions: updatedVersions };
      }
      return m;
    }));
  };

  const handleEditMaterialContent = (materialId, newContent, role) => {
    setMaterials(prev => prev.map(m => {
      if (m.id === materialId) {
        const nextVerNum = (m.versions?.length || 0) + 1;
        const newVerStatus = role === 'owner' ? 'Terverifikasi' : 'Menunggu Verifikasi';
        const newVerObj = {
          version: nextVerNum,
          updatedAt: 'Baru saja',
          updatedBy: `${user.name} (${role})`,
          status: newVerStatus,
          content: newContent,
        };
        return {
          ...m,
          activeVersion: nextVerNum,
          status: newVerStatus,
          content: newContent,
          versions: [newVerObj, ...(m.versions || [])],
        };
      }
      return m;
    }));
  };

  const handleCreateQuiz = (quizData, classId) => {
    const newQuiz = {
      id: `quiz-${Date.now()}`,
      classId: classId || 'cls-101',
      title: quizData.title,
      timeLimit: quizData.timeLimit || 30,
      questionsCount: quizData.questions?.length || 5,
      attemptsCount: 0,
      questions: quizData.questions || [],
    };
    setQuizzes(prev => [newQuiz, ...prev]);
  };

  const handleCompleteQuiz = (quizId, score) => {
    setQuizzes(prev => prev.map(q => q.id === quizId ? { ...q, attemptsCount: (q.attemptsCount || 0) + 1 } : q));
  };

  const handleToggleAdmin = (memberId, newRole) => {
    setMembers(prev => prev.map(mem => mem.id === memberId ? { ...mem, role: newRole } : mem));
  };

  const handleKickMember = (memberId) => {
    setMembers(prev => prev.filter(mem => mem.id !== memberId));
  };

  const handleUpdateClassInfo = (clsId, info) => {
    setClasses(prev => prev.map(c => c.id === clsId ? { ...c, ...info } : c));
  };

  const handleRegenerateCode = (clsId) => {
    const newCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    setClasses(prev => prev.map(c => c.id === clsId ? { ...c, code: newCode } : c));
    return newCode;
  };

  const handleDeleteClass = (clsId) => {
    setClasses(prev => prev.filter(c => c.id !== clsId));
  };

  return (
    <AppStateProvider>
      <BrowserRouter>
        <AppRoutes
          user={user}
          classes={classes}
          userClasses={userClasses}
          announcements={announcements}
          materials={materials}
          quizzes={quizzes}
          leaderboard={leaderboard}
          members={members}
          onRoleChange={handleRoleChange}
          onCreateClass={handleCreateClass}
          onJoinClass={handleJoinClass}
          onAddAnnouncement={handleAddAnnouncement}
          onCreateMaterial={handleCreateMaterial}
          onUpdateMaterialStatus={handleUpdateMaterialStatus}
          onEditMaterialContent={handleEditMaterialContent}
          onCreateQuiz={handleCreateQuiz}
          onCompleteQuiz={handleCompleteQuiz}
          onToggleAdmin={handleToggleAdmin}
          onKickMember={handleKickMember}
          onUpdateClassInfo={handleUpdateClassInfo}
          onRegenerateCode={handleRegenerateCode}
          onDeleteClass={handleDeleteClass}
        />
      </BrowserRouter>
    </AppStateProvider>
  );
}
