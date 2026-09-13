export type Priority = 'low' | 'medium' | 'high';

export type TaskGroupType = 'today' | 'this_week' | 'later' | 'completed';

export interface Task {
  id: string;
  title: string;
  subject?: string; // e.g. "Math", "Computer Science", "Biology", "Literature", "Project"
  subjectColor?: string; // Hex or tailwind color class
  dueDate?: string; // YYYY-MM-DD
  priority: Priority;
  completed: boolean;
  completedAt?: number; // timestamp
  createdAt: number;
  pomodorosSpent: number; // number of completed 25min sessions on this task
  order: number;
}

export type PomodoroMode = 'focus' | 'shortBreak' | 'longBreak';

export interface PomodoroSettings {
  focusTime: number; // in seconds (e.g. 25 * 60)
  shortBreakTime: number; // in seconds (e.g. 5 * 60)
  longBreakTime: number; // in seconds (e.g. 15 * 60)
  longBreakInterval: number; // e.g. 4 sessions
}

export interface PomodoroStats {
  completedToday: number;
  totalFocusMinutes: number;
  lastActiveDate: string; // YYYY-MM-DD
}
