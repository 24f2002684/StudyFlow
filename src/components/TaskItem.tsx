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
    className: 'bg-[#ff4d6d]/10 text-[#ff4d6d] border-[#ff4d6d]/25',
  },
  medium: {
    label: 'Medium',
    className: 'bg-[#fbbf24]/10 text-[#fbbf24] border-[#fbbf24]/25',
  },
  low: {
    label: 'Low',
    className: 'bg-[#2dd4bf]/10 text-[#2dd4bf] border-[#2dd4bf]/25',
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
      className={`group relative rounded-2xl p-4 sm:p-5 transition-all duration-200 border ${
        task.completed
          ? 'bg-neutral-50/50 dark:bg-[#0f0f0f]/60 border-neutral-200/40 dark:border-[#1e1e1e] opacity-70'
          : isDragging
          ? 'bg-white dark:bg-[#1a1a1a] border-[#ff4d6d] shadow-xl scale-[1.01] z-20'
          : 'bg-white dark:bg-[#141414] border-neutral-200 dark:border-[#262626] hover:border-neutral-300 dark:hover:border-[#333333] shadow-xs'
      }`}
    >
      <div className="flex items-start gap-1 sm:gap-2">
        {/* Drag handle with 44x44px touch area */}
        <div
          {...dragHandleProps}
          className={`w-11 h-11 -ml-2 -mt-1 flex items-center justify-center cursor-grab active:cursor-grabbing text-neutral-300 dark:text-[#444444] group-hover:text-neutral-500 dark:group-hover:text-[#777777] transition-colors shrink-0 ${
            task.completed ? 'opacity-30' : 'opacity-80'
          }`}
          title="Drag to reorder"
          aria-label="Drag to reorder"
        >
          <GripVertical className="w-4 h-4" />
        </div>

        {/* Checkbox with minimum 44x44px touch container */}
        <button
          onClick={handleToggle}
          aria-label={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
          className="w-11 h-11 -ml-2 -mt-1 flex items-center justify-center cursor-pointer shrink-0 active:scale-90 transition-transform"
        >
          <div
            className={`w-5.5 h-5.5 rounded-lg flex items-center justify-center border transition-all duration-200 ${
              task.completed
                ? 'bg-[#2dd4bf] border-[#2dd4bf] text-neutral-900 shadow-xs'
                : 'border-neutral-300 dark:border-[#3a3a3a] hover:border-[#ff4d6d] dark:hover:border-[#ff4d6d] bg-neutral-50 dark:bg-[#0f0f0f]'
            }`}
          >
            {task.completed && (
              <Check className="w-3.5 h-3.5 stroke-[3] transform scale-100 transition-transform duration-200" />
            )}
          </div>
        </button>

        {/* Task Details */}
        <div className="flex-1 min-w-0 pt-1 sm:pt-1.5 pl-1">
          <div className="flex items-start justify-between gap-2">
            <h3
              className={`text-sm sm:text-base font-semibold transition-all duration-200 break-words leading-snug ${
                task.completed
                  ? 'line-through text-neutral-400 dark:text-[#555555]'
                  : 'text-neutral-900 dark:text-[#e5e5e5]'
              }`}
            >
              {task.title}
            </h3>

            {/* Actions with 44x44px touch targets on mobile */}
            <div
              className={`flex items-center space-x-1 sm:space-x-1 transition-opacity duration-150 shrink-0 -mt-1.5 -mr-1 ${
                isHovered ? 'opacity-100' : 'opacity-100 sm:opacity-0'
              }`}
            >
              {!task.completed && (
                <button
                  onClick={() => onEdit(task)}
                  className="w-11 h-11 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-neutral-400 hover:text-neutral-700 dark:text-[#666666] dark:hover:text-[#e5e5e5] hover:bg-neutral-100 dark:hover:bg-[#1f1f1f] active:scale-95 active:bg-[#ff4d6d]/15 transition-all cursor-pointer"
                  title="Edit task"
                  aria-label="Edit task"
                >
                  <Pencil className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
                </button>
              )}
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="w-11 h-11 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-neutral-400 hover:text-[#ff4d6d] dark:text-[#666666] dark:hover:text-[#ff4d6d] hover:bg-neutral-100 dark:hover:bg-[#1f1f1f] active:scale-95 active:bg-[#ff4d6d]/15 transition-all cursor-pointer"
                title="Delete task"
                aria-label="Delete task"
              >
                <Trash2 className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
              </button>
            </div>
          </div>

          {/* Badges & Meta */}
          <div className="flex flex-wrap items-center gap-2 mt-2.5 text-xs">
            {/* Subject / Course Tag */}
            {task.subject && (
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-neutral-100 dark:bg-[#1a1a1a] text-neutral-700 dark:text-[#d4d4d4] font-medium border border-neutral-200 dark:border-[#262626]">
                <Tag className="w-3 h-3 text-[#ff4d6d]" />
                <span>{task.subject}</span>
              </span>
            )}

            {/* Priority Tag */}
            <span
              className={`px-2.5 py-1 rounded-full font-bold border text-[11px] ${
                PRIORITY_BADGES[task.priority].className
              }`}
            >
              {PRIORITY_BADGES[task.priority].label}
            </span>

            {/* Due Date */}
            {task.dueDate && (
              <span
                className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full font-medium text-[11px] ${
                  dueInfo.isOverdue
                    ? 'bg-[#ff4d6d]/10 text-[#ff4d6d] border border-[#ff4d6d]/25'
                    : dueInfo.isToday
                    ? 'bg-[#fbbf24]/10 text-[#fbbf24] border border-[#fbbf24]/25'
                    : 'text-neutral-500 dark:text-[#8a8a8a] bg-neutral-50 dark:bg-[#111111] border border-neutral-200/60 dark:border-[#222222]'
                }`}
              >
                <Calendar className="w-3 h-3" />
                <span>{dueInfo.text}</span>
              </span>
            )}

            {/* Pomodoro sessions count */}
            {task.pomodorosSpent > 0 && (
              <span
                className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-neutral-100 dark:bg-[#1a1a1a] text-[#ff4d6d] font-bold text-[11px] border border-neutral-200 dark:border-[#262626]"
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
