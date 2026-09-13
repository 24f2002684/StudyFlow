import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Task, TaskGroupType, PomodoroStats } from '../types';
import { db, isFirebaseConfigured } from '../firebase/config';
import {
  collection,
  onSnapshot,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
} from 'firebase/firestore';
import { getTodayString, getTaskGroup } from '../utils/dateUtils';
import { sounds } from '../utils/sound';
import confetti from 'canvas-confetti';

interface TaskContextType {
  tasks: Task[];
  isLoading: boolean;
  isFirebaseActive: boolean;
  addTask: (data: {
    title: string;
    subject?: string;
    subjectColor?: string;
    dueDate?: string;
    priority: 'low' | 'medium' | 'high';
  }) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  toggleCompleteTask: (id: string) => Promise<void>;
  reorderTasks: (groupType: TaskGroupType, sourceIndex: number, destIndex: number) => void;
  pomodoroStats: PomodoroStats;
  incrementPomodoroSession: (focusMinutes: number, attachedTaskId?: string) => void;
}

const LOCAL_STORAGE_TASKS_KEY = 'studyflow_tasks_v1';
const LOCAL_STORAGE_POMO_KEY = 'studyflow_pomodoro_stats_v1';

const INITIAL_SAMPLE_TASKS: Task[] = [
  {
    id: 'sample-1',
    title: 'Calculus III Problem Set 4: Stokes Theorem',
    subject: 'Math',
    subjectColor: '#3b82f6', // Blue
    dueDate: getTodayString(),
    priority: 'high',
    completed: false,
    createdAt: Date.now() - 3600000 * 5,
    pomodorosSpent: 2,
    order: 0,
  },
  {
    id: 'sample-2',
    title: 'Read Biology Ch. 9: Cellular Respiration',
    subject: 'Biology',
    subjectColor: '#10b981', // Mint / Emerald
    dueDate: getTodayString(),
    priority: 'medium',
    completed: false,
    createdAt: Date.now() - 3600000 * 3,
    pomodorosSpent: 1,
    order: 1,
  },
  {
    id: 'sample-3',
    title: 'Computer Science Lab: Binary Search Trees',
    subject: 'CS 106',
    subjectColor: '#8b5cf6', // Lavender / Purple
    dueDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    priority: 'high',
    completed: false,
    createdAt: Date.now() - 3600000 * 2,
    pomodorosSpent: 0,
    order: 2,
  },
  {
    id: 'sample-4',
    title: 'Submit Psychology Survey Questionnaire',
    subject: 'Psych',
    subjectColor: '#f59e0b', // Amber / Sunny
    dueDate: new Date(Date.now() + 86400000 * 4).toISOString().split('T')[0],
    priority: 'low',
    completed: false,
    createdAt: Date.now() - 3600000 * 1,
    pomodorosSpent: 0,
    order: 3,
  },
  {
    id: 'sample-5',
    title: 'Order semester textbook & course reader',
    subject: 'Campus',
    subjectColor: '#ec4899', // Pink
    dueDate: getTodayString(),
    priority: 'low',
    completed: true,
    completedAt: Date.now() - 3600000 * 2,
    createdAt: Date.now() - 3600000 * 10,
    pomodorosSpent: 1,
    order: 4,
  },
];

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    if (typeof window !== 'undefined' && !isFirebaseConfigured) {
      const saved = localStorage.getItem(LOCAL_STORAGE_TASKS_KEY);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          return INITIAL_SAMPLE_TASKS;
        }
      }
      return INITIAL_SAMPLE_TASKS;
    }
    return [];
  });

  const [isLoading, setIsLoading] = useState<boolean>(isFirebaseConfigured);

  const [pomodoroStats, setPomodoroStats] = useState<PomodoroStats>(() => {
    const today = getTodayString();
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(LOCAL_STORAGE_POMO_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed.lastActiveDate === today) {
            return parsed;
          }
          // New day, reset today's counter but retain focus history
          return {
            completedToday: 0,
            totalFocusMinutes: parsed.totalFocusMinutes || 0,
            lastActiveDate: today,
          };
        } catch {
          // fallback
        }
      }
    }
    return {
      completedToday: 3,
      totalFocusMinutes: 75,
      lastActiveDate: today,
    };
  });

  // Save pomodoro stats to local storage
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_POMO_KEY, JSON.stringify(pomodoroStats));
  }, [pomodoroStats]);

  // Sync with Firestore if enabled, otherwise sync with LocalStorage
  useEffect(() => {
    if (!isFirebaseConfigured || !db) {
      localStorage.setItem(LOCAL_STORAGE_TASKS_KEY, JSON.stringify(tasks));
      setIsLoading(false);
      return;
    }

    const tasksCol = collection(db, 'tasks');
    const q = query(tasksCol, orderBy('order', 'asc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const loadedTasks: Task[] = snapshot.docs.map((d) => ({
          ...(d.data() as Omit<Task, 'id'>),
          id: d.id,
        }));
        setTasks(loadedTasks);
        setIsLoading(false);
      },
      (error) => {
        console.error('Firestore snapshot error, falling back to local state:', error);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [isFirebaseConfigured]);

  const addTask = async (data: {
    title: string;
    subject?: string;
    subjectColor?: string;
    dueDate?: string;
    priority: 'low' | 'medium' | 'high';
  }) => {
    const newTask: Task = {
      id: 'task_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      title: data.title.trim(),
      subject: data.subject?.trim() || undefined,
      subjectColor: data.subjectColor || '#3b82f6',
      dueDate: data.dueDate || undefined,
      priority: data.priority,
      completed: false,
      createdAt: Date.now(),
      pomodorosSpent: 0,
      order: tasks.length,
    };

    if (isFirebaseConfigured && db) {
      try {
        const tasksCol = collection(db, 'tasks');
        await addDoc(tasksCol, newTask);
        return;
      } catch (err) {
        console.error('Error adding task to Firestore, adding locally:', err);
      }
    }

    setTasks((prev) => {
      const updated = [newTask, ...prev];
      localStorage.setItem(LOCAL_STORAGE_TASKS_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    if (isFirebaseConfigured && db) {
      try {
        const taskRef = doc(db, 'tasks', id);
        await updateDoc(taskRef, updates);
        return;
      } catch (err) {
        console.error('Error updating task in Firestore, saving locally:', err);
      }
    }

    setTasks((prev) => {
      const updated = prev.map((t) => (t.id === id ? { ...t, ...updates } : t));
      localStorage.setItem(LOCAL_STORAGE_TASKS_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const deleteTask = async (id: string) => {
    if (isFirebaseConfigured && db) {
      try {
        const taskRef = doc(db, 'tasks', id);
        await deleteDoc(taskRef);
        return;
      } catch (err) {
        console.error('Error deleting task from Firestore, deleting locally:', err);
      }
    }

    setTasks((prev) => {
      const updated = prev.filter((t) => t.id !== id);
      localStorage.setItem(LOCAL_STORAGE_TASKS_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const triggerConfettiCelebration = () => {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#ff6b6b', '#4ecdc4', '#ffe66d', '#a06cd5', '#ff9a9e'],
    });
  };

  const toggleCompleteTask = async (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;

    const nextCompleted = !task.completed;

    if (nextCompleted) {
      sounds.playTaskComplete();
      triggerConfettiCelebration();
    }

    const updates = {
      completed: nextCompleted,
      completedAt: nextCompleted ? Date.now() : undefined,
    };

    await updateTask(id, updates);
  };

  const reorderTasks = (groupType: TaskGroupType, sourceIndex: number, destIndex: number) => {
    if (sourceIndex === destIndex) return;

    // Filter tasks belonging to this group
    const groupTasks = tasks.filter((t) => getTaskGroup(t) === groupType);
    const otherTasks = tasks.filter((t) => getTaskGroup(t) !== groupType);

    const [moved] = groupTasks.splice(sourceIndex, 1);
    groupTasks.splice(destIndex, 0, moved);

    // Reassign sequence orders
    const combined = [...otherTasks, ...groupTasks].map((t, idx) => ({
      ...t,
      order: idx,
    }));

    setTasks(combined);
    localStorage.setItem(LOCAL_STORAGE_TASKS_KEY, JSON.stringify(combined));

    // Update in Firestore asynchronously if active
    if (isFirebaseConfigured && db) {
      groupTasks.forEach((t, idx) => {
        const taskRef = doc(db!, 'tasks', t.id);
        updateDoc(taskRef, { order: idx }).catch(console.error);
      });
    }
  };

  const incrementPomodoroSession = (focusMinutes: number, attachedTaskId?: string) => {
    const today = getTodayString();
    setPomodoroStats((prev) => ({
      completedToday: (prev.lastActiveDate === today ? prev.completedToday : 0) + 1,
      totalFocusMinutes: prev.totalFocusMinutes + focusMinutes,
      lastActiveDate: today,
    }));

    // If attached to a task, increment task's pomodoro count
    if (attachedTaskId) {
      const task = tasks.find((t) => t.id === attachedTaskId);
      if (task) {
        updateTask(attachedTaskId, {
          pomodorosSpent: (task.pomodorosSpent || 0) + 1,
        });
      }
    }
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        isLoading,
        isFirebaseActive: isFirebaseConfigured,
        addTask,
        updateTask,
        deleteTask,
        toggleCompleteTask,
        reorderTasks,
        pomodoroStats,
        incrementPomodoroSession,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = (): TaskContextType => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};
