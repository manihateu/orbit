import { useEffect, useMemo, useState } from "react";
import { getRouteApi, Link, useRouterState } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Bell,
  Filter,
  Search,
  SearchX,
  SlidersHorizontal,
  Sparkles,
  X,
} from "lucide-react";
import { fetchVacancies } from "@/lib/api";
import { vacancies as allVacancies } from "@/data/vacancies";
import { companyMap } from "@/data/companies";
import type { Vacancy } from "@/data/types";
import { cn } from "@/lib/utils";
import { useTitle } from "@/lib/useTitle";
import { useUi } from "@/store/ui";
import { Badge, Button, Card, FilterChip, Input, Skeleton } from "@/components/ui/primitives";
import { VacancyCard } from "@/components/shared/cards";
import { Page, PageHero } from "@/components/layout/Page";

const routeApi = getRouteApi("/vacancies");

const employments = [
  "Все",
  "Стажировка",
  "Частичная занятость",
  "Полная занятость",
  "Проектная работа",
] as const;

type EmploymentFilter = (typeof employments)[number];
type Sort = "match" | "fresh" | "salary";

export function VacanciesPage() {
  useTitle("Вакансии для студентов");
  const search = routeApi.useSearch();
  const { data, isLoading } = useQuery({ queryKey: ["vacancies"], queryFn: fetchVacancies });

  const [query, setQuery] = useState(search.q ?? "");
  const [city, setCity] = useState(search.city ?? "Все города");
  const [employment, setEmployment] = useState<EmploymentFilter>("Все");
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [flexibleOnly, setFlexibleOnly] = useState(false);
  const [hotOnly, setHotOnly] = useState(false);
  const [sort, setSort] = useState<Sort>("match");
  const [showFilters, setShowFilters] = useState(false);
  const toast = useUi((state) => state.toast);

  useEffect(() => {
    setQuery(search.q ?? "");
    if (search.city) setCity(search.city);
  }, [search.q, search.city]);

  const source = data ?? allVacancies;

  const filtered = useMemo(() => {
    let list = [...source];
    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter((vacancy) =>
        [
          vacancy.title,
          vacancy.city,
          vacancy.schedule,
          vacancy.employment,
          vacancy.experience,
          vacancy.remote ? "удалённо" : "",
          ...vacancy.skills,
          ...vacancy.tags,
          companyName(vacancy),
        ]
          .join(" ")
          .toLowerCase()
          .includes(q),
      );
    }
    if (city !== "Все города") list = list.filter((vacancy) => vacancy.city === city);
    if (employment !== "Все") list = list.filter((vacancy) => vacancy.employment === employment);
    if (remoteOnly) list = list.filter((vacancy) => vacancy.remote);
    if (flexibleOnly) list = list.filter((vacancy) => vacancy.schedule.includes("Гибкий"));
    if (hotOnly) list = list.filter((vacancy) => vacancy.hot);

    if (sort === "fresh") {
      list.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
    } else if (sort === "salary") {
      list.sort((a, b) => (b.salaryTo ?? b.salaryFrom ?? 0) - (a.salaryTo ?? a.salaryFrom ?? 0));
    } else {
      list.sort((a, b) => b.match - a.match);
    }
    return list;
  }, [source, query, city, employment, remoteOnly, flexibleOnly, hotOnly, sort]);

  const reset = () => {
    setQuery("");
    setCity("Все города");
    setEmployment("Все");
    setRemoteOnly(false);
    setFlexibleOnly(false);
    setHotOnly(false);
    setSort("match");
  };

  const activeFilters =
    (city !== "Все города" ? 1 : 0) +
    (employment !== "Все" ? 1 : 0) +
    (remoteOnly ? 1 : 0) +
    (flexibleOnly ? 1 : 0) +
    (hotOnly ? 1 : 0);

  return (
    <Page>
      <PageHero
        eyebrow="Модуль 01 · Вакансии и резюме"
        title={
          <>
            Работа, которая <span className="text-gradient">совпадает</span> с тобой
          </>
        }
        description="2 400 вакансий от проверенных работодателей региона. Гибкий график, оплата и наставник — фильтры уже настроены под студентов."
      >
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <LinksTabs />
            <div className="flex items-center gap-2 text-[11.5px] text-muted">
              <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 font-semibold text-emerald-600 dark:text-emerald-400">
                <Sparkles className="size-3" />
                {filtered.length} подходят под профиль
              </span>
            </div>
          </div>
          <div className="hidden flex-wrap items-center gap-1.5 text-[10.5px] text-faint sm:flex">
            <span className="mr-1">Собрано из:</span>
            {["hh.ru", "Авито Работа", "SuperJob", "прямые вакансии предприятий"].map((source) => (
              <span
                key={source}
                className="rounded-full border border-line bg-surface/70 px-2 py-0.5 font-medium text-muted"
              >
                {source}
              </span>
            ))}
          </div>
        </div>
      </PageHero>

      <section className="pb-8">
        <div className="container-page">
          <div className="grid items-start gap-6 lg:grid-cols-[268px_1fr]">
            <div className="lg:sticky lg:top-24">
              <button
                type="button"
                onClick={() => setShowFilters((value) => !value)}
                className="mb-3 flex h-11 w-full items-center justify-between rounded-2xl border border-line bg-surface px-4 text-[12.5px] font-semibold lg:hidden"
              >
                <span className="inline-flex items-center gap-2">
                  <SlidersHorizontal className="size-4 text-brand" />
                  Фильтры
                  {activeFilters > 0 && (
                    <span className="grid size-5 place-items-center rounded-full bg-brand text-[10px] text-white">
                      {activeFilters}
                    </span>
                  )}
                </span>
                <span className="text-muted">{showFilters ? "Скрыть" : "Показать"}</span>
              </button>

              <div className={cn("lg:block", showFilters ? "block" : "hidden")}>
                <FiltersPanel
                  city={city}
                  setCity={setCity}
                  employment={employment}
                  setEmployment={setEmployment}
                  remoteOnly={remoteOnly}
                  setRemoteOnly={setRemoteOnly}
                  flexibleOnly={flexibleOnly}
                  setFlexibleOnly={setFlexibleOnly}
                  hotOnly={hotOnly}
                  setHotOnly={setHotOnly}
                  activeFilters={activeFilters}
                  reset={reset}
                />

                <div className="mt-3 overflow-hidden rounded-[24px] border border-brand/15 bg-linear-to-br from-brand-soft to-transparent p-4">
                  <div className="flex items-center gap-2">
                    <span className="grid size-8 place-items-center rounded-xl bg-brand text-white">
                      <Bell className="size-3.5" />
                    </span>
                    <p className="text-[12px] font-semibold">Подборка на почту</p>
                  </div>
                  <p className="mt-2 text-[10.5px] leading-relaxed text-muted">
                    Присылаем 5 вакансий по твоим фильтрам раз в неделю. Без спама.
                  </p>
                  <button
                    type="button"
                    onClick={() =>
                      toast({
                        title: "Подписка оформлена",
                        description: "Первая подборка придёт в понедельник.",
                        variant: "success",
                      })
                    }
                    className="mt-3 inline-flex h-8 items-center gap-1.5 rounded-full bg-surface px-3 text-[10.5px] font-bold text-brand shadow-sm transition hover:bg-surface-2"
                  >
                    Подписаться
                    <ArrowRight className="size-3" />
                  </button>
                </div>
              </div>
            </div>

            <div>
              <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="relative flex-1">
                  <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-faint" />
                  <Input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Должность, навык или компания"
                    className="h-12 rounded-2xl bg-surface pl-11 pr-10"
                  />
                  {query && (
                    <button
                      type="button"
                      onClick={() => setQuery("")}
                      aria-label="Очистить поиск"
                      className="absolute right-3 top-1/2 grid size-6 -translate-y-1/2 place-items-center rounded-full bg-surface-3 text-muted hover:text-fg"
                    >
                      <X className="size-3" />
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="whitespace-nowrap text-[11.5px] text-faint">
                    {filtered.length} вакансий
                  </span>
                  <select
                    value={sort}
                    onChange={(event) => setSort(event.target.value as Sort)}
                    className="h-12 cursor-pointer rounded-2xl border border-line bg-surface px-3 text-[12px] font-medium outline-none focus:border-brand/40"
                  >
                    <option value="match">По совпадению</option>
                    <option value="fresh">Сначала новые</option>
                    <option value="salary">По зарплате</option>
                  </select>
                </div>
              </div>

              {isLoading ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <VacancySkeleton key={index} />
                  ))}
                </div>
              ) : filtered.length === 0 ? (
                <EmptyState reset={reset} />
              ) : (
                <motion.div layout className="grid gap-4 sm:grid-cols-2">
                  <AnimatePresence mode="popLayout">
                    {filtered.map((vacancy) => (
                      <motion.div
                        key={vacancy.id}
                        layout
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.97 }}
                        transition={{ duration: 0.25 }}
                      >
                        <VacancyCard vacancy={vacancy} className="h-full" />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              )}

              <div className="mt-8 rounded-[24px] border border-dashed border-line p-5 text-center">
                <p className="text-[12.5px] font-semibold">Не нашёл подходящую вакансию?</p>
                <p className="mt-1 text-[11.5px] text-muted">
                  Настрой подбор под себя в ИИ-помощнике — он учтёт навыки и график учёбы.
                </p>
                <Link to="/ai" search={{ tab: "chat" }} className="mt-3 inline-block">
                  <Button variant="secondary" size="sm">
                    <Sparkles className="size-3.5" />
                    Подобрать с ИИ
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Page>
  );
}

