import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { apiService } from '../services/apiService';
import { INITIAL_CLASSES, INITIAL_QUIZZES } from '../data/mockData';

const AppStateContext = createContext();

const INITIAL_STATE = {
  xp: 4080,
  streak: 7,
  examsCompleted: 44,
  correctAnswers: 176,
  powerUps: { hint: 3, shield: 2, freeze: 1, combo: 5 },
  darkMode: false
};

export function getLevelInfo(totalXp) {
  const baseLevel = 25;
  const baseXP    = 3100;
  if (totalXp >= baseXP) {
    const excess      = totalXp - baseXP;
    const levelOffset = Math.floor(excess / 1000);
    const level       = baseLevel + levelOffset;
    const progress    = excess % 1000;
    return { level, progress, max: 1000 };
  }
  const level    = Math.floor(totalXp / 150) + 1;
  const progress = totalXp % 150;
  return { level, progress, max: 150 };
}

export function AppStateProvider({ children }) {
  const [appState, setAppState] = useState(() => {
    try {
      const stored = localStorage.getItem('eduquest_state');
      if (stored) {
        return { ...INITIAL_STATE, ...JSON.parse(stored) };
      }
    } catch (e) {
      console.error("Failed to parse stored state:", e);
    }
    return INITIAL_STATE;
  });

  const [currentUser, setCurrentUser] = useState(() => authService.getStoredUser());
  const [toastMessage, setToastMessage] = useState(null);

  // Sync state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('eduquest_state', JSON.stringify(appState));
    } catch (e) {
      console.error("Failed to save state:", e);
    }
  }, [appState]);

  // Sync dark mode class to html element
  useEffect(() => {
    if (appState.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [appState.darkMode]);

  // Sync user profile & user classes on mount or token change
  useEffect(() => {
    if (authService.getToken()) {
      authService.getProfile()
        .then(user => {
          setCurrentUser(user);
        })
        .catch(err => {
          console.warn('Auto profile fetch failed:', err);
        });
      fetchUserClasses();
    } else {
      setClassList([]);
    }
  }, []);

  const [classList, setClassList] = useState([]);

  const fetchUserClasses = async () => {
    if (!authService.getToken()) {
      setClassList([]);
      return [];
    }
    try {
      const classes = await apiService.getClasses();
      setClassList(classes);
      return classes;
    } catch (e) {
      console.warn("Failed to fetch user classes from API:", e);
      setClassList([]);
      return [];
    }
  };

  const toggleDarkMode = () => {
    setAppState(prev => ({ ...prev, darkMode: !prev.darkMode }));
  };

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 2300);
  };

  const recordExamResult = (earnedXp, correctCount, totalQuestions) => {
    setAppState(prev => ({
      ...prev,
      xp: prev.xp + earnedXp,
      examsCompleted: prev.examsCompleted + 1,
      correctAnswers: prev.correctAnswers + correctCount,
    }));
  };

  const loginUser = async (credentials) => {
    const res = await authService.login(credentials);
    if (res.data?.user) {
      setCurrentUser(res.data.user);
      await fetchUserClasses();
      showToast(`Selamat datang kembali, ${res.data.user.name}!`);
    }
    return res;
  };

  const registerUser = async (data) => {
    const res = await authService.register(data);
    if (res.data?.user) {
      setCurrentUser(res.data.user);
      await fetchUserClasses();
      showToast(`Akun ${res.data.user.name} berhasil terdaftar di database!`);
    }
    return res;
  };

  const updateUserProfile = async (profileData) => {
    try {
      const updated = await authService.updateProfile(profileData);
      setCurrentUser(prev => ({ ...prev, ...updated }));
      return updated;
    } catch (err) {
      console.warn("Backend profile sync notice:", err);
      const newObj = { ...(currentUser || {}), ...profileData };
      setCurrentUser(newObj);
      localStorage.setItem('eduverse_user', JSON.stringify(newObj));
      return newObj;
    }
  };

  const logoutUser = async () => {
    await authService.logout();
    setCurrentUser(null);
    setClassList([]);
    setAppState(INITIAL_STATE);
    setMateriList([]);
    setQuizList(INITIAL_QUIZZES);
    localStorage.removeItem('eduverse_classes');
    localStorage.removeItem('eduverse_user_classes');
    localStorage.removeItem('eduverse_materi');
    localStorage.removeItem('eduverse_quizzes');
    localStorage.removeItem('eduquest_state');
    localStorage.removeItem('eduverse_user');
    localStorage.removeItem('eduverse_token');
    showToast("Anda telah keluar dari akun.");
  };

  const [classXpMap, setClassXpMap] = useState({
    'cls-101': 1250,
    'cls-102': 850,
    'cls-103': 450,
  });

  const getClassXp = (classId) => {
    if (!classId) return 0;
    return classXpMap[classId] ?? 0;
  };

  const addClassXp = (classId, amount) => {
    if (!classId) return;
    setClassXpMap(prev => ({
      ...prev,
      [classId]: (prev[classId] || 0) + amount,
    }));
  };

  const registerClass = (newCls) => {
    setClassList(prev => {
      const exists = prev.some(c => c.id === newCls.id);
      if (exists) return prev;
      return [newCls, ...prev];
    });
  };

  const findClass = (classId) => {
    if (!classId) return null;
    const found = classList.find(c => String(c.id) === String(classId) || c.code === String(classId));
    if (found) return found;
    if (String(classId).startsWith('cls-')) {
      return {
        id: classId,
        name: "Kelas Saya",
        description: "Ruang kelas digital EduVerse",
        code: String(classId).slice(-6).toUpperCase(),
        memberCount: 1,
        role: currentUser?.activeRole || "member",
      };
    }
    return null;
  };

  const updateClassInfo = (classId, newDetails) => {
    if (!classId) return;
    setClassList(prev => {
      const existingIdx = prev.findIndex(c => String(c.id) === String(classId));
      let updated;
      if (existingIdx >= 0) {
        updated = [...prev];
        const existingCode = updated[existingIdx].code;
        updated[existingIdx] = {
          ...updated[existingIdx],
          ...newDetails,
          code: newDetails.code || existingCode || String(classId).slice(-6).toUpperCase()
        };
      } else {
        const fallbackClass = {
          id: classId,
          name: newDetails.name || "Kelas Saya",
          description: newDetails.description || "Ruang kelas digital EduVerse",
          code: newDetails.code || String(classId).slice(-6).toUpperCase(),
          memberCount: 1,
          role: "owner",
          ...newDetails
        };
        updated = [fallbackClass, ...prev];
      }
      try {
        localStorage.setItem('eduverse_classes', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const [materiList, setMateriList] = useState(() => {
    try {
      const stored = localStorage.getItem('eduverse_materi');
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return [];
  });

  const addMateri = (newMateri) => {
    setMateriList(prev => {
      const updated = [newMateri, ...prev];
      try {
        localStorage.setItem('eduverse_materi', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const [quizList, setQuizList] = useState(() => {
    try {
      const stored = localStorage.getItem('eduverse_quizzes');
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return INITIAL_QUIZZES;
  });

  const addQuiz = (newQuiz) => {
    setQuizList(prev => {
      const updated = [newQuiz, ...prev];
      try {
        localStorage.setItem('eduverse_quizzes', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  return (
    <AppStateContext.Provider value={{
      appState,
      setAppState,
      currentUser,
      setCurrentUser,
      classList,
      fetchUserClasses,
      registerClass,
      findClass,
      updateClassInfo,
      materiList,
      addMateri,
      quizList,
      addQuiz,
      classXpMap,
      getClassXp,
      addClassXp,
      loginUser,
      registerUser,
      updateUserProfile,
      logoutUser,
      toggleDarkMode,
      showToast,
      toastMessage,
      recordExamResult,
      getLevelInfo
    }}>
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error("useAppState must be used within an AppStateProvider");
  }
  return context;
}
