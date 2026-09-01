import React from 'react';
import TopBar from '../components/TopBar';
import BottomNav from '../components/BottomNav';
import Toast from '../components/Toast';
import { useAppState } from '../context/AppStateContext';

export default function MobileLayout({ children, hideNav = false, hideBottomNav = false }) {
  const { toastMessage } = useAppState();

  const shouldHideBottom = hideNav || hideBottomNav;

  return (
    <div className={`min-h-screen w-full bg-background relative flex flex-col overflow-x-hidden ${shouldHideBottom ? '' : 'pb-24'}`}>
      {/* TopBar Header is always visible */}
      <TopBar />

      <main className="flex-1 flex flex-col">
        {children}
      </main>

      {/* BottomNav is hidden when shouldHideBottom is true */}
      {!shouldHideBottom && <BottomNav />}

      <Toast message={toastMessage} />
    </div>
  );
}
