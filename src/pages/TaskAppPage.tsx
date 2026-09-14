import React, { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { ProgressStats } from '../components/ProgressStats';
import { TaskList } from '../components/TaskList';
import { PomodoroTimer } from '../components/PomodoroTimer';
import { TaskModal } from '../components/TaskModal';
import { FeedbackModal } from '../components/FeedbackModal';
import { TaskAppBackground } from '../components/TaskAppBackground';
import type { Task } from '../types';
import { Lightbulb, Zap } from 'lucide-react';

export const TaskAppPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
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
    <div className="relative min-h-screen flex flex-col bg-[#f7f7f6] text-[#1f2937] dark:bg-[#0a0a0a] dark:text-[#e5e5e5] transition-colors duration-250">
      {/* Animated Twinkling Stars & Floating Objects in Dark Mode */}
      <TaskAppBackground />

      {/* Navigation */}
      <Navbar
        onOpenAddTask={handleOpenAdd}
        onOpenFeedback={() => setIsFeedbackOpen(true)}
      />

      {/* Main Container */}
      <main className="relative z-10 flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Progress Stats Banner */}
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
          <aside className="lg:col-span-5 space-y-6 lg:sticky lg:top-20">
            {/* Pomodoro Timer */}
            <PomodoroTimer />

            {/* College Study Tip Card */}
            <div className="rounded-2xl p-5 bg-white dark:bg-[#141414] border border-neutral-200 dark:border-[#262626] shadow-xs transition-colors duration-250">
              <div className="flex items-start space-x-3">
                <span className="p-2 rounded-xl bg-[#ff4d6d]/10 text-[#ff4d6d] shrink-0">
                  <Lightbulb className="w-4 h-4" />
                </span>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-800 dark:text-[#e5e5e5] flex items-center">
                    <span>MUDICHU Tip</span>
                    <Zap className="w-3 h-3 text-[#fbbf24] ml-1.5 inline" />
                  </h4>
                  <p className="text-xs text-neutral-500 dark:text-[#8a8a8a] mt-1.5 leading-relaxed">
                    Attach your Pomodoro session to a specific assignment. Breaking coursework into 25-minute sprints eliminates burnout and keeps momentum high!
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* Minimal Footer Credit */}
      <footer className="mt-12 py-8 text-center border-t border-neutral-200/60 dark:border-[#1f1f1f]">
        <p className="text-xs text-neutral-400 dark:text-[#777777] font-medium tracking-wide">
          Made with ❤️ by Suhail
        </p>
      </footer>

      {/* Add / Edit Task Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editingTask={editingTask}
      />

      {/* Feedback Modal */}
      <FeedbackModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
      />
    </div>
  );
};
