import { useEffect, useState } from "react";
import { Link, getRouteApi, useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  BookOpen,
  Briefcase,
  CalendarCheck,
  CalendarDays,
  Check,
  CheckCheck,
  Clock3,
  Download,
  FileCheck2,
  FileText,
  Heart,
  Landmark,
  MapPin,
  RefreshCw,
  Send,
  Share2,
  ShieldCheck,
  Sparkles,
  Trash2,
  UserRound,
} from "lucide-react";
import { demoUser, workRecords } from "@/data/profile";
import { companyMap } from "@/data/companies";
import { vacancyById, vacancies } from "@/data/vacancies";
import { events } from "@/data/events";
import type { ActivityEntry, Application } from "@/data/types";
import { formatDate, formatNumber, plural } from "@/lib/format";
import { cn } from "@/lib/utils";
import { useTitle } from "@/lib/useTitle";
import { useUi } from "@/store/ui";
import { useUser } from "@/store/user";
import { Avatar, Badge, Button, Card, Progress } from "@/components/ui/primitives";
import { CompanyLogo } from "@/components/shared/cards";
import { Modal } from "@/components/ui/Modal";
import { SuccessState } from "@/components/shared/modals";
import { Page } from "@/components/layout/Page";

const routeApi = getRouteApi("/profile");

const profileTabs = [
  { id: "overview", label: "Обзор" },
  { id: "applications", label: "Отклики" },
  { id: "activities", label: "Мероприятия" },
  { id: "workbook", label: "Трудовая книжка" },
  { id: "documents", label: "Документы" },
] as const;

type ProfileTab = (typeof profileTabs)[number]["id"];

const statusMeta: Record<Application["status"], { label: string; variant: "default" | "warning" | "success" }> = {
  sent: { label: "Отправлен", variant: "default" },
  review: { label: "На рассмотрении", variant: "warning" },
  invited: { label: "Приглашение", variant: "success" },
};