function LinksTabs() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const tabs = [
    { to: "/vacancies" as const, label: "Вакансии", count: "2 400" },
    { to: "/resumes" as const, label: "Резюме", count: "1 100" },
  ];
  return (
    <div className="inline-flex rounded-full border border-line bg-surface p-1 shadow-sm">
      {tabs.map((tab) => {
        const active = pathname === tab.to;
        return (
          <Link
            key={tab.to}
            to={tab.to}
            className={cn(
              "inline-flex h-9 items-center gap-2 rounded-full px-3.5 text-[12px] font-semibold transition",
              active ? "bg-fg text-bg" : "text-muted hover:text-fg",
            )}
          >
            {tab.label}
            <span
              className={cn(
                "rounded-full px-1.5 py-0.5 text-[9px] font-bold",
                active ? "bg-bg/20 text-bg" : "bg-surface-3 text-faint",
              )}
            >
              {tab.count}
            </span>
          </Link>
        );
      })}
    </div>
  );
}

function FiltersPanel({
  city,
  setCity,
  employment,
  setEmployment,
  remoteOnly,
  setRemoteOnly,
  flexibleOnly,
  setFlexibleOnly,
  hotOnly,
  setHotOnly,
  activeFilters,
  reset,
}: {
  city: string;
  setCity: (value: string) => void;
  employment: EmploymentFilter;
  setEmployment: (value: EmploymentFilter) => void;
  remoteOnly: boolean;
  setRemoteOnly: (value: boolean) => void;
  flexibleOnly: boolean;
  setFlexibleOnly: (value: boolean) => void;
  hotOnly: boolean;
  setHotOnly: (value: boolean) => void;
  activeFilters: number;
  reset: () => void;
}) {
  return (
    <div className="rounded-[26px] border border-line bg-surface p-5 shadow-[var(--shadow-soft)]">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-[13px] font-semibold">
          <Filter className="size-4 text-brand" />
          Фильтры
          {activeFilters > 0 && <Badge variant="brand">{activeFilters}</Badge>}
        </h2>
        {activeFilters > 0 && (
          <button
            type="button"
            onClick={reset}
            className="text-[10.5px] font-semibold text-muted transition hover:text-brand"
          >
            Сбросить
          </button>
        )}
      </div>

      <div className="mt-5">
        <p className="mb-2.5 text-[10px] font-bold uppercase tracking-[0.14em] text-faint">Город</p>
        <select
          value={city}
          onChange={(event) => setCity(event.target.value)}
          className="h-10 w-full cursor-pointer rounded-xl border border-line bg-surface-2 px-3 text-[12px] font-medium outline-none focus:border-brand/40"
        >
          <option>Все города</option>
          <option>Астрахань</option>
          <option>Нариманов</option>
        </select>
      </div>

      <div className="mt-5">
        <p className="mb-2.5 text-[10px] font-bold uppercase tracking-[0.14em] text-faint">
          Занятость
        </p>
        <div className="flex flex-wrap gap-1.5">
          {employments.map((item) => (
            <FilterChip
              key={item}
              active={employment === item}
              onClick={() => setEmployment(item)}
              className="h-8 px-2.5 text-[11px]"
            >
              {item === "Частичная занятость" ? "Частичная" : item}
            </FilterChip>
          ))}
        </div>
      </div>

      <div className="mt-5 space-y-2.5 border-t border-line pt-4">
        {[
          { label: "Можно удалённо", value: remoteOnly, set: setRemoteOnly },
          { label: "Гибкий график", value: flexibleOnly, set: setFlexibleOnly },
          { label: "Срочные вакансии", value: hotOnly, set: setHotOnly },
        ].map((toggle) => (
          <button
            key={toggle.label}
            type="button"
            onClick={() => toggle.set(!toggle.value)}
            className="flex w-full items-center justify-between text-[12px] font-medium"
          >
            <span className={toggle.value ? "text-fg" : "text-muted"}>{toggle.label}</span>
            <span
              className={cn(
                "relative h-[22px] w-[38px] rounded-full transition-colors",
                toggle.value ? "bg-brand" : "bg-surface-3",
              )}
            >
              <motion.span
                layout
                transition={{ type: "spring", stiffness: 500, damping: 32 }}
                className={cn(
                  "absolute top-[3px] size-4 rounded-full bg-white shadow-sm",
                  toggle.value ? "right-[3px]" : "left-[3px]",
                )}
              />
            </span>
          </button>
        ))}
      </div>

      <div className="mt-5 rounded-2xl bg-brand-soft p-3">
        <p className="flex items-center gap-1.5 text-[10.5px] font-bold text-brand">
          <Sparkles className="size-3" />
          Совет ИИ
        </p>
        <p className="mt-1.5 text-[10.5px] leading-relaxed text-muted">
          Студентам чаще отвечают на вакансии с гибким графиком и пометкой «ментор». Включи фильтр
          «Гибкий график».
        </p>
      </div>
    </div>
  );
}

