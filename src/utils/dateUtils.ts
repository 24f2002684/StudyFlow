import type { Task, TaskGroupType } from '../types';

/**
 * Returns today's date formatted as YYYY-MM-DD in local time
 */
export function getTodayString(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Determine which bucket a task belongs to
 */
export function getTaskGroup(task: Task): TaskGroupType {
  if (task.completed) {
    return 'completed';
  }

  if (!task.dueDate) {
    return 'later';
  }

  const todayStr = getTodayString();
  
  if (task.dueDate <= todayStr) {
    // Due today or overdue
    return 'today';
  }

  // Calculate days difference
  const today = new Date(todayStr + 'T00:00:00');
  const due = new Date(task.dueDate + 'T00:00:00');
  const diffTime = due.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays <= 7) {
    return 'this_week';
  }

  return 'later';
}

/**
 * Friendly readable due date formatting
 */
export function formatDueDate(dateStr?: string): { text: string; isOverdue: boolean; isToday: boolean } {
  if (!dateStr) {
    return { text: 'No due date', isOverdue: false, isToday: false };
  }

  const todayStr = getTodayString();

  if (dateStr === todayStr) {
    return { text: 'Today', isOverdue: false, isToday: true };
  }

  if (dateStr < todayStr) {
    const today = new Date(todayStr + 'T00:00:00');
    const due = new Date(dateStr + 'T00:00:00');
    const daysAgo = Math.round((today.getTime() - due.getTime()) / (1000 * 60 * 60 * 24));
    return {
      text: daysAgo === 1 ? 'Yesterday' : `${daysAgo}d overdue`,
      isOverdue: true,
      isToday: false
    };
  }

  // Future date
  const today = new Date(todayStr + 'T00:00:00');
  const due = new Date(dateStr + 'T00:00:00');
  const diffDays = Math.round((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays === 1) {
    return { text: 'Tomorrow', isOverdue: false, isToday: false };
  }

  if (diffDays < 7) {
    const weekday = due.toLocaleDateString(undefined, { weekday: 'short' });
    return { text: weekday, isOverdue: false, isToday: false };
  }

  const formatted = due.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  return { text: formatted, isOverdue: false, isToday: false };
}
