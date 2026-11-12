import { useState } from "react";
import { Link, useParams } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Briefcase,
  Building2,
  CalendarDays,
  Check,
  Clock3,
  ExternalLink,
  Globe,
  Heart,
  MapPin,
  Send,
  Share2,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import { companyMap } from "@/data/companies";
import { vacancyById, vacancies } from "@/data/vacancies";
import { formatSalary, relativeDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import { useTitle } from "@/lib/useTitle";
import { useUser } from "@/store/user";
import { useUi } from "@/store/ui";
import { Badge, buttonStyles, Card, Progress } from "@/components/ui/primitives";
import { CompanyLogo, VacancyCard } from "@/components/shared/cards";
import { ApplyModal } from "@/components/shared/modals";
import { Page } from "@/components/layout/Page";
import { demoUser } from "@/data/profile";

export function VacancyDetailPage() {
  const { vacancyId } = useParams({ from: "/vacancies/$vacancyId" });
  const vacancy = vacancyById[vacancyId];
  const [applyOpen, setApplyOpen] = useState(false);
  const favorite = useUser((state) => state.favorites.includes(vacancyId));
  const toggleFavorite = useUser((state) => state.toggleFavorite);
  const applied = useUser((state) => state.applications.some((item) => item.vacancyId === vacancyId));
  const mySkills = useUser((state) => state.resume.skills);
  const toast = useUi((state) => state.toast);
  useTitle(vacancy ? vacancy.title : "Вакансия не найдена");

  if (!vacancy) {
    return (
      <Page>
        <section className="container-page flex min-h-[70vh] flex-col items-center justify-center pt-24 text-center">
          <span className="grid size-16 place-items-center rounded-2xl bg-surface-3 text-faint">
            <Briefcase className="size-7" />
          </span>
          <h1 className="mt-5 text-3xl font-semibold tracking-[-0.04em]">Вакансия не найдена</h1>
          <p className="mt-2 text-[13.5px] text-muted">Возможно, она уже закрыта или ссылка устарела.</p>
          <Link to="/vacancies" className={buttonStyles({ className: "mt-6" })}>
            Все вакансии
            <ArrowRight className="size-4" />
          </Link>
        </section>
      </Page>
    );
  }

  const company = companyMap[vacancy.companyId];
  const related = vacancies
    .filter((item) => item.id !== vacancy.id && item.companyId === vacancy.companyId)
    .concat(vacancies.filter((item) => item.id !== vacancy.id && item.companyId !== vacancy.companyId))
    .slice(0, 3);

  const mySkillList = mySkills
    .split(",")
    .map((skill) => skill.trim().toLowerCase())
    .filter(Boolean);
  const vacancySkills = vacancy.skills.map((skill) => ({
    name: skill,
    has: mySkillList.includes(skill.toLowerCase()),
  }));
  const missingSkill = vacancySkills.find((skill) => !skill.has)?.name;

  const share = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast({ title: "Ссылка скопирована", description: "Можно отправлять друзьям.", variant: "info" });
    } catch {
      toast({ title: "Не удалось скопировать", description: "Скопируйте адрес из строки браузера.", variant: "error" });
    }
  };

  return (
    <Page>
      <section className="relative overflow-hidden pb-8 pt-28 sm:pt-32">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="grid-bg absolute inset-x-0 top-0 h-[280px] opacity-60" />
          <div className="absolute -right-32 top-0 size-[380px] rounded-full bg-brand/10 blur-[100px]" />
        </div>

        <div className="container-page relative">
          <Link
            to="/vacancies"
            className="inline-flex items-center gap-1.5 text-[11.5px] font-semibold text-muted transition hover:text-brand"
          >
            <ArrowLeft className="size-3.5" />
            Все вакансии
          </Link>

          <div className="mt-5 flex flex-col justify-between gap-6 lg:flex-row lg:items-start">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-start gap-4 sm:gap-5"
            >
              <CompanyLogo company={company} size="lg" />
              <div>
                <div className="flex flex-wrap items-center gap-1.5">
                  <Badge variant="brand">{vacancy.employment}</Badge>
                  <Badge variant="outline">{vacancy.schedule}</Badge>
                  {vacancy.remote && <Badge variant="outline">Можно удалённо</Badge>}
                  {vacancy.hot && <Badge variant="warning">Срочно</Badge>}
                </div>
                <h1 className="mt-3 max-w-[720px] text-[clamp(1.7rem,3.6vw,2.7rem)] font-semibold leading-[1.06] tracking-[-0.04em] text-balance">
                  {vacancy.title}
                </h1>
                <p className="mt-2.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] text-muted">
                  <span className="inline-flex items-center gap-1.5 font-semibold text-fg">
                    {company.name}
                    {company.verified && <BadgeCheck className="size-4 text-brand" />}
                  </span>
                  <span className="text-faint">·</span>
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="size-3.5" />
                    {vacancy.city}
                  </span>
                  <span className="text-faint">·</span>
                  <span className="inline-flex items-center gap-1">
                    <Clock3 className="size-3.5" />
                    {relativeDate(vacancy.publishedAt)}
                  </span>
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col gap-3"
            >
              <div className="flex items-end justify-between gap-6 lg:justify-end">
                <span className="text-[24px] font-bold tracking-[-0.04em]">
                  {formatSalary(vacancy.salaryFrom, vacancy.salaryTo)}
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const added = toggleFavorite(vacancy.id);
                      toast({
                        title: added ? "В избранном" : "Убрано из избранного",
                        variant: "info",
                      });
                    }}
                    aria-label="В избранное"
                    className={cn(
                      "grid size-11 place-items-center rounded-full border transition",
                      favorite
                        ? "border-rose-400/30 bg-rose-500/10 text-rose-500"
                        : "border-line bg-surface text-muted hover:text-fg",
                    )}
                  >
                    <Heart className={cn("size-4", favorite && "fill-current")} />
                  </button>
                  <button
                    type="button"
                    onClick={share}
                    aria-label="Поделиться"
                    className="grid size-11 place-items-center rounded-full border border-line bg-surface text-muted transition hover:text-fg"
                  >
                    <Share2 className="size-4" />
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 lg:justify-end">
                <button
                  type="button"
                  onClick={() => setApplyOpen(true)}
                  className={buttonStyles({ size: "lg", className: "w-full sm:w-auto" })}
                >
                  {applied ? "Вы откликнулись" : "Откликнуться"}
                  <Send className="size-4" />
                </button>
                <Link
                  to="/ai"
                  search={{ tab: "resume" }}
                  className={buttonStyles({ variant: "secondary", size: "lg" })}
                >
                  <Sparkles className="size-4 text-brand" />
                  Улучшить резюме
                </Link>
              </div>
              <p className="flex items-center gap-1.5 text-[10.5px] text-muted lg:justify-end">
                <BadgeCheck className="size-3.5 text-brand" />
                Резюме прикрепляется автоматически
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="pb-10">
        <div className="container-page grid items-start gap-6 lg:grid-cols-[1fr_340px]">
          <div className="space-y-4">
            <Card className="p-6 sm:p-7">
              <h2 className="text-[17px] font-semibold tracking-[-0.02em]">О вакансии</h2>
              <p className="mt-3 text-[13.5px] leading-relaxed text-muted">{vacancy.description}</p>

              <div className="mt-6 grid gap-6 sm:grid-cols-2">
                <div>
                  <h3 className="text-[12.5px] font-bold uppercase tracking-[0.12em] text-faint">
                    Задачи
                  </h3>
                  <ul className="mt-3 space-y-2.5">
                    {vacancy.tasks.map((task) => (
                      <li key={task} className="flex gap-2.5 text-[13px] leading-relaxed text-muted">
                        <Check className="mt-0.5 size-4 shrink-0 text-brand" />
                        {task}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-[12.5px] font-bold uppercase tracking-[0.12em] text-faint">
                    Требования
                  </h3>
                  <ul className="mt-3 space-y-2.5">
                    {vacancy.requirements.map((requirement) => (
                      <li
                        key={requirement}
                        className="flex gap-2.5 text-[13px] leading-relaxed text-muted"
                      >
                        <span className="mt-[7px] size-1.5 shrink-0 rounded-full bg-faint" />
                        {requirement}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-7">
                <h3 className="text-[12.5px] font-bold uppercase tracking-[0.12em] text-faint">
                  Условия
                </h3>
                <div className="mt-3 grid gap-2 sm:grid-cols-3">
                  {vacancy.conditions.map((condition) => (
                    <div
                      key={condition}
                      className="rounded-2xl border border-line bg-surface-2 p-3.5 text-[12px] leading-relaxed text-muted"
                    >
                      <Sparkles className="mb-2 size-3.5 text-brand" />
                      {condition}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 border-t border-line pt-5">
                <h3 className="text-[12.5px] font-bold uppercase tracking-[0.12em] text-faint">
                  Навыки
                </h3>
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {vacancy.skills.map((skill) => (
                    <Badge key={skill} className="bg-surface-2 px-3 py-1.5 text-[11.5px]">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </Card>

            <Card className="p-6 sm:p-7">
              <div className="flex items-center gap-3">
                <CompanyLogo company={company} />
                <div>
                  <h3 className="flex items-center gap-1.5 text-[15px] font-semibold">
                    {company.name}
                    {company.verified && <BadgeCheck className="size-4 text-brand" />}
                  </h3>
                  <p className="text-[11.5px] text-muted">{company.industry}</p>
                </div>
                <a
                  href={`https://${company.site}`}
                  target="_blank"
                  rel="noreferrer"
                  className="ml-auto hidden items-center gap-1 text-[11px] font-semibold text-brand sm:inline-flex"
                >
                  {company.site}
                  <ExternalLink className="size-3" />
                </a>
              </div>
              <p className="mt-4 text-[13px] leading-relaxed text-muted">{company.about}</p>
              <div className="mt-4 flex flex-wrap gap-4 border-t border-line pt-4 text-[11.5px] text-muted">
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="size-3.5" />
                  {company.city}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Users className="size-3.5" />
                  {company.employees}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Building2 className="size-3.5" />
                  {company.industry}
                </span>
              </div>
            </Card>

            <div>
              <div className="mb-4 flex items-end justify-between">
                <h2 className="text-[20px] font-semibold tracking-[-0.03em]">Похожие вакансии</h2>
                <Link to="/vacancies" className="text-[11.5px] font-semibold text-brand">
                  Все
                </Link>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {related.map((item) => (
                  <VacancyCard key={item.id} vacancy={item} />
                ))}
              </div>
            </div>
          </div>

          <aside className="space-y-3 lg:sticky lg:top-24">
            <Card className="overflow-hidden">
              <div className="border-b border-line bg-linear-to-br from-brand-soft to-transparent p-5">
                <div className="flex items-center justify-between">
                  <p className="flex items-center gap-1.5 text-[12px] font-semibold">
                    <Sparkles className="size-3.5 text-brand" />
                    Совпадение с профилем
                  </p>
                  <span className="text-[21px] font-bold tracking-[-0.04em] text-brand">
                    {vacancy.match}%
                  </span>
                </div>
                <Progress value={vacancy.match} className="mt-3 bg-surface/60" />
                <p className="mt-2 text-[10.5px] text-muted">
                  {vacancySkills.filter((skill) => skill.has).length} из {vacancySkills.length}{" "}
                  ключевых навыков уже в резюме
                </p>
              </div>

              <div className="p-5">
                <div className="flex items-center gap-2">
                  <span className="grid size-9 place-items-center rounded-full bg-linear-to-br from-brand-400 to-brand-800 text-[10px] font-bold text-white">
                    {demoUser.name
                      .split(" ")
                      .map((part) => part[0])
                      .join("")}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-[11.5px] font-semibold">{demoUser.name}</p>
                    <p className="text-[9.5px] text-muted">Резюме · обновлено сегодня</p>
                  </div>
                  <BadgeCheck className="ml-auto size-4 text-brand" />
                </div>

                <div className="mt-4 space-y-2">
                  {vacancySkills.map((skill) => (
                    <div key={skill.name} className="flex items-center gap-2 text-[11px]">
                      <span
                        className={cn(
                          "grid size-4 shrink-0 place-items-center rounded-full",
                          skill.has
                            ? "bg-emerald-500/15 text-emerald-500"
                            : "bg-amber-500/15 text-amber-500",
                        )}
                      >
                        {skill.has ? <Check className="size-2.5" /> : <X className="size-2.5" />}
                      </span>
                      <span className={skill.has ? "text-fg" : "text-muted"}>{skill.name}</span>
                      <span className="ml-auto text-[9px] text-faint">
                        {skill.has ? "подтверждён" : "нет в резюме"}
                      </span>
                    </div>
                  ))}
                </div>

                {missingSkill && (
                  <Link
                    to="/ai"
                    search={{ tab: "resume" }}
                    className="mt-3 flex items-center gap-1.5 rounded-xl bg-brand-soft px-3 py-2 text-[10px] font-semibold text-brand transition hover:bg-brand/15"
                  >
                    <Sparkles className="size-3" />
                    Добавить «{missingSkill}» в резюме
                  </Link>
                )}

                <button
                  type="button"
                  onClick={() => setApplyOpen(true)}
                  className={buttonStyles({ className: "mt-4 w-full" })}
                >
                  {applied ? "Отклик отправлен" : "Откликнуться"}
                  <ArrowRight className="size-4" />
                </button>
                <p className="mt-2.5 text-center text-[9.5px] leading-relaxed text-faint">
                  Отклик займёт 30 секунд. Сопроводительное можно сгенерировать с ИИ.
                </p>
              </div>
            </Card>

            <Card className="p-5">
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-faint">
                Контактное лицо
              </p>
              <div className="mt-3 flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-full bg-brand-soft text-[11px] font-bold text-brand">
                  {vacancy.hr.name
                    .split(" ")
                    .map((part) => part[0])
                    .join("")}
                </span>
                <div>
                  <p className="text-[12px] font-semibold">{vacancy.hr.name}</p>
                  <p className="text-[10px] text-muted">{vacancy.hr.role}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() =>
                  toast({
                    title: "Сообщение отправлено",
                    description: `${vacancy.hr.name} ответит в чате Орбиты.`,
                    variant: "success",
                  })
                }
                className="mt-4 inline-flex h-9 w-full items-center justify-center gap-2 rounded-full border border-line bg-surface-2 text-[11.5px] font-semibold transition hover:border-brand/30 hover:text-brand"
              >
                <Send className="size-3.5" />
                Написать HR
              </button>
            </Card>

            <Card className="p-5">
              <div className="flex items-start gap-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-emerald-500/10 text-emerald-500">
                  <CalendarDays className="size-4" />
                </span>
                <div>
                  <p className="text-[11.5px] font-semibold">Хочешь узнать компанию ближе?</p>
                  <p className="mt-1 text-[10.5px] leading-relaxed text-muted">
                    {company.name} проводит день открытых дверей — приходи и получи приоритет в
                    отборе.
                  </p>
                  <Link
                    to="/events"
                    className="mt-2 inline-flex items-center gap-1 text-[10.5px] font-bold text-brand"
                  >
                    Смотреть события
                    <ArrowUpRightSmall />
                  </Link>
                </div>
              </div>
            </Card>

            <p className="flex items-center justify-center gap-1.5 px-2 text-center text-[9.5px] text-faint">
              <Globe className="size-3" />
              Вакансия размещена 11 ноября 2026 · проверена модератором
            </p>
          </aside>
        </div>
      </section>

      <ApplyModal vacancy={applyOpen ? vacancy : null} onClose={() => setApplyOpen(false)} />
    </Page>
  );
}

function ArrowUpRightSmall() {
  return (
    <svg viewBox="0 0 12 12" className="size-2.5" fill="none">
      <path d="M3 9 9 3M4 3h5v5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}
