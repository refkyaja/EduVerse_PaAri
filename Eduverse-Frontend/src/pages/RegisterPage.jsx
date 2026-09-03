import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Sparkles, Lock, Mail, User, AtSign, AlertCircle, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { useAppState } from '../context/AppStateContext';
import logoImg from '../assets/companion.png';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { registerUser } = useAppState();

  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (password !== passwordConfirmation) {
      setErrorMessage('Konfirmasi password tidak cocok dengan password yang Anda masukkan.');
      return;
    }

    setLoading(true);

    try {
      await registerUser({
        name,
        username,
        email,
        password,
        password_confirmation: passwordConfirmation,
      });
      navigate('/');
    } catch (err) {
      setErrorMessage(err.message || 'Pendaftaran gagal. Periksa kembali data yang dimasukkan.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-background text-foreground flex flex-col justify-between p-4 md:p-8 animate-fade-in">
      {/* Top Left Navigation Link */}
      <div className="max-w-md mx-auto w-full pt-4">
        <Link
          to="/about"
          className="inline-flex items-center gap-2 text-xs font-extrabold text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali ke Halaman Tentang EduVerse
        </Link>
      </div>

      {/* Main Register Card */}
      <div className="w-full max-w-md mx-auto bg-card border border-border rounded-3xl p-6 md:p-8 shadow-2xl space-y-6 my-auto">
        <div className="text-center space-y-2">
          <img
            src={logoImg}
            alt="EduVerse Logo"
            className="w-16 h-16 mx-auto object-contain animate-float"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/assets/companion.png';
            }}
          />
          <h1 className="text-2xl md:text-3xl font-extrabold italic tracking-tight bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            Daftar Akun Baru
          </h1>
          <p className="text-xs text-muted-foreground">
            Terdaftar langsung ke Database Backend Laravel &amp; MySQL
          </p>
        </div>

        {errorMessage && (
          <div className="p-3 bg-danger/10 border border-danger/30 rounded-2xl text-xs text-danger font-bold flex items-start gap-2 animate-shake">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-primary" /> Nama Lengkap
            </label>
            <input
              type="text"
              required
              placeholder="Nama Lengkap"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <AtSign className="w-3.5 h-3.5 text-primary" /> Username
            </label>
            <input
              type="text"
              required
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-primary" /> Email
            </label>
            <input
              type="email"
              required
              placeholder="name@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-primary" /> Kata Sandi
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={8}
                  placeholder="Min. 8 karakter"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-background border border-border rounded-xl pl-3 pr-9 py-2.5 text-xs focus:outline-none focus:border-primary transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
                  aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-primary" /> Konfirmasi
              </label>
              <div className="relative">
                <input
                  type={showPasswordConfirmation ? 'text' : 'password'}
                  required
                  placeholder="Ulangi kata sandi"
                  value={passwordConfirmation}
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                  className="w-full bg-background border border-border rounded-xl pl-3 pr-9 py-2.5 text-xs focus:outline-none focus:border-primary transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
                  aria-label={showPasswordConfirmation ? 'Sembunyikan konfirmasi password' : 'Tampilkan konfirmasi password'}
                >
                  {showPasswordConfirmation ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-primary to-primary-glow text-white font-extrabold py-3.5 rounded-2xl text-sm shadow-glow hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <UserPlus className="w-4 h-4" /> {loading ? 'Mendaftarkan...' : 'Buat Akun EduVerse'}
            </button>
          </div>
        </form>

        <div className="text-center pt-2 border-t border-border/60">
          <p className="text-xs text-muted-foreground">
            Sudah punya akun?{' '}
            <Link to="/login" className="font-extrabold text-primary hover:underline">
              Masuk di sini
            </Link>
          </p>
        </div>
      </div>

      <div className="text-center py-4 text-xs text-muted-foreground">
        © 2026 EduVerse Platform
      </div>
    </div>
  );
}