export function ProfilePage() {
  useTitle("Личный кабинет");
  const search = routeApi.useSearch();
  const navigate = useNavigate();
  const [tab, setTab] = useState<ProfileTab>(search.tab ?? "overview");
  const [verifyOpen, setVerifyOpen] = useState(false);
  const toast = useUi((state) => state.toast);
  const verified = useUser((state) => state.verified);
  const applications = useUser((state) => state.applications);
  const activities = useUser((state) => state.activities);
  const favorites = useUser((state) => state.favorites);
  const registrations = useUser((state) => state.registrations);

  useEffect(() => {
    if (search.tab) setTab(search.tab);
  }, [search.tab]);

  const changeTab = (next: ProfileTab) => {
    setTab(next);
    void navigate({ to: "/profile", search: { tab: next }, replace: true });
  };

  const hours = activities.reduce((sum, activity) => sum + activity.hours, 0);
  const completion = 92;

  const share = async () => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/resumes`);
      toast({
        title: "Ссылка на профиль скопирована",
        description: "Отправьте её работодателю или другу.",
        variant: "info",
      });
    } catch {
      toast({ title: "Не удалось скопировать ссылку", variant: "error" });
    }
  };

  return (
    <Page>
      <section className="relative overflow-hidden pb-6 pt-24 sm:pt-32">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="grid-bg absolute inset-x-0 top-0 h-[260px] opacity-60" />
          <div className="absolute -right-24 top-0 size-[380px] rounded-full bg-brand/10 blur-[100px]" />
        </div>

        <div className="container-page relative">
          <Card className="overflow-hidden">
            <div className="relative h-[124px] bg-linear-to-br from-brand-500 via-brand-600 to-[#0a1f4d] sm:h-[148px]">
              <div className="pointer-events-none absolute inset-0">
                <svg
                  className="absolute -right-16 -top-24 h-[360px] w-[360px] text-white/15"
                  viewBox="0 0 400 400"
                  fill="none"
                >
                  <ellipse cx="200" cy="200" rx="190" ry="76" stroke="currentColor" strokeDasharray="3 8" />
                  <ellipse
                    cx="200"
                    cy="200"
                    rx="190"
                    ry="76"
                    stroke="currentColor"
                    strokeDasharray="3 8"
                    transform="rotate(60 200 200)"
                  />
                </svg>
                <div className="noise absolute inset-0 opacity-30" />
              </div>
              <div className="absolute left-5 top-5 flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[10px] font-semibold text-white backdrop-blur sm:left-6 sm:top-6">
                <Sparkles className="size-3" />
                Профиль студента · 2026
              </div>
              <div className="absolute right-5 top-5 hidden items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[10px] font-semibold text-white backdrop-blur sm:right-6 sm:top-6 sm:flex">
                <span className="size-1.5 rounded-full bg-emerald-300" />
                Открыт к предложениям · январь 2027
              </div>
            </div>

            <div className="px-5 pb-6 sm:px-7">
              <div className="-mt-10 flex flex-col justify-between gap-4 sm:-mt-12 sm:flex-row sm:items-end">
                <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-end sm:gap-4">
                  <Avatar
                    name={demoUser.name}
                    c1={demoUser.avatarC1}
                    c2={demoUser.avatarC2}
                    size="xl"
                    className="ring-4 ring-surface"
                  />
                  <div className="min-w-0 pb-1 sm:pt-14">
                    <h1 className="flex items-center gap-2 text-[21px] font-semibold tracking-[-0.03em] sm:text-[23px]">
                      {demoUser.name}
                      {verified && <BadgeCheck className="size-5 text-brand" />}
                    </h1>
                    <p className="mt-0.5 text-[12px] text-muted">
                      {demoUser.role} · {demoUser.university}, {demoUser.course} курс
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-1.5">
                      {verified ? (
                        <button
                          type="button"
                          onClick={() => setVerifyOpen(true)}
                          className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10px] font-bold text-emerald-600 transition hover:bg-emerald-500/15 dark:text-emerald-400"
                        >
                          <ShieldCheck className="size-3" />
                          Подтверждён через Госуслуги
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setVerifyOpen(true)}
                          className="inline-flex items-center gap-1 rounded-full bg-amber-500/12 px-2.5 py-1 text-[10px] font-bold text-amber-700 transition hover:bg-amber-500/20 dark:text-amber-400"
                        >
                          <ShieldCheck className="size-3" />
                          Подтвердить профиль
                        </button>
                      )}
                      <Badge variant="outline">
                        <MapPin className="size-3" />
                        {demoUser.city}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                  <Link to="/ai" search={{ tab: "resume" }} className="w-full sm:w-auto">
                    <Button variant="secondary" size="sm" className="w-full sm:w-auto">
                      <FileText className="size-3.5" />
                      Редактировать резюме
                    </Button>
                  </Link>
                  <Button variant="primary" size="sm" onClick={share} className="w-full sm:w-auto">
                    <Share2 className="size-3.5" />
                    Поделиться
                  </Button>
                </div>
              </div>

              <div className="mt-5 grid gap-4 border-t border-line pt-5 lg:grid-cols-[1fr_auto] lg:items-center">
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[11px] text-muted">
                  <span className="inline-flex items-center gap-1.5">
                    <UserRound className="size-3.5 text-brand" />
                    {demoUser.faculty}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock3 className="size-3.5 text-brand" />
                    {hours} {plural(hours, "час", "часа", "часов")} активности
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarCheck className="size-3.5 text-brand" />
                    {registrations.length}{" "}
                    {plural(registrations.length, "регистрация", "регистрации", "регистраций")}
                  </span>
                </div>
                <div className="flex min-w-[220px] items-center gap-3">
                  <div className="flex-1">
                    <div className="mb-1 flex justify-between text-[9.5px] text-faint">
                      <span>Заполненность профиля</span>
                      <span className="font-semibold text-brand">{completion}%</span>
                    </div>
                    <Progress value={completion} />
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      toast({
                        title: "Что улучшить",
                        description: "Добавьте портфолио и второй контакт — профиль станет заметнее.",
                        variant: "info",
                      })
                    }
                    className="grid size-8 place-items-center rounded-full border border-line text-muted transition hover:text-brand"
                    aria-label="Советы по профилю"
                  >
                    <Sparkles className="size-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </Card>

          <div className="no-scrollbar scroll-fade mt-4 flex gap-1 overflow-x-auto rounded-full border border-line bg-surface p-1">
            {profileTabs.map((item) => {
              const active = tab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => changeTab(item.id)}
                  className={cn(
                    "relative shrink-0 rounded-full px-4 py-2 text-[11.5px] font-semibold transition-colors",
                    active ? "text-bg" : "text-muted hover:text-fg",
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="profile-tab"
                      className="absolute inset-0 rounded-full bg-fg"
                      transition={{ type: "spring", stiffness: 420, damping: 34 }}
                    />
                  )}
                  <span className="relative">{item.label}</span>
                  {item.id === "applications" && applications.length > 0 && (
                    <span
                      className={cn(
                        "relative ml-1.5 rounded-full px-1.5 py-0.5 text-[9px] font-bold",
                        active ? "bg-bg/20 text-bg" : "bg-surface-3 text-faint",
                      )}
                    >
                      {applications.length}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="pb-10">
        <div className="container-page">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
            >
              {tab === "overview" && (
                <OverviewTab
                  applications={applications}
                  activities={activities}
                  favorites={favorites}
                  hours={hours}
                  onVerify={() => setVerifyOpen(true)}
                />
              )}
              {tab === "applications" && <ApplicationsTab applications={applications} />}
              {tab === "activities" && <ActivitiesTab activities={activities} />}
              {tab === "workbook" && (
                <WorkbookTab verified={verified} onVerify={() => setVerifyOpen(true)} />
              )}
              {tab === "documents" && (
                <DocumentsTab verified={verified} onVerify={() => setVerifyOpen(true)} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      <GosuslugiModal open={verifyOpen} onClose={() => setVerifyOpen(false)} />
    </Page>
  );
}

function OverviewTab({
  applications,
  activities,
  favorites,
  hours,
  onVerify,
}: {
  applications: Application[];
  activities: ActivityEntry[];
  favorites: string[];
  hours: number;
  onVerify: () => void;
}) {
  const toast = useUi((state) => state.toast);
  const toggleFavorite = useUser((state) => state.toggleFavorite);
  const favoriteVacancies = favorites
    .map((id) => vacancyById[id])
    .filter((item): item is NonNullable<typeof item> => Boolean(item))
    .slice(0, 3);
  const recommendations = vacancies.slice(0, 2);
  const upcoming = events.slice(1, 3);

  const stats = [
    { icon: Send, value: applications.length, label: "отклика", note: "в работе" },
    { icon: CalendarCheck, value: activities.length, label: "активности", note: "в резюме" },
    { icon: Clock3, value: hours, label: plural(hours, "час", "часа", "часов"), note: "подтверждено" },
    { icon: Heart, value: favorites.length, label: "в избранном", note: "вакансии" },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-[22px] border border-line bg-surface p-5">
            <div className="flex items-center justify-between">
              <span className="grid size-9 place-items-center rounded-xl bg-brand-soft text-brand">
                <stat.icon className="size-4" />
              </span>
              <span className="text-[10px] text-faint">{stat.note}</span>
            </div>
            <p className="mt-4 text-[26px] font-bold leading-none tracking-[-0.04em]">
              {formatNumber(stat.value)}
            </p>
            <p className="mt-1 text-[11px] text-muted">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.35fr_0.65fr]">
        <div className="space-y-4">
          <div className="rounded-[24px] border border-line bg-surface p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-[13px] font-semibold">Рекомендовано тебе</p>
                <p className="text-[10.5px] text-muted">ИИ обновил подборку сегодня</p>
              </div>
              <Link to="/vacancies" className="text-[10.5px] font-bold text-brand">
                Все
              </Link>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {recommendations.map((vacancy) => {
                const company = companyMap[vacancy.companyId];
                return (
                  <Link
                    key={vacancy.id}
                    to="/vacancies/$vacancyId"
                    params={{ vacancyId: vacancy.id }}
                    className="group rounded-2xl border border-line bg-surface-2 p-3.5 transition hover:border-brand/30"
                  >
                    <div className="flex items-center gap-2.5">
                      <CompanyLogo company={company} size="sm" className="size-8 rounded-[10px] text-[9px]" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[11px] font-semibold">{vacancy.title}</p>
                        <p className="text-[9px] text-muted">{company.name}</p>
                      </div>
                      <ArrowRight className="size-3.5 text-faint transition group-hover:translate-x-0.5 group-hover:text-brand" />
                    </div>
                    <div className="mt-2.5 flex items-center justify-between">
                      <span className="text-[10px] font-bold">
                        {formatNumber(vacancy.salaryFrom ?? 0)}–{formatNumber(vacancy.salaryTo ?? 0)} ₽
                      </span>
                      <span className="rounded-full bg-emerald-500/10 px-1.5 py-0.5 text-[8.5px] font-bold text-emerald-600 dark:text-emerald-400">
                        {vacancy.match}%
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="rounded-[24px] border border-line bg-surface p-5">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-[13px] font-semibold">Ближайшие события</p>
              <Link to="/events" className="text-[10.5px] font-bold text-brand">
                Все
              </Link>
            </div>
            <div className="divide-y divide-line">
              {upcoming.map((event) => (
                <div key={event.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                  <div className="grid w-10 shrink-0 place-items-center rounded-lg border border-line bg-surface-2 py-1">
                    <span className="text-[13px] font-bold leading-none">
                      {new Date(event.date).getDate()}
                    </span>
                    <span className="text-[7px] uppercase text-faint">
                      {formatDate(event.date).split(" ")[1]}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[11px] font-semibold">{event.title}</p>
                    <p className="text-[9px] text-muted">
                      {event.time} · +{event.hours} ч активности
                    </p>
                  </div>
                  <Link to="/events" className="text-faint hover:text-brand">
                    <ArrowUpRight className="size-3.5" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="relative overflow-hidden rounded-[24px] border border-brand/20 bg-linear-to-br from-brand-soft to-transparent p-5">
            <div className="flex items-center gap-2">
              <span className="grid size-8 place-items-center rounded-xl bg-brand text-white">
                <Sparkles className="size-4" />
              </span>
              <p className="text-[12px] font-semibold">Совет от Орби</p>
            </div>
            <p className="mt-3 text-[11px] leading-relaxed text-muted">
              У тебя 92% заполненности профиля. Добавь ссылку на портфолио — работодатели чаще
              открывают такие резюме на 40%.
            </p>
            <Link to="/ai" search={{ tab: "resume" }} className="mt-3 inline-flex">
              <Button size="sm" variant="soft">
                Улучшить резюме
                <ArrowRight className="size-3" />
              </Button>
            </Link>
          </div>

          <div className="rounded-[24px] border border-line bg-surface p-5">
            <div className="flex items-center justify-between">
              <p className="text-[12px] font-semibold">Избранное</p>
              <Heart className="size-3.5 text-rose-400" />
            </div>
            <div className="mt-3 space-y-2">
              {favoriteVacancies.length === 0 && (
                <p className="text-[10.5px] text-muted">Пока пусто — сохраняй вакансии кнопкой ♥</p>
              )}
              {favoriteVacancies.map((vacancy) => (
                <div key={vacancy.id} className="flex items-center gap-2">
                  <Link
                    to="/vacancies/$vacancyId"
                    params={{ vacancyId: vacancy.id }}
                    className="min-w-0 flex-1 truncate text-[10.5px] font-medium text-muted transition hover:text-fg"
                  >
                    {vacancy.title}
                  </Link>
                  <button
                    type="button"
                    aria-label="Убрать из избранного"
                    onClick={() => {
                      toggleFavorite(vacancy.id);
                      toast({ title: "Убрано из избранного", variant: "info" });
                    }}
                    className="text-faint transition hover:text-rose-500"
                  >
                    <Trash2 className="size-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[24px] border border-line bg-surface p-5">
            <div className="flex items-center gap-2">
              <ShieldCheck className="size-4 text-brand" />
              <p className="text-[12px] font-semibold">Госуслуги</p>
              <Badge variant="success" className="ml-auto">
                активно
              </Badge>
            </div>
            <p className="mt-2 text-[10.5px] leading-relaxed text-muted">
              Профиль подтверждён. Электронная трудовая синхронизирована с СФР.
            </p>
            <button
              type="button"
              onClick={onVerify}
              className="mt-3 text-[10.5px] font-bold text-brand transition hover:opacity-75"
            >
              Проверить статус →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ApplicationsTab({ applications }: { applications: Application[] }) {
  return (
    <div className="mx-auto max-w-[900px] space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[16px] font-semibold tracking-[-0.02em]">Мои отклики</p>
          <p className="text-[11px] text-muted">
            {applications.length} {plural(applications.length, "отклик", "отклика", "откликов")} · среднее время ответа 2 дня
          </p>
        </div>
        <Link to="/vacancies">
          <Button variant="secondary" size="sm">
            Найти ещё
            <ArrowRight className="size-3.5" />
          </Button>
        </Link>
      </div>

      {applications.length === 0 ? (
        <div className="rounded-[24px] border border-dashed border-line p-12 text-center">
          <p className="text-[13px] font-semibold">Пока нет откликов</p>
          <p className="mt-1 text-[11px] text-muted">Выбери вакансию и отправь первый отклик.</p>
        </div>
      ) : (
        applications.map((application) => {
          const vacancy = vacancyById[application.vacancyId];
          if (!vacancy) return null;
          const company = companyMap[vacancy.companyId];
          const status = statusMeta[application.status];
          return (
            <div
              key={application.id}
              className="flex flex-col gap-4 rounded-[22px] border border-line bg-surface p-4 sm:flex-row sm:items-center"
            >
              <CompanyLogo company={company} />
              <div className="min-w-0 flex-1">
                <Link
                  to="/vacancies/$vacancyId"
                  params={{ vacancyId: vacancy.id }}
                  className="text-[13px] font-semibold transition hover:text-brand"
                >
                  {vacancy.title}
                </Link>
                <p className="mt-0.5 text-[10.5px] text-muted">
                  {company.name} · отклик {formatDate(application.appliedAt)}
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-1.5">
                  <Badge variant={status.variant}>{status.label}</Badge>
                  <Badge variant="outline">{vacancy.employment}</Badge>
                  <span className="text-[9.5px] text-faint">
                    {formatNumber(vacancy.salaryFrom ?? 0)} ₽
                  </span>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <Link
                  to="/vacancies/$vacancyId"
                  params={{ vacancyId: vacancy.id }}
                  className="inline-flex h-9 items-center gap-1.5 rounded-full border border-line px-3.5 text-[10.5px] font-semibold text-muted transition hover:text-brand"
                >
                  Открыть
                  <ArrowUpRight className="size-3" />
                </Link>
                <span className="text-[9px] text-faint">HR ответит в чате</span>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

function ActivitiesTab({ activities }: { activities: ActivityEntry[] }) {
  const totalHours = activities.reduce((sum, activity) => sum + activity.hours, 0);
  const verifiedCount = activities.length;

  return (
    <div className="mx-auto max-w-[900px] space-y-4">
      <div className="grid gap-3 sm:grid-cols-3">
        {[
          { icon: CalendarCheck, value: activities.length, label: "подтверждённых участий" },
          { icon: Clock3, value: totalHours, label: "часов активности" },
          { icon: CheckCheck, value: verifiedCount, label: "отметок в резюме" },
        ].map((stat) => (
          <div key={stat.label} className="flex items-center gap-3 rounded-[20px] border border-line bg-surface p-4">
            <span className="grid size-10 place-items-center rounded-xl bg-brand-soft text-brand">
              <stat.icon className="size-4" />
            </span>
            <div>
              <p className="text-[18px] font-bold leading-none tracking-[-0.03em]">{stat.value}</p>
              <p className="mt-1 text-[10px] text-muted">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-[24px] border border-line bg-surface p-5 sm:p-6">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-[14px] font-semibold">Активность и практика</p>
            <p className="text-[10.5px] text-muted">Все события подтверждены организаторами</p>
          </div>
          <Link to="/events">
            <Button size="sm" variant="secondary">
              Добавить событие
              <ArrowRight className="size-3.5" />
            </Button>
          </Link>
        </div>

        <div className="relative">
          <div className="absolute bottom-2 left-[19px] top-3 w-px bg-line" />
          <div className="space-y-4">
            {activities.map((activity) => {
              const Icon =
                activity.source === "event"
                  ? CalendarDays
                  : activity.source === "internship"
                    ? Briefcase
                    : BookOpen;
              return (
                <div key={activity.id} className="relative flex gap-4">
                  <span className="relative z-10 grid size-10 shrink-0 place-items-center rounded-full border border-line bg-surface text-brand">
                    <Icon className="size-4" />
                  </span>
                  <div className="min-w-0 flex-1 rounded-2xl border border-line bg-surface-2 p-3.5">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <p className="text-[12px] font-semibold">{activity.title}</p>
                        <p className="mt-0.5 text-[10px] text-muted">
                          {activity.organizer} · {formatDate(activity.date)}
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Badge variant="brand">+{activity.hours} ч</Badge>
                        <Badge variant="success">
                          <Check className="size-2.5" />
                          в резюме
                        </Badge>
                      </div>
                    </div>
                    <p className="mt-2 flex items-center gap-1 text-[9px] text-faint">
                      <BadgeCheck className="size-3 text-emerald-500" />
                      Подтверждено организатором · {activity.kind}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function WorkbookTab({ verified, onVerify }: { verified: boolean; onVerify: () => void }) {
  const toast = useUi((state) => state.toast);
  return (
    <div className="mx-auto max-w-[900px] space-y-4">
      <div className="relative overflow-hidden rounded-[24px] border border-brand/20 bg-linear-to-br from-brand-soft via-surface to-surface p-5 sm:p-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-start gap-3.5">
            <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-brand text-white">
              <Landmark className="size-5" />
            </span>
            <div>
              <p className="flex items-center gap-2 text-[14px] font-semibold">
                Электронная трудовая книжка
                {verified && (
                  <Badge variant="success">
                    <Check className="size-2.5" />
                    синхронизировано
                  </Badge>
                )}
              </p>
              <p className="mt-1 text-[11px] leading-relaxed text-muted">
                Данные из СФР через Госуслуги. Записи о практике и стажировках добавляются
                автоматически.
              </p>
              <p className="mt-1.5 text-[9.5px] text-faint">
                Последняя синхронизация: 12 ноября 2026, 09:41
              </p>
            </div>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              if (verified) {
                toast({
                  title: "Данные актуальны",
                  description: "Трудовая книжка синхронизирована 12 ноября 2026.",
                  variant: "info",
                });
              } else {
                onVerify();
              }
            }}
          >
            <RefreshCw className="size-3.5" />
            Обновить
          </Button>
        </div>
      </div>

      <div className="rounded-[24px] border border-line bg-surface p-5 sm:p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[14px] font-semibold">Записи о трудовой деятельности</p>
            <p className="text-[10.5px] text-muted">
              {workRecords.length} записи · {workRecords.length} подтверждены СФР
            </p>
          </div>
          <Badge variant="outline">
            <ShieldCheck className="size-3" />
            СФР
          </Badge>
        </div>

        <div className="relative mt-5">
          <div className="absolute bottom-4 left-[15px] top-4 w-px bg-line" />
          <div className="space-y-4">
            {workRecords.map((record) => (
              <div key={record.id} className="relative flex gap-4">
                <span className="relative z-10 grid size-8 shrink-0 place-items-center rounded-full border border-line bg-surface text-brand">
                  <Briefcase className="size-3.5" />
                </span>
                <div className="min-w-0 flex-1 rounded-2xl border border-line bg-surface-2 p-4">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <p className="text-[12.5px] font-semibold">{record.role}</p>
                      <p className="text-[10.5px] text-muted">{record.company}</p>
                    </div>
                    <Badge variant="outline">{record.type}</Badge>
                  </div>
                  <p className="mt-2 flex items-center gap-1.5 text-[9.5px] text-faint">
                    <Clock3 className="size-3" />
                    {record.start} — {record.end}
                  </p>
                  <p className="mt-2 text-[10.5px] leading-relaxed text-muted">{record.result}</p>
                  <p className="mt-2 flex items-center gap-1 text-[9px] font-semibold text-emerald-600 dark:text-emerald-400">
                    <BadgeCheck className="size-3" />
                    Запись подтверждена СФР
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-5 flex items-start gap-2 rounded-xl bg-surface-2 p-3.5">
          <ShieldCheck className="mt-0.5 size-3.5 shrink-0 text-brand" />
          <p className="text-[9.5px] leading-relaxed text-muted">
            Работодатель видит только записи, которые ты открыл в настройках приватности. Данные
            защищены и передаются по защищённому каналу Госуслуг.
          </p>
        </div>
      </div>
    </div>
  );
}

function DocumentsTab({ verified, onVerify }: { verified: boolean; onVerify: () => void }) {
  const toast = useUi((state) => state.toast);
  const reset = useUser((state) => state.reset);
  const [shareWithEmployers, setShareWithEmployers] = useState(true);
  const [aiRecommendations, setAiRecommendations] = useState(true);

  return (
    <div className="mx-auto max-w-[900px] space-y-4">
      <div className="relative overflow-hidden rounded-[24px] border border-line bg-surface p-5 sm:p-6">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div className="flex items-start gap-3.5">
            <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-emerald-500/10 text-emerald-500">
              <ShieldCheck className="size-5" />
            </span>
            <div>
              <p className="text-[14px] font-semibold">
                {verified ? "Профиль подтверждён" : "Профиль не подтверждён"}
              </p>
              <p className="mt-1 text-[11px] leading-relaxed text-muted">
                {verified
                  ? `Личность подтверждена через Госуслуги ${demoUser.verifiedAt}. СНИЛС совпадает с профилем.`
                  : "Подтвердите личность через Госуслуги, чтобы получать больше приглашений."}
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                <Badge variant={verified ? "success" : "warning"}>
                  <BadgeCheck className="size-3" />
                  {verified ? "Проверенный профиль" : "Требуется проверка"}
                </Badge>
                <Badge variant="outline">СНИЛС {demoUser.snils}</Badge>
              </div>
            </div>
          </div>
          <Button variant="primary" size="sm" onClick={onVerify}>
            <Landmark className="size-3.5" />
            {verified ? "Обновить данные" : "Подтвердить"}
          </Button>
        </div>
      </div>

      <div className="rounded-[24px] border border-line bg-surface p-5 sm:p-6">
        <p className="text-[14px] font-semibold">Документы и данные</p>
        <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
          {[
            { icon: UserRound, title: "Паспорт РФ", note: "Подтверждён Госуслугами", ok: true },
            { icon: ShieldCheck, title: "СНИЛС", note: demoUser.snils, ok: true },
            { icon: FileCheck2, title: "ИНН", note: "Загружен автоматически", ok: true },
            { icon: Briefcase, title: "Трудовая книжка", note: "4 записи из СФР", ok: verified },
          ].map((doc) => (
            <div
              key={doc.title}
              className="flex items-center gap-3 rounded-2xl border border-line bg-surface-2 p-3.5"
            >
              <span className="grid size-9 place-items-center rounded-xl bg-surface text-brand">
                <doc.icon className="size-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[11.5px] font-semibold">{doc.title}</p>
                <p className="text-[9.5px] text-muted">{doc.note}</p>
              </div>
              {doc.ok ? (
                <Check className="size-4 text-emerald-500" />
              ) : (
                <span className="text-[9px] font-semibold text-amber-500">нет</span>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-[24px] border border-line bg-surface p-5 sm:p-6">
        <p className="text-[14px] font-semibold">Приватность</p>
        <div className="mt-3 divide-y divide-line">
          {[
            {
              title: "Показывать трудовую книжку работодателям",
              note: "Только проверенным компаниям-партнёрам",
              value: shareWithEmployers,
              set: setShareWithEmployers,
            },
            {
              title: "ИИ-рекомендации",
              note: "Подбор вакансий и курсов на основе профиля",
              value: aiRecommendations,
              set: setAiRecommendations,
            },
          ].map((row) => (
            <div key={row.title} className="flex items-center justify-between gap-4 py-3">
              <div>
                <p className="text-[11.5px] font-semibold">{row.title}</p>
                <p className="text-[9.5px] text-muted">{row.note}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  row.set(!row.value);
                  toast({
                    title: row.value ? "Настройка выключена" : "Настройка включена",
                    description: row.title,
                    variant: "info",
                  });
                }}
                className={cn(
                  "relative h-[24px] w-[42px] shrink-0 rounded-full transition-colors",
                  row.value ? "bg-brand" : "bg-surface-3",
                )}
              >
                <motion.span
                  layout
                  transition={{ type: "spring", stiffness: 500, damping: 32 }}
                  className={cn(
                    "absolute top-[3px] size-[18px] rounded-full bg-white shadow-sm",
                    row.value ? "right-[3px]" : "left-[3px]",
                  )}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={() =>
            toast({
              title: "Выписка сформирована",
              description: "Файл появится в загрузках в течение минуты.",
              variant: "success",
            })
          }
          className="flex items-center gap-3 rounded-[20px] border border-line bg-surface p-4 text-left transition hover:border-brand/30"
        >
          <span className="grid size-9 place-items-center rounded-xl bg-brand-soft text-brand">
            <Download className="size-4" />
          </span>
          <div>
            <p className="text-[11.5px] font-semibold">Скачать данные профиля</p>
            <p className="text-[9.5px] text-muted">JSON с резюме и активностью</p>
          </div>
        </button>
        <button
          type="button"
          onClick={() => {
            reset();
            toast({ title: "Демо-данные сброшены", variant: "info" });
          }}
          className="flex items-center gap-3 rounded-[20px] border border-line bg-surface p-4 text-left transition hover:border-rose-400/40"
        >
          <span className="grid size-9 place-items-center rounded-xl bg-surface-2 text-muted">
            <RefreshCw className="size-4" />
          </span>
          <div>
            <p className="text-[11.5px] font-semibold">Сбросить демо-данные</p>
            <p className="text-[9.5px] text-muted">Вернуть исходное состояние профиля</p>
          </div>
        </button>
      </div>
    </div>
  );
}

function GosuslugiModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [step, setStep] = useState(0);
  const setVerified = useUser((state) => state.setVerified);
  const verified = useUser((state) => state.verified);
  const toast = useUi((state) => state.toast);

  useEffect(() => {
    if (open) setStep(0);
  }, [open]);

  useEffect(() => {
    if (step !== 1) return;
    const timer = window.setTimeout(() => {
      setVerified(true);
      setStep(2);
      toast({
        title: "Профиль подтверждён",
        description: "Данные СНИЛС и трудовой книжки синхронизированы.",
        variant: "success",
      });
    }, 1700);
    return () => window.clearTimeout(timer);
  }, [step, setVerified, toast]);

  return (
    <Modal open={open} onClose={onClose} className="sm:max-w-[480px]" hideClose={step === 1}>
      <AnimatePresence mode="wait" initial={false}>
        {step === 0 && (
          <motion.div key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="flex items-center gap-2 pr-10">
              <span className="grid size-9 place-items-center rounded-xl bg-brand text-white">
                <Landmark className="size-4" />
              </span>
              <div>
                <p className="text-[13px] font-semibold">Госуслуги</p>
                <p className="text-[9.5px] text-muted">Безопасная проверка данных</p>
              </div>
              <Badge variant="success" className="ml-auto">
                <ShieldCheck className="size-3" />
                защищено
              </Badge>
            </div>

            <h3 className="mt-5 text-[21px] font-semibold leading-tight tracking-[-0.03em]">
              {verified ? "Обновить данные профиля" : "Подтвердить профиль"}
            </h3>
            <p className="mt-2 text-[12px] leading-relaxed text-muted">
              Мы запросим у Госуслуг только необходимые данные. Работодатели увидят бейдж
              «Проверенный профиль», а записи трудовой добавятся автоматически.
            </p>

            <div className="mt-4 space-y-2 rounded-2xl border border-line bg-surface-2 p-3.5">
              {[
                { title: "ФИО и дата рождения", note: "из профиля Госуслуг" },
                { title: "СНИЛС", note: demoUser.snils },
                { title: "Электронная трудовая книжка", note: "4 записи из СФР" },
              ].map((row) => (
                <div key={row.title} className="flex items-center gap-2.5">
                  <span className="grid size-4 shrink-0 place-items-center rounded-full bg-emerald-500/15 text-emerald-500">
                    <Check className="size-2.5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10.5px] font-semibold">{row.title}</p>
                    <p className="text-[9px] text-faint">{row.note}</p>
                  </div>
                </div>
              ))}
            </div>

            <Button className="mt-5 w-full" size="lg" onClick={() => setStep(1)}>
              <Landmark className="size-4" />
              {verified ? "Обновить через Госуслуги" : "Продолжить с Госуслугами"}
            </Button>
            <p className="mt-3 text-center text-[9px] leading-relaxed text-faint">
              Нажимая кнопку, вы соглашаетесь на обработку персональных данных
            </p>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center py-10 text-center"
          >
            <div className="relative grid size-20 place-items-center">
              <span className="absolute inset-0 animate-spin rounded-full border-2 border-brand/20 border-t-brand [animation-duration:1.1s]" />
              <span className="grid size-12 place-items-center rounded-full bg-brand-soft text-brand">
                <Landmark className="size-5" />
              </span>
            </div>
            <p className="mt-5 text-[14px] font-semibold">Проверяем данные</p>
            <p className="mt-1.5 max-w-[280px] text-[11px] leading-relaxed text-muted">
              Сверяем СНИЛС и загружаем записи из электронной трудовой книжки. Это займёт несколько
              секунд.
            </p>
            <div className="mt-4 flex items-center gap-1.5">
              {[0, 1, 2].map((dot) => (
                <motion.span
                  key={dot}
                  className="size-1.5 rounded-full bg-brand"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.1, repeat: Infinity, delay: dot * 0.2 }}
                />
              ))}
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="done" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <SuccessState
              title="Профиль подтверждён"
              description="СНИЛС совпадает, трудовая книжка синхронизирована. Теперь работодатели видят проверенные данные, а отклики отправляются быстрее."
            >
              <div className="mb-4 grid grid-cols-3 gap-2 rounded-2xl border border-line bg-surface-2 p-3">
                {[
                  { label: "Госуслуги", value: "ок" },
                  { label: "СНИЛС", value: "ок" },
                  { label: "Трудовая", value: "4" },
                ].map((item) => (
                  <div key={item.label}>
                    <p className="text-[12px] font-bold text-emerald-500">{item.value}</p>
                    <p className="text-[8.5px] text-faint">{item.label}</p>
                  </div>
                ))}
              </div>
              <Button className="w-full" size="lg" onClick={onClose}>
                Готово
                <Check className="size-4" />
              </Button>
            </SuccessState>
          </motion.div>
        )}
      </AnimatePresence>
    </Modal>
  );
}
