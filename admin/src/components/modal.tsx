"use client";

import { useEffect, useRef, type MouseEvent, type ReactNode } from "react";

type ModalProps = {
  title: string;
  className?: string;
  children: ReactNode;
  onClose: () => void;
};

export function Modal({
  title,
  className = "",
  children,
  onClose,
}: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    dialog.showModal();
    return () => dialog.close();
  }, []);

  function handleBackdrop(event: MouseEvent<HTMLDialogElement>) {
    if (event.target === event.currentTarget) onClose();
  }

  return (
    <dialog
      ref={ref}
      className={`app-dialog ${className}`}
      aria-label={title}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onMouseDown={handleBackdrop}
    >
      {children}
    </dialog>
  );
}
