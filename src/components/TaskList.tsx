import React, { useState } from 'react';
import { Search, Filter, CalendarDays, Sun, Clock, CheckCircle2 } from 'lucide-react';
import type { Task } from '../types';
import { useTasks } from '../context/TaskContext';
import { TaskGroup } from './TaskGroup';
import { getTaskGroup } from '../utils/dateUtils';

interface TaskListProps {
  onEditTask: (task: Task) => void;
  onOpenAddTask: () => void;
}

export const TaskList: React.FC<TaskListProps> = ({ onEditTask, onOpenAddTask }) => {
  const { tasks, isLoading } = useTasks();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');

  // Extract unique subjects
  const allSubjects = Array.from(
    new Set(tasks.map((t) => t.subject).filter((s): s is string => Boolean(s)))
  );

  // Filter tasks
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.subject && task.subject.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesSubject =
      selectedSubject === 'all' || task.subject === selectedSubject;

    const matchesPriority =
      selectedPriority === 'all' || task.priority === selectedPriority;

    return matchesSearch && matchesSubject && matchesPriority;
  });

  const todayTasks = filteredTasks.filter((t) => getTaskGroup(t) === 'today');
  const thisWeekTasks = filteredTasks.filter((t) => getTaskGroup(t) === 'this_week');
  const laterTasks = filteredTasks.filter((t) => getTaskGroup(t) === 'later');
  const completedTasks = filteredTasks.filter((t) => getTaskGroup(t) === 'completed');

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-8 h-8 border-3 border-[#ff4d6d] border-t-transparent rounded-full animate-spin" />
        <p className="mt-3 text-xs text-neutral-500 dark:text-[#8a8a8a] font-medium">
          Loading your study flow...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Search & Filters */}
      <div className="bg-white dark:bg-[#141414] rounded-2xl p-3 sm:p-4 border border-neutral-200 dark:border-[#262626] shadow-xs space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-neutral-400 dark:text-[#666666] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search tasks, subjects, or notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 sm:py-2 text-sm rounded-full bg-neutral-50 dark:bg-[#0f0f0f] border border-neutral-200 dark:border-[#262626] text-neutral-900 dark:text-[#e5e5e5] placeholder-neutral-400 dark:placeholder-[#555555] focus:outline-none focus:border-[#ff4d6d] transition-all min-h-[44px]"
          />
        </div>

        {/* Filter Controls: Swipeable Horizontal Pill Row on Mobile */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-0.5">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 sm:pb-0 -mx-1 px-1 sm:mx-0 sm:px-0 sm:flex-wrap">
            <div className="flex items-center space-x-1 text-xs font-semibold text-neutral-400 dark:text-[#777777] shrink-0 mr-1">
              <Filter className="w-3.5 h-3.5 text-[#ff4d6d]" />
              <span>Filter:</span>
            </div>

            <button
              onClick={() => setSelectedSubject('all')}
              className={`min-h-[40px] px-3.5 py-2 rounded-full text-xs font-semibold transition-all shrink-0 active:scale-95 cursor-pointer border ${
                selectedSubject === 'all'
                  ? 'bg-[#ff4d6d] text-white border-[#ff4d6d] shadow-xs'
                  : 'bg-neutral-100 dark:bg-[#1a1a1a] text-neutral-600 dark:text-[#8a8a8a] border-neutral-200 dark:border-[#262626] hover:text-neutral-900 dark:hover:text-[#e5e5e5]'
              }`}
            >
              All Subjects
            </button>

            {allSubjects.map((sub) => (
              <button
                key={sub}
                onClick={() => setSelectedSubject(sub === selectedSubject ? 'all' : sub)}
                className={`min-h-[40px] px-3.5 py-2 rounded-full text-xs font-semibold transition-all shrink-0 active:scale-95 cursor-pointer border ${
                  selectedSubject === sub
                    ? 'bg-[#ff4d6d] text-white border-[#ff4d6d] shadow-xs'
                    : 'bg-neutral-100 dark:bg-[#1a1a1a] text-neutral-600 dark:text-[#8a8a8a] border-neutral-200 dark:border-[#262626] hover:text-neutral-900 dark:hover:text-[#e5e5e5]'
                }`}
              >
                {sub}
              </button>
            ))}
          </div>

          {/* Priority filter dropdown */}
          <div className="flex items-center justify-end shrink-0 pt-1 sm:pt-0">
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="w-full sm:w-auto min-h-[40px] text-xs font-semibold py-2 px-3.5 rounded-full bg-neutral-100 dark:bg-[#1a1a1a] text-neutral-700 dark:text-[#d4d4d4] border border-neutral-200 dark:border-[#262626] focus:border-[#ff4d6d] focus:outline-none cursor-pointer"
            >
              <option value="all">⚡ All Priorities</option>
              <option value="high">🔥 High Priority</option>
              <option value="medium">✨ Medium Priority</option>
              <option value="low">🌱 Low Priority</option>
            </select>
          </div>
        </div>
      </div>

      {/* Task Groups */}
      {filteredTasks.length === 0 ? (
        <div className="text-center py-16 px-4 bg-white/50 dark:bg-[#141414]/50 rounded-2xl border border-dashed border-neutral-200 dark:border-[#262626]">
          <span className="text-3xl">🌿</span>
          <h3 className="mt-3 text-base font-bold text-neutral-900 dark:text-[#e5e5e5]">
            No matching tasks found
          </h3>
          <p className="text-xs text-neutral-500 dark:text-[#8a8a8a] mt-1 max-w-sm mx-auto">
            {searchQuery
              ? `No assignments match "${searchQuery}". Clear your search or create a new task.`
              : 'You have a clear schedule! Ready to add an assignment or reading?'}
          </p>
          <button
            onClick={onOpenAddTask}
            className="mt-4 px-4 py-2 text-xs font-semibold rounded-xl bg-[#ff4d6d] hover:bg-[#ff3357] text-white shadow-xs transition-all active:scale-95 cursor-pointer"
          >
            + Add New Task
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <TaskGroup
            title="Today"
            icon={<Sun className="w-4 h-4 text-[#ff4d6d] inline" />}
            groupType="today"
            tasks={todayTasks}
            emptyMessage="Nothing due today — enjoy the break! ☕"
            emptySubtext="Take time to recharge or get ahead on upcoming assignments."
            onEditTask={onEditTask}
          />

          <TaskGroup
            title="This Week"
            icon={<CalendarDays className="w-4 h-4 text-[#2dd4bf] inline" />}
            groupType="this_week"
            tasks={thisWeekTasks}
            emptyMessage="Nothing scheduled for the rest of the week! 🚀"
            emptySubtext="You're ahead of the curve. Keep that momentum going."
            onEditTask={onEditTask}
          />

          <TaskGroup
            title="Later & Unscheduled"
            icon={<Clock className="w-4 h-4 text-[#8a8a8a] inline" />}
            groupType="later"
            tasks={laterTasks}
            emptyMessage="No long-term assignments queued up"
            emptySubtext="Big semester projects or thesis chapters will appear here."
            defaultExpanded={false}
            onEditTask={onEditTask}
          />

          {completedTasks.length > 0 && (
            <TaskGroup
              title="Completed"
              icon={<CheckCircle2 className="w-4 h-4 text-[#2dd4bf] inline" />}
              groupType="completed"
              tasks={completedTasks}
              emptyMessage="No completed tasks yet"
              emptySubtext="Finish a task to see it checked off here!"
              defaultExpanded={false}
              onEditTask={onEditTask}
            />
          )}
        </div>
      )}
    </div>
  );
};
