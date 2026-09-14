import React, { useState, useEffect } from 'react';
import { X, MessageSquare, Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mwlkdaey';

export const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [feedback, setFeedback] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // Close modal on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Reset status when reopening
  useEffect(() => {
    if (isOpen) {
      if (status === 'success') {
        setStatus('idle');
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim()) {
      setErrorMessage('Please share your thoughts, suggestion, or bug report.');
      return;
    }

    setStatus('submitting');
    setErrorMessage('');

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          name: name.trim() || 'Anonymous Student',
          contact: contact.trim() || 'Not provided',
          message: feedback.trim(),
          submittedAt: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        setStatus('success');
        setName('');
        setContact('');
        setFeedback('');
      } else {
        const data = await response.json().catch(() => null);
        setStatus('error');
        setErrorMessage(
          data?.error || 'Something went wrong while sending your feedback. Please try again.'
        );
      }
    } catch {
      setStatus('error');
      setErrorMessage('Network connection error. Please check your internet and try again.');
    }
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
          <div className="flex items-center space-x-2.5">
            <span className="p-2 rounded-xl bg-[#ff4d6d]/10 text-[#ff4d6d]">
              <MessageSquare className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-lg font-bold text-neutral-900 dark:text-[#e5e5e5]">
                Feedback & Suggestions
              </h2>
              <p className="text-xs text-neutral-500 dark:text-[#8a8a8a]">
                Help make MUDICHU better for college students
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-11 h-11 rounded-full flex items-center justify-center text-neutral-400 hover:text-neutral-600 dark:text-[#8a8a8a] dark:hover:text-[#e5e5e5] hover:bg-neutral-100 dark:hover:bg-[#1f1f1f] active:scale-95 active:bg-[#ff4d6d]/10 transition-all cursor-pointer -mr-2"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {status === 'success' ? (
          <div className="py-8 px-4 text-center space-y-4">
            <div className="w-14 h-14 mx-auto rounded-full bg-[#2dd4bf]/15 text-[#2dd4bf] flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-neutral-900 dark:text-[#e5e5e5]">
              Thanks for the feedback! 🙌
            </h3>
            <p className="text-sm text-neutral-500 dark:text-[#8a8a8a] max-w-sm mx-auto leading-relaxed">
              Your thoughts and suggestions go directly to our inbox and help us polish MUDICHU.
            </p>
            <button
              onClick={onClose}
              className="mt-2 min-h-[44px] px-6 py-2.5 rounded-full bg-[#ff4d6d] hover:bg-[#ff3357] text-white text-sm font-bold shadow-md transition-all active:scale-95 cursor-pointer"
            >
              Back to MUDICHU
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            {errorMessage && (
              <div className="flex items-center space-x-2 p-3 rounded-2xl bg-[#ff4d6d]/10 text-[#ff4d6d] border border-[#ff4d6d]/20 text-xs font-medium">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Name field (optional) */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-[#8a8a8a] mb-1.5">
                Your Name <span className="normal-case font-normal text-neutral-400 dark:text-[#666666]">(optional)</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Alex Chen"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-neutral-50 dark:bg-[#0f0f0f] border border-neutral-200 dark:border-[#262626] text-neutral-900 dark:text-[#e5e5e5] placeholder-neutral-400 dark:placeholder-[#555555] focus:outline-none focus:border-[#ff4d6d] text-sm transition-all min-h-[44px]"
              />
            </div>

            {/* Contact field (optional) */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-[#8a8a8a] mb-1.5">
                Contact — Email or Phone <span className="normal-case font-normal text-neutral-400 dark:text-[#666666]">(optional)</span>
              </label>
              <input
                type="text"
                placeholder="e.g. alex@college.edu"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-neutral-50 dark:bg-[#0f0f0f] border border-neutral-200 dark:border-[#262626] text-neutral-900 dark:text-[#e5e5e5] placeholder-neutral-400 dark:placeholder-[#555555] focus:outline-none focus:border-[#ff4d6d] text-sm transition-all min-h-[44px]"
              />
            </div>

            {/* Feedback / suggestions / bugs (required) */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-[#8a8a8a] mb-1.5">
                Feedback / Suggestions / Bugs <span className="text-[#ff4d6d]">*</span>
              </label>
              <textarea
                required
                rows={4}
                placeholder="What's working well? What features would help your college workflow? Any bugs found?"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-neutral-50 dark:bg-[#0f0f0f] border border-neutral-200 dark:border-[#262626] text-neutral-900 dark:text-[#e5e5e5] placeholder-neutral-400 dark:placeholder-[#555555] focus:outline-none focus:border-[#ff4d6d] text-sm transition-all resize-none leading-relaxed"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end space-x-3 pt-3 border-t border-neutral-100 dark:border-[#222222]">
              <button
                type="button"
                onClick={onClose}
                className="min-h-[44px] px-5 py-2.5 rounded-full text-sm font-semibold text-neutral-600 dark:text-[#8a8a8a] hover:text-neutral-900 dark:hover:text-[#e5e5e5] hover:bg-neutral-100 dark:hover:bg-[#1f1f1f] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={status === 'submitting'}
                className="min-h-[44px] inline-flex items-center space-x-2 px-6 py-2.5 rounded-full bg-[#ff4d6d] hover:bg-[#ff3357] disabled:opacity-60 text-white font-bold text-sm shadow-md transition-all active:scale-95 cursor-pointer"
              >
                {status === 'submitting' ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Feedback</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
