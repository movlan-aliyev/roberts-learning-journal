"use client";
import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes } from "react";

const baseClass = "w-full rounded-lg border border-border dark:border-border-dark bg-white dark:bg-[#1a1a1a] px-3 py-2 text-ink dark:text-ink-light placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-teal/40 focus:border-teal transition-colors";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className = "", ...props }, ref) => (
    <input ref={ref} className={`${baseClass} ${className}`} {...props} />
  )
);
Input.displayName = "Input";

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className = "", ...props }, ref) => (
    <textarea ref={ref} className={`${baseClass} min-h-[120px] ${className}`} {...props} />
  )
);
Textarea.displayName = "Textarea";

export function FormField({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-muted dark:text-muted-dark">{label}</label>
      {children}
      {hint && <p className="text-xs text-muted">{hint}</p>}
    </div>
  );
}
