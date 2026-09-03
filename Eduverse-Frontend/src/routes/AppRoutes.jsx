import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAppState } from '../context/AppStateContext';
import { authService } from '../services/authService';

import MobileLayout from '../layouts/MobileLayout';
import HomePage from '../pages/HomePage';
import MateriPage from '../pages/MateriPage';
import QuizPickerPage from '../pages/QuizPickerPage';
import QuizPlayPage from '../pages/QuizPlayPage';
import LeaderboardPage from '../pages/LeaderboardPage';
import ProfilePage from '../pages/ProfilePage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';

import MainPage from '../pages/MainPage';
import ClassAnggotaPage from '../pages/ClassAnggotaPage';
import AccountSettingsPage from '../pages/AccountSettingsPage';
import AboutPage from '../pages/AboutPage';

/**
 * Protected Route Wrapper Component
 * Redirects unauthenticated users to /login page.
 */
function ProtectedRoute({ children }) {
  const { currentUser } = useAppState();
  const token = authService.getToken();

  if (!currentUser && !token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function ClassRouteRedirect({ targetTab }) {
  const { classList } = useAppState();
  if (classList && classList.length > 0 && classList[0]?.id) {
    return <Navigate to={`/class/${classList[0].id}/${targetTab}`} replace />;
  }
  return <Navigate to="/" replace />;
}

export default function AppRoutes({
  user,
  classes,
  userClasses,
  members,
  onRoleChange,
  onCreateClass,
  onJoinClass,
  onToggleAdmin,
  onKickMember,
}) {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/about" element={<AboutPage />} />
      <Route path="/about.html" element={<Navigate to="/about" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/login.html" element={<Navigate to="/login" replace />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/register.html" element={<Navigate to="/register" replace />} />

      {/* 1. HALAMAN UTAMA / DAFTAR KELAS (PROTECTED) */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MobileLayout hideNav={true}>
              <MainPage
                user={user}
                classes={classes}
                userClasses={userClasses}
                onCreateClass={onCreateClass}
                onJoinClass={onJoinClass}
              />
            </MobileLayout>
          </ProtectedRoute>
        }
      />
      <Route path="/classes" element={<Navigate to="/" replace />} />

      {/* 2. BERANDA KELAS (PROTECTED) */}
      <Route
        path="/class/:classId"
        element={
          <ProtectedRoute>
            <MobileLayout>
              <HomePage />
            </MobileLayout>
          </ProtectedRoute>
        }
      />

      {/* 3. MATERI KELAS (PROTECTED) */}
      <Route
        path="/class/:classId/materi"
        element={
          <ProtectedRoute>
            <MobileLayout>
              <MateriPage currentRole={user?.activeRole} />
            </MobileLayout>
          </ProtectedRoute>
        }
      />

      {/* 4. KUIS KELAS (PROTECTED) */}
      <Route
        path="/class/:classId/kuis"
        element={
          <ProtectedRoute>
            <MobileLayout>
              <QuizPickerPage currentRole={user?.activeRole} />
            </MobileLayout>
          </ProtectedRoute>
        }
      />
      <Route path="/class/:classId/quiz" element={<Navigate to="/class/:classId/kuis" replace />} />

      {/* 5. LEADERBOARD KELAS (PROTECTED) */}
      <Route
        path="/class/:classId/leaderboard"
        element={
          <ProtectedRoute>
            <MobileLayout>
              <LeaderboardPage />
            </MobileLayout>
          </ProtectedRoute>
        }
      />

      {/* 6. ANGGOTA KELAS (PROTECTED) */}
      <Route
        path="/class/:classId/anggota"
        element={
          <ProtectedRoute>
            <MobileLayout>
              <ClassAnggotaPage members={members} currentRole={user.activeRole} onToggleAdmin={onToggleAdmin} onKickMember={onKickMember} />
            </MobileLayout>
          </ProtectedRoute>
        }
      />

      {/* 7. STANDALONE REDIRECTS TO ACTIVE CLASS */}
      <Route path="/materi" element={<ProtectedRoute><ClassRouteRedirect targetTab="materi" /></ProtectedRoute>} />
      <Route path="/materi.html" element={<Navigate to="/materi" replace />} />

      <Route path="/quiz" element={<ProtectedRoute><ClassRouteRedirect targetTab="kuis" /></ProtectedRoute>} />
      <Route path="/quiz.html" element={<Navigate to="/quiz" replace />} />

      <Route
        path="/quiz/play"
        element={
          <ProtectedRoute>
            <MobileLayout hideNav={true}>
              <QuizPlayPage />
            </MobileLayout>
          </ProtectedRoute>
        }
      />
      <Route path="/quiz-play" element={<Navigate to="/quiz/play" replace />} />
      <Route path="/quiz-play.html" element={<Navigate to="/quiz/play" replace />} />

      <Route path="/leaderboard" element={<ProtectedRoute><ClassRouteRedirect targetTab="leaderboard" /></ProtectedRoute>} />
      <Route path="/leaderboard.html" element={<Navigate to="/leaderboard" replace />} />

      {/* 8. PROFIL & PUSAT PENGATURAN KELAS (PROTECTED) */}
      <Route
        path="/class/:classId/profile"
        element={
          <ProtectedRoute>
            <MobileLayout>
              <ProfilePage />
            </MobileLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/class/:classId/edit-info"
        element={
          <ProtectedRoute>
            <MobileLayout>
              <ProfilePage initialTab="settings" />
            </MobileLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/class/:classId/add-subject"
        element={
          <ProtectedRoute>
            <MobileLayout>
              <ProfilePage initialTab="add_subject" />
            </MobileLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/class/:classId/add-material"
        element={
          <ProtectedRoute>
            <MobileLayout>
              <ProfilePage initialTab="add_material" />
            </MobileLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/class/:classId/add-quiz"
        element={
          <ProtectedRoute>
            <MobileLayout>
              <ProfilePage initialTab="add_quiz" />
            </MobileLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/class/:classId/verification"
        element={
          <ProtectedRoute>
            <MobileLayout>
              <ProfilePage initialTab="verification" />
            </MobileLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/class/:classId/members"
        element={
          <ProtectedRoute>
            <MobileLayout>
              <ProfilePage initialTab="members" />
            </MobileLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/class/:classId/audit-log"
        element={
          <ProtectedRoute>
            <MobileLayout>
              <ProfilePage initialTab="audit_log" />
            </MobileLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <MobileLayout>
              <ProfilePage />
            </MobileLayout>
          </ProtectedRoute>
        }
      />
      <Route path="/profile.html" element={<Navigate to="/profile" replace />} />

      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <MobileLayout hideNav={true}>
              <AccountSettingsPage />
            </MobileLayout>
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
