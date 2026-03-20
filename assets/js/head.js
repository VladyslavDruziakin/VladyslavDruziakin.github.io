window.tailwind = window.tailwind || {};
window.tailwind.config = {
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      colors: {
        neon: {
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
        },
        matrix: {
          400: '#4ade80',
          500: '#22c55e',
        },
      },
      boxShadow: {
        lightneon: '0 0 0 1px rgba(6,182,212,.35), 0 0 28px rgba(6,182,212,.25)',
        darkneon: '0 0 0 1px rgba(34,197,94,.4), 0 0 30px rgba(34,197,94,.28)',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        glitchJitter: {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '20%': { transform: 'translate(0.4px, -0.3px)' },
          '40%': { transform: 'translate(-0.6px, 0.4px)' },
          '60%': { transform: 'translate(0.5px, 0.2px)' },
          '80%': { transform: 'translate(-0.3px, -0.4px)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        bgDriftA: {
          '0%, 100%': { transform: 'translate3d(0, 0, 0) scale(1)', opacity: '0.65' },
          '20%': { transform: 'translate3d(72px, 34px, 0) scale(1.08)', opacity: '0.92' },
          '45%': { transform: 'translate3d(156px, -62px, 0) scale(0.92)', opacity: '0.5' },
          '70%': { transform: 'translate3d(38px, -104px, 0) scale(1.12)', opacity: '0.88' },
        },
        bgDriftB: {
          '0%, 100%': { transform: 'translate3d(0, 0, 0) scale(1)', opacity: '0.55' },
          '18%': { transform: 'translate3d(-64px, 42px, 0) scale(0.94)', opacity: '0.82' },
          '50%': { transform: 'translate3d(-168px, -36px, 0) scale(1.14)', opacity: '0.42' },
          '78%': { transform: 'translate3d(-52px, -92px, 0) scale(1.02)', opacity: '0.8' },
        },
        neonPulse: {
          '0%, 100%': { filter: 'drop-shadow(0 0 0px rgba(6,182,212,0.0))' },
          '50%': { filter: 'drop-shadow(0 0 12px rgba(6,182,212,0.45))' },
        },
        syncFlow: {
          '0%': { left: '0%' },
          '100%': { left: 'calc(100% - 0.5rem)' },
        },
      },
      animation: {
        'fade-up': 'fadeUp .7s ease-out both',
        'glitch-jitter': 'glitchJitter 2.4s steps(2, end) infinite',
        float: 'float 5s ease-in-out infinite',
        'bg-drift-a': 'bgDriftA 18s ease-in-out infinite',
        'bg-drift-b': 'bgDriftB 21s ease-in-out infinite',
        'neon-pulse': 'neonPulse 3s ease-in-out infinite',
        'sync-flow': 'syncFlow 1.4s ease-in-out infinite alternate',
      },
    },
  },
};

(() => {
  let savedTheme = null;
  try {
    savedTheme = localStorage.getItem('theme');
  } catch (_error) {
    savedTheme = null;
  }
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    document.documentElement.classList.add('dark');
  }
})();
