import React, { useCallback, useEffect, useRef } from 'react';
import { X, Send, Check } from 'lucide-react';
import { useForm, ValidationError } from '@formspree/react';
import { useEscapeKey } from '../lib/useEscapeKey';

const FORMSPREE_ID = 'mjgldknv';

interface ContactModalProps {
  open: boolean;
  onClose: () => void;
}

export default function ContactModal({ open, onClose }: ContactModalProps) {
  const [state, handleSubmit, reset] = useForm(FORMSPREE_ID);
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    setTimeout(() => nameRef.current?.focus(), 50);
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const handleClose = useCallback(() => {
    onClose();
    // Defer the reset so the modal can fade out without flashing the form
    // back behind the success state on a successful submission.
    setTimeout(reset, 300);
  }, [onClose, reset]);

  useEscapeKey(open, handleClose);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" role="dialog" aria-modal="true" aria-label="Contact">
      <div className="absolute inset-0 bg-black/40 dark:bg-black/70" onClick={handleClose} />
      <div className="relative w-full max-w-md bg-white dark:bg-neutral-950 text-black dark:text-neutral-100 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 max-h-[calc(100vh-2rem)] flex flex-col overflow-hidden">
        {state.succeeded ? (
          <div className="px-6 py-10 sm:px-8 sm:py-12 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 flex items-center justify-center mb-5">
              <Check className="w-6 h-6" />
            </div>
            <h2 className="font-heading text-xl sm:text-2xl font-bold tracking-tight mb-2">
              Message sent
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs">
              Thanks for reaching out. We&rsquo;ll get back to you soon.
            </p>
            <button
              type="button"
              onClick={handleClose}
              className="mt-6 inline-flex items-center px-4 py-2 rounded-lg bg-black text-white dark:bg-white dark:text-black text-sm font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between px-5 sm:px-6 pt-5 pb-3 border-b border-gray-100 dark:border-gray-900">
              <h1 className="font-heading text-lg font-bold tracking-tight">Contact</h1>
              <button
                type="button"
                onClick={handleClose}
                aria-label="Close"
                className="-mr-2 p-2 text-gray-400 hover:text-black dark:text-gray-500 dark:hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              id="contact-form"
              onSubmit={handleSubmit}
              className="px-5 sm:px-6 py-5 space-y-5 overflow-y-auto"
            >
              <Field label="Name" required>
                <input
                  ref={nameRef}
                  type="text"
                  name="name"
                  required
                  maxLength={120}
                  placeholder="Your answer"
                  className={inputCls}
                />
              </Field>

              <Field label="Organization">
                <input
                  type="text"
                  name="organization"
                  maxLength={200}
                  placeholder="Your answer"
                  className={inputCls}
                />
              </Field>

              <Field label="Email" required>
                <input
                  type="email"
                  name="email"
                  required
                  maxLength={200}
                  placeholder="you@example.com"
                  className={inputCls}
                />
                <ValidationError
                  prefix="Email"
                  field="email"
                  errors={state.errors}
                  className="mt-2 text-xs text-red-500"
                />
              </Field>

              <Field label="Message" required>
                <textarea
                  name="message"
                  required
                  maxLength={4000}
                  rows={4}
                  placeholder="Your answer"
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-200 dark:border-gray-800 text-sm leading-relaxed bg-transparent placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:outline-none focus:border-black dark:focus:border-white resize-y"
                />
                <ValidationError
                  prefix="Message"
                  field="message"
                  errors={state.errors}
                  className="mt-2 text-xs text-red-500"
                />
              </Field>
            </form>

            <div className="px-5 sm:px-6 py-3 border-t border-gray-100 dark:border-gray-900 flex items-center justify-end">
              <button
                type="submit"
                form="contact-form"
                disabled={state.submitting}
                aria-label={state.submitting ? 'Sending' : 'Send'}
                className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-black text-white dark:bg-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 disabled:opacity-30 disabled:pointer-events-none transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const inputCls =
  'w-full bg-transparent text-sm placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:outline-none border-b border-gray-200 dark:border-gray-800 focus:border-black dark:focus:border-white pb-2';

function Field({
  label,
  hint,
  required,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="flex items-baseline gap-1.5 mb-2">
        <h2 className="font-heading text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">
          {label}
        </h2>
        {required && <span className="text-red-500 text-xs leading-none">*</span>}
        {hint && (
          <span className="text-xs text-gray-400 dark:text-gray-500 normal-case tracking-normal font-normal">
            {hint}
          </span>
        )}
      </div>
      {children}
    </section>
  );
}
