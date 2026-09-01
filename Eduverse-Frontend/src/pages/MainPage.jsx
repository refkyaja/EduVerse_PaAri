import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, LogIn, Search, BookOpen, Users, Globe, Lock, Sparkles, X, Info, ChevronDown } from 'lucide-react';
import ClassCard from '../components/ClassCard';
import CreateClassModal from '../components/CreateClassModal';
import JoinClassModal from '../components/JoinClassModal';

import { useAppState } from '../context/AppStateContext';

export default function MainPage({ user, classes, userClasses = [], onCreateClass, onJoinClass }) {
  const { currentUser } = useAppState();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isJoinOpen, setIsJoinOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // If newly registered/logged in user, start with userClasses (empty initially until created/joined)
  const targetClasses = currentUser ? userClasses : (classes || []);

  const filteredClasses = targetClasses.filter(cls => {
    return cls.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           cls.description?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="px-4 md:px-8 pt-6 pb-24 space-y-6 animate-fade-in max-w-7xl mx-auto w-full">
      {/* Hero Welcome Banner */}
      <div className="rounded-3xl p-6 md:p-8 text-white shadow-md border border-border/50 relative overflow-hidden">
        {/* Background Banner Image */}
        <img
          src="/assets/banner_eduverse2.png"
          alt="EduVerse Banner"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Overlay gradient for contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-900/65 to-slate-900/35 z-0" />

        <div className="relative z-10 space-y-2 text-center md:text-left max-w-2xl">
          <h1 className="text-2xl md:text-4xl font-extrabold italic tracking-tight text-white drop-shadow-md">
            Selamat Datang di EduVerse, {currentUser ? currentUser.name : (user?.name || "Refky Satria")}!
          </h1>
          <p className="text-xs md:text-sm text-white/90 leading-relaxed max-w-xl">
            Buat kelas kamu sendiri, undang teman, bagikan materi, buat kuis interaktif, dan belajar bersama dalam satu ruang digital.
          </p>
        </div>
      </div>

      {/* Search Input Bar & Action Menu Button (Placed side by side on left) */}
      <div className="flex items-center gap-3 justify-start relative z-20">
        <div className="relative flex-1 sm:flex-none sm:w-80">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari kelas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-card border border-border rounded-2xl pl-10 pr-9 py-2.5 text-xs md:text-sm focus:outline-none focus:border-primary transition-colors shadow-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-0.5 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Class Options Dropdown Button */}
        <div className="relative">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="bg-primary text-primary-foreground font-extrabold px-3 py-2.5 rounded-2xl text-xs md:text-sm shadow-glow hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
            title="Opsi Kelas"
            aria-label="Opsi Kelas"
          >
            <Plus className="w-4 h-4" />
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown Options */}
          {isMenuOpen && (
            <>
              {/* Invisible Overlay to Close on Click Outside */}
              <div
                className="fixed inset-0 z-20"
                onClick={() => setIsMenuOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-44 bg-card border border-border rounded-2xl p-1.5 shadow-2xl z-30 animate-scale-up space-y-1">
                <button
                  onClick={() => {
                    setIsCreateOpen(true);
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold hover:bg-primary/15 hover:text-primary transition-colors flex items-center gap-2.5 cursor-pointer whitespace-nowrap"
                >
                  <Plus className="w-4 h-4 text-primary shrink-0" />
                  <span>Buat Kelas</span>
                </button>
                <button
                  onClick={() => {
                    setIsJoinOpen(true);
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold hover:bg-primary/15 hover:text-primary transition-colors flex items-center gap-2.5 cursor-pointer whitespace-nowrap"
                >
                  <LogIn className="w-4 h-4 text-primary shrink-0" />
                  <span>Gabung Kelas</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Class List Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-primary rounded-full"></div>
            <h2 className="text-xl font-extrabold italic">Daftar Ruang Kelas</h2>
          </div>
          <span className="text-xs font-bold text-muted-foreground">
            Menampilkan {filteredClasses.length} kelas
          </span>
        </div>

        {/* Responsive Grid */}
        {filteredClasses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredClasses.map(cls => (
              <ClassCard key={cls.id} cls={cls} />
            ))}
          </div>
        ) : (
          <div className="bg-card rounded-3xl p-10 text-center space-y-3 shadow-sm">
            <BookOpen className="w-12 h-12 text-muted-foreground mx-auto" />
            <h3 className="font-extrabold text-lg">Kelas Tidak Ditemukan</h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              {searchQuery
                ? `Tidak ada kelas yang cocok dengan kata kunci "${searchQuery}".`
                : 'Kamu belum bergabung atau membuat kelas.'}
            </p>
          </div>
        )}
      </div>

      {/* Modals */}
      <CreateClassModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreateClass={onCreateClass}
      />

      <JoinClassModal
        isOpen={isJoinOpen}
        onClose={() => setIsJoinOpen(false)}
        onJoinClass={onJoinClass}
      />
    </div>
  );
}
