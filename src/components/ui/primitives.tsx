import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "soft" | "dark";
type Size = "sm" | "md" | "lg" | "icon";

const base =
  "relative inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-full font-semibold transition-[transform,background-color,box-shadow,border-color,color] duration-300 ease-out active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50";

const variants: Record<Variant, string> = {
  primary:
    "bg-brand text-white shadow-[0_12px_30px_-14px_var(--glow)] hover:-translate-y-0.5 hover:bg-brand-strong hover:shadow-[0_18px_40px_-14px_var(--glow)]",
  secondary:
    "border border-line bg-surface text-fg shadow-[0_1px_2px_rgba(16,24,40,.04)] hover:-translate-y-0.5 hover:border-line-strong hover:bg-surface-2",
  ghost: "text-muted hover:bg-fg/5 hover:text-fg",
  soft: "bg-brand-soft text-brand hover:bg-brand/15",
  dark: "bg-fg text-bg hover:-translate-y-0.5 hover:opacity-90",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-[13px]",
  md: "h-11 px-5 text-sm",
  lg: "h-13 px-7 text-[15px]",
  icon: "size-10",
};

export function buttonStyles({
  variant = "primary",
  size = "md",
  className,
}: {
  variant?: Variant;
  size?: Size;
  className?: string;
} = {}) {
  return cn(base, variants[variant], sizes[size], className);
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  loading,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={buttonStyles({ variant, size, className })}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      {children}
    </button>
  );
}

type BadgeVariant = "default" | "brand" | "success" | "warning" | "outline" | "danger";

const badgeVariants: Record<BadgeVariant, string> = {
  default: "bg-surface-3 text-muted",
  brand: "bg-brand-soft text-brand",
  success: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  warning: "bg-amber-500/12 text-amber-700 dark:text-amber-400",
  outline: "border border-line text-muted",
  danger: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
};

export function Badge({
  children,
  variant = "default",
  className,
}: {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11.5px] font-semibold leading-none tracking-[-0.01em]",
        badgeVariants[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function Card({
  children,
  className,
  hover = false,
}: {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-[26px] border border-line bg-surface shadow-[var(--shadow-soft)]",
        hover && "card-hover",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-12 w-full rounded-2xl border border-line bg-surface-2 px-4 text-sm text-fg outline-none transition placeholder:text-faint focus:border-brand/50 focus:bg-surface focus:ring-4 focus:ring-brand/10",
        className,
      )}
      {...props}
    />
  );
}

export function Avatar({
  name,
  c1 = "#3b82f6",
  c2 = "#1e40af",
  size = "md",
  verified,
  className,
}: {
  name: string;
  c1?: string;
  c2?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  verified?: boolean;
  className?: string;
}) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  const sizeClasses = {
    xs: "size-8 text-[11px]",
    sm: "size-10 text-xs",
    md: "size-12 text-sm",
    lg: "size-16 text-lg",
    xl: "size-24 text-2xl",
  }[size];

  return (
    <span className={cn("relative inline-flex shrink-0 rounded-full", className)}>
      <span
        className={cn(
          "grid place-items-center rounded-full font-bold tracking-tight text-white ring-2 ring-surface",
          sizeClasses,
        )}
        style={{ backgroundImage: `linear-gradient(135deg, ${c1}, ${c2})` }}
      >
        {initials}
      </span>
      {verified && (
        <span className="absolute -bottom-0.5 -right-0.5 grid size-5 place-items-center rounded-full bg-surface">
          <svg viewBox="0 0 20 20" className="size-4 text-brand" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M10 1.6 12.3 3l2.7-.3 1.2 2.5 2.4 1.3-.5 2.7 1.4 2.2-1.9 2-.4 2.7-2.7.6-1.7 2.2-2.6-1-2.6 1-1.7-2.2-2.7-.6-.4-2.7-1.9-2L1.9 9.2 1.4 6.5 3.8 5.2 5 2.7l2.7.3L10 1.6Zm4.3 6.1a1 1 0 0 0-1.4-1.4l-4 4-1.6-1.6a1 1 0 0 0-1.4 1.4l2.3 2.3a1 1 0 0 0 1.4 0l4.7-4.7Z"
              clipRule="evenodd"
            />
          </svg>
        </span>
      )}
    </span>
  );
}

export function Progress({
  value,
  className,
  barClassName,
}: {
  value: number;
  className?: string;
  barClassName?: string;
}) {
  return (
    <div className={cn("h-1.5 w-full overflow-hidden rounded-full bg-surface-3", className)}>
      <div
        className={cn("h-full rounded-full bg-brand transition-[width] duration-700", barClassName)}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-5",
        align === "center" && "items-center text-center",
        action && "sm:flex-row sm:items-end sm:justify-between",
        className,
      )}
    >
      <div className={cn("max-w-2xl", align === "center" && "mx-auto")}>
        {eyebrow && (
          <div className="mb-4 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-brand">
            <span className="h-px w-6 bg-brand/50" />
            {eyebrow}
          </div>
        )}
        <h2 className="text-[clamp(1.9rem,3.4vw,2.9rem)] font-semibold leading-[1.06] tracking-[-0.035em] text-balance">
          {title}
        </h2>
        {description && (
          <p className="mt-4 text-[15px] leading-relaxed text-muted sm:text-base">{description}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export function FilterChip({
  active,
  children,
  onClick,
  className,
}: {
  active?: boolean;
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex h-9 items-center gap-1.5 rounded-full border px-3.5 text-[12.5px] font-semibold transition-all duration-200",
        active
          ? "border-brand/30 bg-brand text-white shadow-[0_8px_20px_-12px_var(--glow)]"
          : "border-line bg-surface text-muted hover:border-line-strong hover:text-fg",
        className,
      )}
    >
      {children}
    </button>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-2xl bg-linear-to-r from-surface-3 via-surface-2 to-surface-3 bg-[length:200%_100%]",
        className,
      )}
    />
  );
}

export function IconTile({
  children,
  className,
  tone = "brand",
}: {
  children: ReactNode;
  className?: string;
  tone?: "brand" | "light" | "dark";
}) {
  return (
    <span
      className={cn(
        "grid size-11 shrink-0 place-items-center rounded-[15px]",
        tone === "brand" && "bg-brand-soft text-brand",
        tone === "light" && "bg-white/15 text-white",
        tone === "dark" && "bg-fg text-bg",
        className,
      )}
    >
      {children}
    </span>
  );
}
