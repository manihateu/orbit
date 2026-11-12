import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Heart, Menu, Moon, Sparkles, Sun, UserRound, X } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { Avatar, buttonStyles } from "@/components/ui/primitives";
import { useTheme } from "@/store/theme";
import { useUser } from "@/store/user";
import { demoUser } from "@/data/profile";
import { cn } from "@/lib/utils";

const navLinks = [
  { to: "/vacancies", label: "Вакансии" },
  { to: "/resumes", label: "Резюме" },
  { to: "/internships", label: "Стажировки" },
  { to: "/events", label: "Мероприятия" },
  { to: "/education", label: "Обучение" },
] as const;

function isActive(pathname: string, to: string) {
  return pathname === to || pathname.startsWith(`${to}/`);
}

export function Header() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const [open, setOpen] = useState(false);
  const theme = useTheme((state) => state.theme);
  const toggleTheme = useTheme((state) => state.toggle);
  const favorites = useUser((state) => state.favorites.length);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-[80]">
        <div className="container-page">
          <div className="mt-3 flex h-16 items-center justify-between gap-2 rounded-full border border-line glass px-3 shadow-[0_20px_50px_-32px_rgba(0,0,0,.45)] sm:mt-4 sm:px-4">
            <Logo onClick={() => setOpen(false)} />

            <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Основная навигация">
              {navLinks.map((link) => {
                const active = isActive(pathname, link.to);
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "relative inline-flex h-9 items-center rounded-full px-3 text-[12.5px] font-semibold transition-colors duration-300",
                      active ? "text-brand" : "text-muted hover:bg-fg/5 hover:text-fg",
                    )}
                  >
                    {active && (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 rounded-full bg-brand-soft"
                        transition={{ type: "spring", stiffness: 420, damping: 34 }}
                      />
                    )}
                    <span className="relative">{link.label}</span>
                  </Link>
                );
              })}
              <Link
                to="/ai"
                aria-current={isActive(pathname, "/ai") ? "page" : undefined}
                className={cn(
                  "ml-1 inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-[12.5px] font-bold transition-all duration-300",
                  isActive(pathname, "/ai")
                    ? "bg-brand text-white shadow-[0_8px_20px_-10px_var(--glow)]"
                    : "bg-brand-soft text-brand hover:bg-brand/15",
                )}
              >
                <Sparkles className="size-3.5" />
                ИИ-помощник
              </Link>
            </nav>

            <div className="flex items-center gap-1">
              <Link
                to="/profile"
                aria-label="Избранное"
                className="relative hidden size-10 place-items-center rounded-full border border-line bg-surface text-muted transition hover:border-line-strong hover:text-fg sm:grid"
              >
                <Heart className="size-4" />
                {favorites > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 grid size-4 place-items-center rounded-full bg-brand text-[9px] font-bold text-white">
                    {favorites}
                  </span>
                )}
              </Link>

              <button
                type="button"
                onClick={toggleTheme}
                aria-label={theme === "dark" ? "Светлая тема" : "Тёмная тема"}
                className="grid size-10 place-items-center rounded-full border border-line bg-surface text-muted transition hover:border-line-strong hover:text-fg"
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={theme}
                    initial={{ rotate: -70, opacity: 0, scale: 0.6 }}
                    animate={{ rotate: 0, opacity: 1, scale: 1 }}
                    exit={{ rotate: 70, opacity: 0, scale: 0.6 }}
                    transition={{ duration: 0.25 }}
                    className="grid place-items-center"
                  >
                    {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
                  </motion.span>
                </AnimatePresence>
              </button>

              <Link
                to="/ai"
                search={{ tab: "resume" }}
                className={buttonStyles({
                  size: "sm",
                  className: "ml-1 hidden xl:inline-flex",
                })}
              >
                Создать резюме
              </Link>

              <Link
                to="/profile"
                aria-label="Профиль"
                className="relative ml-0.5 grid size-10 place-items-center rounded-full border border-line bg-surface text-muted transition hover:border-line-strong hover:text-fg"
              >
                <UserRound className="size-[17px]" />
              </Link>

              <button
                type="button"
                onClick={() => setOpen(true)}
                aria-label="Открыть меню"
                className="grid size-10 place-items-center rounded-full border border-line bg-surface text-fg lg:hidden"
              >
                <Menu className="size-[18px]" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[95] lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              initial={{ y: "-100%" }}
              animate={{ y: 0 }}
              exit={{ y: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 34 }}
              className="flex h-dvh flex-col bg-bg"
            >
              <div className="container-page flex h-[76px] shrink-0 items-center justify-between">
                <Logo onClick={() => setOpen(false)} />
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Закрыть меню"
                  className="grid size-10 place-items-center rounded-full border border-line bg-surface text-fg"
                >
                  <X className="size-[18px]" />
                </button>
              </div>

              <nav className="container-page flex flex-1 flex-col justify-center gap-1 overflow-y-auto pb-6">
                {[...navLinks, { to: "/ai", label: "ИИ-помощник" }].map((link, index) => (
                  <motion.div
                    key={link.to}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.06 + index * 0.045, duration: 0.35 }}
                  >
                    <Link
                      to={link.to}
                      onClick={() => setOpen(false)}
                      aria-current={isActive(pathname, link.to) ? "page" : undefined}
                      className={cn(
                        "flex items-center justify-between border-b border-line py-3.5 text-[27px] font-semibold tracking-[-0.035em]",
                        isActive(pathname, link.to) ? "text-brand" : "text-fg",
                      )}
                    >
                      {link.label}
                      <ArrowUpRight className="size-5 text-faint" />
                    </Link>
                  </motion.div>
                ))}
              </nav>

              <div className="container-page shrink-0 pb-8">
                <Link
                  to="/profile"
                  onClick={() => setOpen(false)}
                  className="mb-3 flex items-center gap-3 rounded-2xl border border-line bg-surface p-3"
                >
                  <Avatar
                    name={demoUser.name}
                    c1={demoUser.avatarC1}
                    c2={demoUser.avatarC2}
                    size="sm"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-[12.5px] font-semibold">{demoUser.name}</p>
                    <p className="text-[10px] text-muted">
                      Личный кабинет · профиль подтверждён
                    </p>
                  </div>
                  <ArrowUpRight className="size-4 text-faint" />
                </Link>
                <Link
                  to="/ai"
                  search={{ tab: "resume" }}
                  onClick={() => setOpen(false)}
                  className={buttonStyles({ size: "lg", className: "w-full" })}
                >
                  Создать резюме с ИИ
                  <Sparkles className="size-4" />
                </Link>
                <div className="mt-4 flex items-center justify-between text-[11px] text-faint">
                  <span>Астраханская область</span>
                  <button type="button" onClick={toggleTheme} className="font-semibold text-muted">
                    {theme === "dark" ? "Светлая тема" : "Тёмная тема"}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

