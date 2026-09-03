import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Settings,
  Shield,
  Lock,
  Moon,
  Sun,
  LogOut,
  Check,
  Mail,
  Camera,
  Trash2,
  AlertCircle,
  KeyRound,
  Sparkles,
  Award,
  BookOpen,
  Eye,
  EyeOff
} from 'lucide-react';
import { useAppState } from '../context/AppStateContext';
import ImageCropperModal from '../components/ImageCropperModal';

export default function AccountSettingsPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const { appState, currentUser, userProfile, updateUserProfile, toggleDarkMode, showToast, logoutUser } = useAppState();

  const activeUser = currentUser || userProfile || {
    name: 'Refky Satria',
    username: 'refky',
    email: 'refky@eduverse.id',
    bio: 'Pelajar & Tech Enthusiast | Suka kuis & kompetisi',
  };

  const getInitialAvatar = (user) => {
    const name = user?.name || user?.username || 'User';
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=8b5cf6&color=ffffff&bold=true&size=256`;
  };

  const getAvatarUrl = (user) => {
    const raw = user?.profile_photo || user?.avatar;
    if (raw && !String(raw).includes('unsplash')) return raw;
    return getInitialAvatar(user);
  };

  // Form states
  const [name, setName] = useState(activeUser.name || '');
  const [username, setUsername] = useState(activeUser.username || '');
  const [email, setEmail] = useState(activeUser.email || '');
  const [bio, setBio] = useState(activeUser.bio || '');
  const [selectedAvatar, setSelectedAvatar] = useState(getAvatarUrl(activeUser));
  const [activeTab, setActiveTab] = useState('profile'); // 'profile', 'edit', 'security', 'theme'
  const [cropperOpen, setCropperOpen] = useState(false);
  const [tempImageSrc, setTempImageSrc] = useState(null);

  // Password Change Form States
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPasswordState, setShowConfirmPasswordState] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);

  useEffect(() => {
    const userObj = currentUser || userProfile;
    if (userObj) {
      setName(userObj.name || '');
      setUsername(userObj.username || '');
      setEmail(userObj.email || '');
      setBio(userObj.bio || '');
      setSelectedAvatar(getAvatarUrl(userObj));
    }
  }, [currentUser, userProfile]);

  // Check if current avatar is custom (not default initial avatar)
  const isCustomAvatar = selectedAvatar && !selectedAvatar.includes('ui-avatars.com') && !selectedAvatar.includes('unsplash');

  // 1. Upload Photo from Internal Device Storage (opens cropper first)
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Harap pilih file gambar yang valid.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const imageUrl = event.target?.result;
      if (imageUrl) {
        setTempImageSrc(imageUrl);
        setCropperOpen(true);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleCropComplete = async (croppedImg) => {
    setSelectedAvatar(croppedImg);
    setCropperOpen(false);
    setTempImageSrc(null);

    if (updateUserProfile) {
      await updateUserProfile({ avatar: croppedImg, profile_photo: croppedImg });
    }
    showToast('Foto profil berhasil dipotong & diperbarui!');
  };

  // 2. Delete / Reset Profile Photo back to default mascot
  const handleDeletePhoto = () => {
    const fallbackAvatar = getInitialAvatar(activeUser);
    setSelectedAvatar(fallbackAvatar);
    if (updateUserProfile) {
      updateUserProfile({ avatar: null, profile_photo: null });
    }
    showToast('Foto profil berhasil dihapus dan dikembalikan ke inisial nama.');
  };

  // 3. Save Edit Information (Name, Username, Email, Bio)
  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (updateUserProfile) {
      updateUserProfile({
        name: name.trim(),
        username: username.trim().toLowerCase().replace(/\s+/g, ''),
        email: email.trim(),
        bio: bio.trim(),
        avatar: selectedAvatar,
        profile_photo: selectedAvatar,
      });
    }
    showToast('Informasi akun berhasil diperbarui!');
  };

  // 4. Handle Password Change Submit
  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (!currentPassword) {
      setPasswordError('Masukkan kata sandi lama Anda.');
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError('Kata sandi baru minimal 8 karakter.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('Konfirmasi kata sandi baru tidak cocok.');
      return;
    }

    setPasswordLoading(true);
    setTimeout(() => {
      setPasswordLoading(false);
      setPasswordSuccess('Kata sandi berhasil diperbarui!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      showToast('Kata sandi Anda telah berhasil diubah.');
    }, 600);
  };

  // 5. Logout handler
  const handleLogout = async () => {
    await logoutUser();
    navigate('/login');
  };

  return (
    <section className="px-4 md:px-8 pt-4 md:pt-6 pb-24 space-y-6 animate-fade-in flex flex-col max-w-5xl mx-auto w-full">
      {/* Hidden Native File Input for Device Internal Storage Image Upload */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />

      {/* Main Grid: Sleek Sidebar Nav & Content Views */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Navigation Sidebar */}
        <div className="md:col-span-4 bg-card/80 backdrop-blur-xl border border-border/80 rounded-3xl p-2.5 md:p-3 shadow-md flex md:flex-col overflow-x-auto no-scrollbar gap-1.5">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 md:w-full shrink-0 flex items-center justify-center md:justify-start gap-3 px-4 py-3 md:py-3.5 rounded-2xl font-extrabold text-xs transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'profile'
                ? 'bg-primary text-primary-foreground shadow-glow'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
            }`}
          >
            <User className="w-4 h-4 shrink-0" />
            <span>Ringkasan Akun</span>
          </button>

          <button
            onClick={() => setActiveTab('edit')}
            className={`flex-1 md:w-full shrink-0 flex items-center justify-center md:justify-start gap-3 px-4 py-3 md:py-3.5 rounded-2xl font-extrabold text-xs transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'edit'
                ? 'bg-primary text-primary-foreground shadow-glow'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
            }`}
          >
            <Settings className="w-4 h-4 shrink-0" />
            <span>Edit Informasi</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`flex-1 md:w-full shrink-0 flex items-center justify-center md:justify-start gap-3 px-4 py-3 md:py-3.5 rounded-2xl font-extrabold text-xs transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'security'
                ? 'bg-primary text-primary-foreground shadow-glow'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
            }`}
          >
            <Shield className="w-4 h-4 shrink-0" />
            <span>Keamanan &amp; Password</span>
          </button>

          <button
            onClick={() => setActiveTab('theme')}
            className={`flex-1 md:w-full shrink-0 flex items-center justify-center md:justify-start gap-3 px-4 py-3 md:py-3.5 rounded-2xl font-extrabold text-xs transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'theme'
                ? 'bg-primary text-primary-foreground shadow-glow'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
            }`}
          >
            {appState.darkMode ? <Moon className="w-4 h-4 shrink-0 text-primary-glow" /> : <Sun className="w-4 h-4 shrink-0 text-warning" />}
            <span>Mode Tampilan</span>
          </button>

          <button
            onClick={handleLogout}
            className="flex-1 md:w-full shrink-0 flex items-center justify-center md:justify-start gap-3 px-4 py-3 md:py-3.5 rounded-2xl font-extrabold text-xs text-danger hover:bg-danger/10 transition-colors cursor-pointer whitespace-nowrap md:mt-2 md:pt-3 md:border-t md:border-border/60"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span>Logout Akun</span>
          </button>
        </div>

        {/* Content View Section */}
        <div className="md:col-span-8 space-y-6">
          {activeTab === 'profile' && (
            <div className="space-y-6">
              {/* EduQuest Brand Gradient Profile Header Banner */}
              <div className="relative rounded-3xl p-6 md:p-8 bg-gradient-to-br from-primary via-primary to-primary-glow border border-white/20 shadow-glow overflow-hidden text-primary-foreground flex flex-col sm:flex-row items-center sm:items-start gap-6">
                {/* Circular Profile Avatar with Camera & Delete Overlays */}
                <div className="relative group shrink-0">
                  <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-white/20 backdrop-blur-md p-1 border-2 border-white/40 shadow-lg overflow-hidden flex items-center justify-center">
                    <img
                      src={selectedAvatar}
                      alt="Profile Avatar"
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>

                  {/* Camera Icon Overlay (Pilih dari Penyimpanan Internal) */}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    title="Pilih foto profil dari penyimpanan internal device"
                    className="absolute bottom-0 right-0 bg-white text-primary p-2.5 rounded-full shadow-lg border border-primary/20 hover:scale-110 active:scale-95 transition-transform cursor-pointer"
                  >
                    <Camera className="w-4 h-4" />
                  </button>

                  {/* Delete Profile Photo Icon Overlay (Reset to Default Mascot) */}
                  {isCustomAvatar && (
                    <button
                      type="button"
                      onClick={handleDeletePhoto}
                      title="Hapus foto profil dan kembalikan ke foto bawaan"
                      className="absolute top-0 right-0 bg-danger text-white p-2 rounded-full shadow-lg border border-white/20 hover:scale-110 active:scale-95 transition-transform cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* User Credentials & Header */}
                <div className="space-y-2 text-center sm:text-left min-w-0 flex-1 z-10">
                  <h2 className="text-2xl md:text-3xl font-extrabold italic tracking-tight truncate drop-shadow-md">
                    {activeUser.name}
                  </h2>
                  <p className="text-xs text-primary-foreground/90 font-semibold truncate">
                    @{activeUser.username} · {activeUser.email}
                  </p>

                  {/* Action Buttons inside Banner */}
                  <div className="pt-2 flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-white/20 hover:bg-white/30 text-white text-xs font-extrabold px-4 py-2 rounded-full backdrop-blur-md border border-white/30 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <Camera className="w-3.5 h-3.5" /> Upload Foto Baru
                    </button>
                    {isCustomAvatar && (
                      <button
                        type="button"
                        onClick={handleDeletePhoto}
                        className="bg-danger/80 hover:bg-danger text-white text-xs font-extrabold px-4 py-2 rounded-full backdrop-blur-md border border-white/30 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Hapus Foto Profil
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Bio & Details Box */}
              <div className="bg-card border border-border rounded-3xl p-6 space-y-4 shadow-sm">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <h3 className="font-extrabold text-base italic">Ringkasan Profil</h3>
                  <button
                    onClick={() => setActiveTab('edit')}
                    className="text-xs text-primary font-bold hover:underline cursor-pointer flex items-center gap-1.5 bg-primary/10 px-3.5 py-1.5 rounded-full"
                  >
                    <Settings className="w-3.5 h-3.5" /> Edit Informasi
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1">
                    <p className="font-bold text-muted-foreground uppercase text-[10px]">Nama Lengkap</p>
                    <p className="font-extrabold text-foreground text-sm">{activeUser.name}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="font-bold text-muted-foreground uppercase text-[10px]">Username</p>
                    <p className="font-extrabold text-foreground text-sm">@{activeUser.username}</p>
                  </div>
                  <div className="space-y-1 sm:col-span-2">
                    <p className="font-bold text-muted-foreground uppercase text-[10px]">Alamat Email</p>
                    <p className="font-extrabold text-foreground text-sm truncate">{activeUser.email}</p>
                  </div>
                </div>

                {activeUser.bio && (
                  <div className="pt-3 border-t border-border space-y-1 text-xs">
                    <p className="font-bold text-muted-foreground uppercase text-[10px]">Bio / Deskripsi</p>
                    <p className="text-foreground italic leading-relaxed font-medium">"{activeUser.bio}"</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'edit' && (
            <div className="bg-card border border-border rounded-3xl p-6 shadow-sm space-y-5">
              <div className="border-b border-border pb-3">
                <h3 className="font-extrabold text-base italic flex items-center gap-2 text-primary">
                  <Settings className="w-4 h-4" /> Edit Informasi Pengguna
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">Perbarui nama, username, email, dan bio kamu.</p>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-background border border-border rounded-2xl px-4 py-3 text-xs focus:outline-none focus:border-primary transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5">
                      Username
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">@</span>
                      <input
                        type="text"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s+/g, ''))}
                        className="w-full bg-background border border-border rounded-2xl pl-8 pr-4 py-3 text-xs focus:outline-none focus:border-primary transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-background border border-border rounded-2xl pl-10 pr-4 py-3 text-xs focus:outline-none focus:border-primary transition-colors"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5">
                    Bio / Deskripsi Singkat
                  </label>
                  <textarea
                    rows={3}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full bg-background border border-border rounded-2xl px-4 py-3 text-xs focus:outline-none focus:border-primary transition-colors resize-none"
                    placeholder="Tulis bio singkat kamu..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto bg-gradient-to-r from-primary to-primary-glow text-white font-extrabold py-3.5 px-8 rounded-2xl text-xs shadow-glow active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Check className="w-4 h-4" /> Simpan Perubahan Profil
                </button>
              </form>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="bg-card border border-border rounded-3xl p-6 shadow-sm space-y-5">
              <div className="border-b border-border pb-3">
                <h3 className="font-extrabold text-base italic flex items-center gap-2 text-primary">
                  <KeyRound className="w-4 h-4" /> Pengaturan Keamanan &amp; Kata Sandi
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">Ubah kata sandi akun EduVerse kamu secara aman.</p>
              </div>

              {passwordError && (
                <div className="p-3 bg-danger/10 border border-danger/30 rounded-2xl text-xs text-danger font-bold flex items-start gap-2 animate-shake">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{passwordError}</span>
                </div>
              )}

              {passwordSuccess && (
                <div className="p-3 bg-success/10 border border-success/30 rounded-2xl text-xs text-success font-bold flex items-start gap-2 animate-fade-in">
                  <Check className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{passwordSuccess}</span>
                </div>
              )}

              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-primary" /> Kata Sandi Saat Ini
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full bg-background border border-border rounded-2xl pl-4 pr-11 py-3 text-xs focus:outline-none focus:border-primary transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
                      aria-label={showCurrentPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                    >
                      {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                      <KeyRound className="w-3.5 h-3.5 text-primary" /> Kata Sandi Baru
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        required
                        minLength={8}
                        placeholder="Minimal 8 karakter"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full bg-background border border-border rounded-2xl pl-4 pr-11 py-3 text-xs focus:outline-none focus:border-primary transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
                        aria-label={showNewPassword ? 'Sembunyikan kata sandi baru' : 'Tampilkan kata sandi baru'}
                      >
                        {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-primary" /> Konfirmasi Kata Sandi Baru
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPasswordState ? 'text' : 'password'}
                        required
                        placeholder="Ulangi kata sandi baru"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full bg-background border border-border rounded-2xl pl-4 pr-11 py-3 text-xs focus:outline-none focus:border-primary transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPasswordState(!showConfirmPasswordState)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
                        aria-label={showConfirmPasswordState ? 'Sembunyikan konfirmasi kata sandi' : 'Tampilkan konfirmasi kata sandi'}
                      >
                        {showConfirmPasswordState ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={passwordLoading}
                  className="w-full sm:w-auto bg-gradient-to-r from-primary to-primary-glow text-white font-extrabold py-3.5 px-8 rounded-2xl text-xs shadow-glow active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Lock className="w-4 h-4" /> {passwordLoading ? 'Memproses Ubah Kata Sandi...' : 'Perbarui Kata Sandi'}
                </button>
              </form>
            </div>
          )}

          {activeTab === 'theme' && (
            <div className="bg-card border border-border rounded-3xl p-6 shadow-sm space-y-5">
              <div className="border-b border-border pb-3">
                <h3 className="font-extrabold text-base italic flex items-center gap-2 text-primary">
                  {appState.darkMode ? <Moon className="w-4 h-4 text-primary" /> : <Sun className="w-4 h-4 text-warning" />} Mode Tampilan Aplikasi
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">Pilih mode tampilan sesuai kenyamanan visual mata kamu.</p>
              </div>

              {/* Interactive Theme Switcher Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div
                  onClick={() => { if (appState.darkMode) toggleDarkMode(); }}
                  className={`p-5 rounded-3xl border-2 transition-all cursor-pointer flex flex-col justify-between gap-4 ${
                    !appState.darkMode
                      ? 'bg-primary/10 border-primary shadow-glow scale-[1.02]'
                      : 'bg-background border-border hover:border-primary/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-500 grid place-items-center font-bold">
                      <Sun className="w-5 h-5" />
                    </div>
                    {!appState.darkMode && (
                      <span className="px-2.5 py-1 bg-primary text-white text-[10px] font-extrabold rounded-full">
                        Aktif
                      </span>
                    )}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm">Mode Terang (Light)</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">Tampilan terang jernih dan segar</p>
                  </div>
                </div>

                <div
                  onClick={() => { if (!appState.darkMode) toggleDarkMode(); }}
                  className={`p-5 rounded-3xl border-2 transition-all cursor-pointer flex flex-col justify-between gap-4 ${
                    appState.darkMode
                      ? 'bg-primary/10 border-primary shadow-glow scale-[1.02]'
                      : 'bg-background border-border hover:border-primary/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary grid place-items-center font-bold">
                      <Moon className="w-5 h-5" />
                    </div>
                    {appState.darkMode && (
                      <span className="px-2.5 py-1 bg-primary text-white text-[10px] font-extrabold rounded-full">
                        Aktif
                      </span>
                    )}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm">Mode Gelap (Dark)</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">Tampilan gelap EduQuest yang elegan</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Image Cropper Modal */}
      {cropperOpen && tempImageSrc && (
        <ImageCropperModal
          imageSrc={tempImageSrc}
          onClose={() => {
            setCropperOpen(false);
            setTempImageSrc(null);
          }}
          onCropComplete={handleCropComplete}
        />
      )}
    </section>
  );
}