function VacancySkeleton() {
  return (
    <Card className="space-y-4 p-5">
      <div className="flex gap-3">
        <Skeleton className="size-12 rounded-2xl" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-3.5 w-4/5" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
      <Skeleton className="h-4 w-2/3" />
      <div className="flex gap-2">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-6 w-14 rounded-full" />
      </div>
      <Skeleton className="h-9 w-full" />
    </Card>
  );
}

function EmptyState({ reset }: { reset: () => void }) {
  return (
    <div className="grid place-items-center rounded-[28px] border border-dashed border-line bg-surface/50 px-6 py-20 text-center">
      <span className="grid size-14 place-items-center rounded-2xl bg-surface-3 text-faint">
        <SearchX className="size-6" />
      </span>
      <h3 className="mt-4 text-[17px] font-semibold tracking-[-0.02em]">Ничего не нашлось</h3>
      <p className="mt-2 max-w-[320px] text-[12.5px] leading-relaxed text-muted">
        Попробуй изменить запрос или сбросить фильтры — вакансий много, и часть может подойти по
        навыкам.
      </p>
      <Button variant="secondary" size="sm" className="mt-4" onClick={reset}>
        Сбросить фильтры
      </Button>
    </div>
  );
}

function companyName(vacancy: Vacancy) {
  return companyMap[vacancy.companyId]?.name ?? "";
}
