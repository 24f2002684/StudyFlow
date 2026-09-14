import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, SkipForward, Volume2, Sparkles, BookOpen } from 'lucide-react';
import type { PomodoroMode } from '../types';
import { useTasks } from '../context/TaskContext';
import { sounds } from '../utils/sound';

const MODE_CONFIG: Record<
  PomodoroMode,
  { label: string; duration: number; ringColor: string; bgBadge: string }
> = {
  focus: {
    label: 'Focus Session',
    duration: 25 * 60,
    ringColor: '#ff4d6d',
    bgBadge: 'bg-[#ff4d6d]/15 text-[#ff4d6d] border border-[#ff4d6d]/30',
  },
  shortBreak: {
    label: 'Short Break',
    duration: 5 * 60,
    ringColor: '#2dd4bf',
    bgBadge: 'bg-[#2dd4bf]/15 text-[#2dd4bf] border border-[#2dd4bf]/30',
  },
  longBreak: {
    label: 'Long Break',
    duration: 15 * 60,
    ringColor: '#fbbf24',
    bgBadge: 'bg-[#fbbf24]/15 text-[#fbbf24] border border-[#fbbf24]/30',
  },
};

export const PomodoroTimer: React.FC = () => {
  const { tasks, incrementPomodoroSession } = useTasks();
  const [mode, setMode] = useState<PomodoroMode>('focus');
  const [timeLeft, setTimeLeft] = useState<number>(MODE_CONFIG.focus.duration);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [cycleCount, setCycleCount] = useState<number>(0);
  const [attachedTaskId, setAttachedTaskId] = useState<string>('');

  const pendingTasks = tasks.filter((t) => !t.completed);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, mode, cycleCount, attachedTaskId]);

  const handleTimerComplete = () => {
    sounds.playSessionComplete();
    setIsRunning(false);

    if (mode === 'focus') {
      const nextCycle = cycleCount + 1;
      setCycleCount(nextCycle);
      incrementPomodoroSession(25, attachedTaskId || undefined);

      if (nextCycle % 4 === 0) {
        setMode('longBreak');
        setTimeLeft(MODE_CONFIG.longBreak.duration);
      } else {
        setMode('shortBreak');
        setTimeLeft(MODE_CONFIG.shortBreak.duration);
      }
    } else {
      setMode('focus');
      setTimeLeft(MODE_CONFIG.focus.duration);
    }
  };

  const switchMode = (newMode: PomodoroMode) => {
    setIsRunning(false);
    setMode(newMode);
    setTimeLeft(MODE_CONFIG[newMode].duration);
  };

  const toggleRunning = () => {
    setIsRunning((prev) => !prev);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(MODE_CONFIG[mode].duration);
  };

  const skipTimer = () => {
    handleTimerComplete();
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const radius = 88;
  const circumference = 2 * Math.PI * radius;
  const totalDuration = MODE_CONFIG[mode].duration;
  const strokeDashoffset = circumference - ((totalDuration - timeLeft) / totalDuration) * circumference;

  return (
    <div className="bg-white dark:bg-[#141414] rounded-2xl p-6 border border-neutral-200 dark:border-[#262626] shadow-xs transition-colors duration-250">
      {/* Mode Switcher Tabs with minimum 44px touch height */}
      <div className="flex items-center justify-center p-1 rounded-2xl bg-neutral-100 dark:bg-[#0f0f0f] mb-6 border border-neutral-200/60 dark:border-[#262626] gap-1">
        <button
          onClick={() => switchMode('focus')}
          className={`flex-1 min-h-[44px] py-1.5 px-1.5 sm:px-3 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer flex flex-col sm:flex-row items-center justify-center text-center leading-tight ${
            mode === 'focus'
              ? 'bg-white dark:bg-[#1f1f1f] text-[#ff4d6d] shadow-xs'
              : 'text-neutral-500 dark:text-[#8a8a8a] hover:text-neutral-800 dark:hover:text-[#e5e5e5]'
          }`}
        >
          <span>🍅 Focus</span>
          <span className="text-[10px] sm:text-[11px] sm:ml-1 font-normal opacity-75">(25m)</span>
        </button>
        <button
          onClick={() => switchMode('shortBreak')}
          className={`flex-1 min-h-[44px] py-1.5 px-1.5 sm:px-3 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer flex flex-col sm:flex-row items-center justify-center text-center leading-tight ${
            mode === 'shortBreak'
              ? 'bg-white dark:bg-[#1f1f1f] text-[#2dd4bf] shadow-xs'
              : 'text-neutral-500 dark:text-[#8a8a8a] hover:text-neutral-800 dark:hover:text-[#e5e5e5]'
          }`}
        >
          <span>☕ Short</span>
          <span className="text-[10px] sm:text-[11px] sm:ml-1 font-normal opacity-75">(5m)</span>
        </button>
        <button
          onClick={() => switchMode('longBreak')}
          className={`flex-1 min-h-[44px] py-1.5 px-1.5 sm:px-3 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer flex flex-col sm:flex-row items-center justify-center text-center leading-tight ${
            mode === 'longBreak'
              ? 'bg-white dark:bg-[#1f1f1f] text-[#fbbf24] shadow-xs'
              : 'text-neutral-500 dark:text-[#8a8a8a] hover:text-neutral-800 dark:hover:text-[#e5e5e5]'
          }`}
        >
          <span>🧘 Long</span>
          <span className="text-[10px] sm:text-[11px] sm:ml-1 font-normal opacity-75">(15m)</span>
        </button>
      </div>

      {/* Circular Progress Ring */}
      <div className="relative flex flex-col items-center justify-center my-2">
        <svg className="w-52 h-52 -rotate-90 transform" viewBox="0 0 200 200">
          <circle
            cx="100"
            cy="100"
            r={radius}
            stroke="currentColor"
            strokeWidth="7"
            fill="transparent"
            className="text-neutral-100 dark:text-[#202020]"
          />
          <circle
            cx="100"
            cy="100"
            r={radius}
            stroke={MODE_CONFIG[mode].ringColor}
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            fill="transparent"
            className="transition-all duration-500 ease-out"
          />
        </svg>

        {/* Center Countdown */}
        <div className="absolute flex flex-col items-center justify-center">
          <span className="text-4xl sm:text-5xl font-extrabold tracking-tight font-mono text-neutral-900 dark:text-[#e5e5e5]">
            {formattedTime}
          </span>
          <span
            className={`mt-1.5 text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${MODE_CONFIG[mode].bgBadge}`}
          >
            {MODE_CONFIG[mode].label}
          </span>
          {mode === 'focus' && (
            <span className="text-[11px] text-neutral-400 dark:text-[#8a8a8a] mt-1">
              Cycle {(cycleCount % 4) + 1} of 4
            </span>
          )}
        </div>
      </div>

      {/* Controls with 48x48px thumb-friendly buttons and 12-16px gap */}
      <div className="flex items-center justify-center gap-3 sm:gap-4 mt-6">
        <button
          onClick={resetTimer}
          className="w-12 h-12 min-w-[44px] min-h-[44px] rounded-full bg-neutral-100 dark:bg-[#1a1a1a] border border-neutral-200 dark:border-[#2a2a2a] text-neutral-600 dark:text-[#8a8a8a] hover:text-neutral-900 dark:hover:text-[#e5e5e5] flex items-center justify-center transition-all active:scale-90 active:bg-[#ff4d6d]/15 cursor-pointer"
          title="Reset timer"
          aria-label="Reset timer"
        >
          <RotateCcw className="w-5 h-5" />
        </button>

        <button
          onClick={toggleRunning}
          className={`min-h-[48px] px-7 py-3 rounded-full font-bold text-sm sm:text-base flex items-center space-x-2.5 shadow-md transition-all active:scale-95 cursor-pointer ${
            isRunning
              ? 'bg-[#fbbf24] hover:bg-[#f59e0b] text-neutral-950 shadow-[#fbbf24]/20'
              : 'bg-[#ff4d6d] hover:bg-[#ff3357] text-white shadow-[#ff4d6d]/25'
          }`}
          aria-label={isRunning ? 'Pause timer' : 'Start timer'}
        >
          {isRunning ? (
            <>
              <Pause className="w-5 h-5 fill-current" />
              <span>Pause</span>
            </>
          ) : (
            <>
              <Play className="w-5 h-5 fill-current" />
              <span>Start</span>
            </>
          )}
        </button>

        <button
          onClick={skipTimer}
          className="w-12 h-12 min-w-[44px] min-h-[44px] rounded-full bg-neutral-100 dark:bg-[#1a1a1a] border border-neutral-200 dark:border-[#2a2a2a] text-neutral-600 dark:text-[#8a8a8a] hover:text-neutral-900 dark:hover:text-[#e5e5e5] flex items-center justify-center transition-all active:scale-90 active:bg-[#ff4d6d]/15 cursor-pointer"
          title="Skip session"
          aria-label="Skip session"
        >
          <SkipForward className="w-5 h-5" />
        </button>

        <button
          onClick={() => sounds.playSessionComplete()}
          className="w-12 h-12 min-w-[44px] min-h-[44px] rounded-full bg-neutral-100 dark:bg-[#1a1a1a] border border-neutral-200 dark:border-[#2a2a2a] text-neutral-500 dark:text-[#8a8a8a] hover:text-[#ff4d6d] flex items-center justify-center transition-all active:scale-90 active:bg-[#ff4d6d]/15 cursor-pointer"
          title="Test sound alert"
          aria-label="Test sound alert"
        >
          <Volume2 className="w-5 h-5" />
        </button>
      </div>

      {/* Attach to Task Selector */}
      <div className="mt-6 pt-5 border-t border-neutral-200/80 dark:border-[#262626]">
        <label className="flex items-center space-x-1.5 text-xs font-semibold text-neutral-600 dark:text-[#8a8a8a] mb-2">
          <BookOpen className="w-3.5 h-3.5 text-[#ff4d6d]" />
          <span>Attach to current study task:</span>
        </label>
        <select
          value={attachedTaskId}
          onChange={(e) => setAttachedTaskId(e.target.value)}
          className="w-full min-h-[44px] text-xs rounded-2xl bg-neutral-50 dark:bg-[#0f0f0f] border border-neutral-200 dark:border-[#262626] px-3.5 py-2.5 text-neutral-800 dark:text-[#e5e5e5] focus:outline-none focus:border-[#ff4d6d] transition-colors cursor-pointer"
        >
          <option value="">No task linked (General Study)</option>
          {pendingTasks.map((t) => (
            <option key={t.id} value={t.id}>
              {t.subject ? `[${t.subject}] ` : ''}
              {t.title}
            </option>
          ))}
        </select>
        {attachedTaskId && (
          <p className="text-[11px] text-[#2dd4bf] mt-2 flex items-center">
            <Sparkles className="w-3 h-3 mr-1 shrink-0" />
            <span>Completing this session logs +1 🍅 to this task!</span>
          </p>
        )}
      </div>
    </div>
  );
};
