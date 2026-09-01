/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        background: 'rgba(var(--background), <alpha-value>)',
        foreground: 'rgba(var(--foreground), <alpha-value>)',
        card: { DEFAULT: 'rgba(var(--card), <alpha-value>)', foreground: 'rgba(var(--card-foreground), <alpha-value>)' },
        primary: { DEFAULT: 'rgba(var(--primary), <alpha-value>)', foreground: 'rgba(var(--primary-foreground), <alpha-value>)', glow: 'rgba(var(--primary-glow), <alpha-value>)' },
        muted: { DEFAULT: 'rgba(var(--muted), <alpha-value>)', foreground: 'rgba(var(--muted-foreground), <alpha-value>)' },
        border: 'rgba(var(--border), <alpha-value>)',
        'brand-purple': 'rgba(var(--brand-purple), <alpha-value>)',
        'brand-blue': 'rgba(var(--brand-blue), <alpha-value>)',
        'brand-soft': 'rgba(var(--brand-soft), <alpha-value>)',
        'dark-surface': 'rgba(var(--dark-surface), <alpha-value>)',
        success: 'rgba(var(--success), <alpha-value>)',
        warning: 'rgba(var(--warning), <alpha-value>)',
        danger: 'rgba(var(--danger), <alpha-value>)',
        'xp-gold': 'rgba(var(--xp-gold), <alpha-value>)',
      },
      boxShadow: {
        glow: '0 10px 40px -10px rgba(178, 59, 231, 0.5)',
        'blue-glow': '0 10px 30px -10px rgba(59, 130, 246, 0.5)',
      },
      animation: {
        'fade-in': 'fade-in 0.4s ease-out',
        'scale-in': 'scale-in 0.2s ease-out',
        'slide-up': 'slide-up 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        float: 'float 4s ease-in-out infinite',
      }
    }
  },
  plugins: [],
}
