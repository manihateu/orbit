import { useState, type FormEvent, type ReactNode } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  Bot,
  Briefcase,
  CalendarDays,
  CalendarCheck,
  Check,
  ChevronRight,
  GraduationCap,
  Heart,
  Landmark,
  MapPin,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  Users,
  Wand2,
} from "lucide-react";
import { fetchVacancies } from "@/lib/api";
import { companies, companyMap } from "@/data/companies";
import { vacancies } from "@/data/vacancies";
import { internships } from "@/data/internships";
import { events } from "@/data/events";
import { formatDate, formatMoney, formatSalary } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Badge, buttonStyles, Card, Skeleton } from "@/components/ui/primitives";
import { CompanyLogo, VacancyCard } from "@/components/shared/cards";
import { useUser } from "@/store/user";
import { Page } from "@/components/layout/Page";

const tabs = ["Вакансии", "Стажировки", "Мероприятия"] as const;
type Tab = (typeof tabs)[number];

const popularSearches = [
  { label: "Frontend", tab: "Вакансии" as Tab },
  { label: "Без опыта", tab: "Вакансии" as Tab },
  { label: "SMM", tab: "Вакансии" as Tab },
  { label: "Ярмарка вакансий", tab: "Мероприятия" as Tab },
];

export function HomePage() {
  return (
    <Page>
      <Hero />
      <TrustStrip />
      <Modules />
      <FeaturedVacancies />
      <HowItWorks />
      <PracticeAndEvents />
      <AiShowcase />
      <VerificationShowcase />
      <Testimonials />
      <FinalCta />
    </Page>
  );
}

