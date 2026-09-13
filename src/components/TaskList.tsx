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

  // Extract unique subjects for filter chips
  const allSubjects = Array.from(
    new Set(tasks.map((t) => t.subject).filter((s): s is string => Boolean(s)))
  );

  // Filter tasks based on search and filters
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

  // Group filtered tasks
  const todayTasks = filteredTasks.filter((t) => getTaskGroup(t) === 'today');
  const thisWeekTasks = filteredTasks.filter((t) => getTaskGroup(t) === 'this_week');
  const laterTasks = filteredTasks.filter((t) => getTaskGroup(t) === 'later');
  const completedTasks = filteredTasks.filter((t) => getTaskGroup(t) === 'completed');

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-10 h-10 border-4 border-rose-400 border-t-transparent rounded-full animate-spin" />
        <p className="mt-4 text-sm text-slate-500 dark:text-slate-400 font-medium">
          Loading your study flow...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Search & Filter Bar */}
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-3 sm:p-4 border border-slate-200/80 dark:border-slate-700/80 shadow-xs space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search tasks, subjects, or notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-700 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/30 transition-all"
          />
        </div>

        {/* Filter Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <div className="flex items-center space-x-1 text-xs text-slate-400 mr-1">
            <Filter className="w-3 h-3" />
            <span>Filter:</span>
          </div>

          {/* All chip */}
          <button
            onClick={() => setSelectedSubject('all')}
            className={`px-2.5 py-1 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              selectedSubject === 'all'
                ? 'bg-slate-800 text-white dark:bg-white dark:text-slate-900'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
            }`}
          >
            All Subjects
          </button>

          {allSubjects.map((sub) => (
            <button
              key={sub}
              onClick={() => setSelectedSubject(sub === selectedSubject ? 'all' : sub)}
              className={`px-2.5 py-1 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                selectedSubject === sub
                  ? 'bg-rose-500 text-white'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
              }`}
            >
              {sub}
            </button>
          ))}

          {/* Priority filter */}
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="ml-auto text-xs font-medium py-1 px-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-none focus:ring-2 focus:ring-rose-400/40"
          >
            <option value="all">All Priorities</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>
        </div>
      </div>

      {/* Task Groups */}
      {filteredTasks.length === 0 ? (
        <div className="text-center py-16 px-4 bg-white/60 dark:bg-slate-850/60 dark:bg-slate-800/60 rounded-3xl border border-dashed border-slate-200 dark:border-slate-700">
          <span className="text-4xl">🎉</span>
          <h3 className="mt-3 text-lg font-bold text-slate-800 dark:text-slate-100">
            No matching tasks found
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
            {searchQuery
              ? `No assignments match "${searchQuery}". Clear your search or create a new task.`
              : "You have a clear schedule! Ready to add an assignment or reading?"}
          </p>
          <button
            onClick={onOpenAddTask}
            className="mt-4 px-4 py-2 text-sm font-semibold rounded-2xl bg-rose-500 hover:bg-rose-600 text-white shadow-md shadow-rose-500/20 transition-all active:scale-95 cursor-pointer"
          >
            + Add New Task
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Today Group */}
          <TaskGroup
            title="Today"
            icon={<Sun className="w-5 h-5 text-amber-500 inline" />}
            groupType="today"
            tasks={todayTasks}
            emptyMessage="Nothing due today — enjoy the break! ☕"
            emptySubtext="Take time to recharge or get ahead on upcoming assignments."
            onEditTask={onEditTask}
          />

          {/* This Week Group */}
          <TaskGroup
            title="This Week"
            icon={<CalendarDays className="w-5 h-5 text-indigo-500 inline" />}
            groupType="this_week"
            tasks={thisWeekTasks}
            emptyMessage="Nothing scheduled for the rest of the week! 🚀"
            emptySubtext="You're ahead of the curve. Keep that momentum going."
            onEditTask={onEditTask}
          />

          {/* Later Group */}
          <TaskGroup
            title="Later & Unscheduled"
            icon={<Clock className="w-5 h-5 text-emerald-500 inline" />}
            groupType="later"
            tasks={laterTasks}
            emptyMessage="No long-term assignments queued up 🌿"
            emptySubtext="Big semester projects or thesis chapters will appear here."
            defaultExpanded={false}
            onEditTask={onEditTask}
          />

          {/* Completed Group */}
          {completedTasks.length > 0 && (
            <TaskGroup
              title="Completed"
              icon={<CheckCircle2 className="w-5 h-5 text-emerald-500 inline" />}
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
