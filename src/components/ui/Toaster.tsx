import { AnimatePresence, motion } from "framer-motion";
import { CircleCheck, Info, TriangleAlert, X } from "lucide-react";
import { useUi } from "@/store/ui";

const icons = {
  success: CircleCheck,
  info: Info,
  error: TriangleAlert,
};

export function Toaster() {
  const toasts = useUi((state) => state.toasts);
  const dismiss = useUi((state) => state.dismiss);

  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed bottom-4 right-4 z-[120] flex w-[calc(100%-2rem)] max-w-[380px] flex-col gap-2.5 sm:bottom-6 sm:right-6"
    >
      <AnimatePresence initial={false}>
        {toasts.map((toast) => {
          const Icon = icons[toast.variant];
          return (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 30, scale: 0.97 }}
              transition={{ type: "spring", stiffness: 420, damping: 34 }}
              className="pointer-events-auto flex items-start gap-3 rounded-[20px] border border-line bg-surface/95 p-4 shadow-[0_24px_60px_-24px_rgba(0,0,0,.45)] backdrop-blur-xl"
            >
              <span
                className={
                  toast.variant === "error"
                    ? "text-rose-500"
                    : toast.variant === "info"
                      ? "text-brand"
                      : "text-emerald-500"
                }
              >
                <Icon className="mt-0.5 size-[18px]" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[13.5px] font-semibold leading-snug tracking-[-0.01em]">
                  {toast.title}
                </p>
                {toast.description && (
                  <p className="mt-1 text-[12.5px] leading-relaxed text-muted">{toast.description}</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => dismiss(toast.id)}
                aria-label="Скрыть уведомление"
                className="text-faint transition hover:text-fg"
              >
                <X className="size-3.5" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
