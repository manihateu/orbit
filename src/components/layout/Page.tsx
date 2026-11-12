import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/primitives";
import { cn } from "@/lib/utils";

export function Page({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function PageHero({
  eyebrow,
  title,
  description,
  children,
  compact = false,
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  compact?: boolean;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "relative overflow-hidden pb-7 pt-26 sm:pb-8 sm:pt-32",
        compact && "pb-6 pt-24 sm:pt-28",
        className,
      )}
    >
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="grid-bg absolute inset-x-0 top-0 h-[340px] opacity-70" />
        <div className="absolute -top-32 right-[-10%] size-[460px] rounded-full bg-brand/10 blur-[110px]" />
        <div className="absolute left-[-15%] top-24 size-[320px] rounded-full bg-brand/5 blur-[90px]" />
      </div>
      <div className="container-page relative">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          {eyebrow && (
            <Badge variant="brand" className="mb-4 px-3 py-1.5 text-[10.5px] sm:mb-5 sm:text-[11px]">
              <Sparkles className="size-3" />
              {eyebrow}
            </Badge>
          )}
          <h1
            className={cn(
              "max-w-4xl text-[clamp(1.9rem,4.6vw,3.4rem)] font-semibold leading-[1.04] tracking-[-0.045em] text-balance sm:leading-[1.03]",
              compact && "text-[clamp(1.7rem,3.4vw,2.5rem)] leading-[1.06]",
            )}
          >
            {title}
          </h1>
          {description && (
            <p
              className={cn(
                "mt-4 max-w-2xl text-[14px] leading-relaxed text-muted sm:mt-5 sm:text-[16px]",
                compact && "mt-3 max-w-xl text-[13px] sm:text-sm",
              )}
            >
              {description}
            </p>
          )}
          {children && <div className={cn("mt-6 sm:mt-8", compact && "mt-5 sm:mt-6")}>{children}</div>}
        </motion.div>
      </div>
    </section>
  );
}
