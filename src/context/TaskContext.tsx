import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Task, TaskGroupType, PomodoroStats } from '../types';
import { db, isFirebaseConfigured } from '../firebase/config';
import { useAuth } from './AuthContext';
import {
  collection,
  onSnapshot,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  setDoc,
  getDoc,
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

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const uid = user?.uid || 'guest';

  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [pomodoroStats, setPomodoroStats] = useState<PomodoroStats>(() => {
    const today = getTodayString();
    return {
      completedToday: 0,
      totalFocusMinutes: 0,
      lastActiveDate: today,
    };
  });

  const getStorageKey = (prefix: string) => `mudichu_${prefix}_${uid}`;

  // Sync tasks and stats scoped to user
  useEffect(() => {
    if (!user) {
      setTasks([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const today = getTodayString();

    // 1. If Firebase is not active or offline, use user-scoped local storage
    if (!isFirebaseConfigured || !db) {
      const savedTasks = localStorage.getItem(getStorageKey('tasks'));
      if (savedTasks) {
        try {
          setTasks(JSON.parse(savedTasks));
        } catch {
          setTasks([]);
        }
      } else {
        setTasks([]);
      }

      const savedStats = localStorage.getItem(getStorageKey('pomo'));
      if (savedStats) {
        try {
          const parsed = JSON.parse(savedStats);
          if (parsed.lastActiveDate === today) {
            setPomodoroStats(parsed);
          } else {
            setPomodoroStats({
              completedToday: 0,
              totalFocusMinutes: parsed.totalFocusMinutes || 0,
              lastActiveDate: today,
            });
          }
        } catch {
          // default
        }
      } else {
        setPomodoroStats({ completedToday: 0, totalFocusMinutes: 0, lastActiveDate: today });
      }

      setIsLoading(false);
      return;
    }

    // 2. Connect to per-user Firestore subcollection: users/{uid}/tasks
    const userTasksCol = collection(db, 'users', user.uid, 'tasks');
    const q = query(userTasksCol, orderBy('order', 'asc'));

    const unsubscribeTasks = onSnapshot(
      q,
      (snapshot) => {
        if (snapshot.empty) {
          // Brand new user starts with a clean empty slate
          setTasks([]);
        } else {
          const loadedTasks: Task[] = snapshot.docs.map((d) => ({
            ...(d.data() as Omit<Task, 'id'>),
            id: d.id,
          }));
          setTasks(loadedTasks);
        }
        setIsLoading(false);
      },
      (error) => {
        console.error('Firestore per-user tasks subscription error:', error);
        const savedTasks = localStorage.getItem(getStorageKey('tasks'));
        setTasks(savedTasks ? JSON.parse(savedTasks) : []);
        setIsLoading(false);
      }
    );

    // 3. Connect to per-user Pomodoro stats: users/{uid}/stats/pomodoro
    const pomoDocRef = doc(db, 'users', user.uid, 'stats', 'pomodoro');
    getDoc(pomoDocRef).then((snap) => {
      if (snap.exists()) {
        const data = snap.data() as PomodoroStats;
        if (data.lastActiveDate === today) {
          setPomodoroStats(data);
        } else {
          setPomodoroStats({
            completedToday: 0,
            totalFocusMinutes: data.totalFocusMinutes || 0,
            lastActiveDate: today,
          });
        }
      }
    }).catch(console.warn);

    return () => unsubscribeTasks();
  }, [user?.uid]);

  // Persist local copy when offline
  useEffect(() => {
    if (user && (!isFirebaseConfigured || !db)) {
      localStorage.setItem(getStorageKey('tasks'), JSON.stringify(tasks));
    }
  }, [tasks, user?.uid]);

  useEffect(() => {
    if (user && (!isFirebaseConfigured || !db)) {
      localStorage.setItem(getStorageKey('pomo'), JSON.stringify(pomodoroStats));
    }
  }, [pomodoroStats, user?.uid]);

  const addTask = async (data: {
    title: string;
    subject?: string;
    subjectColor?: string;
    dueDate?: string;
    priority: 'low' | 'medium' | 'high';
  }) => {
    if (!user) return;

    const newTask: Task = {
      id: 'task_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      title: data.title.trim(),
      subject: data.subject?.trim() || undefined,
      subjectColor: data.subjectColor || '#ff4d6d',
      dueDate: data.dueDate || undefined,
      priority: data.priority,
      completed: false,
      createdAt: Date.now(),
      pomodorosSpent: 0,
      order: tasks.length,
    };

    if (isFirebaseConfigured && db) {
      try {
        const userTasksCol = collection(db, 'users', user.uid, 'tasks');
        await addDoc(userTasksCol, newTask);
        return;
      } catch (err) {
        console.error('Error adding task to user subcollection:', err);
      }
    }

    setTasks((prev) => [newTask, ...prev]);
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    if (!user) return;

    if (isFirebaseConfigured && db) {
      try {
        const taskRef = doc(db, 'users', user.uid, 'tasks', id);
        await updateDoc(taskRef, updates);
        return;
      } catch (err) {
        console.error('Error updating task in user subcollection:', err);
      }
    }

    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
  };

  const deleteTask = async (id: string) => {
    if (!user) return;

    if (isFirebaseConfigured && db) {
      try {
        const taskRef = doc(db, 'users', user.uid, 'tasks', id);
        await deleteDoc(taskRef);
        return;
      } catch (err) {
        console.error('Error deleting task in user subcollection:', err);
      }
    }

    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const triggerConfettiCelebration = () => {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#ff4d6d', '#2dd4bf', '#fbbf24', '#ffffff'],
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
    if (sourceIndex === destIndex || !user) return;

    const groupTasks = tasks.filter((t) => getTaskGroup(t) === groupType);
    const otherTasks = tasks.filter((t) => getTaskGroup(t) !== groupType);

    const [moved] = groupTasks.splice(sourceIndex, 1);
    groupTasks.splice(destIndex, 0, moved);

    const combined = [...otherTasks, ...groupTasks].map((t, idx) => ({
      ...t,
      order: idx,
    }));

    setTasks(combined);

    if (isFirebaseConfigured && db) {
      groupTasks.forEach((t, idx) => {
        const taskRef = doc(db!, 'users', user.uid, 'tasks', t.id);
        updateDoc(taskRef, { order: idx }).catch(console.error);
      });
    }
  };

  const incrementPomodoroSession = (focusMinutes: number, attachedTaskId?: string) => {
    if (!user) return;
    const today = getTodayString();

    const updatedStats: PomodoroStats = {
      completedToday: (pomodoroStats.lastActiveDate === today ? pomodoroStats.completedToday : 0) + 1,
      totalFocusMinutes: pomodoroStats.totalFocusMinutes + focusMinutes,
      lastActiveDate: today,
    };

    setPomodoroStats(updatedStats);

    if (isFirebaseConfigured && db) {
      const pomoDocRef = doc(db, 'users', user.uid, 'stats', 'pomodoro');
      setDoc(pomoDocRef, updatedStats, { merge: true }).catch(console.warn);
    }

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
