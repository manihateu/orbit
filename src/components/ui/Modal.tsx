import { useEffect, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  className?: string;
  hideClose?: boolean;
}

export function Modal({ open, onClose, title, description, children, className, hideClose }: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef(onClose);

  useEffect(() => {
    closeRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeRef.current();
    };
    document.addEventListener("keydown", onKeyDown);
    const timer = window.setTimeout(() => panelRef.current?.focus(), 60);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
      window.clearTimeout(timer);
    };
  }, [open]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center sm:p-6">
          <motion.div
            className="absolute inset-0 bg-[#04060a]/55 backdrop-blur-[6px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
          />
          <motion.div
            ref={panelRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            className={cn(
              "relative max-h-[92dvh] w-full overflow-y-auto rounded-t-[30px] border border-line bg-surface p-6 shadow-[0_40px_120px_-40px_rgba(0,0,0,.6)] outline-none sm:max-w-[520px] sm:rounded-[32px] sm:p-7",
              className,
            )}
            initial={{ opacity: 0, y: 36, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 22, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 360, damping: 32, mass: 0.8 }}
          >
            <div className="mb-1 flex items-start justify-between gap-6">
              <div className="min-w-0 pr-10">
                {title && (
                  <h3 className="text-[22px] font-semibold leading-tight tracking-[-0.03em]">
                    {title}
                  </h3>
                )}
                {description && (
                  <p className="mt-2 text-[13.5px] leading-relaxed text-muted">{description}</p>
                )}
              </div>
            </div>
            {!hideClose && (
              <button
                type="button"
                onClick={onClose}
                aria-label="Закрыть"
                className="absolute right-4 top-4 z-20 grid size-9 place-items-center rounded-full border border-line bg-surface-2 text-muted transition hover:bg-surface-3 hover:text-fg"
              >
                <X className="size-4" />
              </button>
            )}
            <div className={cn(title && "mt-5")}>{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
