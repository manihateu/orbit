import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  ArrowRight,
  GraduationCap,
  Search,
  SearchX,
  ShieldCheck,
  Sparkles,
  Users,
  Wand2,
} from "lucide-react";
import { fetchResumes } from "@/lib/api";
import { resumes as seedResumes } from "@/data/resumes";
import type { Resume } from "@/data/types";
import { formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";
import { useTitle } from "@/lib/useTitle";
import { Badge, Button, Card, FilterChip, Input, Skeleton } from "@/components/ui/primitives";
import { ResumeCard } from "@/components/shared/cards";
import { InviteModal } from "@/components/shared/modals";
import { Page, PageHero } from "@/components/layout/Page";

const directions = ["Все", "Разработка", "Аналитика", "Инженерия", "Дизайн", "Медиа", "Экология", "HR"] as const;
type Direction = (typeof directions)[number];

function directionOf(resume: Resume): Direction {
  const role = resume.role.toLowerCase();
  if (role.includes("разработчик") || role.includes("frontend") || role.includes("python"))
    return "Разработка";
  if (role.includes("аналитик")) return "Аналитика";
  if (role.includes("инженер") || role.includes("техник")) return "Инженерия";
  if (role.includes("дизайнер")) return "Дизайн";
  if (role.includes("smm") || role.includes("контент") || role.includes("медиа")) return "Медиа";
  if (role.includes("эколог")) return "Экология";
  if (role.includes("hr")) return "HR";
  return "Все";
}

export function ResumesPage() {
  useTitle("Резюме студентов");
  const { data, isLoading } = useQuery({ queryKey: ["resumes"], queryFn: fetchResumes });
  const [query, setQuery] = useState("");
  const [direction, setDirection] = useState<Direction>("Все");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [sort, setSort] = useState<"match" | "activity" | "fresh">("match");
  const [invite, setInvite] = useState<Resume | null>(null);
  const [inviteOpen, setInviteOpen] = useState(false);

  const source = data ?? seedResumes;

  const filtered = useMemo(() => {
    let list = [...source];
    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter((resume) =>
        [resume.name, resume.role, resume.university, resume.faculty, ...resume.skills]
          .join(" ")
          .toLowerCase()
          .includes(q),
      );
    }
    if (direction !== "Все") list = list.filter((resume) => directionOf(resume) === direction);
    if (verifiedOnly) list = list.filter((resume) => resume.verified);

    if (sort === "activity") list.sort((a, b) => b.activityHours - a.activityHours);
    else if (sort === "fresh") list.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
    else list.sort((a, b) => b.match - a.match);

    return list;
  }, [source, query, direction, verifiedOnly, sort]);

  return (
    <Page>
      <PageHero
        eyebrow="Модуль 01 · Резюме и профили"
        title={
          <>
            Студенты, которых <span className="text-gradient">стоит заметить</span>
          </>
        }
        description="1 100 проверенных профилей с подтверждёнными навыками, отметками об активности и записями из электронной трудовой книжки."
      >
        <div className="flex flex-wrap items-center gap-3">
          <ResumeTabs />
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="size-3.5" />
            Только верифицированные данные
          </span>
        </div>
      </PageHero>

      <section className="pb-10">
        <div className="container-page">
          <div className="mb-6 flex flex-col gap-4 rounded-[26px] border border-brand/15 bg-linear-to-r from-brand-soft via-surface to-surface p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div className="flex items-start gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-brand text-white">
                <Wand2 className="size-[18px]" />
              </span>
              <div>
                <p className="text-[13.5px] font-semibold">Ты студент и ищешь работу?</p>
                <p className="mt-1 text-[11.5px] leading-relaxed text-muted">
                  Собери резюме с ИИ-помощником за 2 минуты и попади в подборку для работодателей.
                </p>
              </div>
            </div>
            <Link to="/ai" search={{ tab: "resume" }} className="shrink-0">
              <Button size="sm">
                Создать резюме
                <Sparkles className="size-3.5" />
              </Button>
            </Link>
          </div>

          <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-[420px]">
              <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-faint" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Имя, навык или специальность"
                className="h-11 rounded-2xl bg-surface pl-11"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setVerifiedOnly((value) => !value)}
                className={cn(
                  "inline-flex h-9 items-center gap-1.5 rounded-full border px-3 text-[11.5px] font-semibold transition",
                  verifiedOnly
                    ? "border-brand/30 bg-brand-soft text-brand"
                    : "border-line bg-surface text-muted hover:text-fg",
                )}
              >
                <ShieldCheck className="size-3.5" />
                Проверенные
              </button>
              <select
                value={sort}
                onChange={(event) => setSort(event.target.value as typeof sort)}
                className="h-9 cursor-pointer rounded-full border border-line bg-surface px-3 text-[11.5px] font-medium outline-none focus:border-brand/40"
              >
                <option value="match">По совпадению</option>
                <option value="activity">По активности</option>
                <option value="fresh">Обновлённые</option>
              </select>
              <span className="text-[11px] text-faint">{filtered.length} профилей</span>
            </div>
          </div>

          <div className="no-scrollbar scroll-fade mb-6 flex gap-1.5 overflow-x-auto pb-1">
            {directions.map((item) => (
              <FilterChip
                key={item}
                active={direction === item}
                onClick={() => setDirection(item)}
                className="shrink-0"
              >
                {item}
              </FilterChip>
            ))}
          </div>

          <div className="mb-6 flex items-center gap-2 text-[11px] text-muted">
            <Users className="size-3.5 text-brand" />
            <span>
              Работодатели уже откликнулись на <span className="font-semibold text-fg">128</span>{" "}
              профилей за эту неделю
            </span>
          </div>

          {isLoading ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <Card key={index} className="space-y-4 p-5">
                  <div className="flex gap-3">
                    <Skeleton className="size-12 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-3.5 w-3/5" />
                      <Skeleton className="h-3 w-4/5" />
                    </div>
                  </div>
                  <Skeleton className="h-12 w-full" />
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-16 rounded-full" />
                    <Skeleton className="h-6 w-16 rounded-full" />
                  </div>
                  <Skeleton className="h-16 w-full" />
                </Card>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="grid place-items-center rounded-[28px] border border-dashed border-line bg-surface/50 px-6 py-20 text-center">
              <span className="grid size-14 place-items-center rounded-2xl bg-surface-3 text-faint">
                <SearchX className="size-6" />
              </span>
              <h3 className="mt-4 text-[17px] font-semibold">Профили не найдены</h3>
              <p className="mt-2 max-w-[300px] text-[12.5px] text-muted">
                Попробуй другое направление или сними фильтр проверенных профилей.
              </p>
              <Button
                variant="secondary"
                size="sm"
                className="mt-4"
                onClick={() => {
                  setQuery("");
                  setDirection("Все");
                  setVerifiedOnly(false);
                }}
              >
                Сбросить
              </Button>
            </div>
          ) : (
            <motion.div layout className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((resume) => (
                <ResumeCard
                  key={resume.id}
                  resume={resume}
                  onInvite={(item) => {
                    setInvite(item);
                    setInviteOpen(true);
                  }}
                />
              ))}
            </motion.div>
          )}

          <div className="mt-10 grid gap-4 lg:grid-cols-2">
            <Card className="flex flex-col justify-between gap-4 p-6 sm:flex-row sm:items-center">
              <div className="flex items-start gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-brand-soft text-brand">
                  <GraduationCap className="size-5" />
                </span>
                <div>
                  <p className="text-[13px] font-semibold">Работодателям: заказ на подготовку</p>
                  <p className="mt-1 text-[11.5px] leading-relaxed text-muted">
                    Сформируйте требования к специалисту — вуз и предприятие подготовят его под вас.
                  </p>
                </div>
              </div>
              <Link to="/education" className="shrink-0">
                <Button variant="secondary" size="sm">
                  Подробнее
                  <ArrowRight className="size-3.5" />
                </Button>
              </Link>
            </Card>

            <Card className="flex items-center gap-4 p-6">
              <div className="flex -space-x-2">
                {source.slice(0, 4).map((resume) => (
                  <span
                    key={resume.id}
                    className="grid size-9 place-items-center rounded-full text-[9px] font-bold text-white ring-2 ring-surface"
                    style={{ backgroundImage: `linear-gradient(140deg, ${resume.c1}, ${resume.c2})` }}
                  >
                    {resume.name
                      .split(" ")
                      .map((part) => part[0])
                      .join("")}
                  </span>
                ))}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-semibold">
                  {formatNumber(1100)}+ студентов уже на Орбите
                </p>
                <p className="mt-0.5 text-[11px] text-muted">
                  Средний отклик работодателя — 2 дня
                </p>
              </div>
              <Badge variant="success">онлайн</Badge>
            </Card>
          </div>
        </div>
      </section>

      <InviteModal
        resumeName={invite?.name ?? null}
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
      />
    </Page>
  );
}

function ResumeTabs() {
  return (
    <div className="inline-flex rounded-full border border-line bg-surface p-1 shadow-sm">
      {[
        { to: "/vacancies" as const, label: "Вакансии", count: "2 400" },
        { to: "/resumes" as const, label: "Резюме", count: "1 100" },
      ].map((tab) => (
        <Link
          key={tab.to}
          to={tab.to}
          className={cn(
            "inline-flex h-9 items-center gap-2 rounded-full px-3.5 text-[12px] font-semibold transition",
            tab.to === "/resumes" ? "bg-fg text-bg" : "text-muted hover:text-fg",
          )}
        >
          {tab.label}
          <span
            className={cn(
              "rounded-full px-1.5 py-0.5 text-[9px] font-bold",
              tab.to === "/resumes" ? "bg-bg/20 text-bg" : "bg-surface-3 text-faint",
            )}
          >
            {tab.count}
          </span>
        </Link>
      ))}
    </div>
  );
}
