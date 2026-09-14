import React from 'react';
import { LogOut, X } from 'lucide-react';

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const LogoutModal: React.FC<LogoutModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-sm rounded-3xl bg-white dark:bg-[#141414] p-6 shadow-2xl border border-neutral-200 dark:border-[#262626] transition-all transform scale-100">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-[#222222]">
          <div className="flex items-center space-x-2 text-[#ff4d6d]">
            <LogOut className="w-5 h-5" />
            <h3 className="text-base font-bold text-neutral-900 dark:text-[#e5e5e5]">
              Log Out
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-600 dark:text-[#8a8a8a] dark:hover:text-[#e5e5e5] hover:bg-neutral-100 dark:hover:bg-[#1f1f1f] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="py-4 text-sm text-neutral-600 dark:text-[#8a8a8a] leading-relaxed">
          Log out of MUDICHU? Your tasks and Pomodoro sessions remain safely saved to your Google account.
        </div>

        <div className="flex items-center justify-end space-x-2.5 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-600 dark:text-[#8a8a8a] hover:text-neutral-900 dark:hover:text-[#e5e5e5] hover:bg-neutral-100 dark:hover:bg-[#1f1f1f] transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-5 py-2 rounded-xl bg-[#ff4d6d] hover:bg-[#ff3357] text-white text-xs font-semibold shadow-xs transition-all active:scale-95 cursor-pointer"
          >
            Confirm Log Out
          </button>
        </div>
      </div>
    </div>
  );
};
