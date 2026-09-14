import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-xl bg-white dark:bg-[#141414] border border-neutral-200 dark:border-[#262626] text-neutral-600 dark:text-[#e5e5e5] hover:text-[#ff4d6d] dark:hover:text-[#ff4d6d] hover:border-[#ff4d6d]/40 dark:hover:border-[#ff4d6d]/40 shadow-xs transition-all active:scale-95 cursor-pointer"
      title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
      aria-label="Toggle Theme"
    >
      <div className="w-4 h-4 flex items-center justify-center">
        {theme === 'light' ? (
          <Moon className="w-4 h-4 text-neutral-700 transition-transform duration-200" />
        ) : (
          <Sun className="w-4 h-4 text-[#fbbf24] transition-transform duration-200" />
        )}
      </div>
    </button>
  );
};
