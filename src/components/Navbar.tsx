import React, { useState, useEffect } from 'react';
import { Plus, MessageSquarePlus, Cloud, Database, LogOut, Menu, X, CheckCircle2 } from 'lucide-react';
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleConfirmLogout = async () => {
    setIsLogoutOpen(false);
    setIsMobileMenuOpen(false);
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
      <header className="sticky top-0 z-30 backdrop-blur-md bg-[#f7f7f6]/95 dark:bg-[#0a0a0a]/95 border-b border-neutral-200/80 dark:border-[#262626] transition-colors duration-250">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between">
          {/* Brand */}
          <div
            className="flex items-center space-x-3 cursor-pointer select-none py-1 -ml-1 pl-1"
            onClick={() => {
              setIsMobileMenuOpen(false);
              navigate('/app');
            }}
          >
            <img
              src="/logo_v1.png"
              alt="MUDICHU Logo"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl object-contain shadow-xs shrink-0"
            />
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-lg sm:text-xl font-extrabold tracking-tight text-neutral-900 dark:text-[#e5e5e5]">
                  MUDICHU
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#ff4d6d]/10 text-[#ff4d6d] border border-[#ff4d6d]/20">
                  Student
                </span>
              </div>
              <p className="text-[11px] text-neutral-500 dark:text-[#8a8a8a] hidden md:block">
                Organize classes, crush deadlines & master focus
              </p>
            </div>
          </div>

          {/* Desktop Navigation (sm and up) */}
          <div className="hidden sm:flex items-center space-x-3">
            {/* Storage status badge */}
            <div
              className="hidden md:flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-neutral-100 dark:bg-[#141414] text-neutral-600 dark:text-[#8a8a8a] border border-neutral-200 dark:border-[#262626]"
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
              className="min-h-[44px] inline-flex items-center space-x-2 px-3.5 py-2 rounded-full bg-white dark:bg-[#141414] border border-neutral-200 dark:border-[#262626] text-neutral-700 dark:text-[#e5e5e5] hover:text-[#ff4d6d] dark:hover:text-[#ff4d6d] hover:border-[#ff4d6d]/40 dark:hover:border-[#ff4d6d]/40 text-xs font-semibold shadow-xs transition-all active:scale-95 cursor-pointer"
              title="Send suggestions or report bugs"
            >
              <MessageSquarePlus className="w-4 h-4 text-[#ff4d6d]" />
              <span>Feedback</span>
            </button>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Add Task Button */}
            <button
              onClick={onOpenAddTask}
              className="min-h-[44px] inline-flex items-center space-x-2 px-5 py-2.5 rounded-full bg-[#ff4d6d] hover:bg-[#ff3357] text-white font-bold text-xs sm:text-sm shadow-sm hover:shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Add Task</span>
            </button>

            {/* User Profile & Logout */}
            {user && (
              <div className="flex items-center space-x-2 pl-2 border-l border-neutral-200 dark:border-[#262626]">
                <div
                  className="flex items-center space-x-2 py-1 px-2 rounded-full bg-neutral-100/80 dark:bg-[#161616] border border-neutral-200/80 dark:border-[#262626]"
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
                  className="w-11 h-11 rounded-full flex items-center justify-center text-neutral-400 hover:text-[#ff4d6d] dark:text-[#8a8a8a] dark:hover:text-[#ff4d6d] hover:bg-neutral-100 dark:hover:bg-[#1a1a1a] transition-all active:scale-95 active:bg-[#ff4d6d]/10 cursor-pointer"
                  title="Log out of MUDICHU"
                  aria-label="Log out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Mobile Right Controls (< sm) */}
          <div className="flex sm:hidden items-center space-x-2.5">
            {/* Quick Mobile Theme Toggle */}
            <ThemeToggle />

            {/* Mobile Menu Trigger Button (44x44px target) */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="w-11 h-11 rounded-full bg-white dark:bg-[#141414] border border-neutral-200 dark:border-[#262626] text-neutral-700 dark:text-[#e5e5e5] hover:text-[#ff4d6d] dark:hover:text-[#ff4d6d] hover:border-[#ff4d6d]/40 dark:hover:border-[#ff4d6d]/40 shadow-xs flex items-center justify-center active:scale-95 active:bg-[#ff4d6d]/10 transition-all cursor-pointer"
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 text-[#ff4d6d]" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Overflow Drawer Card */}
        {isMobileMenuOpen && (
          <div className="sm:hidden border-t border-neutral-200 dark:border-[#262626] bg-[#f7f7f6]/98 dark:bg-[#0f0f0f]/98 backdrop-blur-xl px-4 py-5 shadow-2xl space-y-4 animate-in fade-in duration-150">
            {/* User Profile Card */}
            {user && (
              <div className="p-3.5 rounded-2xl bg-white dark:bg-[#161616] border border-neutral-200 dark:border-[#282828] flex items-center space-x-3 shadow-xs">
                {photoURL && !avatarFailed ? (
                  <img
                    src={photoURL}
                    alt={user.name || 'User avatar'}
                    referrerPolicy="no-referrer"
                    onError={() => setAvatarFailed(true)}
                    className="w-11 h-11 rounded-full object-cover shrink-0 border border-neutral-200 dark:border-[#333333]"
                  />
                ) : (
                  <div className="w-11 h-11 rounded-full bg-[#ff4d6d] text-white text-base font-bold flex items-center justify-center shrink-0">
                    {firstInitial}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-bold text-neutral-900 dark:text-[#e5e5e5] truncate">
                    {user.name || 'Student'}
                  </div>
                  <div className="text-xs text-neutral-500 dark:text-[#8a8a8a] truncate">
                    {user.email || 'Google Account'}
                  </div>
                </div>
                <div className="shrink-0 flex items-center space-x-1 px-2 py-1 rounded-full text-[10px] font-semibold bg-[#2dd4bf]/10 text-[#2dd4bf] border border-[#2dd4bf]/20">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Active</span>
                </div>
              </div>
            )}

            {/* Storage Status */}
            <div className="flex items-center justify-between px-3.5 py-2.5 rounded-2xl bg-white dark:bg-[#141414] border border-neutral-200 dark:border-[#262626] text-xs">
              <span className="text-neutral-500 dark:text-[#8a8a8a] font-medium">Database Persistence</span>
              <div className="flex items-center space-x-1.5 font-semibold text-neutral-700 dark:text-[#e5e5e5]">
                {isFirebaseActive ? (
                  <>
                    <Cloud className="w-4 h-4 text-[#2dd4bf]" />
                    <span>Cloud Sync</span>
                  </>
                ) : (
                  <>
                    <Database className="w-4 h-4 text-[#8a8a8a]" />
                    <span>Local Storage</span>
                  </>
                )}
              </div>
            </div>

            {/* Mobile Actions Menu List */}
            <div className="space-y-2.5 pt-1">
              {/* Feedback Button */}
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenFeedback();
                }}
                className="w-full min-h-[44px] flex items-center justify-center space-x-2 px-4 py-3 rounded-full bg-white dark:bg-[#141414] border border-neutral-200 dark:border-[#262626] text-neutral-800 dark:text-[#e5e5e5] hover:text-[#ff4d6d] font-semibold text-sm shadow-xs active:scale-[0.98] transition-all cursor-pointer"
              >
                <MessageSquarePlus className="w-4 h-4 text-[#ff4d6d]" />
                <span>Feedback & Suggestions</span>
              </button>

              {/* Log Out Button */}
              {user && (
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsLogoutOpen(true);
                  }}
                  className="w-full min-h-[44px] flex items-center justify-center space-x-2 px-4 py-3 rounded-full bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 text-[#ff4d6d] font-semibold text-sm active:scale-[0.98] transition-all cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out</span>
                </button>
              )}
            </div>
          </div>
        )}
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
