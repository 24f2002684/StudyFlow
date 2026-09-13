import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { TaskProvider } from './context/TaskContext';
import { Navbar } from './components/Navbar';
import { ProgressStats } from './components/ProgressStats';
import { TaskList } from './components/TaskList';
import { PomodoroTimer } from './components/PomodoroTimer';
import { TaskModal } from './components/TaskModal';
import type { Task } from './types';
import { Lightbulb, Heart, Zap, Sparkles } from 'lucide-react';

const MainApp: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const handleOpenAdd = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#faf9f6] text-slate-800 dark:bg-[#0f172a] dark:text-slate-100 transition-colors duration-300">
      {/* Navigation */}
      <Navbar onOpenAddTask={handleOpenAdd} />

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Welcome & Progress Stats Banner */}
        <div className="mb-6">
          <ProgressStats />
        </div>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Left Column: Tasks (7 cols) */}
          <section className="lg:col-span-7 space-y-6">
            <TaskList onEditTask={handleEditTask} onOpenAddTask={handleOpenAdd} />
          </section>

          {/* Right Column: Pomodoro & Study Widgets (5 cols) */}
          <aside className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
            {/* Pomodoro Timer */}
            <PomodoroTimer />

            {/* Quick College Study Tip Card */}
            <div className="rounded-3xl p-5 bg-gradient-to-br from-rose-50/70 via-amber-50/70 to-emerald-50/70 dark:from-slate-850 dark:via-slate-800 dark:to-slate-850 border border-slate-200/80 dark:border-slate-750/70 shadow-xs">
              <div className="flex items-start space-x-3">
                <span className="p-2 rounded-2xl bg-amber-100 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400 shrink-0">
                  <Lightbulb className="w-5 h-5" />
                </span>
                <div>
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center">
                    <span>StudyFlow Student Tip</span>
                    <Zap className="w-3.5 h-3.5 text-amber-500 ml-1.5 inline" />
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                    Attach your Pomodoro session to a specific assignment. Breaking coursework into 25-minute sprints eliminates burnout and keeps momentum high!
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 py-6 border-t border-slate-200/60 dark:border-slate-800/80 text-center text-xs text-slate-400 dark:text-slate-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="flex items-center">
            Built with <Heart className="w-3.5 h-3.5 text-rose-500 mx-1 fill-current" /> for college students everywhere.
          </p>
          <p className="flex items-center space-x-1">
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span>Usability • Visual Delight • Speed</span>
          </p>
        </div>
      </footer>

      {/* Add / Edit Task Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editingTask={editingTask}
      />
    </div>
  );
};

export function App() {
  return (
    <ThemeProvider>
      <TaskProvider>
        <MainApp />
      </TaskProvider>
    </ThemeProvider>
  );
}

export default App;
