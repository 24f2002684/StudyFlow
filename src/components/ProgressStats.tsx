import React from 'react';
import { CheckCircle2, Clock, Flame, Sparkles } from 'lucide-react';
import { useTasks } from '../context/TaskContext';
import { getTodayString } from '../utils/dateUtils';

export const ProgressStats: React.FC = () => {
  const { tasks, pomodoroStats } = useTasks();
  const todayStr = getTodayString();

  // Calculate today's tasks
  const todaysTasks = tasks.filter(
    (t) =>
      (!t.completed && (t.dueDate === todayStr || (t.dueDate && t.dueDate < todayStr))) ||
      (t.completed && t.completedAt && new Date(t.completedAt).toISOString().split('T')[0] === todayStr) ||
      (t.completed && !t.completedAt && t.dueDate === todayStr)
  );

  const completedToday = todaysTasks.filter((t) => t.completed).length;
  const totalToday = todaysTasks.length;
  const progressPercent = totalToday > 0 ? Math.round((completedToday / totalToday) * 100) : 0;

  // Encouraging student microcopy
  const getEncouragement = () => {
    if (totalToday === 0) return 'No tasks due today — take time to recharge! ☕';
    if (progressPercent === 100) return 'All caught up! You totally crushed today! 🙌';
    if (progressPercent >= 75) return 'Almost there! Just a final push! 🚀';
    if (progressPercent >= 50) return 'Halfway through today’s goals! Keep the momentum! ⚡';
    if (progressPercent > 0) return 'Great start! Small steps lead to high grades 📚';
    return 'Ready to dive in? Pick your top priority and let’s roll! 💡';
  };

  const tomatoes = Array.from({ length: Math.min(pomodoroStats.completedToday, 10) }, (_, i) => i);

  return (
    <div className="bg-white dark:bg-[#141414] rounded-2xl p-5 sm:p-6 border border-neutral-200 dark:border-[#262626] shadow-xs transition-colors duration-250">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Progress bar & Encouragement */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <span className="p-1 rounded-lg bg-[#ff4d6d]/10 text-[#ff4d6d]">
                <CheckCircle2 className="w-4 h-4" />
              </span>
              <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-[#e5e5e5]">
                Today's Progress
              </h2>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-[#1f1f1f] text-neutral-700 dark:text-[#e5e5e5] border border-neutral-200/60 dark:border-[#2a2a2a]">
              {completedToday} of {totalToday} completed ({progressPercent}%)
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full h-2.5 bg-neutral-100 dark:bg-[#1f1f1f] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-[#ff4d6d] transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="mt-2.5 flex items-center text-xs text-neutral-500 dark:text-[#8a8a8a]">
            <Sparkles className="w-3.5 h-3.5 text-[#fbbf24] mr-1.5 shrink-0" />
            <span>{getEncouragement()}</span>
          </div>
        </div>

        {/* Right: Focus Tracker */}
        <div className="flex sm:items-center gap-4 pt-3 md:pt-0 md:border-l md:border-neutral-200/80 md:dark:border-[#262626] md:pl-6 shrink-0">
          <div className="flex flex-col">
            <div className="flex items-center space-x-1.5 text-xs font-semibold text-neutral-500 dark:text-[#8a8a8a] mb-1">
              <Flame className="w-3.5 h-3.5 text-[#ff4d6d]" />
              <span>Focus Sessions</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xl font-extrabold text-neutral-900 dark:text-[#e5e5e5]">
                {pomodoroStats.completedToday}
              </span>
              <div className="flex items-center space-x-0.5 text-sm">
                {tomatoes.map((i) => (
                  <span key={i} title="Pomodoro completed">
                    🍅
                  </span>
                ))}
                {pomodoroStats.completedToday === 0 && (
                  <span className="text-xs text-neutral-400 dark:text-[#666666] italic">No pomodoros yet today</span>
                )}
                {pomodoroStats.completedToday > 10 && (
                  <span className="text-xs font-bold text-[#ff4d6d]">+{pomodoroStats.completedToday - 10}</span>
                )}
              </div>
            </div>
            <div className="flex items-center text-[11px] text-neutral-400 dark:text-[#8a8a8a] mt-0.5">
              <Clock className="w-3 h-3 mr-1" />
              <span>{pomodoroStats.totalFocusMinutes} mins total focus</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
