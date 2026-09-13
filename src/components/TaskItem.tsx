import React, { useState } from 'react';
import {
  Calendar,
  GripVertical,
  Pencil,
  Trash2,
  Check,
  Tag,
} from 'lucide-react';
import type { Task, Priority } from '../types';
import { useTasks } from '../context/TaskContext';
import { formatDueDate } from '../utils/dateUtils';

interface TaskItemProps {
  task: Task;
  onEdit: (task: Task) => void;
  dragHandleProps?: React.HTMLAttributes<HTMLDivElement>;
  isDragging?: boolean;
}

const PRIORITY_BADGES: Record<Priority, { label: string; className: string }> = {
  high: {
    label: 'High',
    className: 'bg-rose-100/80 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-900',
  },
  medium: {
    label: 'Medium',
    className: 'bg-amber-100/80 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-900',
  },
  low: {
    label: 'Low',
    className: 'bg-emerald-100/80 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900',
  },
};

export const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onEdit,
  dragHandleProps,
  isDragging = false,
}) => {
  const { toggleCompleteTask, deleteTask } = useTasks();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const dueInfo = formatDueDate(task.dueDate);

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDeleting(true);
    await deleteTask(task.id);
  };

  const handleToggle = () => {
    toggleCompleteTask(task.id);
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group relative rounded-2xl p-4 transition-all duration-200 border ${
        task.completed
          ? 'bg-slate-50/70 dark:bg-slate-800/40 border-slate-200/50 dark:border-slate-850 opacity-75'
          : isDragging
          ? 'bg-white dark:bg-slate-800 border-rose-400 shadow-xl scale-[1.02] z-20'
          : 'bg-white dark:bg-slate-800 border-slate-200/80 dark:border-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600 shadow-xs hover:shadow-md'
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Drag handle */}
        <div
          {...dragHandleProps}
          className={`cursor-grab active:cursor-grabbing text-slate-300 dark:text-slate-600 group-hover:text-slate-400 dark:group-hover:text-slate-400 p-1 -ml-1 transition-opacity ${
            task.completed ? 'opacity-30' : 'opacity-80'
          }`}
          title="Drag to reorder"
        >
          <GripVertical className="w-4 h-4" />
        </div>

        {/* Checkbox with pop animation */}
        <button
          onClick={handleToggle}
          aria-label={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
          className={`relative mt-0.5 w-6 h-6 rounded-lg flex items-center justify-center border transition-all duration-300 active:scale-90 cursor-pointer shrink-0 ${
            task.completed
              ? 'bg-emerald-500 border-emerald-500 text-white shadow-xs'
              : 'border-slate-300 dark:border-slate-600 hover:border-rose-400 dark:hover:border-rose-400 bg-slate-50/50 dark:bg-slate-700/30'
          }`}
        >
          {task.completed && (
            <Check className="w-4 h-4 stroke-[3] transform scale-100 transition-transform duration-200" />
          )}
        </button>

        {/* Task Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3
              className={`text-sm sm:text-base font-semibold transition-all duration-200 break-words ${
                task.completed
                  ? 'line-through text-slate-400 dark:text-slate-500 font-normal'
                  : 'text-slate-800 dark:text-slate-100'
              }`}
            >
              {task.title}
            </h3>

            {/* Quick Action Buttons */}
            <div
              className={`flex items-center space-x-1 transition-opacity duration-150 ${
                isHovered ? 'opacity-100' : 'opacity-100 sm:opacity-0'
              }`}
            >
              {!task.completed && (
                <button
                  onClick={() => onEdit(task)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                  title="Edit task"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
                title="Delete task"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Badges and Metadata */}
          <div className="flex flex-wrap items-center gap-2 mt-2 text-xs">
            {/* Subject / Course Tag */}
            {task.subject && (
              <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-700/70 text-slate-700 dark:text-slate-300 font-medium">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: task.subjectColor || '#3b82f6' }}
                />
                <Tag className="w-3 h-3 text-slate-400" />
                <span>{task.subject}</span>
              </span>
            )}

            {/* Priority Tag */}
            <span
              className={`px-2 py-0.5 rounded-lg font-medium border text-[11px] ${
                PRIORITY_BADGES[task.priority].className
              }`}
            >
              {PRIORITY_BADGES[task.priority].label}
            </span>

            {/* Due Date */}
            {task.dueDate && (
              <span
                className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-lg font-medium text-[11px] ${
                  dueInfo.isOverdue
                    ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-300 border border-rose-200 dark:border-rose-900'
                    : dueInfo.isToday
                    ? 'bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-300 border border-amber-200 dark:border-amber-900'
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                <Calendar className="w-3 h-3" />
                <span>{dueInfo.text}</span>
              </span>
            )}

            {/* Pomodoros logged */}
            {task.pomodorosSpent > 0 && (
              <span
                className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 font-semibold text-[11px] border border-rose-200/60 dark:border-rose-900/60"
                title={`${task.pomodorosSpent} pomodoro sessions completed on this task`}
              >
                <span>🍅</span>
                <span>{task.pomodorosSpent}</span>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
