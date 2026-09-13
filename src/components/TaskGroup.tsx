import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import type { Task, TaskGroupType } from '../types';
import { TaskItem } from './TaskItem';
import { useTasks } from '../context/TaskContext';

interface TaskGroupProps {
  title: string;
  icon: React.ReactNode;
  groupType: TaskGroupType;
  tasks: Task[];
  emptyMessage: string;
  emptySubtext: string;
  defaultExpanded?: boolean;
  onEditTask: (task: Task) => void;
}

export const TaskGroup: React.FC<TaskGroupProps> = ({
  title,
  icon,
  groupType,
  tasks,
  emptyMessage,
  emptySubtext,
  defaultExpanded = true,
  onEditTask,
}) => {
  const { reorderTasks } = useTasks();
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    setDragOverIndex(index);
  };

  const handleDrop = (index: number) => {
    if (draggedIndex !== null && draggedIndex !== index) {
      reorderTasks(groupType, draggedIndex, index);
    }
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  return (
    <div className="mb-6 last:mb-0">
      {/* Group Header */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between py-2 px-1 cursor-pointer select-none group"
      >
        <div className="flex items-center space-x-2.5">
          <span className="text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 transition-colors">
            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </span>
          <div className="flex items-center space-x-2">
            <span className="text-base sm:text-lg">{icon}</span>
            <h3 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100">
              {title}
            </h3>
          </div>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
            {tasks.length}
          </span>
        </div>
      </div>

      {/* Group Items */}
      {isExpanded && (
        <div className="mt-2 space-y-2.5">
          {tasks.length === 0 ? (
            <div className="py-7 px-4 text-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30">
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                {emptyMessage}
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                {emptySubtext}
              </p>
            </div>
          ) : (
            tasks.map((task, index) => (
              <div
                key={task.id}
                draggable={!task.completed}
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDrop={() => handleDrop(index)}
                onDragEnd={handleDragEnd}
                className={`transition-all duration-200 ${
                  dragOverIndex === index ? 'border-t-2 border-rose-400 pt-1' : ''
                } ${draggedIndex === index ? 'opacity-40' : 'opacity-100'}`}
              >
                <TaskItem
                  task={task}
                  onEdit={onEditTask}
                  isDragging={draggedIndex === index}
                />
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
