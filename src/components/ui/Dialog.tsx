"use client";
import { useEffect, useRef, type ReactNode } from "react";

interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export function Dialog({ open, onClose, title, children }: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (open) ref.current?.showModal();
    else ref.current?.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      className="backdrop:bg-black/40 bg-white dark:bg-[#222] rounded-xl p-0 max-w-lg w-full border border-border dark:border-border-dark shadow-xl"
    >
      <div className="flex items-center justify-between p-4 border-b border-border dark:border-border-dark">
        <h2 className="font-serif text-lg font-semibold">{title}</h2>
        <button onClick={onClose} className="p-1 hover:bg-ink/5 rounded" aria-label="Close">?</button>
      </div>
      <div className="p-4">{children}</div>
    </dialog>
  );
}
