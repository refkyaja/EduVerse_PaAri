import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { INITIAL_CLASSES } from '../data/mockData';

const AppStateContext = createContext();

const INITIAL_STATE = {
  xp: 3950,
  streak: 7,
  examsCompleted: 42,
  correctAnswers: 0,
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

  // Sync user profile on mount if token exists
  useEffect(() => {
    if (authService.getToken()) {
      authService.getProfile()
        .then(user => setCurrentUser(user))
        .catch(err => {
          console.warn('Auto profile fetch failed:', err);
        });
    }
  }, []);

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
      showToast(`Selamat datang kembali, ${res.data.user.name}!`);
    }
    return res;
  };

  const registerUser = async (data) => {
    const res = await authService.register(data);
    if (res.data?.user) {
      setCurrentUser(res.data.user);
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

  const [classList, setClassList] = useState(() => {
    try {
      const stored = localStorage.getItem('eduverse_classes');
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return INITIAL_CLASSES;
  });

  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const stored = localStorage.getItem('eduverse_classes');
        if (stored) setClassList(JSON.parse(stored));
      } catch (e) {}
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const registerClass = (newCls) => {
    setClassList(prev => {
      const exists = prev.some(c => c.id === newCls.id);
      if (exists) return prev;
      const updated = [newCls, ...prev];
      try {
        localStorage.setItem('eduverse_classes', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const findClass = (classId) => {
    if (!classId) return null;
    const found = classList.find(c => c.id === classId || c.code === classId);
    if (found) return found;
    return {
      id: classId,
      name: "Kelas Baru",
      description: "Ruang kelas digital EduVerse",
      code: "EDU123",
      memberCount: 1,
      role: "owner",
      isNew: true,
    };
  };

  return (
    <AppStateContext.Provider value={{
      appState,
      setAppState,
      currentUser,
      setCurrentUser,
      classList,
      registerClass,
      findClass,
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
