import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, SkipForward, Volume2, Sparkles, BookOpen } from 'lucide-react';
import type { PomodoroMode } from '../types';
import { useTasks } from '../context/TaskContext';
import { sounds } from '../utils/sound';

const MODE_CONFIG: Record<
  PomodoroMode,
  { label: string; duration: number; color: string; ringColor: string; bgBadge: string }
> = {
  focus: {
    label: 'Focus Session',
    duration: 25 * 60,
    color: 'text-rose-500',
    ringColor: '#f43f5e', // Rose-500
    bgBadge: 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300',
  },
  shortBreak: {
    label: 'Short Break',
    duration: 5 * 60,
    color: 'text-emerald-500',
    ringColor: '#10b981', // Emerald-500
    bgBadge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300',
  },
  longBreak: {
    label: 'Long Break',
    duration: 15 * 60,
    color: 'text-indigo-500',
    ringColor: '#6366f1', // Indigo-500
    bgBadge: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300',
  },
};

export const PomodoroTimer: React.FC = () => {
  const { tasks, incrementPomodoroSession } = useTasks();
  const [mode, setMode] = useState<PomodoroMode>('focus');
  const [timeLeft, setTimeLeft] = useState<number>(MODE_CONFIG.focus.duration);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [cycleCount, setCycleCount] = useState<number>(0);
  const [attachedTaskId, setAttachedTaskId] = useState<string>('');

  // Uncompleted tasks for dropdown
  const pendingTasks = tasks.filter((t) => !t.completed);

  // Interval reference
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            // Timer finished
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

      // Trigger break
      if (nextCycle % 4 === 0) {
        setMode('longBreak');
        setTimeLeft(MODE_CONFIG.longBreak.duration);
      } else {
        setMode('shortBreak');
        setTimeLeft(MODE_CONFIG.shortBreak.duration);
      }
    } else {
      // Break finished, return to focus
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

  // Format MM:SS
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  // SVG circular ring calculation
  const radius = 88;
  const circumference = 2 * Math.PI * radius;
  const totalDuration = MODE_CONFIG[mode].duration;
  const strokeDashoffset = circumference - ((totalDuration - timeLeft) / totalDuration) * circumference;

  return (
    <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-md rounded-3xl p-6 border border-slate-200/80 dark:border-slate-700/80 shadow-sm transition-all duration-300">
      {/* Mode Switcher Tabs */}
      <div className="flex items-center justify-center p-1 rounded-2xl bg-slate-100 dark:bg-slate-900/60 mb-6">
        <button
          onClick={() => switchMode('focus')}
          className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
            mode === 'focus'
              ? 'bg-white dark:bg-slate-800 text-rose-500 shadow-xs'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          🍅 Focus (25m)
        </button>
        <button
          onClick={() => switchMode('shortBreak')}
          className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
            mode === 'shortBreak'
              ? 'bg-white dark:bg-slate-800 text-emerald-500 shadow-xs'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          ☕ Short (5m)
        </button>
        <button
          onClick={() => switchMode('longBreak')}
          className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
            mode === 'longBreak'
              ? 'bg-white dark:bg-slate-800 text-indigo-500 shadow-xs'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          🧘 Long (15m)
        </button>
      </div>

      {/* Circular Progress Ring */}
      <div className="relative flex flex-col items-center justify-center my-2">
        <svg className="w-52 h-52 -rotate-90 transform" viewBox="0 0 200 200">
          {/* Background circle */}
          <circle
            cx="100"
            cy="100"
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-slate-100 dark:text-slate-700/60"
          />
          {/* Progress circle */}
          <circle
            cx="100"
            cy="100"
            r={radius}
            stroke={MODE_CONFIG[mode].ringColor}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            fill="transparent"
            className="transition-all duration-500 ease-out"
          />
        </svg>

        {/* Center Countdown & Details */}
        <div className="absolute flex flex-col items-center justify-center">
          <span className="text-4xl sm:text-5xl font-extrabold tracking-tight font-mono text-slate-900 dark:text-white">
            {formattedTime}
          </span>
          <span
            className={`mt-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${MODE_CONFIG[mode].bgBadge}`}
          >
            {MODE_CONFIG[mode].label}
          </span>
          {mode === 'focus' && (
            <span className="text-[11px] text-slate-400 mt-1">
              Cycle {(cycleCount % 4) + 1} of 4
            </span>
          )}
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex items-center justify-center space-x-3 mt-5">
        <button
          onClick={resetTimer}
          className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-700/70 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-all duration-200 active:scale-95 cursor-pointer"
          title="Reset timer"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <button
          onClick={toggleRunning}
          className={`flex items-center space-x-2 px-6 py-3 rounded-2xl font-bold text-white shadow-md transition-all duration-200 active:scale-95 cursor-pointer ${
            isRunning
              ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/30'
              : 'bg-rose-500 hover:bg-rose-600 shadow-rose-500/30'
          }`}
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
          className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-700/70 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-all duration-200 active:scale-95 cursor-pointer"
          title="Skip session"
        >
          <SkipForward className="w-4 h-4" />
        </button>

        <button
          onClick={() => sounds.playSessionComplete()}
          className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-700/70 text-slate-500 dark:text-slate-400 hover:text-amber-500 transition-all duration-200 active:scale-95 cursor-pointer"
          title="Test sound alert"
        >
          <Volume2 className="w-4 h-4" />
        </button>
      </div>

      {/* Attach to Task Selector */}
      <div className="mt-6 pt-5 border-t border-slate-200/70 dark:border-slate-700/70">
        <label className="flex items-center space-x-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">
          <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
          <span>Attach to current study task:</span>
        </label>
        <select
          value={attachedTaskId}
          onChange={(e) => setAttachedTaskId(e.target.value)}
          className="w-full text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-2.5 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/30 transition-colors"
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
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1.5 flex items-center">
            <Sparkles className="w-3 h-3 mr-1" />
            Completing this session will log +1 🍅 to this task!
          </p>
        )}
      </div>
    </div>
  );
};
