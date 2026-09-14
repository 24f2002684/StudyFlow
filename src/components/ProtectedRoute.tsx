import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#f7f7f6] dark:bg-[#0a0a0a] text-neutral-800 dark:text-[#e5e5e5]">
        <div className="relative flex flex-col items-center">
          <div className="relative w-14 h-14 mb-4">
            <div className="absolute inset-0 rounded-2xl bg-[#ff4d6d]/20 animate-ping" />
            <img
              src="/logo_v1.png"
              alt="MUDICHU Logo"
              className="relative w-14 h-14 rounded-2xl object-contain shadow-lg"
            />
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-base font-extrabold tracking-tight">MUDICHU</span>
            <div className="w-1.5 h-1.5 rounded-full bg-[#ff4d6d] animate-bounce" />
          </div>
          <p className="mt-2 text-xs text-neutral-400 dark:text-[#777777]">
            Warming up your study flow...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