function Hero() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("Вакансии");
  const [query, setQuery] = useState("");
  const [city, setCity] = useState("Все города");
  const reduceMotion = useReducedMotion();
  const featuredVacancy = vacancies[0];
  const featuredCompany = companyMap[featuredVacancy.companyId];
  const nearestEvent = events[0];

  const submit = () => {
    const search = { q: query.trim() || undefined };
    if (tab === "Вакансии") {
      void navigate({
        to: "/vacancies",
        search: { ...search, city: city === "Все города" ? undefined : city },
      });
    } else if (tab === "Стажировки") {
      void navigate({ to: "/internships", search });
    } else {
      void navigate({ to: "/events", search });
    }
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    submit();
  };

  return (
    <section className="relative overflow-hidden pb-16 pt-26 sm:pb-20 sm:pt-32 lg:pb-24 lg:pt-36">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-x-0 top-0 h-[620px] bg-[radial-gradient(ellipse_65%_55%_at_50%_0%,rgba(59,130,246,0.13),transparent_68%)]" />
        <div className="absolute -right-40 -top-40 size-[620px] rounded-full bg-brand/15 blur-[120px]" />
        <div className="absolute -left-40 top-40 size-[420px] rounded-full bg-brand/8 blur-[100px]" />
        <svg
          className={cn(
            "absolute right-[-60px] top-[90px] hidden h-[420px] w-[420px] text-brand/20 lg:block",
            !reduceMotion && "animate-spin-slow",
          )}
          viewBox="0 0 400 400"
          fill="none"
        >
          <ellipse cx="200" cy="200" rx="185" ry="80" stroke="currentColor" strokeDasharray="2 7" />
          <ellipse
            cx="200"
            cy="200"
            rx="185"
            ry="80"
            stroke="currentColor"
            strokeDasharray="2 7"
            transform="rotate(62 200 200)"
          />
        </svg>
      </div>

      <div className="container-page relative grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-line bg-surface/70 py-1 pl-1 pr-3.5 text-[10.5px] font-semibold text-muted shadow-[0_1px_2px_rgba(0,0,0,.03)] backdrop-blur sm:text-[11.5px]">
              <span className="grid size-6 place-items-center rounded-full bg-brand text-white">
                <Sparkles className="size-3" />
              </span>
              Программа «Карьерный старт»
              <span className="h-3 w-px bg-line" />
              <span className="text-brand">2026</span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
            className="mt-5 text-[clamp(2.05rem,5vw,3.5rem)] font-semibold leading-[1.02] tracking-[-0.045em] text-balance sm:mt-6"
          >
            Первая работа
            <br />
            начинается <span className="text-gradient">здесь</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
            className="mt-4 max-w-[480px] text-[14.5px] leading-relaxed text-muted sm:mt-5 sm:text-[16.5px]"
          >
            Вакансии и стажировки с гибким графиком, мероприятия с отметкой в резюме и ИИ, который
            помогает выбрать профессию. Без опыта — но с настоящим будущим.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
          >
            <form
              onSubmit={onSubmit}
              className="mt-6 rounded-[24px] border border-line bg-surface p-2 shadow-[var(--shadow-float)] sm:mt-8 sm:rounded-[26px]"
            >
              <div className="flex gap-1 px-1 pt-1">
                {tabs.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setTab(item)}
                    className={cn(
                      "relative rounded-full px-3 py-1.5 text-[11.5px] font-semibold transition-colors",
                      tab === item ? "text-brand" : "text-muted hover:text-fg",
                    )}
                  >
                    {tab === item && (
                      <motion.span
                        layoutId="hero-search-tab"
                        className="absolute inset-0 rounded-full bg-brand-soft"
                        transition={{ type: "spring", stiffness: 420, damping: 32 }}
                      />
                    )}
                    <span className="relative">{item}</span>
                  </button>
                ))}
              </div>

              <div className="mt-1 flex flex-col gap-2 p-1 sm:flex-row sm:items-center">
                <div className="relative flex-1">
                  <Search className="pointer-events-none absolute left-3.5 top-1/2 size-[17px] -translate-y-1/2 text-faint" />
                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder={
                      tab === "Вакансии"
                        ? "Кем хочешь работать?"
                        : tab === "Стажировки"
                          ? "Направление стажировки"
                          : "Что тебе интересно?"
                    }
                    className="h-11 w-full rounded-2xl bg-transparent pl-10 pr-3 text-[13.5px] outline-none placeholder:text-faint"
                  />
                </div>
                <div className="hidden h-7 w-px bg-line sm:block" />
                <div className="flex items-center gap-2 sm:contents">
                  <div className="relative flex flex-1 items-center sm:w-[150px] sm:flex-none">
                    <MapPin className="pointer-events-none absolute left-3 size-4 text-faint" />
                    <select
                      value={city}
                      onChange={(event) => setCity(event.target.value)}
                      className="h-11 w-full cursor-pointer appearance-none rounded-2xl bg-transparent pl-9 pr-6 text-[12.5px] font-medium text-muted outline-none"
                    >
                      <option>Все города</option>
                      <option>Астрахань</option>
                      <option>Нариманов</option>
                    </select>
                    <ChevronDownMini />
                  </div>
                  <button
                    type="submit"
                    className={buttonStyles({ className: "h-11 shrink-0 px-4 sm:px-5" })}
                  >
                    Найти
                    <ArrowRight className="size-4" />
                  </button>
                </div>
              </div>
            </form>

            <div className="mt-3 flex flex-wrap items-center gap-1.5">
              <span className="mr-1 hidden text-[11px] text-faint sm:inline">Часто ищут:</span>
              {popularSearches.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => {
                    setQuery(item.label);
                    setTab(item.tab);
                    const search = { q: item.label };
                    if (item.tab === "Мероприятия") void navigate({ to: "/events", search });
                    else void navigate({ to: "/vacancies", search });
                  }}
                  className="rounded-full border border-line bg-surface/60 px-2 py-1 text-[10.5px] font-medium text-muted transition hover:border-brand/30 hover:text-brand sm:px-2.5 sm:text-[11px]"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-9 grid max-w-[480px] grid-cols-3 gap-4 border-t border-line pt-5"
          >
            {[
              { value: "2 400+", label: "вакансий" },
              { value: "380", label: "стажировок" },
              { value: "96", label: "предприятий" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-[20px] font-bold tracking-[-0.04em]">{stat.value}</p>
                <p className="mt-0.5 text-[11px] text-muted">{stat.label}</p>
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="sm:hidden"
          >
            <Link
              to="/vacancies/$vacancyId"
              params={{ vacancyId: featuredVacancy.id }}
              className="mt-5 flex items-center gap-3 rounded-2xl border border-line bg-surface p-3.5 shadow-[var(--shadow-soft)]"
            >
              <CompanyLogo company={featuredCompany} size="sm" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-[0.1em] text-brand">
                    <Sparkles className="size-2.5" />
                    Подобрано под тебя
                  </p>
                  <span className="shrink-0 text-[10px] font-bold text-brand">94%</span>
                </div>
                <p className="mt-1 line-clamp-2 text-[12px] font-semibold leading-snug">
                  {featuredVacancy.title}
                </p>
                <p className="mt-0.5 truncate text-[10px] text-muted">
                  {formatSalary(featuredVacancy.salaryFrom, featuredVacancy.salaryTo)} ·{" "}
                  {featuredCompany.name}
                </p>
              </div>
            </Link>
            <div className="mt-2 flex gap-2">
              <span className="inline-flex min-w-0 flex-1 items-center gap-1.5 rounded-xl border border-line bg-surface/70 px-2.5 py-2 text-[9.5px] font-medium text-muted">
                <ShieldCheck className="size-3.5 shrink-0 text-emerald-500" />
                <span className="truncate">Профиль подтверждён</span>
              </span>
              <span className="inline-flex min-w-0 flex-1 items-center gap-1.5 rounded-xl border border-line bg-surface/70 px-2.5 py-2 text-[9.5px] font-medium text-muted">
                <CalendarCheck className="size-3.5 shrink-0 text-brand" />
                <span className="truncate">
                  {formatDate(nearestEvent.date)} · +{nearestEvent.hours} ч
                </span>
              </span>
            </div>
          </motion.div>
        </div>

        <HeroVisual />
      </div>
    </section>
  );
}

function ChevronDownMini() {
  return (
    <svg
      viewBox="0 0 12 12"
      className="pointer-events-none absolute right-2.5 size-3 text-faint"
      fill="none"
    >
      <path d="M3 4.5 6 7.5 9 4.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function HeroVisual() {
  const vacancy = vacancies[0];
  const company = companyMap[vacancy.companyId];
  const event = events[0];
  const favorite = useUser((state) => state.favorites.includes(vacancy.id));
  const toggleFavorite = useUser((state) => state.toggleFavorite);

  return (
    <div className="relative mx-auto hidden w-full max-w-[460px] sm:block">
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        className="relative"
      >
        <div className="absolute -inset-8 -z-10 rounded-full bg-brand/15 blur-[70px]" />

        <div className="noise relative overflow-hidden rounded-[30px] border border-line bg-surface p-5 shadow-[var(--shadow-soft)]">
          <div className="flex items-center justify-between">
            <Badge variant="brand">
              <Sparkles className="size-3" />
              Подобрано ИИ
            </Badge>
            <span className="text-[10.5px] font-medium text-faint">обновлено сейчас</span>
          </div>

          <div className="mt-4 flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <CompanyLogo company={company} />
              <div>
                <p className="text-[15px] font-semibold leading-snug tracking-[-0.02em]">
                  {vacancy.title}
                </p>
                <p className="mt-1 flex items-center gap-1 text-[11.5px] text-muted">
                  {company.name}
                  <BadgeCheck className="size-3.5 text-brand" />
                </p>
              </div>
            </div>
            <MatchRing value={94} />
          </div>

          <div className="mt-4 flex items-center justify-between rounded-2xl bg-surface-2 px-3.5 py-3">
            <span className="text-[14px] font-bold tracking-[-0.02em]">
              {formatSalary(vacancy.salaryFrom, vacancy.salaryTo)}
            </span>
            <span className="text-[10.5px] text-muted">20–30 ч / неделю</span>
          </div>

          <div className="mt-4">
            <div className="mb-1.5 flex justify-between text-[10px] text-faint">
              <span>Совпадение по навыкам</span>
              <span className="font-semibold text-brand">отлично</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-surface-3">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "94%" }}
                transition={{ duration: 1.1, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="h-full rounded-full bg-linear-to-r from-brand-400 to-brand-600"
              />
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-1.5">
            {vacancy.skills.slice(0, 4).map((skill) => (
              <span
                key={skill}
                className="rounded-full border border-line bg-surface px-2.5 py-1 text-[10.5px] font-medium text-muted"
              >
                {skill}
              </span>
            ))}
          </div>

          <div className="mt-4 flex items-center gap-2">
            <Link
              to="/vacancies/$vacancyId"
              params={{ vacancyId: vacancy.id }}
              className={buttonStyles({ className: "h-10 flex-1 text-[12.5px]" })}
            >
              Посмотреть вакансию
              <ArrowRight className="size-3.5" />
            </Link>
            <button
              type="button"
              aria-label={favorite ? "Убрать из избранного" : "В избранное"}
              aria-pressed={favorite}
              onClick={() => toggleFavorite(vacancy.id)}
              className="grid size-10 shrink-0 place-items-center rounded-full border border-line bg-surface text-muted transition hover:text-rose-500"
            >
              <Heart className={cn("size-4", favorite && "fill-current text-rose-500")} />
            </button>
          </div>

          <div className="mt-3 flex items-center justify-center gap-1.5 text-[10px] text-faint">
            <Sparkles className="size-3 text-brand" />
            Ещё 11 вакансий с совпадением выше 85%
          </div>
        </div>

        <div className="mt-2 grid grid-cols-2 gap-2">
          <div className="flex items-center gap-2 rounded-2xl border border-line bg-surface/70 px-3 py-2.5">
            <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-emerald-500/10 text-emerald-500">
              <ShieldCheck className="size-3.5" />
            </span>
            <div className="min-w-0">
              <p className="text-[10px] font-semibold leading-tight">Профиль подтверждён</p>
              <p className="truncate text-[9px] text-muted">Госуслуги · трудовая</p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-2xl border border-line bg-surface/70 px-3 py-2.5">
            <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-brand-soft text-brand">
              <CalendarCheck className="size-3.5" />
            </span>
            <div className="min-w-0">
              <p className="text-[10px] font-semibold leading-tight">
                {formatDate(event.date)} · ярмарка
              </p>
              <p className="truncate text-[9px] text-muted">+{event.hours} ч в резюме</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function MatchRing({ value }: { value: number }) {
  const radius = 25;
  const circumference = 2 * Math.PI * radius;
  return (
    <div className="relative size-[62px] shrink-0">
      <svg viewBox="0 0 62 62" className="size-full -rotate-90">
        <circle cx="31" cy="31" r={radius} fill="none" strokeWidth="5" className="stroke-surface-3" />
        <motion.circle
          cx="31"
          cy="31"
          r={radius}
          fill="none"
          strokeWidth="5"
          strokeLinecap="round"
          className="stroke-brand"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference * (1 - value / 100) }}
          transition={{ duration: 1.3, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center">
        <span className="text-[12.5px] font-bold tracking-[-0.02em]">{value}%</span>
      </div>
    </div>
  );
}

function TrustStrip() {
  const partners = companies.slice(0, 6);
  return (
    <section className="border-y border-line bg-surface/50 py-6 sm:py-8">
      <div className="container-page">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-baseline gap-2.5">
            <p className="text-[20px] font-bold tracking-[-0.04em]">96</p>
            <p className="max-w-[220px] text-[11.5px] leading-snug text-muted">
              предприятий-партнёров уже нанимают студентов через Орбиту
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 lg:justify-end">
            {partners.map((company) => (
              <div key={company.id} className="flex items-center gap-2 opacity-65 transition hover:opacity-100">
                <CompanyLogo company={company} size="sm" className="size-7 rounded-lg text-[9px]" />
                <span className="text-[12.5px] font-semibold tracking-[-0.01em]">{company.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Modules() {
  return (
    <section className="py-14 sm:py-20 lg:py-28">
      <div className="container-page">
        <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <div className="mb-4 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-brand">
              <span className="h-px w-6 bg-brand/50" />
              Шесть модулей
            </div>
            <h2 className="text-[clamp(1.9rem,3.6vw,3rem)] font-semibold leading-[1.05] tracking-[-0.04em] text-balance">
              Всё, что нужно для старта карьеры — в одном месте
            </h2>
            <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-muted">
              Не просто доска объявлений. Экосистема, где вуз, предприятие и студент действуют
              вместе — с подтверждёнными данными и понятным результатом.
            </p>
          </div>
          <Link
            to="/vacancies"
            className={buttonStyles({ variant: "secondary", className: "shrink-0" })}
          >
            Начать поиск
            <ArrowUpRight className="size-4" />
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-12">
          <ModuleCard
            className="lg:col-span-7 lg:row-span-2"
            icon={<Briefcase className="size-5" />}
            index="01"
            title="Вакансии и резюме"
            description="Тысячи предложений от работодателей региона и проверенные резюме студентов. Умный подбор по навыкам, формату и загрузке."
            href="/vacancies"
            visual={<VacancyModuleVisual />}
          />
          <ModuleCard
            className="lg:col-span-5 border-brand/20 bg-linear-to-br from-brand-600 via-brand-700 to-[#0b1e4d] text-white"
            icon={<Landmark className="size-5" />}
            index="04"
            title="Госуслуги и трудовая"
            description="Подтверждённый профиль, проверенный СНИЛС и электронная трудовая книжка из СФР."
            href="/profile"
            dark
            visual={<VerificationVisual />}
          />
          <ModuleCard
            className="lg:col-span-5 border-white/10 bg-[#080a10] text-white"
            icon={<Bot className="size-5" />}
            index="05"
            title="Внутренний ИИ-помощник"
            description="Профориентация, подбор вакансий и курсов, сборка резюме и подготовка к собеседованию."
            href="/ai"
            dark
            visual={<AiVisual />}
          />
          <ModuleCard
            className="lg:col-span-4"
            icon={<Target className="size-5" />}
            index="02"
            title="Практики от предприятий"
            description="Договор о практике «студент — вуз — предприятие» с оплатой и наставником."
            href="/internships"
            visual={<TripartiteVisual />}
          />
          <ModuleCard
            className="lg:col-span-4"
            icon={<CalendarDays className="size-5" />}
            index="03"
            title="Мероприятия"
            description="Дни открытых дверей, семинары и ярмарки. Участие автоматически попадает в резюме."
            href="/events"
            visual={<EventsVisual />}
          />
          <ModuleCard
            className="lg:col-span-4"
            icon={<GraduationCap className="size-5" />}
            index="06"
            title="Траектория с вузами"
            description="Совместные программы и заказ на подготовку специалистов с оплатой за качество."
            href="/education"
            visual={<TrajectoryVisual />}
          />
        </div>
      </div>
    </section>
  );
}

type ModuleHref = "/vacancies" | "/internships" | "/events" | "/profile" | "/ai" | "/education";

function ModuleCard({
  icon,
  index,
  title,
  description,
  href,
  visual,
  className,
  dark = false,
}: {
  icon: ReactNode;
  index: string;
  title: string;
  description: string;
  href: ModuleHref;
  visual: ReactNode;
  className?: string;
  dark?: boolean;
}) {
  return (
    <Link
      to={href}
      className={cn(
        "group card-hover relative flex flex-col overflow-hidden rounded-[28px] border border-line bg-surface p-6 shadow-[var(--shadow-soft)] sm:p-7",
        className,
      )}
    >
      <div className="flex items-start justify-between">
        <span
          className={cn(
            "grid size-11 place-items-center rounded-[15px]",
            dark ? "bg-white/10 text-white" : "bg-brand-soft text-brand",
          )}
        >
          {icon}
        </span>
        <span
          className={cn(
            "text-[11px] font-bold tracking-[0.14em]",
            dark ? "text-white/30" : "text-faint/70",
          )}
        >
          {index}
        </span>
      </div>

      <h3
        className={cn(
          "mt-5 text-[21px] font-semibold leading-tight tracking-[-0.03em]",
          dark && "text-white",
        )}
      >
        {title}
      </h3>
      <p
        className={cn(
          "mt-2.5 max-w-[400px] text-[12.5px] leading-relaxed",
          dark ? "text-white/60" : "text-muted",
        )}
      >
        {description}
      </p>

      <div className="mt-5 flex-1">{visual}</div>

      <span
        className={cn(
          "mt-5 inline-flex items-center gap-1 text-[11.5px] font-bold transition-all duration-300 group-hover:gap-2",
          dark ? "text-white" : "text-brand",
        )}
      >
        Подробнее
        <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}

function VacancyModuleVisual() {
  return (
    <div className="relative mt-2 rounded-[22px] border border-line bg-surface-2/70 p-3.5">
      <div className="flex items-center gap-2 rounded-xl border border-line bg-surface px-3 py-2.5">
        <Search className="size-3.5 text-faint" />
        <span className="text-[11px] text-faint">Frontend, гибкий график</span>
        <span className="ml-auto rounded-md bg-brand px-1.5 py-0.5 text-[9px] font-bold text-white">
          найти
        </span>
      </div>
      <div className="mt-2.5 space-y-2">
        {[
          { id: "kaspiytech", title: "Junior Frontend-разработчик", salary: "45–65 тыс. ₽", match: 94 },
          { id: "meridian-media", title: "SMM-специалист", salary: "30–40 тыс. ₽", match: 88 },
          { id: "astrasoft", title: "Python-разработчик (стажёр)", salary: "50–70 тыс. ₽", match: 90 },
        ].map((item, index) => {
          const company = companyMap[item.id];
          return (
            <div
              key={item.id}
              className={cn(
                "flex items-center gap-2.5 rounded-xl border border-line bg-surface p-2.5 transition group-hover:border-brand/20",
                index === 2 && "hidden sm:flex",
              )}
            >
              <CompanyLogo company={company} size="sm" className="size-8 rounded-[10px] text-[9px]" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[11px] font-semibold">{item.title}</p>
                <p className="text-[9.5px] text-muted">{item.salary} · {company.name}</p>
              </div>
              <span className="rounded-full bg-emerald-500/10 px-1.5 py-0.5 text-[9px] font-bold text-emerald-600 dark:text-emerald-400">
                {item.match}%
              </span>
            </div>
          );
        })}
      </div>
      <div className="mt-2.5 flex items-center justify-between rounded-xl border border-dashed border-brand/25 bg-brand-soft/50 px-3 py-2">
        <div className="flex items-center gap-2">
          <span className="grid size-6 place-items-center rounded-full bg-brand text-white">
            <Check className="size-3" />
          </span>
          <div>
            <p className="text-[10px] font-semibold">Резюме проверено</p>
            <p className="text-[9px] text-muted">Орбита · 12 ноября</p>
          </div>
        </div>
        <span className="text-[9px] font-bold text-brand">готово к отклику</span>
      </div>
      <div className="mt-2.5 flex items-center gap-2.5 rounded-xl border border-line bg-surface px-3 py-2.5">
        <span className="grid size-7 shrink-0 place-items-center rounded-full bg-gradient-to-br from-brand-400 to-brand-800 text-[9px] font-bold text-white">
          ДВ
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[10px] font-semibold">Даниил Ветров · 4 курс</p>
          <p className="text-[9px] text-muted">Frontend · 149 ч активности</p>
        </div>
        <span className="rounded-full bg-emerald-500/10 px-1.5 py-0.5 text-[8.5px] font-bold text-emerald-600 dark:text-emerald-400">
          96%
        </span>
      </div>
      <div className="mt-2.5 hidden items-center gap-2.5 rounded-xl border border-line bg-surface px-3 py-2.5 sm:flex">
        <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-emerald-500/10 text-emerald-500">
          <CalendarCheck className="size-3.5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-semibold">Собеседование · 15 ноября</p>
          <p className="text-[9px] text-muted">КаспийТех · 14:00, онлайн</p>
        </div>
        <span className="rounded-full bg-emerald-500/10 px-1.5 py-0.5 text-[8px] font-bold text-emerald-600 dark:text-emerald-400">
          ок
        </span>
      </div>
      <div className="mt-2.5 hidden grid-cols-2 gap-2 sm:grid">
        <div className="rounded-xl border border-line bg-surface p-2.5">
          <p className="text-[8px] uppercase tracking-wide text-faint">Новых совпадений</p>
          <p className="mt-1 text-[15px] font-bold leading-none">12</p>
          <p className="mt-1 text-[8px] text-emerald-500">+4 за неделю</p>
        </div>
        <div className="rounded-xl border border-line bg-surface p-2.5">
          <p className="text-[8px] uppercase tracking-wide text-faint">Приглашения</p>
          <p className="mt-1 text-[15px] font-bold leading-none">3</p>
          <p className="mt-1 text-[8px] text-brand">от работодателей</p>
        </div>
      </div>
      <div className="mt-2.5 hidden rounded-xl border border-line bg-surface px-3 py-2.5 sm:block">
        <div className="flex justify-between text-[9px]">
          <span className="text-muted">Профиль готов к отклику</span>
          <span className="font-bold text-brand">92%</span>
        </div>
        <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-surface-3">
          <div className="h-full w-[92%] rounded-full bg-brand" />
        </div>
      </div>
      <div className="pointer-events-none absolute -right-6 -top-6 size-24 rounded-full bg-brand/10 blur-2xl" />
    </div>
  );
}

function VerificationVisual() {
  return (
    <div className="relative rounded-[20px] border border-white/12 bg-white/[0.06] p-3.5">
      <div className="flex items-center gap-2.5">
        <span className="grid size-9 place-items-center rounded-xl bg-white/12">
          <ShieldCheck className="size-[18px] text-white" />
        </span>
        <div>
          <p className="text-[11px] font-bold">Даниил Ветров</p>
          <p className="text-[9.5px] text-white/55">Проверенный профиль</p>
        </div>
        <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-emerald-400/15 px-2 py-1 text-[9px] font-bold text-emerald-300">
          <BadgeCheck className="size-3" />
          подтверждён
        </span>
      </div>
      <div className="mt-3 space-y-1.5">
        {["Госуслуги", "СНИЛС", "Электронная трудовая"].map((item) => (
          <div key={item} className="flex items-center gap-2 text-[10px] text-white/70">
            <Check className="size-3 text-emerald-300" />
            {item}
            <span className="ml-auto text-white/35">ок</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function AiVisual() {
  return (
    <div className="relative space-y-2 rounded-[20px] border border-white/10 bg-white/[0.04] p-3">
      <div className="flex justify-end">
        <span className="max-w-[80%] rounded-2xl rounded-br-md bg-brand px-3 py-2 text-[10px] leading-relaxed text-white">
          Какие курсы мне нужны для аналитики?
        </span>
      </div>
      <div className="flex justify-start">
        <span className="max-w-[88%] rounded-2xl rounded-bl-md bg-white/[0.08] px-3 py-2 text-[10px] leading-relaxed text-white/80">
          По твоему профилю — SQL и Python. Добавил в траекторию и подобрал 3 стажировки.
        </span>
      </div>
      <div className="flex items-center gap-1.5 pl-1">
        <span className="size-1.5 animate-bounce rounded-full bg-white/40 [animation-delay:-0.2s]" />
        <span className="size-1.5 animate-bounce rounded-full bg-white/40 [animation-delay:-0.1s]" />
        <span className="size-1.5 animate-bounce rounded-full bg-white/40" />
        <span className="ml-1 text-[9px] text-white/35">Орби печатает</span>
      </div>
      <div className="pointer-events-none absolute -left-8 bottom-0 size-28 rounded-full bg-brand/30 blur-3xl" />
    </div>
  );
}

function TripartiteVisual() {
  return (
    <div className="rounded-[20px] border border-line bg-surface-2/60 p-3.5">
      <div className="flex items-center justify-between text-center">
        {[
          { label: "Студент", icon: GraduationCap },
          { label: "Вуз", icon: Landmark },
          { label: "Предприятие", icon: Briefcase },
        ].map((node, index) => (
          <div key={node.label} className="relative flex flex-1 flex-col items-center gap-1.5">
            {index < 2 && (
              <span className="absolute left-[58%] top-4 h-px w-[84%] border-t border-dashed border-brand/30" />
            )}
            <span className="relative grid size-8 place-items-center rounded-full border border-line bg-surface text-brand">
              <node.icon className="size-3.5" />
            </span>
            <span className="text-[9px] font-semibold text-muted">{node.label}</span>
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center justify-center gap-1 rounded-lg bg-emerald-500/10 py-1.5 text-[9px] font-bold text-emerald-600 dark:text-emerald-400">
        <BadgeCheck className="size-3" />
        Договор о практике
      </div>
    </div>
  );
}

function EventsVisual() {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2.5 rounded-[16px] border border-line bg-surface-2/60 p-2.5">
        <div className="grid w-9 place-items-center rounded-lg bg-brand-soft py-1 text-brand">
          <span className="text-[13px] font-bold leading-none">20</span>
          <span className="text-[7.5px] font-semibold uppercase">ноя</span>
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[10px] font-semibold">Ярмарка «Старт карьеры»</p>
          <p className="text-[8.5px] text-muted">АГТУ · 60 компаний</p>
        </div>
        <BadgeCheck className="size-3.5 shrink-0 text-emerald-500" />
      </div>
      <div className="flex items-center gap-1.5 rounded-lg bg-brand-soft/60 px-2.5 py-1.5 text-[9px] font-semibold text-brand">
        <CalendarCheck className="size-3" />
        Отметка добавлена в резюме
      </div>
    </div>
  );
}

function TrajectoryVisual() {
  return (
    <div className="rounded-[20px] border border-line bg-surface-2/60 p-3.5">
      <div className="relative flex items-center justify-between">
        <span className="absolute left-2 right-2 top-3 h-px bg-brand/25" />
        {[
          { label: "Вуз", done: true },
          { label: "Стажировка", done: true },
          { label: "Оффер", done: false },
        ].map((step) => (
          <div key={step.label} className="relative flex flex-col items-center gap-1.5">
            <span
              className={cn(
                "grid size-6 place-items-center rounded-full border-2 text-[8px] font-bold",
                step.done
                  ? "border-brand bg-brand text-white"
                  : "border-dashed border-brand/40 bg-surface text-brand",
              )}
            >
              {step.done ? <Check className="size-3" /> : "4"}
            </span>
            <span className="text-[8.5px] font-semibold text-muted">{step.label}</span>
          </div>
        ))}
      </div>
      <p className="mt-3 text-center text-[9px] text-faint">
        Заказ на подготовку · оплата за качество
      </p>
    </div>
  );
}

function FeaturedVacancies() {
  const { data, isLoading } = useQuery({ queryKey: ["vacancies"], queryFn: fetchVacancies });
  const featured = (data ?? vacancies).slice(0, 3);

  return (
    <section className="border-y border-line bg-bg-soft/50 py-14 sm:py-24">
      <div className="container-page">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-brand">
              <span className="h-px w-6 bg-brand/50" />
              Подобрано для тебя
            </div>
            <h2 className="text-[clamp(1.8rem,3.2vw,2.6rem)] font-semibold leading-[1.06] tracking-[-0.04em]">
              Вакансии, где ждут студентов
            </h2>
          </div>
          <Link to="/vacancies" className={buttonStyles({ variant: "secondary", size: "sm" })}>
            Все 2 400 вакансий
            <ArrowRight className="size-3.5" />
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {isLoading
            ? Array.from({ length: 3 }).map((_, index) => (
                <Card key={index} className="space-y-4 p-5">
                  <div className="flex gap-3">
                    <Skeleton className="size-12 rounded-2xl" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-3.5 w-4/5" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </div>
                  <Skeleton className="h-3 w-2/3" />
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-16 rounded-full" />
                    <Skeleton className="h-6 w-20 rounded-full" />
                  </div>
                  <Skeleton className="h-8 w-full" />
                </Card>
              ))
            : featured.map((vacancy) => <VacancyCard key={vacancy.id} vacancy={vacancy} />)}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      icon: Target,
      title: "Заполни профиль",
      text: "Импортируй данные из Госуслуг и собери резюме с ИИ за пару минут.",
    },
    {
      icon: Sparkles,
      title: "Получи подбор",
      text: "Алгоритм предложит вакансии, стажировки и мероприятия под твои навыки.",
    },
    {
      icon: Briefcase,
      title: "Начни практику",
      text: "Договор о практике с предприятием и вузом: оплата, наставник, зачёт.",
    },
    {
      icon: TrendingUp,
      title: "Собери портфолио",
      text: "Каждое событие и курс — подтверждённая отметка в резюме и трудовая книжка.",
    },
  ];

  return (
    <section className="py-14 sm:py-24">
      <div className="container-page">
        <div className="mb-8 max-w-2xl sm:mb-12">
          <div className="mb-4 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-brand">
            <span className="h-px w-6 bg-brand/50" />
            Как это работает
          </div>
          <h2 className="text-[clamp(1.8rem,3.4vw,2.7rem)] font-semibold leading-[1.06] tracking-[-0.04em]">
            От первого клика до первого оффера
          </h2>
        </div>

        <div className="relative grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="pointer-events-none absolute left-[12%] right-[12%] top-[46px] hidden border-t border-dashed border-line lg:block" />
          {steps.map((step, index) => (
            <div key={step.title} className="relative rounded-[20px] border border-line bg-surface p-4 sm:rounded-[24px] sm:p-6">
              <div className="flex items-center justify-between">
                <span className="grid size-11 place-items-center rounded-2xl bg-brand-soft text-brand">
                  <step.icon className="size-5" />
                </span>
                <span className="text-[11px] font-bold tracking-[0.15em] text-faint">
                  0{index + 1}
                </span>
              </div>
              <h3 className="mt-5 text-[15px] font-semibold tracking-[-0.02em]">{step.title}</h3>
              <p className="mt-2 text-[12px] leading-relaxed text-muted">{step.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PracticeAndEvents() {
  const internship = internships[0];
  const company = companyMap[internship.companyId];
  const upcoming = events.slice(0, 3);

  return (
    <section className="py-4">
      <div className="container-page grid gap-4 lg:grid-cols-2">
        <div className="relative overflow-hidden rounded-[30px] border border-line bg-surface p-6 shadow-[var(--shadow-soft)] sm:p-8">
          <div className="absolute -right-16 -top-16 size-48 rounded-full bg-brand/10 blur-3xl" />
          <Badge variant="brand">Модуль 02</Badge>
          <h2 className="mt-4 text-[clamp(1.5rem,2.6vw,2rem)] font-semibold leading-[1.1] tracking-[-0.035em]">
            Практика, которую засчитают
          </h2>
          <p className="mt-3 max-w-[380px] text-[13px] leading-relaxed text-muted">
            Предприятия, вуз и студент подписывают договор о практике. Практика идёт в зачёт, а
            лучшие участники получают оффер — без конкурса на общих основаниях.
          </p>

          <div className="mt-6 rounded-2xl border border-line bg-surface-2 p-4">
            <div className="flex items-center gap-3">
              <CompanyLogo company={company} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-semibold">{internship.title}</p>
                <p className="mt-0.5 text-[11px] text-muted">
                  {company.name} · {internship.duration} · {formatMoney(internship.stipend)} ₽/мес
                </p>
              </div>
              <span className="rounded-full bg-emerald-500/10 px-2 py-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                {internship.hiringChance}% офер
              </span>
            </div>
            <div className="mt-3 flex items-center gap-1.5 border-t border-line pt-3 text-[10.5px] text-muted">
              <Users className="size-3.5 text-brand" />
              {internship.seats} мест · отбор до {formatDate(internship.deadline)}
            </div>
          </div>

          <Link
            to="/internships"
            className="mt-5 inline-flex items-center gap-1.5 text-[12.5px] font-bold text-brand transition hover:gap-2.5"
          >
            Все программы практик
            <ArrowRight className="size-4" />
          </Link>
        </div>

        <div className="relative overflow-hidden rounded-[30px] border border-line bg-surface p-6 shadow-[var(--shadow-soft)] sm:p-8">
          <div className="absolute -right-16 -top-16 size-48 rounded-full bg-brand/8 blur-3xl" />
          <div className="flex items-center justify-between">
            <Badge variant="brand">Модуль 03</Badge>
            <Link to="/events" className="text-[11px] font-semibold text-muted hover:text-fg">
              Все события
            </Link>
          </div>
          <h2 className="mt-4 text-[clamp(1.5rem,2.6vw,2rem)] font-semibold leading-[1.1] tracking-[-0.035em]">
            Ближайшие мероприятия
          </h2>

          <div className="mt-5 divide-y divide-line">
            {upcoming.map((event) => (
              <div key={event.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                <div className="grid w-11 shrink-0 place-items-center rounded-xl border border-line bg-surface-2 py-1.5">
                  <span className="text-[15px] font-bold leading-none">
                    {new Date(event.date).getDate()}
                  </span>
                  <span className="mt-0.5 text-[7.5px] font-semibold uppercase text-muted">
                    {formatDate(event.date).split(" ")[1]}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[12px] font-semibold">{event.title}</p>
                  <p className="mt-0.5 text-[10px] text-muted">
                    {event.time} · {event.format} · +{event.hours} ч
                  </p>
                </div>
                <ChevronRight className="size-4 shrink-0 text-faint" />
              </div>
            ))}
          </div>

          <Link
            to="/events"
            className="mt-5 inline-flex items-center gap-1.5 text-[12.5px] font-bold text-brand transition hover:gap-2.5"
          >
            Записаться на событие
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function AiShowcase() {
  return (
    <section className="py-14 sm:py-24">
      <div className="container-page">
        <div className="noise relative overflow-hidden rounded-[34px] border border-white/10 bg-[#07090f] p-7 text-white sm:p-10 lg:p-14">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -right-20 -top-24 size-[420px] rounded-full bg-brand/25 blur-[100px]" />
            <div className="absolute -bottom-32 left-10 size-[340px] rounded-full bg-indigo-500/15 blur-[100px]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,.08)_1px,transparent_0)] [background-size:28px_28px] opacity-40" />
          </div>

          <div className="relative grid gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-center">
            <div>
              <Badge className="border border-white/15 bg-white/10 text-white">
                <Bot className="size-3" />
                Модуль 05 · Орби AI
              </Badge>
              <h2 className="mt-5 max-w-[560px] text-[clamp(1.9rem,3.8vw,3rem)] font-semibold leading-[1.04] tracking-[-0.04em] text-balance">
                Карьерный наставник, который всегда на связи
              </h2>
              <p className="mt-4 max-w-[490px] text-[14px] leading-relaxed text-white/60">
                Орби знает региональный рынок труда, ваши навыки и требования работодателей. Он
                подберёт стажировку, объяснит, каких курсов не хватает, и соберёт резюме, которое
                дочитают.
              </p>

              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                {[
                  { icon: Target, title: "Профориентация", text: "6 вопросов — и понятная сфера" },
                  { icon: Search, title: "Умный подбор", text: "Вакансии по навыкам и графику" },
                  { icon: Wand2, title: "Резюме и письмо", text: "Черновик за 2 минуты" },
                  { icon: MessageSquareIcon, title: "Подготовка", text: "Вопросы и разбор ответов" },
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-2.5">
                    <span className="grid size-8 shrink-0 place-items-center rounded-xl bg-white/10 text-white">
                      <item.icon className="size-4" />
                    </span>
                    <div>
                      <p className="text-[11.5px] font-semibold">{item.title}</p>
                      <p className="text-[10.5px] text-white/45">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/ai"
                  search={{ tab: "chat" }}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-white px-6 text-[13px] font-bold text-[#07090f] transition hover:bg-white/90"
                >
                  Открыть ИИ-помощника
                  <Sparkles className="size-4" />
                </Link>
                <Link
                  to="/ai"
                  search={{ tab: "test" }}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-white/20 px-6 text-[13px] font-semibold text-white transition hover:bg-white/10"
                >
                  Пройти профориентацию
                  <ArrowRight className="size-4" />
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="rounded-[26px] border border-white/10 bg-white/[0.04] p-4 backdrop-blur">
                <div className="flex items-center gap-2.5 border-b border-white/10 pb-3">
                  <span className="grid size-8 place-items-center rounded-full bg-linear-to-br from-brand-400 to-brand-700">
                    <Sparkles className="size-4" />
                  </span>
                  <div>
                    <p className="text-[11px] font-semibold">Орби</p>
                    <p className="text-[9px] text-emerald-400">онлайн · отвечает мгновенно</p>
                  </div>
                  <span className="ml-auto rounded-full bg-white/10 px-2 py-1 text-[8.5px] font-semibold text-white/60">
                    beta
                  </span>
                </div>

                <div className="mt-4 space-y-3">
                  <div className="flex justify-end">
                    <div className="max-w-[85%] rounded-2xl rounded-br-md bg-brand px-3.5 py-2.5 text-[11px] leading-relaxed">
                      Хочу стажировку в IT, но учусь на экономиста. Реально?
                    </div>
                  </div>
                  <div className="flex justify-start">
                    <div className="max-w-[90%] rounded-2xl rounded-bl-md bg-white/[0.07] px-3.5 py-2.5 text-[11px] leading-relaxed text-white/80">
                      Да. У тебя есть Excel и аналитическое мышление — это база. Предлагаю
                      3-месячную стажировку в КаспийТехе и курс по SQL. Загрузить резюме?
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pl-1">
                    {["Подобрать стажировку", "Показать курс"].map((chip) => (
                      <span
                        key={chip}
                        className="rounded-full border border-white/15 px-2.5 py-1 text-[9.5px] text-white/60"
                      >
                        {chip}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-2.5">
                  <span className="text-[10.5px] text-white/35">Спросить Орби…</span>
                  <span className="ml-auto grid size-7 place-items-center rounded-full bg-brand">
                    <ArrowUpRight className="size-3.5" />
                  </span>
                </div>
              </div>

              <div className="absolute -left-4 -top-5 hidden rounded-2xl border border-white/10 bg-[#0d1017] px-3 py-2 shadow-2xl sm:block">
                <p className="text-[9px] text-white/40">Точность подбора</p>
                <p className="text-[15px] font-bold tracking-tight">94%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function MessageSquareIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.7">
      <path
        d="M21 12a8 8 0 0 1-8 8H7l-4 3V12a8 8 0 0 1 8-8h2a8 8 0 0 1 8 8Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function VerificationShowcase() {
  return (
    <section className="py-4">
      <div className="container-page">
        <div className="grid items-center gap-10 rounded-[32px] border border-line bg-surface p-7 shadow-[var(--shadow-soft)] sm:p-10 lg:grid-cols-[1fr_0.85fr] lg:p-12">
          <div>
            <Badge variant="brand">
              <Landmark className="size-3" />
              Модуль 04 · Госуслуги
            </Badge>
            <h2 className="mt-4 max-w-[520px] text-[clamp(1.8rem,3.2vw,2.6rem)] font-semibold leading-[1.07] tracking-[-0.04em]">
              Профиль, которому доверяют с первого взгляда
            </h2>
            <p className="mt-4 max-w-[500px] text-[13.5px] leading-relaxed text-muted">
              Вход через Госуслуги, проверка СНИЛС и автоматическая загрузка записей из электронной
              трудовой книжки. Работодатель видит подтверждённый опыт — вы не тратите время на
              справки.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {["Подтверждённый профиль", "Электронная трудовая", "Согласие на данные"].map(
                (item) => (
                  <span
                    key={item}
                    className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface-2 px-3 py-1.5 text-[11px] font-medium text-muted"
                  >
                    <Check className="size-3 text-emerald-500" />
                    {item}
                  </span>
                ),
              )}
            </div>
            <Link
              to="/profile"
              className={buttonStyles({ className: "mt-7", variant: "dark", size: "md" })}
            >
              Проверить профиль
              <ArrowUpRight className="size-4" />
            </Link>
          </div>

          <div className="relative">
            <div className="rounded-[24px] border border-line bg-surface-2 p-5">
              <div className="flex items-center gap-3">
                <span className="grid size-11 place-items-center rounded-full bg-linear-to-br from-brand-400 to-brand-800 text-[12px] font-bold text-white">
                  ДВ
                </span>
                <div>
                  <p className="flex items-center gap-1.5 text-[13px] font-semibold">
                    Даниил Ветров
                    <BadgeCheck className="size-4 text-brand" />
                  </p>
                  <p className="text-[10.5px] text-muted">СНИЛС ··· 789 00 · проверено 02.10.2026</p>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                {[
                  { icon: Landmark, title: "Госуслуги", note: "личность подтверждена" },
                  { icon: ShieldCheck, title: "СНИЛС", note: "совпадает с профилем" },
                  { icon: Briefcase, title: "Электронная трудовая", note: "4 записи из СФР" },
                ].map((row) => (
                  <div
                    key={row.title}
                    className="flex items-center gap-2.5 rounded-xl border border-line bg-surface px-3 py-2.5"
                  >
                    <span className="grid size-7 place-items-center rounded-lg bg-emerald-500/10 text-emerald-500">
                      <row.icon className="size-3.5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-[10.5px] font-semibold">{row.title}</p>
                      <p className="text-[9px] text-muted">{row.note}</p>
                    </div>
                    <Check className="size-3.5 text-emerald-500" />
                  </div>
                ))}
              </div>
              <div className="mt-3 flex items-center gap-2 rounded-xl bg-brand-soft px-3 py-2 text-[9.5px] font-medium text-brand">
                <Sparkles className="size-3" />
                Работодатели видят бейдж «Проверенный профиль»
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  const items = [
    {
      quote:
        "Через Орбиту попала на стажировку в КаспийТех, а через три месяца получила оффер. На собеседовании больше всего спрашивали про хакатон — отметки о мероприятиях реально работают.",
      name: "Полина Соколова",
      role: "3 курс, АГУ · аналитик данных",
      c1: "#8b5cf6",
      c2: "#6d28d9",
    },
    {
      quote:
        "Для предприятия договор о практике снимает половину вопросов: студент приходит подготовленный, вуз закрывает документы, а мы платим за результат. Уже взяли шесть стажёров.",
      name: "Игорь Лебедев",
      role: "Head of Analytics, КаспийТех",
      c1: "#3b82f6",
      c2: "#1e40af",
    },
    {
      quote:
        "Собрал резюме с ИИ за вечер и откликнулся на 12 вакансий. Приглашения начали приходить на следующий день. Главное — профиль был подтверждён через Госуслуги.",
      name: "Максим Дорохов",
      role: "4 курс, АГТУ · Python-разработчик",
      c1: "#14b8a6",
      c2: "#0f766e",
    },
  ];

  return (
    <section className="py-14 sm:py-24">
      <div className="container-page">
        <div className="mb-10 max-w-2xl">
          <div className="mb-4 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-brand">
            <span className="h-px w-6 bg-brand/50" />
            Истории
          </div>
          <h2 className="text-[clamp(1.8rem,3.4vw,2.7rem)] font-semibold leading-[1.06] tracking-[-0.04em]">
            Уже не первые шаги
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {items.map((item) => (
            <div
              key={item.name}
              className="card-hover flex h-full flex-col rounded-[26px] border border-line bg-surface p-6 shadow-[var(--shadow-soft)]"
            >
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star key={index} className="size-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="mt-4 flex-1 text-[13px] leading-relaxed text-muted">«{item.quote}»</p>
              <div className="mt-5 flex items-center gap-3 border-t border-line pt-4">
                <span
                  className="grid size-9 place-items-center rounded-full text-[10px] font-bold text-white"
                  style={{ backgroundImage: `linear-gradient(140deg, ${item.c1}, ${item.c2})` }}
                >
                  {item.name
                    .split(" ")
                    .map((part) => part[0])
                    .join("")}
                </span>
                <div>
                  <p className="text-[11.5px] font-semibold">{item.name}</p>
                  <p className="text-[10px] text-faint">{item.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="pb-4 pt-6">
      <div className="container-page">
        <div className="noise relative overflow-hidden rounded-[34px] bg-linear-to-br from-brand-500 via-brand-600 to-brand-800 px-6 py-12 text-center text-white sm:px-12 sm:py-16">
          <div className="pointer-events-none absolute inset-0">
            <svg
              className="absolute left-1/2 top-1/2 h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/2 text-white/10"
              viewBox="0 0 400 400"
              fill="none"
            >
              <ellipse cx="200" cy="200" rx="190" ry="76" stroke="currentColor" />
              <ellipse cx="200" cy="200" rx="190" ry="76" stroke="currentColor" transform="rotate(60 200 200)" />
              <ellipse cx="200" cy="200" rx="190" ry="76" stroke="currentColor" transform="rotate(120 200 200)" />
            </svg>
            <div className="absolute -left-20 -top-20 size-72 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -bottom-24 right-0 size-80 rounded-full bg-[#0b1e4d]/40 blur-3xl" />
          </div>

          <div className="relative">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[10.5px] font-semibold">
              <Sparkles className="size-3" />
              Бесплатно для студентов
            </span>
            <h2 className="mx-auto mt-5 max-w-[700px] text-[clamp(2rem,4.4vw,3.4rem)] font-semibold leading-[1.03] tracking-[-0.045em] text-balance">
              Карьера не начинается после выпуска
            </h2>
            <p className="mx-auto mt-4 max-w-[460px] text-[13.5px] leading-relaxed text-white/70">
              Собери профиль, пройди профориентацию и получи первые предложения уже на этой неделе.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                to="/ai"
                search={{ tab: "resume" }}
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-white px-7 text-[13.5px] font-bold text-brand-800 transition hover:bg-white/90 sm:w-auto"
              >
                Создать резюме
                <ArrowUpRight className="size-4" />
              </Link>
              <Link
                to="/vacancies"
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full border border-white/25 px-7 text-[13.5px] font-semibold text-white transition hover:bg-white/10 sm:w-auto"
              >
                Смотреть вакансии
                <ArrowRight className="size-4" />
              </Link>
            </div>
            <p className="mt-6 text-[10.5px] text-white/50">
              Уже 12 400 студентов Астраханской области на Орбите
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
