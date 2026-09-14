import React, { useState, useEffect } from 'react';
import { X, Calendar, Tag, AlertCircle, Sparkles } from 'lucide-react';
import type { Task, Priority } from '../types';
import { useTasks } from '../context/TaskContext';
import { getTodayString } from '../utils/dateUtils';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingTask?: Task | null;
}

const SUBJECT_PRESETS = [
  { name: 'Math', color: '#ff4d6d' },
  { name: 'CS', color: '#2dd4bf' },
  { name: 'Biology', color: '#2dd4bf' },
  { name: 'Economics', color: '#fbbf24' },
  { name: 'Essay', color: '#ff4d6d' },
  { name: 'Project', color: '#2dd4bf' },
  { name: 'Personal', color: '#8a8a8a' },
];

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  editingTask,
}) => {
  const { addTask, updateTask } = useTasks();

  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [subjectColor, setSubjectColor] = useState('#ff4d6d');
  const [dueDate, setDueDate] = useState(getTodayString());
  const [priority, setPriority] = useState<Priority>('medium');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setSubject(editingTask.subject || '');
      setSubjectColor(editingTask.subjectColor || '#ff4d6d');
      setDueDate(editingTask.dueDate || '');
      setPriority(editingTask.priority);
    } else {
      setTitle('');
      setSubject('');
      setSubjectColor('#ff4d6d');
      setDueDate(getTodayString());
      setPriority('medium');
    }
    setError('');
  }, [editingTask, isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please provide a task or assignment title');
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingTask) {
        await updateTask(editingTask.id, {
          title: title.trim(),
          subject: subject.trim() || undefined,
          subjectColor,
          dueDate: dueDate || undefined,
          priority,
        });
      } else {
        await addTask({
          title: title.trim(),
          subject: subject.trim() || undefined,
          subjectColor,
          dueDate: dueDate || undefined,
          priority,
        });
      }
      onClose();
    } catch {
      setError('Failed to save task. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const setDatePreset = (daysOffset: number) => {
    const target = new Date();
    target.setDate(target.getDate() + daysOffset);
    const y = target.getFullYear();
    const m = String(target.getMonth() + 1).padStart(2, '0');
    const d = String(target.getDate()).padStart(2, '0');
    setDueDate(`${y}-${m}-${d}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-[#141414] p-6 sm:p-7 shadow-2xl border border-neutral-200 dark:border-[#262626] transition-all transform scale-100">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-100 dark:border-[#222222]">
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-[#ff4d6d]/10 text-[#ff4d6d]">
              <Sparkles className="w-5 h-5" />
            </span>
            <h2 className="text-lg font-bold text-neutral-900 dark:text-[#e5e5e5]">
              {editingTask ? 'Edit Study Task' : 'Add New Task'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-neutral-400 hover:text-neutral-600 dark:text-[#8a8a8a] dark:hover:text-[#e5e5e5] hover:bg-neutral-100 dark:hover:bg-[#1f1f1f] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {error && (
            <div className="flex items-center space-x-2 p-3 rounded-xl bg-[#ff4d6d]/10 text-[#ff4d6d] border border-[#ff4d6d]/20 text-xs font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-[#8a8a8a] mb-1.5">
              Task Title *
            </label>
            <input
              type="text"
              autoFocus
              placeholder="e.g. Write Introduction for Psychology Paper"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-[#0f0f0f] border border-neutral-200 dark:border-[#262626] text-neutral-900 dark:text-[#e5e5e5] placeholder-neutral-400 dark:placeholder-[#555555] focus:outline-none focus:border-[#ff4d6d] text-sm font-medium transition-all"
            />
          </div>

          {/* Subject / Tag */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-[#8a8a8a] mb-1.5">
              Course / Subject Tag
            </label>
            <div className="relative">
              <Tag className="w-4 h-4 text-neutral-400 dark:text-[#666666] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="e.g. Math, CS, History"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-neutral-50 dark:bg-[#0f0f0f] border border-neutral-200 dark:border-[#262626] text-neutral-900 dark:text-[#e5e5e5] placeholder-neutral-400 dark:placeholder-[#555555] focus:outline-none focus:border-[#ff4d6d] text-sm transition-all"
              />
            </div>

            {/* Presets */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {SUBJECT_PRESETS.map((preset) => (
                <button
                  type="button"
                  key={preset.name}
                  onClick={() => {
                    setSubject(preset.name);
                    setSubjectColor(preset.color);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer border ${
                    subject === preset.name
                      ? 'bg-[#ff4d6d] text-white border-[#ff4d6d]'
                      : 'bg-neutral-100 dark:bg-[#1a1a1a] text-neutral-600 dark:text-[#8a8a8a] border-neutral-200 dark:border-[#262626] hover:text-neutral-900 dark:hover:text-[#e5e5e5]'
                  }`}
                >
                  <span
                    className="inline-block w-1.5 h-1.5 rounded-full mr-1.5"
                    style={{ backgroundColor: preset.color }}
                  />
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          {/* Due Date */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-[#8a8a8a]">
                Due Date
              </label>
              <div className="flex items-center space-x-1">
                <button
                  type="button"
                  onClick={() => setDatePreset(0)}
                  className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-[#1a1a1a] text-neutral-600 dark:text-[#8a8a8a] hover:text-neutral-900 dark:hover:text-[#e5e5e5] border border-neutral-200 dark:border-[#262626]"
                >
                  Today
                </button>
                <button
                  type="button"
                  onClick={() => setDatePreset(1)}
                  className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-[#1a1a1a] text-neutral-600 dark:text-[#8a8a8a] hover:text-neutral-900 dark:hover:text-[#e5e5e5] border border-neutral-200 dark:border-[#262626]"
                >
                  Tomorrow
                </button>
                <button
                  type="button"
                  onClick={() => setDatePreset(7)}
                  className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-[#1a1a1a] text-neutral-600 dark:text-[#8a8a8a] hover:text-neutral-900 dark:hover:text-[#e5e5e5] border border-neutral-200 dark:border-[#262626]"
                >
                  Next Week
                </button>
              </div>
            </div>
            <div className="relative">
              <Calendar className="w-4 h-4 text-neutral-400 dark:text-[#666666] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-neutral-50 dark:bg-[#0f0f0f] border border-neutral-200 dark:border-[#262626] text-neutral-900 dark:text-[#e5e5e5] text-sm focus:outline-none focus:border-[#ff4d6d]"
              />
            </div>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-[#8a8a8a] mb-1.5">
              Priority
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPriority('low')}
                className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  priority === 'low'
                    ? 'bg-[#2dd4bf]/15 border-[#2dd4bf] text-[#2dd4bf]'
                    : 'bg-neutral-50 dark:bg-[#0f0f0f] border-neutral-200 dark:border-[#262626] text-neutral-600 dark:text-[#8a8a8a] hover:border-neutral-300'
                }`}
              >
                Low
              </button>
              <button
                type="button"
                onClick={() => setPriority('medium')}
                className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  priority === 'medium'
                    ? 'bg-[#fbbf24]/15 border-[#fbbf24] text-[#fbbf24]'
                    : 'bg-neutral-50 dark:bg-[#0f0f0f] border-neutral-200 dark:border-[#262626] text-neutral-600 dark:text-[#8a8a8a] hover:border-neutral-300'
                }`}
              >
                Medium
              </button>
              <button
                type="button"
                onClick={() => setPriority('high')}
                className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  priority === 'high'
                    ? 'bg-[#ff4d6d]/15 border-[#ff4d6d] text-[#ff4d6d]'
                    : 'bg-neutral-50 dark:bg-[#0f0f0f] border-neutral-200 dark:border-[#262626] text-neutral-600 dark:text-[#8a8a8a] hover:border-neutral-300'
                }`}
              >
                High
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-neutral-100 dark:border-[#222222]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm font-medium text-neutral-600 dark:text-[#8a8a8a] hover:text-neutral-900 dark:hover:text-[#e5e5e5] hover:bg-neutral-100 dark:hover:bg-[#1f1f1f] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 rounded-xl bg-[#ff4d6d] hover:bg-[#ff3357] text-white font-semibold text-sm shadow-xs active:scale-95 transition-all cursor-pointer"
            >
              {isSubmitting ? 'Saving...' : editingTask ? 'Update Task' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
