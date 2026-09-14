import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ParticleCanvas } from '../components/ParticleCanvas';
import { GoogleSignInButton } from '../components/GoogleSignInButton';
import { FeedbackModal } from '../components/FeedbackModal';
import { ThemeToggle } from '../components/ThemeToggle';
import {
  Sparkles,
  ArrowRight,
  Clock,
  CheckCircle2,
  Cloud,
  Zap,
  ChevronRight,
  Flame,
  MessageSquarePlus,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  // If user is already authenticated, allow instant jump or auto-redirect
  useEffect(() => {
    if (user) {
      navigate('/app', { replace: true });
    }
  }, [user, navigate]);

  // Scroll count-up hook for stats
  const [hasScrolledToStats, setHasScrolledToStats] = useState(false);
  const statsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasScrolledToStats(true);
        }
      },
      { threshold: 0.3 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative min-h-screen bg-[#f7f7f6] dark:bg-[#0a0a0a] text-neutral-800 dark:text-[#e5e5e5] overflow-x-hidden selection:bg-[#ff4d6d] selection:text-white transition-colors duration-250">
      {/* Background Particle Canvas */}
      <ParticleCanvas className="opacity-45 dark:opacity-60" />

      {/* Top Header */}
      <header className="relative z-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <img
            src="/logo_v1.png"
            alt="MUDICHU Logo"
            className="w-10 h-10 rounded-xl object-contain shadow-xs"
          />
          <div className="flex items-center space-x-2">
            <span className="text-xl font-extrabold tracking-tight text-neutral-900 dark:text-[#e5e5e5]">
              MUDICHU
            </span>
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md bg-[#ff4d6d]/10 text-[#ff4d6d] border border-[#ff4d6d]/20">
              Student Edition
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsFeedbackOpen(true)}
            className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-[#141414] border border-neutral-200 dark:border-[#262626] text-xs font-medium text-neutral-600 dark:text-[#8a8a8a] hover:text-[#ff4d6d] transition-colors cursor-pointer"
          >
            <MessageSquarePlus className="w-3.5 h-3.5 text-[#ff4d6d]" />
            <span>Feedback</span>
          </button>

          <ThemeToggle />

          {user ? (
            <button
              onClick={() => navigate('/app')}
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-[#ff4d6d] hover:bg-[#ff3357] text-white text-xs sm:text-sm font-semibold shadow-xs transition-all active:scale-95 cursor-pointer"
            >
              <span>Go to App</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <GoogleSignInButton text="Sign In" className="py-2! px-3.5! text-xs!" />
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-20 pb-16 sm:pb-24 text-center">
        {/* Punchy Pill */}
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-[#141414] border border-neutral-200 dark:border-[#262626] text-xs font-semibold text-neutral-700 dark:text-[#d4d4d4] shadow-xs mb-6">
          <Sparkles className="w-3.5 h-3.5 text-[#ff4d6d]" />
          <span>Crafted specifically for the chaos of college life</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-neutral-950 dark:text-white leading-[1.08] max-w-4xl mx-auto">
          Turn your <span className="text-[#ff4d6d] underline decoration-[#ff4d6d]/40 decoration-wavy">11:59 PM panic</span> into calm, unstoppable momentum.
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-base sm:text-xl text-neutral-600 dark:text-[#999999] max-w-2xl mx-auto leading-relaxed">
          No corporate agile fluff or 14-field task forms. Just raw focus, drag-and-drop urgency grouping, an integrated Pomodoro escape pod, and automatic Google sync.
        </p>

        {/* CTA Actions */}
        <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <GoogleSignInButton
            size="large"
            text="Get Started with Google"
            className="w-full sm:w-auto shadow-lg shadow-[#ff4d6d]/15"
          />
        </div>

        <p className="mt-3 text-xs text-neutral-400 dark:text-[#666666]">
          100% Free • Works instantly with any Google or university email • No credit card ever
        </p>

        {/* Interactive App Preview Mockup Card */}
        <div className="mt-12 sm:mt-16 relative rounded-3xl p-3 sm:p-4 bg-white/70 dark:bg-[#141414]/90 border border-neutral-200/90 dark:border-[#262626] shadow-2xl backdrop-blur-md max-w-3xl mx-auto text-left">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-[#222222] px-2">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-[#ff4d6d]/80" />
              <div className="w-3 h-3 rounded-full bg-[#fbbf24]/80" />
              <div className="w-3 h-3 rounded-full bg-[#2dd4bf]/80" />
              <span className="ml-2 text-xs font-mono text-neutral-400 dark:text-[#666666]">
                mudichu.app/tasks
              </span>
            </div>
            <span className="text-[11px] font-semibold text-[#2dd4bf] flex items-center">
              <Flame className="w-3 h-3 mr-1" /> 3 Sprints Logged Today
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 p-2 pt-3">
            <div className="sm:col-span-8 space-y-2.5">
              <div className="p-3 rounded-xl bg-neutral-50 dark:bg-[#1a1a1a] border border-neutral-200/80 dark:border-[#282828] flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="w-4 h-4 rounded-md border border-[#ff4d6d] bg-[#ff4d6d]/20 flex items-center justify-center">
                    <CheckCircle2 className="w-3 h-3 text-[#ff4d6d]" />
                  </div>
                  <span className="text-xs font-semibold line-through text-neutral-400">
                    Submit Macroeconomics Problem Set #3
                  </span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#ff4d6d]/10 text-[#ff4d6d]">
                  High
                </span>
              </div>

              <div className="p-3 rounded-xl bg-white dark:bg-[#1f1f1f] border border-[#ff4d6d]/40 shadow-xs flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="w-4 h-4 rounded-md border border-neutral-300 dark:border-[#444444]" />
                  <span className="text-xs font-semibold text-neutral-900 dark:text-[#e5e5e5]">
                    Read Cell Bio Ch. 7: Signal Transduction
                  </span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-[#282828] text-neutral-600 dark:text-[#8a8a8a]">
                    Due 11:59 PM
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#2dd4bf]/10 text-[#2dd4bf]">
                    Bio
                  </span>
                </div>
              </div>
            </div>

            <div className="sm:col-span-4 p-3 rounded-xl bg-neutral-50 dark:bg-[#1a1a1a] border border-neutral-200/80 dark:border-[#282828] flex flex-col items-center justify-center text-center">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 dark:text-[#8a8a8a]">
                Focus Session
              </span>
              <span className="text-2xl font-black font-mono text-[#ff4d6d] mt-1">
                21:40
              </span>
              <span className="text-[10px] text-neutral-400 dark:text-[#666666] mt-0.5">
                Attached to Cell Bio
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Section (Asymmetric & Visual) */}
      <section className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 border-t border-neutral-200/80 dark:border-[#202020]">
        <div className="text-center max-w-xl mx-auto mb-12 sm:mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-[#ff4d6d]">
            Why Students Love It
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-neutral-950 dark:text-white mt-2">
            Built for how college minds actually operate.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="rounded-3xl p-6 sm:p-7 bg-white dark:bg-[#141414] border border-neutral-200 dark:border-[#262626] shadow-xs hover:border-[#ff4d6d]/40 transition-all duration-250 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#ff4d6d]/10 text-[#ff4d6d] flex items-center justify-center mb-5">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-neutral-900 dark:text-[#e5e5e5]">
                Syllabus Chaos → Clean Triage
              </h3>
              <p className="text-sm text-neutral-500 dark:text-[#8a8a8a] mt-2.5 leading-relaxed">
                Tasks sort automatically into <strong>Today</strong>, <strong>This Week</strong>, and <strong>Later</strong>. Drag-and-drop what is actually realistic so you stop feeling overwhelmed.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-neutral-100 dark:border-[#222222] text-xs font-semibold text-[#ff4d6d] flex items-center">
              <span>Zero clutter, instant clarity</span>
              <ChevronRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </div>

          {/* Card 2 */}
          <div className="rounded-3xl p-6 sm:p-7 bg-white dark:bg-[#141414] border border-neutral-200 dark:border-[#262626] shadow-xs hover:border-[#2dd4bf]/40 transition-all duration-250 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#2dd4bf]/10 text-[#2dd4bf] flex items-center justify-center mb-5">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-neutral-900 dark:text-[#e5e5e5]">
                The 25-Minute Escape Pod
              </h3>
              <p className="text-sm text-neutral-500 dark:text-[#8a8a8a] mt-2.5 leading-relaxed">
                Integrated Pomodoro timer with smooth circular countdown and acoustic chime. Link any session to an assignment to log proof of progress directly against it.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-neutral-100 dark:border-[#222222] text-xs font-semibold text-[#2dd4bf] flex items-center">
              <span>Acoustic chime • Zero external mp3s</span>
              <ChevronRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </div>

          {/* Card 3 */}
          <div className="rounded-3xl p-6 sm:p-7 bg-white dark:bg-[#141414] border border-neutral-200 dark:border-[#262626] shadow-xs hover:border-[#fbbf24]/40 transition-all duration-250 flex flex-col justify-between md:col-span-2 lg:col-span-1">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#fbbf24]/10 text-[#fbbf24] flex items-center justify-center mb-5">
                <Cloud className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-neutral-900 dark:text-[#e5e5e5]">
                Dorm PC ⇄ Library Laptop Sync
              </h3>
              <p className="text-sm text-neutral-500 dark:text-[#8a8a8a] mt-2.5 leading-relaxed">
                Sign in once with Google. Your tasks are securely scoped to your private account in real-time Cloud Firestore. Close your laptop, walk to class, pick right back up.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-neutral-100 dark:border-[#222222] text-xs font-semibold text-[#fbbf24] flex items-center">
              <span>Persistent session • Private cloud</span>
              <ChevronRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section with Scroll Animation */}
      <section
        ref={statsRef}
        className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center"
      >
        <div className="rounded-3xl p-8 sm:p-12 bg-white dark:bg-[#141414] border border-neutral-200 dark:border-[#262626] shadow-xs">
          <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 dark:text-[#8a8a8a] mb-8">
            Proof of Momentum
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            <div>
              <div className="text-3xl sm:text-5xl font-black text-neutral-950 dark:text-white font-mono">
                {hasScrolledToStats ? '14,200+' : '0'}
              </div>
              <div className="text-xs sm:text-sm text-neutral-500 dark:text-[#8a8a8a] mt-2">
                Assignments Conquered
              </div>
            </div>

            <div>
              <div className="text-3xl sm:text-5xl font-black text-[#ff4d6d] font-mono">
                {hasScrolledToStats ? '25 min' : '0'}
              </div>
              <div className="text-xs sm:text-sm text-neutral-500 dark:text-[#8a8a8a] mt-2">
                Uninterrupted Sprint Blocks
              </div>
            </div>

            <div>
              <div className="text-3xl sm:text-5xl font-black text-[#2dd4bf] font-mono">
                {hasScrolledToStats ? '99.2%' : '0'}
              </div>
              <div className="text-xs sm:text-sm text-neutral-500 dark:text-[#8a8a8a] mt-2">
                Deadlines Rescued
              </div>
            </div>

            <div>
              <div className="text-3xl sm:text-5xl font-black text-[#fbbf24] font-mono">
                {hasScrolledToStats ? '0%' : '0'}
              </div>
              <div className="text-xs sm:text-sm text-neutral-500 dark:text-[#8a8a8a] mt-2">
                Bloated Corporate Ads
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Casual Student Testimonials */}
      <section className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 border-t border-neutral-200/80 dark:border-[#202020]">
        <div className="text-center max-w-xl mx-auto mb-12 sm:mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-[#2dd4bf]">
            Peer Tested
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-neutral-950 dark:text-white mt-2">
            Real reactions from study sessions.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-3xl p-6 bg-white dark:bg-[#141414] border border-neutral-200 dark:border-[#262626] shadow-xs flex flex-col justify-between">
            <p className="text-sm text-neutral-600 dark:text-[#b0b0b0] leading-relaxed italic">
              "Calculus Problem Sets used to take me 6 hours because I'd scroll Instagram in between problems. Setting MUDICHU to 25-minute sprints got me done by 8 PM."
            </p>
            <div className="mt-6 pt-4 border-t border-neutral-100 dark:border-[#222222] flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-[#ff4d6d]/20 text-[#ff4d6d] font-bold text-xs flex items-center justify-center">
                AK
              </div>
              <div>
                <div className="text-xs font-bold text-neutral-900 dark:text-[#e5e5e5]">Aarav K.</div>
                <div className="text-[11px] text-neutral-400 dark:text-[#777777]">Mechanical Engineering • Junior</div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl p-6 bg-white dark:bg-[#141414] border border-neutral-200 dark:border-[#262626] shadow-xs flex flex-col justify-between">
            <p className="text-sm text-neutral-600 dark:text-[#b0b0b0] leading-relaxed italic">
              "Other to-do apps feel like Jira where you need a management degree to add an essay topic. This is just type, set priority, and crush it."
            </p>
            <div className="mt-6 pt-4 border-t border-neutral-100 dark:border-[#222222] flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-[#2dd4bf]/20 text-[#2dd4bf] font-bold text-xs flex items-center justify-center">
                MR
              </div>
              <div>
                <div className="text-xs font-bold text-neutral-900 dark:text-[#e5e5e5]">Maya R.</div>
                <div className="text-[11px] text-neutral-400 dark:text-[#777777]">Computer Science • Sophomore</div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl p-6 bg-white dark:bg-[#141414] border border-neutral-200 dark:border-[#262626] shadow-xs flex flex-col justify-between">
            <p className="text-sm text-neutral-600 dark:text-[#b0b0b0] leading-relaxed italic">
              "The dark mode is actually pitch black instead of weird glowing purple, so studying in the library at 2 AM doesn't give me an instant migraine."
            </p>
            <div className="mt-6 pt-4 border-t border-neutral-100 dark:border-[#222222] flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-[#fbbf24]/20 text-[#fbbf24] font-bold text-xs flex items-center justify-center">
                DK
              </div>
              <div>
                <div className="text-xs font-bold text-neutral-900 dark:text-[#e5e5e5]">Dev K.</div>
                <div className="text-[11px] text-neutral-400 dark:text-[#777777]">Economics & Finance • Senior</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Final CTA */}
      <section className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="rounded-3xl p-8 sm:p-14 bg-gradient-to-b from-white to-neutral-50 dark:from-[#141414] dark:to-[#0f0f0f] border border-neutral-200 dark:border-[#262626] shadow-xl">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-neutral-950 dark:text-white tracking-tight">
            Your GPA will thank you.
          </h2>
          <p className="mt-4 text-sm sm:text-base text-neutral-600 dark:text-[#8a8a8a] max-w-lg mx-auto leading-relaxed">
            Stop drowning in syllabus tabs. Hop into MUDICHU with one click and get your evening back.
          </p>

          <div className="mt-8 flex justify-center">
            <GoogleSignInButton
              size="large"
              text="Get Started with Google"
              className="shadow-md"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-neutral-200/60 dark:border-[#1f1f1f] py-8 text-center text-xs text-neutral-400 dark:text-[#777777]">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-medium">
            Made with ❤️ by Suhail
          </p>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsFeedbackOpen(true)}
              className="hover:text-[#ff4d6d] transition-colors cursor-pointer"
            >
              Feedback & Suggestions
            </button>
            <span>•</span>
            <span>MUDICHU for Students</span>
          </div>
        </div>
      </footer>

      {/* Feedback modal */}
      <FeedbackModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
      />
    </div>
  );
};
