import React, { useState, useEffect } from 'react';
import { Plus, MessageSquarePlus, Cloud, Database, LogOut } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { useTasks } from '../context/TaskContext';
import { useAuth } from '../context/AuthContext';
import { LogoutModal } from './LogoutModal';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase/config';

interface NavbarProps {
  onOpenAddTask: () => void;
  onOpenFeedback: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAddTask, onOpenFeedback }) => {
  const { isFirebaseActive } = useTasks();
  const { user, logout } = useAuth();
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const navigate = useNavigate();

  const handleConfirmLogout = async () => {
    setIsLogoutOpen(false);
    await logout();
    navigate('/');
  };

  const [avatarFailed, setAvatarFailed] = useState(false);
  const photoURL = user?.photoURL || auth?.currentUser?.photoURL || null;

  useEffect(() => {
    setAvatarFailed(false);
  }, [photoURL]);

  const firstName = user?.name ? user.name.split(' ')[0] : (user?.email?.split('@')[0] || 'Student');
  const firstInitial = (user?.name?.trim().charAt(0) || user?.email?.trim().charAt(0) || 'S').toUpperCase();

  return (
    <>
      <header className="sticky top-0 z-30 backdrop-blur-md bg-[#f7f7f6]/90 dark:bg-[#0a0a0a]/90 border-b border-neutral-200/80 dark:border-[#262626] transition-colors duration-250">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/app')}>
            <img
              src="/logo_v1.png"
              alt="MUDICHU Logo"
              className="w-9 h-9 rounded-xl object-contain shadow-xs"
            />
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-extrabold tracking-tight text-neutral-900 dark:text-[#e5e5e5]">
                  MUDICHU
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider bg-neutral-100 dark:bg-[#1a1a1a] text-neutral-600 dark:text-[#8a8a8a] border border-neutral-200 dark:border-[#262626]">
                  Student
                </span>
              </div>
              <p className="text-[11px] text-neutral-500 dark:text-[#8a8a8a] hidden sm:block">
                Organize classes, crush deadlines & master focus
              </p>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Storage status badge */}
            <div
              className="hidden md:flex items-center space-x-1.5 px-2.5 py-1 rounded-xl text-xs font-medium bg-neutral-100 dark:bg-[#141414] text-neutral-600 dark:text-[#8a8a8a] border border-neutral-200 dark:border-[#262626]"
              title={isFirebaseActive ? 'Connected to Cloud Firestore' : 'Running with local persistence'}
            >
              {isFirebaseActive ? (
                <>
                  <Cloud className="w-3.5 h-3.5 text-[#2dd4bf]" />
                  <span>Cloud Sync</span>
                </>
              ) : (
                <>
                  <Database className="w-3.5 h-3.5 text-[#8a8a8a]" />
                  <span>Local Storage</span>
                </>
              )}
            </div>

            {/* Feedback Button */}
            <button
              onClick={onOpenFeedback}
              className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-white dark:bg-[#141414] border border-neutral-200 dark:border-[#262626] text-neutral-700 dark:text-[#e5e5e5] hover:text-[#ff4d6d] dark:hover:text-[#ff4d6d] hover:border-[#ff4d6d]/40 dark:hover:border-[#ff4d6d]/40 text-xs font-medium shadow-xs transition-all active:scale-95 cursor-pointer"
              title="Send suggestions or report bugs"
            >
              <MessageSquarePlus className="w-4 h-4 text-[#ff4d6d]" />
              <span className="hidden sm:inline">Feedback</span>
            </button>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Add Task Button */}
            <button
              onClick={onOpenAddTask}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-[#ff4d6d] hover:bg-[#ff3357] text-white font-semibold text-xs sm:text-sm shadow-xs transition-all active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Add Task</span>
            </button>

            {/* User Profile & Logout */}
            {user && (
              <div className="flex items-center space-x-2 pl-1 border-l border-neutral-200 dark:border-[#262626]">
                <div
                  className="flex items-center space-x-2 py-1 px-1.5 rounded-xl bg-neutral-100/80 dark:bg-[#161616] border border-neutral-200/80 dark:border-[#262626]"
                  title={`Signed in as ${user.email || user.name}`}
                >
                  {photoURL && !avatarFailed ? (
                    <img
                      src={photoURL}
                      alt={user.name || 'User avatar'}
                      referrerPolicy="no-referrer"
                      onError={() => setAvatarFailed(true)}
                      className="w-7 h-7 rounded-full object-cover shrink-0"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-[#ff4d6d] text-white text-xs font-bold flex items-center justify-center shrink-0">
                      {firstInitial}
                    </div>
                  )}
                  <span className="text-xs font-semibold text-neutral-800 dark:text-[#e5e5e5] hidden lg:inline pr-1">
                    {firstName}
                  </span>
                </div>

                <button
                  onClick={() => setIsLogoutOpen(true)}
                  className="p-2 rounded-xl text-neutral-400 hover:text-[#ff4d6d] dark:text-[#8a8a8a] dark:hover:text-[#ff4d6d] hover:bg-neutral-100 dark:hover:bg-[#1a1a1a] transition-colors cursor-pointer"
                  title="Log out of MUDICHU"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Logout confirmation dialog */}
      <LogoutModal
        isOpen={isLogoutOpen}
        onClose={() => setIsLogoutOpen(false)}
        onConfirm={handleConfirmLogout}
      />
    </>
  );
};
