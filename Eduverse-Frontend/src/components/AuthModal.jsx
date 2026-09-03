import React, { useState } from 'react';
import { LogIn, UserPlus, Sparkles, AlertCircle, Lock, Mail, User, AtSign, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { useAppState } from '../context/AppStateContext';

export default function AuthModal({ isOpen, onClose }) {
  const { loginUser, registerUser, currentUser, logoutUser } = useAppState();

  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Register Form State
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regPasswordConf, setRegPasswordConf] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showRegPasswordConf, setShowRegPasswordConf] = useState(false);

  // Login Form State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  if (!isOpen) return null;

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (regPassword !== regPasswordConf) {
      setErrorMessage('Konfirmasi password tidak cocok dengan password.');
      return;
    }

    setLoading(true);
    try {
      await registerUser({
        name,
        username,
        email: regEmail,
        password: regPassword,
        password_confirmation: regPasswordConf,
      });
      onClose();
    } catch (err) {
      setErrorMessage(err.message || 'Gagal mendaftar. Periksa kembali inputan Anda.');
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      await loginUser({
        email: loginEmail,
        password: loginPassword,
      });
      onClose();
    } catch (err) {
      setErrorMessage(err.message || 'Login gagal. Email atau password salah.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogoutClick = async () => {
    setLoading(true);
    try {
      await logoutUser();
      onClose();
    } catch (err) {
      setErrorMessage(err.message || 'Gagal logout');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-card border border-border rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-5 relative overflow-hidden">
        
        {/* Top Header & Close Button */}
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-foreground">Autentikasi Laravel API</h3>
              <p className="text-[10px] text-muted-foreground">Database MySQL: eduverse_db</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-muted hover:bg-muted/80 text-muted-foreground flex items-center justify-center font-bold text-xs cursor-pointer transition-colors"
          >
            ✕
          </button>
        </div>

        {/* If user is already logged in */}
        {currentUser ? (
          <div className="text-center py-4 space-y-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 text-primary mx-auto flex items-center justify-center text-2xl font-extrabold shadow-sm border border-primary/20">
              👤
            </div>
            <div>
              <h4 className="font-extrabold text-lg text-foreground">{currentUser.name}</h4>
              <p className="text-xs text-primary font-mono font-bold">@{currentUser.username}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{currentUser.email}</p>
            </div>
            <div className="p-3 bg-success/10 border border-success/30 rounded-2xl text-xs text-success font-extrabold flex items-center justify-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Terhubung dengan Backend Laravel (Token Sanctum Aktif)
            </div>
            <button
              onClick={handleLogoutClick}
              disabled={loading}
              className="w-full bg-danger/10 hover:bg-danger/20 text-danger font-extrabold py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
            >
              {loading ? 'Mengeluarkan...' : 'Logout / Keluar Akun'}
            </button>
          </div>
        ) : (
          <>
            {/* Mode Switcher Tabs */}
            <div className="grid grid-cols-2 p-1 bg-muted rounded-2xl">
              <button
                type="button"
                onClick={() => { setMode('login'); setErrorMessage(''); }}
                className={`py-2 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  mode === 'login' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <LogIn className="w-3.5 h-3.5" /> Masuk (Login)
              </button>
              <button
                type="button"
                onClick={() => { setMode('register'); setErrorMessage(''); }}
                className={`py-2 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  mode === 'register' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" /> Daftar (Register)
              </button>
            </div>

            {/* Error Message Alert */}
            {errorMessage && (
              <div className="p-3 bg-danger/10 border border-danger/30 rounded-2xl text-xs text-danger font-bold flex items-start gap-2 animate-shake">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span className="leading-tight">{errorMessage}</span>
              </div>
            )}

            {/* LOGIN FORM */}
            {mode === 'login' && (
              <form onSubmit={handleLoginSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-muted-foreground mb-1">Email</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
                    <input
                      type="email"
                      required
                      placeholder="nama@domain.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="w-full bg-background border border-border rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-muted-foreground mb-1">Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
                    <input
                      type={showLoginPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full bg-background border border-border rounded-xl pl-9 pr-10 py-2.5 text-sm focus:outline-none focus:border-primary"
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                    >
                      {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary text-primary-foreground font-extrabold py-2.5 rounded-xl text-xs shadow-glow flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01] transition-all"
                >
                  {loading ? 'Memproses Login...' : 'Masuk ke EduVerse'}
                </button>
              </form>
            )}

            {/* REGISTER FORM */}
            {mode === 'register' && (
              <form onSubmit={handleRegisterSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-muted-foreground mb-1">Nama Lengkap</label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
                    <input
                      type="text"
                      required
                      placeholder="Refky Satria"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-background border border-border rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-muted-foreground mb-1">Username Unik</label>
                  <div className="relative">
                    <AtSign className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
                    <input
                      type="text"
                      required
                      placeholder="refky_satria"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full bg-background border border-border rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-muted-foreground mb-1">Alamat Email</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
                    <input
                      type="email"
                      required
                      placeholder="refky@eduverse.com"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      className="w-full bg-background border border-border rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-muted-foreground mb-1">Password</label>
                    <div className="relative">
                      <input
                        type={showRegPassword ? 'text' : 'password'}
                        required
                        minLength={8}
                        placeholder="Min. 8 karakter"
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-primary"
                      />
                      <button
                        type="button"
                        onClick={() => setShowRegPassword(!showRegPassword)}
                        className="absolute right-2 top-2 text-muted-foreground hover:text-foreground"
                      >
                        {showRegPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-muted-foreground mb-1">Konfirmasi</label>
                    <div className="relative">
                      <input
                        type={showRegPasswordConf ? 'text' : 'password'}
                        required
                        placeholder="Ulangi password"
                        value={regPasswordConf}
                        onChange={(e) => setRegPasswordConf(e.target.value)}
                        className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-primary"
                      />
                      <button
                        type="button"
                        onClick={() => setShowRegPasswordConf(!showRegPasswordConf)}
                        className="absolute right-2 top-2 text-muted-foreground hover:text-foreground"
                      >
                        {showRegPasswordConf ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary text-primary-foreground font-extrabold py-2.5 rounded-xl text-xs shadow-glow flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01] transition-all mt-2"
                >
                  {loading ? 'Mendaftarkan Akun...' : 'Daftar Akun Baru'}
                </button>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
}
