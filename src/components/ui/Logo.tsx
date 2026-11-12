import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "relative grid size-9 shrink-0 place-items-center overflow-hidden rounded-[12px] bg-linear-to-br from-brand-400 via-brand-600 to-brand-800 shadow-[0_8px_20px_-8px_var(--glow)]",
        className,
      )}
    >
      <span className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,.45),transparent_55%)]" />
      <svg viewBox="0 0 32 32" className="relative size-6" fill="none" aria-hidden="true">
        <ellipse
          cx="16"
          cy="16"
          rx="10"
          ry="4.6"
          stroke="white"
          strokeOpacity="0.9"
          strokeWidth="1.5"
          transform="rotate(-28 16 16)"
        />
        <ellipse
          cx="16"
          cy="16"
          rx="10"
          ry="4.6"
          stroke="white"
          strokeOpacity="0.45"
          strokeWidth="1.2"
          transform="rotate(38 16 16)"
        />
        <circle cx="16" cy="16" r="2.6" fill="white" />
      </svg>
    </span>
  );
}

export function Logo({
  className,
  withText = true,
  onClick,
}: {
  className?: string;
  withText?: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      to="/"
      onClick={onClick}
      aria-label="Орбита — на главную"
      className={cn("group inline-flex items-center gap-2.5", className)}
    >
      <LogoMark className="transition-transform duration-500 group-hover:rotate-[12deg]" />
      {withText && (
        <span className="text-[17px] font-extrabold leading-none tracking-[-0.04em]">
          орбита<span className="text-brand">.</span>
        </span>
      )}
    </Link>
  );
}
