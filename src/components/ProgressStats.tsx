import React from 'react';
import { CheckCircle2, Clock, Flame, Sparkles } from 'lucide-react';
import { useTasks } from '../context/TaskContext';
import { getTodayString } from '../utils/dateUtils';

export const ProgressStats: React.FC = () => {
  const { tasks, pomodoroStats } = useTasks();
  const todayStr = getTodayString();

  // Calculate today's tasks
  const todaysTasks = tasks.filter(
    (t) => (!t.completed && (t.dueDate === todayStr || (t.dueDate && t.dueDate < todayStr))) ||
           (t.completed && t.completedAt && new Date(t.completedAt).toISOString().split('T')[0] === todayStr) ||
           (t.completed && !t.completedAt && t.dueDate === todayStr)
  );

  const completedToday = todaysTasks.filter((t) => t.completed).length;
  const totalToday = todaysTasks.length;
  const progressPercent = totalToday > 0 ? Math.round((completedToday / totalToday) * 100) : 0;

  // Encouraging microcopy generator
  const getEncouragement = () => {
    if (totalToday === 0) return 'No tasks scheduled for today — enjoy your break! 🌴';
    if (progressPercent === 100) return 'All caught up! You totally crushed today! 🎉';
    if (progressPercent >= 75) return 'Almost there! Just a final push! 🚀';
    if (progressPercent >= 50) return 'Halfway through today’s study goals! Keep the momentum! ⚡';
    if (progressPercent > 0) return 'Great start! Small steps lead to high grades 📚';
    return 'Ready to dive in? Pick your top priority and let’s roll! 💡';
  };

  // Generate tomato emojis array
  const tomatoes = Array.from({ length: Math.min(pomodoroStats.completedToday, 10) }, (_, i) => i);

  return (
    <div className="bg-white/90 dark:bg-slate-850/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-3xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-700/80 shadow-sm transition-all duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Progress bar & Motivation */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <span className="p-1.5 rounded-xl bg-rose-50 text-rose-500 dark:bg-rose-950/50 dark:text-rose-400">
                <CheckCircle2 className="w-4 h-4" />
              </span>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Today's Progress
              </h2>
            </div>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200">
              {completedToday} of {totalToday} completed ({progressPercent}%)
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full h-3 bg-slate-100 dark:bg-slate-700/80 rounded-full overflow-hidden p-0.5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-rose-400 via-pink-500 to-amber-400 transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="mt-2 flex items-center text-xs font-medium text-slate-500 dark:text-slate-400">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 mr-1.5 shrink-0" />
            <span>{getEncouragement()}</span>
          </div>
        </div>

        {/* Right: Pomodoro Session Count Pill */}
        <div className="flex sm:items-center gap-3 pt-3 md:pt-0 md:border-l md:border-slate-200/70 md:dark:border-slate-700/70 md:pl-6 shrink-0">
          <div className="flex flex-col">
            <div className="flex items-center space-x-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
              <Flame className="w-3.5 h-3.5 text-rose-500" />
              <span>Focus Sessions</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xl font-extrabold text-slate-900 dark:text-white">
                {pomodoroStats.completedToday}
              </span>
              <div className="flex items-center space-x-0.5 text-base">
                {tomatoes.map((i) => (
                  <span key={i} title="Pomodoro completed" className="transform hover:scale-125 transition-transform">
                    🍅
                  </span>
                ))}
                {pomodoroStats.completedToday === 0 && (
                  <span className="text-xs text-slate-400 italic">No pomodoros yet today</span>
                )}
                {pomodoroStats.completedToday > 10 && (
                  <span className="text-xs font-bold text-rose-500">+{pomodoroStats.completedToday - 10}</span>
                )}
              </div>
            </div>
            <div className="flex items-center text-[11px] text-slate-400 mt-0.5">
              <Clock className="w-3 h-3 mr-1" />
              <span>{pomodoroStats.totalFocusMinutes} mins total focus</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
