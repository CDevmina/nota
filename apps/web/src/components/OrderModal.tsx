'use client';

import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { subscribeSchema, type SubscribeInput } from '@/lib/subscribe-schema';
import type { Cta, OrderModal as OrderModalContent } from '@/lib/types';

type Status = 'idle' | 'sending' | 'success' | 'error';

/**
 * The Order pill and the modal it opens.
 *
 * Every string comes from Strapi — labels, placeholder, and all three result
 * messages. Scroll locks while open, focus moves into the dialog, and Escape
 * closes it.
 */
export default function OrderModal({
  cta,
  price,
  content,
  className = '',
}: {
  cta: Cta;
  price: string | null;
  content: OrderModalContent;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<Status>('idle');
  const dialogRef = useRef<HTMLDivElement>(null);
  const emailRef = useRef<HTMLInputElement | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SubscribeInput>({ resolver: zodResolver(subscribeSchema) });

  const { ref: emailFieldRef, ...emailField } = register('email');

  useEffect(() => {
    if (!open) return;

    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    emailRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);

    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const close = () => {
    setOpen(false);
    setStatus('idle');
    reset();
  };

  const onSubmit = async (values: SubscribeInput) => {
    setStatus('sending');
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      setStatus(res.ok ? 'success' : 'error');
      if (res.ok) reset();
    } catch {
      setStatus('error');
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`items-center gap-2 rounded-full bg-white px-1.5 py-1.5 text-black ${className}`}
      >
        <span className="label rounded-full bg-black px-4 py-2 text-white">
          {cta.label}
          {cta.productName ? (
            <span className="ml-2 text-white/50">{cta.productName}</span>
          ) : null}
          {price ? <span className="ml-2">• {price}</span> : null}
        </span>
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-[300] grid place-items-center bg-black/70 p-6 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) close();
          }}
        >
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="order-modal-title"
            className="w-full max-w-lg bg-white p-10 text-black"
          >
            <h2 id="order-modal-title" className="display text-center">
              {content.title}
            </h2>
            {content.description ? (
              <p className="spec-item mt-4 text-center text-black/70">{content.description}</p>
            ) : null}

            {status === 'success' ? (
              <p role="status" className="spec-item mt-10 text-center">
                {content.successMessage}
              </p>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-10">
                <label htmlFor="order-email" className="sr-only">
                  {content.emailPlaceholder}
                </label>
                <input
                  {...emailField}
                  ref={(el) => {
                    emailFieldRef(el);
                    emailRef.current = el;
                  }}
                  id="order-email"
                  type="email"
                  placeholder={content.emailPlaceholder}
                  aria-invalid={errors.email ? 'true' : undefined}
                  aria-describedby={errors.email ? 'order-email-error' : undefined}
                  className="spec-item w-full border-b border-black/30 bg-transparent pb-3 outline-none focus:border-black"
                />

                {/* Honeypot. Hidden from people, tempting to bots. */}
                <input
                  {...register('smartToken')}
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  className="absolute h-0 w-0 overflow-hidden opacity-0"
                />

                {errors.email ? (
                  <p id="order-email-error" className="label mt-3 text-[#963A31]">
                    {content.requiredMessage}
                  </p>
                ) : null}

                {status === 'error' ? (
                  <p role="alert" className="label mt-3 text-[#963A31]">
                    {content.errorMessage}
                  </p>
                ) : null}

                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="label mt-8 w-full bg-black px-6 py-4 text-white disabled:opacity-60"
                >
                  {content.submitLabel}
                </button>
              </form>
            )}

            <button
              type="button"
              onClick={close}
              className="label mx-auto mt-6 block text-black/60 underline underline-offset-4"
            >
              {content.closeLabel}
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
