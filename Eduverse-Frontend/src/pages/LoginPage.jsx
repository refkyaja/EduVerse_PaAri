import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, Sparkles, Lock, Mail, AlertCircle, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { useAppState } from '../context/AppStateContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const { loginUser } = useAppState();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      await loginUser({ email, password });
      navigate('/');
    } catch (err) {
      setErrorMessage(err.message || 'Login gagal. Periksa kembali email dan password Anda.');
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

      {/* Main Login Card */}
      <div className="w-full max-w-md mx-auto bg-card border border-border rounded-3xl p-6 md:p-8 shadow-2xl space-y-6 my-auto">
        <div className="text-center space-y-2">
          <img
            src="/assets/companion.png"
            alt="EduVerse Logo"
            className="w-16 h-16 mx-auto object-contain animate-float"
          />
          <h1 className="text-2xl md:text-3xl font-extrabold italic tracking-tight bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            Masuk EduVerse
          </h1>
          <p className="text-xs text-muted-foreground">
            Terhubung ke Database Backend Laravel &amp; MySQL
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
              <Mail className="w-3.5 h-3.5 text-primary" /> Alamat Email
            </label>
            <input
              type="email"
              required
              placeholder="nama@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-primary" /> Kata Sandi
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-background border border-border rounded-xl pl-4 pr-11 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
                aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-primary to-primary-glow text-white font-extrabold py-3.5 rounded-2xl text-sm shadow-glow hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogIn className="w-4 h-4" /> {loading ? 'Memproses Login...' : 'Masuk ke Halaman Utama'}
            </button>
          </div>
        </form>

        <div className="text-center pt-2 border-t border-border/60">
          <p className="text-xs text-muted-foreground">
            Belum punya akun?{' '}
            <Link to="/register" className="font-extrabold text-primary hover:underline">
              Daftar Akun Baru
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
