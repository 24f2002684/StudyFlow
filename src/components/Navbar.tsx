import React from 'react';
import { Plus, Sparkles, Cloud, Database } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { useTasks } from '../context/TaskContext';

interface NavbarProps {
  onOpenAddTask: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAddTask }) => {
  const { isFirebaseActive } = useTasks();

  return (
    <header className="sticky top-0 z-30 backdrop-blur-md bg-[#faf9f6]/85 dark:bg-[#0f172a]/85 border-b border-slate-200/60 dark:border-slate-800/80 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-400 via-coral-400 to-amber-400 p-0.5 shadow-md shadow-rose-500/15 flex items-center justify-center">
            <div className="w-full h-full bg-white dark:bg-slate-900 rounded-[14px] flex items-center justify-center text-xl">
              🎓
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 bg-clip-text text-transparent">
                StudyFlow
              </span>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60">
                <Sparkles className="w-2.5 h-2.5 mr-1" /> Student Edition
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
              Organize classes, crush deadlines & master focus
            </p>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Storage status badge */}
          <div
            className="hidden md:flex items-center space-x-1.5 px-2.5 py-1 rounded-xl text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200/70 dark:border-slate-700/70"
            title={isFirebaseActive ? 'Connected to Cloud Firestore' : 'Running on Local Storage (Zero Config)'}
          >
            {isFirebaseActive ? (
              <>
                <Cloud className="w-3.5 h-3.5 text-blue-500" />
                <span>Cloud Sync</span>
              </>
            ) : (
              <>
                <Database className="w-3.5 h-3.5 text-emerald-500" />
                <span>Local Persisted</span>
              </>
            )}
          </div>

          <ThemeToggle />

          <button
            onClick={onOpenAddTask}
            className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-medium text-sm shadow-md shadow-rose-500/25 hover:shadow-lg hover:shadow-rose-500/35 transition-all duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-rose-400/50 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add Task</span>
          </button>
        </div>
      </div>
    </header>
  );
};
