import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle({ className = "" }) {
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <button
      onClick={toggleDarkMode}
      type="button"
      className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-center ${
        darkMode 
          ? 'bg-slate-800/80 border-slate-700 text-amber-400 hover:bg-slate-700/80 hover:border-slate-600' 
          : 'bg-white/80 border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
      } ${className}`}
      aria-label="Toggle dark mode"
      title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      {darkMode ? (
        <Sun className="w-5 h-5 transition-transform hover:rotate-45" />
      ) : (
        <Moon className="w-5 h-5 transition-transform hover:-rotate-12" />
      )}
    </button>
  );
}
