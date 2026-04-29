import React from 'react';
import { X } from 'lucide-react';
import { signIn } from '../lib/auth-client';

interface SignInModalProps {
  open: boolean;
  onClose: () => void;
}

export default function SignInModal({ open, onClose }: SignInModalProps) {
  if (!open) return null;

  const handle = (provider: 'github' | 'twitter') => {
    signIn.social({
      provider,
      callbackURL: window.location.href,
    });
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/40 sm:p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm bg-white rounded-t-2xl sm:rounded-2xl p-6 sm:p-7 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-5 gap-3">
          <div>
            <h2 className="font-heading text-xl font-bold text-black">Sign in to continue</h2>
            <p className="text-sm text-gray-500 mt-1">
              One last step — pick how to sign in.
            </p>
          </div>
          <button
            onClick={onClose}
            className="-m-2 p-2 text-gray-400 hover:text-black active:text-black transition-colors flex-shrink-0"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-2.5">
          <button
            onClick={() => handle('github')}
            className="w-full flex items-center justify-center gap-3 px-4 py-3.5 rounded-xl bg-black text-white hover:bg-gray-800 active:bg-gray-800 transition-colors text-sm font-medium"
          >
            <GithubIcon />
            Continue with GitHub
          </button>
          <button
            onClick={() => handle('twitter')}
            className="w-full flex items-center justify-center gap-3 px-4 py-3.5 rounded-xl border border-gray-200 hover:border-gray-400 active:border-gray-400 transition-colors text-sm font-medium text-black"
          >
            <XIcon />
            Continue with X
          </button>
        </div>

        <p className="text-[11px] text-gray-400 text-center mt-5 leading-relaxed">
          By continuing you agree to be a respectful contributor.
          We only store your name, email, and avatar.
        </p>
      </div>
    </div>
  );
}

function GithubIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56v-2.16c-3.2.7-3.87-1.36-3.87-1.36-.52-1.34-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.05 0 0 .97-.31 3.18 1.18.92-.26 1.91-.39 2.9-.39s1.98.13 2.9.39c2.21-1.49 3.18-1.18 3.18-1.18.62 1.59.23 2.76.11 3.05.74.81 1.18 1.84 1.18 3.1 0 4.42-2.69 5.4-5.25 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.68.8.56C20.21 21.39 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5z" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}
