import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/useTheme';

interface ThemeToggleProps {
  className?: string;
  compact?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '', compact = false }) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  if (compact) {
    return (
      <button
        onClick={toggleTheme}
        type="button"
        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 cursor-pointer ${
          isDark
            ? 'bg-slate-950/80 text-indigo-400 hover:text-indigo-300 border border-slate-800 hover:bg-slate-900 shadow-md'
            : 'bg-white text-amber-600 hover:text-amber-700 border border-[#DDD6C8] hover:bg-[#FAF8F5] shadow-xs'
        } ${className}`}
        title={isDark ? 'Switch to Warm Beige Light Mode' : 'Switch to Executive Dark Mode'}
        aria-label={isDark ? 'Switch to Warm Beige Light Mode' : 'Switch to Executive Dark Mode'}
      >
        {isDark ? (
          <Moon className="w-4 h-4 transition-transform duration-300 hover:rotate-12" />
        ) : (
          <Sun className="w-4 h-4 transition-transform duration-300 hover:rotate-45" />
        )}
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className={`relative inline-flex items-center gap-1.5 p-1 rounded-xl transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 cursor-pointer ${
        isDark
          ? 'bg-slate-800/90 text-slate-300 hover:text-white border border-slate-700/80 shadow-inner'
          : 'bg-[#EDE8DE] text-slate-700 hover:text-slate-900 border border-[#DBD4C6] shadow-sm'
      } ${className}`}
      title={isDark ? 'Switch to Warm Beige Light Mode' : 'Switch to Executive Dark Mode'}
      aria-label={isDark ? 'Switch to Warm Beige Light Mode' : 'Switch to Executive Dark Mode'}
    >
      {/* Light option indicator */}
      <div
        className={`flex items-center justify-center w-7 h-7 rounded-lg transition-all duration-300 ${
          !isDark
            ? 'bg-[#FBF9F5] text-amber-600 shadow-sm border border-[#E0D9CB]'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <Sun className="w-3.5 h-3.5 transition-transform duration-300 rotate-0" />
      </div>

      {/* Dark option indicator */}
      <div
        className={`flex items-center justify-center w-7 h-7 rounded-lg transition-all duration-300 ${
          isDark
            ? 'bg-slate-900 text-indigo-400 shadow-sm border border-slate-700/80'
            : 'text-slate-500 hover:text-slate-700'
        }`}
      >
        <Moon className="w-3.5 h-3.5 transition-transform duration-300 rotate-0" />
      </div>
    </button>
  );
};
