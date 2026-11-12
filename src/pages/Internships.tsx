import { useEffect, useMemo, useState } from "react";
import { Link, getRouteApi } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  Briefcase,
  Building2,
  CalendarDays,
  Check,
  Clock3,
  FileSignature,
  GraduationCap,
  MapPin,
  Search,
  Sparkles,
  Target,
  Users,
} from "lucide-react";
import { fetchInternships } from "@/lib/api";
import { internships as seedInternships } from "@/data/internships";
import type { Internship } from "@/data/types";
import { companyMap } from "@/data/companies";
import { formatDate, formatMoney } from "@/lib/format";
import { useTitle } from "@/lib/useTitle";
import { useUi } from "@/store/ui";
import { Badge, Button, Card, FilterChip, Input, Progress } from "@/components/ui/primitives";
import { InternshipCard } from "@/components/shared/cards";
import { Modal } from "@/components/ui/Modal";
import { SuccessState } from "@/components/shared/modals";
import { Page, PageHero } from "@/components/layout/Page";

const routeApi = getRouteApi("/internships");
const directions = ["Все", "IT и аналитика", "Инженерия", "Энергетика", "Медиа", "Судостроение", "Экология"] as const;

export function InternshipsPage() {
  useTitle("Стажировки и практика");
  const search = routeApi.useSearch();
  const { data, isLoading } = useQuery({ queryKey: ["internships"], queryFn: fetchInternships });
  const [query, setQuery] = useState(search.q ?? "");
  const [direction, setDirection] = useState<(typeof directions)[number]>("Все");
  const [selected, setSelected] = useState<Internship | null>(null);

  useEffect(() => {
    setQuery(search.q ?? "");
  }, [search.q]);

  const source = data ?? seedInternships;
  const filtered = useMemo(() => {
    let list = [...source];
    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter((item) =>
        [item.title, item.direction, item.mentor, companyMap[item.companyId]?.name ?? ""]
          .join(" ")
          .toLowerCase()
          .includes(q),
      );
    }
    if (direction !== "Все") list = list.filter((item) => item.direction === direction);
    return list;
  }, [source, query, direction]);

  return (
    <Page>
      <PageHero
        eyebrow="Модуль 02 · Практики и обучение"
        title={
          <>
            Практика, которая идёт <span className="text-gradient">в зачёт</span>
          </>
        }
        description="Программы предприятий региона с оплатой и наставником. Договор о практике между студентом, вузом и предприятием — прозрачно для всех."
      >
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="brand">
            <FileSignature className="size-3" />
            Программа «Карьерный старт»
          </Badge>
          <span className="text-[11.5px] text-muted">74% стажёров получают оффер</span>
        </div>
      </PageHero>

      <section className="pb-8">
        <div className="container-page">
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {[
              { icon: Briefcase, value: "380", label: "программ практик", note: "от 96 предприятий" },
              { icon: Users, value: "2 100", label: "студентов прошли", note: "за 2025/26 год" },
              { icon: Target, value: "74%", label: "получают оффер", note: "по итогам стажировки" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-[20px] border border-line bg-surface p-3 sm:flex sm:items-center sm:gap-3.5 sm:p-4"
              >
                <span className="hidden size-10 shrink-0 place-items-center rounded-2xl bg-brand-soft text-brand sm:grid">
                  <stat.icon className="size-[18px]" />
                </span>
                <div>
                  <p className="text-[17px] font-bold leading-none tracking-[-0.03em] sm:text-[19px]">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-[10px] leading-tight text-muted sm:text-[11px]">
                    {stat.label}
                  </p>
                  <p className="hidden text-[9.5px] text-faint sm:block">{stat.note}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative sm:max-w-[400px] sm:flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-faint" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Направление, компания или наставник"
                className="h-11 rounded-2xl bg-surface pl-11"
              />
            </div>
            <span className="text-[11.5px] text-muted">{filtered.length} программ доступно</span>
          </div>

          <div className="no-scrollbar scroll-fade mt-4 flex gap-1.5 overflow-x-auto pb-1">
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

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {isLoading
              ? Array.from({ length: 6 }).map((_, index) => (
                  <Card key={index} className="h-[380px] animate-pulse bg-surface-2">
                    <span className="sr-only">Загрузка</span>
                  </Card>
                ))
              : filtered.map((internship) => (
                  <InternshipCard key={internship.id} internship={internship} onOpen={setSelected} />
                ))}
          </div>

          {filtered.length === 0 && (
            <div className="mt-6 rounded-[24px] border border-dashed border-line p-12 text-center text-[12.5px] text-muted">
              По этому направлению пока нет программ — попробуй другой фильтр.
            </div>
          )}
        </div>
      </section>

      <section className="py-10">
        <div className="container-page">
          <div className="grid items-center gap-8 rounded-[32px] border border-line bg-surface p-6 shadow-[var(--shadow-soft)] sm:p-10 lg:grid-cols-[1fr_0.95fr]">
            <div>
              <Badge variant="brand">Как это устроено</Badge>
              <h2 className="mt-4 max-w-[480px] text-[clamp(1.7rem,3vw,2.4rem)] font-semibold leading-[1.08] tracking-[-0.04em]">
                Один договор вместо «договоримся на словах»
              </h2>
              <p className="mt-4 max-w-[480px] text-[13px] leading-relaxed text-muted">
                Студент, вуз и предприятие фиксируют условия практики в одном документе: сроки,
                оплату, наставника и зачёт по дисциплине. Куратор программы следит за исполнением.
              </p>

              <div className="mt-6 space-y-3">
                {[
                  { title: "Для студента", text: "Оплата, наставник и запись в трудовую книжку" },
                  { title: "Для вуза", text: "Реальная база практики и трудоустройство выпускников" },
                  { title: "Для предприятия", text: "Подготовленный кандидат без затрат на поиск" },
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-3">
                    <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-emerald-500/12 text-emerald-500">
                      <Check className="size-3" />
                    </span>
                    <p className="text-[12.5px] text-muted">
                      <span className="font-semibold text-fg">{item.title}.</span> {item.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative rounded-[26px] border border-line bg-surface-2 p-6">
              <div className="absolute left-1/2 top-1/2 hidden h-[220px] w-px -translate-x-1/2 -translate-y-1/2 border-l border-dashed border-brand/30 sm:block" />
              <div className="relative space-y-3">
                {[
                  { icon: GraduationCap, label: "Студент", note: "заявка и резюме", color: "text-brand" },
                  { icon: Building2, label: "Вуз", note: "договор и зачёт", color: "text-indigo-500" },
                  { icon: Briefcase, label: "Предприятие", note: "оплата и наставник", color: "text-emerald-500" },
                ].map((node) => (
                  <div
                    key={node.label}
                    className="relative flex items-center gap-3 rounded-2xl border border-line bg-surface px-4 py-3.5"
                  >
                    <span className={`grid size-9 place-items-center rounded-xl bg-surface-2 ${node.color}`}>
                      <node.icon className="size-4" />
                    </span>
                    <div>
                      <p className="text-[12px] font-semibold">{node.label}</p>
                      <p className="text-[10px] text-muted">{node.note}</p>
                    </div>
                    <BadgeCheck className="ml-auto size-4 text-emerald-500" />
                  </div>
                ))}
              </div>
              <div className="relative mt-4 flex items-center justify-center gap-2 rounded-2xl bg-brand px-4 py-3 text-white">
                <FileSignature className="size-4" />
                <span className="text-[11px] font-semibold">Единый договор о практике</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-8">
        <div className="container-page">
          <div className="grid gap-4 md:grid-cols-4">
            {[
              { step: "01", title: "Выбери программу", text: "Отфильтруй по направлению и графику" },
              { step: "02", title: "Подай заявку", text: "Резюме и мотивация — 5 минут" },
              { step: "03", title: "Собеседование", text: "Короткий разговор с наставником" },
              { step: "04", title: "Договор и старт", text: "Вуз и предприятие подписывают онлайн" },
            ].map((step) => (
              <div key={step.step} className="rounded-[22px] border border-line bg-surface p-5">
                <span className="text-[10px] font-bold tracking-[0.16em] text-brand">{step.step}</span>
                <p className="mt-3 text-[13px] font-semibold">{step.title}</p>
                <p className="mt-1 text-[11px] leading-relaxed text-muted">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <InternshipModal internship={selected} onClose={() => setSelected(null)} />
    </Page>
  );
}

function InternshipModal({
  internship,
  onClose,
}: {
  internship: Internship | null;
  onClose: () => void;
}) {
  const [last, setLast] = useState<Internship | null>(internship);
  const [sent, setSent] = useState(false);
  const toast = useUi((state) => state.toast);

  useEffect(() => {
    if (internship) {
      setLast(internship);
      setSent(false);
    }
  }, [internship]);

  const data = internship ?? last;
  if (!data) return null;
  const company = companyMap[data.companyId];
  const filled = Math.round(((data.seats - 3) / data.seats) * 100);

  return (
    <Modal open={!!internship} onClose={onClose} className="sm:max-w-[580px]">
      <AnimatePresence mode="wait" initial={false}>
        {sent ? (
          <motion.div key="sent" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <SuccessState
              title="Заявка отправлена"
              description={`Куратор программы «${data.title}» свяжется с тобой в течение двух рабочих дней. Документы для договора о практике придут в личный кабинет.`}
            >
              <div className="space-y-2">
                <Link
                  to="/profile"
                  search={{ tab: "applications" }}
                  onClick={onClose}
                  className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-brand text-sm font-semibold text-white transition hover:bg-brand-strong"
                >
                  Мои заявки
                  <ArrowRight className="size-4" />
                </Link>
                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex h-11 w-full items-center justify-center rounded-full text-[13px] font-semibold text-muted transition hover:bg-surface-2"
                >
                  Смотреть другие программы
                </button>
              </div>
            </SuccessState>
          </motion.div>
        ) : (
          <motion.div key="info" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-start gap-3.5">
              <span
                className="grid size-12 shrink-0 place-items-center rounded-[15px] text-[13px] font-bold text-white"
                style={{ backgroundImage: `linear-gradient(140deg, ${company.c1}, ${company.c2})` }}
              >
                {company.initials}
              </span>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-1.5">
                  <Badge variant="brand">{data.direction}</Badge>
                  <Badge variant="outline">{data.format}</Badge>
                </div>
                <h3 className="mt-2 text-[21px] font-semibold leading-tight tracking-[-0.03em]">
                  {data.title}
                </h3>
                <p className="mt-1 flex items-center gap-1 text-[11.5px] text-muted">
                  {company.name}
                  <BadgeCheck className="size-3.5 text-brand" />
                </p>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-2 rounded-2xl border border-line bg-surface-2 p-3 text-center">
              {[
                { label: "Стипендия", value: `${formatMoney(data.stipend)} ₽` },
                { label: "Длительность", value: data.duration },
                { label: "Мест", value: `${data.seats}` },
              ].map((item) => (
                <div key={item.label}>
                  <p className="text-[13px] font-bold tracking-[-0.02em]">{item.value}</p>
                  <p className="mt-0.5 text-[9.5px] text-faint">{item.label}</p>
                </div>
              ))}
            </div>

            <p className="mt-4 text-[12.5px] leading-relaxed text-muted">{data.description}</p>

            <div className="mt-5">
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-faint">
                Программа
              </p>
              <div className="mt-2.5 space-y-2">
                {data.program.map((item) => (
                  <div key={item} className="flex items-start gap-2.5 text-[12px] text-muted">
                    <span className="mt-0.5 grid size-[18px] shrink-0 place-items-center rounded-full bg-brand-soft text-brand">
                      <Check className="size-2.5" />
                    </span>
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              <div className="rounded-xl border border-line bg-surface-2 px-3 py-2.5">
                <p className="flex items-center gap-1.5 text-[10px] text-faint">
                  <Users className="size-3" />
                  Наставник
                </p>
                <p className="mt-1 text-[11px] font-medium">{data.mentor}</p>
              </div>
              <div className="rounded-xl border border-line bg-surface-2 px-3 py-2.5">
                <p className="flex items-center gap-1.5 text-[10px] text-faint">
                  <CalendarDays className="size-3" />
                  Заявки до
                </p>
                <p className="mt-1 text-[11px] font-medium">{formatDate(data.deadline)}</p>
              </div>
            </div>

            <div className="mt-4">
              <div className="mb-1.5 flex items-center justify-between text-[10px] text-faint">
                <span className="flex items-center gap-1">
                  <MapPin className="size-3" />
                  {data.format}
                </span>
                <span>{filled}% мест занято</span>
              </div>
              <Progress value={filled} />
            </div>

            <div className="mt-4 flex items-center gap-2 rounded-xl bg-emerald-500/8 px-3 py-2.5 text-[10.5px] leading-relaxed text-emerald-700 dark:text-emerald-400">
              <Sparkles className="size-3.5 shrink-0" />
              По завершении — сертификат, запись в резюме и шанс на оффер {data.hiringChance}%
            </div>

            <Button
              className="mt-5 w-full"
              size="lg"
              onClick={() => {
                toast({
                  title: "Заявка на программу отправлена",
                  description: data.title,
                  variant: "success",
                });
                setSent(true);
              }}
            >
              Подать заявку
              <ArrowRight className="size-4" />
            </Button>
            <p className="mt-3 flex items-center justify-center gap-1 text-center text-[10px] text-faint">
              <Clock3 className="size-3" />
              Отбор занимает 2–3 рабочих дня
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </Modal>
  );
}
