import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  Briefcase,
  Camera,
  Check,
  Code2,
  Cog,
  FileSignature,
  GraduationCap,
  Leaf,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  Waypoints,
} from "lucide-react";
import {
  programs,
  trajectories,
  universities,
  universityMap,
} from "@/data/education";
import type { EducationProgram } from "@/data/types";
import { companyMap } from "@/data/companies";
import { vacancyById } from "@/data/vacancies";
import { useTitle } from "@/lib/useTitle";
import { Badge, Button, Card, Input, Progress } from "@/components/ui/primitives";
import { Modal } from "@/components/ui/Modal";
import { SuccessState } from "@/components/shared/modals";
import { Page, PageHero } from "@/components/layout/Page";
import { cn } from "@/lib/utils";

const trajectoryIcons = {
  code: Code2,
  chart: TrendingUp,
  gear: Cog,
  sparkles: Sparkles,
  leaf: Leaf,
  camera: Camera,
};

export function EducationPage() {
  useTitle("Обучение и траектория");
  const [trajectoryId, setTrajectoryId] = useState(trajectories[0].id);
  const [program, setProgram] = useState<EducationProgram | null>(null);
  const [orderOpen, setOrderOpen] = useState(false);

  const trajectory = trajectories.find((item) => item.id === trajectoryId) ?? trajectories[0];

  return (
    <Page>
      <PageHero
        eyebrow="Модуль 06 · Образование и карьера"
        title={
          <>
            Учись по <span className="text-gradient">траектории</span>, а не по интуиции
          </>
        }
        description="Вузы, колледжи и предприятия региона вместе проектируют обучение под реальные задачи. А работодатель может заказать подготовку специалиста и платить за результат."
      >
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="brand">
            <GraduationCap className="size-3" />
            14 учебных заведений
          </Badge>
          <Badge variant="outline">86 совместных программ</Badge>
          <Badge variant="success">оплата за качество</Badge>
        </div>
      </PageHero>

      <section className="pb-10">
        <div className="container-page">
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
            {[
              { icon: GraduationCap, value: "14", label: "вузов и колледжей", note: "в Астраханской области" },
              { icon: Waypoints, value: "86", label: "программ", note: "с участием предприятий" },
              { icon: Briefcase, value: "214", label: "заказов на подготовку", note: "за 2025/26 год" },
              { icon: Target, value: "81%", label: "выходят на работу", note: "по профилю обучения" },
            ].map((stat) => (
              <div key={stat.label} className="rounded-[22px] border border-line bg-surface p-5">
                <span className="grid size-9 place-items-center rounded-xl bg-brand-soft text-brand">
                  <stat.icon className="size-4" />
                </span>
                <p className="mt-4 text-[26px] font-bold leading-none tracking-[-0.04em]">
                  {stat.value}
                </p>
                <p className="mt-1.5 text-[11.5px] font-medium">{stat.label}</p>
                <p className="text-[10px] text-faint">{stat.note}</p>
              </div>
            ))}
          </div>

          <div className="mt-12">
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand">
                  Партнёры
                </p>
                <h2 className="mt-2 text-[clamp(1.5rem,2.8vw,2.1rem)] font-semibold tracking-[-0.035em]">
                  Учебные заведения региона
                </h2>
              </div>
              <p className="max-w-[340px] text-[11.5px] leading-relaxed text-muted">
                Интеграция с учебными планами: зачёт практики, совместные лаборатории и целевое
                обучение.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {universities.map((university) => (
                <div
                  key={university.id}
                  className="card-hover flex flex-col rounded-[22px] border border-line bg-surface p-4"
                >
                  <span
                    className="grid size-10 place-items-center rounded-xl text-[11px] font-bold text-white"
                    style={{ backgroundImage: `linear-gradient(140deg, ${university.c1}, ${university.c2})` }}
                  >
                    {university.short}
                  </span>
                  <p className="mt-3 line-clamp-2 text-[11.5px] font-semibold leading-snug">
                    {university.name}
                  </p>
                  <p className="mt-2 text-[10px] text-muted">
                    {university.programs} программ · {university.students}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-8">
        <div className="container-page">
          <div className="overflow-hidden rounded-[32px] border border-line bg-surface shadow-[var(--shadow-soft)]">
            <div className="border-b border-line p-6 sm:p-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <Badge variant="brand">
                    <Waypoints className="size-3" />
                    Конструктор траектории
                  </Badge>
                  <h2 className="mt-3 text-[clamp(1.5rem,2.6vw,2rem)] font-semibold tracking-[-0.035em]">
                    От первого курса до оффера
                  </h2>
                  <p className="mt-2 text-[12.5px] leading-relaxed text-muted">
                    Выбери направление — покажем шаги, которые уже согласованы с вузами и
                    предприятиями.
                  </p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {trajectories.map((item) => {
                    const Icon = trajectoryIcons[item.icon];
                    const active = item.id === trajectory.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setTrajectoryId(item.id)}
                        className={cn(
                          "inline-flex h-9 items-center gap-1.5 rounded-full border px-3 text-[11.5px] font-semibold transition",
                          active
                            ? "border-brand/30 bg-brand-soft text-brand"
                            : "border-line bg-surface text-muted hover:text-fg",
                        )}
                      >
                        <Icon className="size-3.5" />
                        {item.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[1.2fr_0.8fr]">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={trajectory.id}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.3 }}
                  className="relative"
                >
                  <div className="absolute bottom-4 left-[17px] top-4 w-px bg-linear-to-b from-brand/40 via-line to-transparent" />
                  <div className="space-y-4">
                    {trajectory.steps.map((step, index) => (
                      <div key={step.title} className="relative flex gap-4">
                        <span
                          className={cn(
                            "relative z-10 grid size-9 shrink-0 place-items-center rounded-full border text-[10px] font-bold",
                            index === trajectory.steps.length - 1
                              ? "border-brand bg-brand text-white"
                              : "border-line bg-surface text-brand",
                          )}
                        >
                          {index === trajectory.steps.length - 1 ? (
                            <Check className="size-4" />
                          ) : (
                            `0${index + 1}`
                          )}
                        </span>
                        <div className="min-w-0 flex-1 rounded-2xl border border-line bg-surface-2 p-3.5">
                          <div className="flex flex-wrap items-center justify-between gap-1">
                            <p className="text-[12.5px] font-semibold">{step.title}</p>
                            <span className="text-[9.5px] font-medium text-brand">{step.duration}</span>
                          </div>
                          <p className="mt-0.5 text-[10.5px] font-medium text-muted">{step.place}</p>
                          <p className="mt-1 text-[10.5px] leading-relaxed text-faint">{step.detail}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>

              <div className="rounded-[24px] border border-line bg-surface-2 p-5">
                <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-faint">
                  <Sparkles className="size-3.5 text-brand" />
                  Подходящие вакансии
                </p>
                <div className="mt-3 space-y-2">
                  {trajectory.vacancyIds.map((id) => {
                    const vacancy = vacancyById[id];
                    if (!vacancy) return null;
                    const company = companyMap[vacancy.companyId];
                    return (
                      <Link
                        key={id}
                        to="/vacancies/$vacancyId"
                        params={{ vacancyId: id }}
                        className="group flex items-center gap-2.5 rounded-xl border border-line bg-surface px-3 py-2.5 transition hover:border-brand/30"
                      >
                        <span
                          className="grid size-8 shrink-0 place-items-center rounded-lg text-[9px] font-bold text-white"
                          style={{ backgroundImage: `linear-gradient(140deg, ${company.c1}, ${company.c2})` }}
                        >
                          {company.initials}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[10.5px] font-semibold">{vacancy.title}</p>
                          <p className="text-[9px] text-muted">{company.name}</p>
                        </div>
                        <ArrowUpRight className="size-3.5 text-faint transition group-hover:text-brand" />
                      </Link>
                    );
                  })}
                </div>

                <div className="mt-4 rounded-xl bg-brand-soft p-3">
                  <p className="text-[10px] font-bold text-brand">Что дальше?</p>
                  <p className="mt-1 text-[10px] leading-relaxed text-muted">
                    Пройди профориентацию — ИИ сверит траекторию с твоими интересами и оценками.
                  </p>
                  <Link
                    to="/ai"
                    search={{ tab: "test" }}
                    className="mt-2 inline-flex items-center gap-1 text-[10px] font-bold text-brand"
                  >
                    Пройти тест
                    <ArrowRight className="size-3" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-10">
        <div className="container-page">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-brand">
                <span className="h-px w-6 bg-brand/50" />
                Совместные программы
              </div>
              <h2 className="text-[clamp(1.7rem,3.2vw,2.5rem)] font-semibold tracking-[-0.04em]">
                Обучение с гарантией практики
              </h2>
            </div>
            <Link
              to="/internships"
              className="inline-flex items-center gap-1.5 text-[12px] font-bold text-brand"
            >
              Смотреть практики
              <ArrowRight className="size-3.5" />
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {programs.map((item) => {
              const university = universityMap[item.universityId];
              const company = companyMap[item.companyId];
              return (
                <Card key={item.id} hover className="flex flex-col p-5">
                  <div className="flex items-start justify-between">
                    <span
                      className="grid size-10 place-items-center rounded-xl text-[10px] font-bold text-white"
                      style={{ backgroundImage: `linear-gradient(140deg, ${university.c1}, ${university.c2})` }}
                    >
                      {university.short}
                    </span>
                    {item.order ? (
                      <Badge variant="brand">
                        <FileSignature className="size-3" />
                        Заказ на подготовку
                      </Badge>
                    ) : (
                      <Badge variant="outline">Бюджет и платно</Badge>
                    )}
                  </div>
                  <h3 className="mt-4 text-[15px] font-semibold leading-snug tracking-[-0.02em]">
                    {item.title}
                  </h3>
                  <p className="mt-1 flex items-center gap-1 text-[10.5px] text-muted">
                    {university.short} × {company.name}
                    <BadgeCheck className="size-3 text-brand" />
                  </p>
                  <p className="mt-3 line-clamp-2 text-[11.5px] leading-relaxed text-muted">
                    {item.description}
                  </p>

                  <div className="mt-4 grid grid-cols-3 gap-2 rounded-xl bg-surface-2 p-2.5 text-center">
                    <div>
                      <p className="text-[11.5px] font-bold">{item.duration}</p>
                      <p className="text-[9px] text-faint">обучение</p>
                    </div>
                    <div>
                      <p className="text-[11.5px] font-bold">{item.budgetPlaces}</p>
                      <p className="text-[9px] text-faint">бюджет</p>
                    </div>
                    <div>
                      <p className="text-[11.5px] font-bold">{item.hiringChance}%</p>
                      <p className="text-[9px] text-faint">трудоустройство</p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="mb-1 flex items-center justify-between text-[9px] text-faint">
                      <span>Выход на работу</span>
                      <span>{item.hiringChance}%</span>
                    </div>
                    <Progress value={item.hiringChance} />
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => setProgram(item)}
                      className="inline-flex h-9 items-center gap-1.5 rounded-full border border-line bg-surface-2 px-3.5 text-[11px] font-semibold transition hover:border-brand/30 hover:text-brand"
                    >
                      О программе
                      <ArrowUpRight className="size-3" />
                    </button>
                    <span className="text-[9.5px] text-faint">{item.payment}</span>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-10">
        <div className="container-page">
          <div className="noise relative overflow-hidden rounded-[32px] bg-linear-to-br from-[#0a1a3f] via-[#0c2457] to-[#07101f] p-7 text-white sm:p-10">
            <div className="pointer-events-none absolute -right-20 -top-24 size-[420px] rounded-full bg-brand/25 blur-[100px]" />
            <div className="relative grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <div>
                <Badge className="border border-white/15 bg-white/10 text-white">
                  <Briefcase className="size-3" />
                  Работодателям · head hunting
                </Badge>
                <h2 className="mt-4 max-w-[560px] text-[clamp(1.8rem,3.4vw,2.7rem)] font-semibold leading-[1.06] tracking-[-0.04em]">
                  Заказ на подготовку специалиста
                </h2>
                <p className="mt-4 max-w-[520px] text-[13px] leading-relaxed text-white/60">
                  Опишите, какой специалист нужен через год. Вуз включит дисциплины в учебный план,
                  предприятие даст практику, Орбита соберёт кандидатов. Оплата — за качество
                  выпускника, а не за часы.
                </p>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {[
                    { title: "Срок до кандидата", value: "8 недель" },
                    { title: "Оплата", value: "30% старт / 70% результат" },
                    { title: "Профилей в базе", value: "12 400 студентов" },
                    { title: "Гарантия", value: "замена в течение 3 месяцев" },
                  ].map((item) => (
                    <div
                      key={item.title}
                      className="rounded-2xl border border-white/10 bg-white/[0.04] px-3.5 py-3"
                    >
                      <p className="text-[9px] uppercase tracking-wide text-white/40">{item.title}</p>
                      <p className="mt-1 text-[12px] font-semibold">{item.value}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex flex-col gap-2 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => setOrderOpen(true)}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-white px-6 text-[12.5px] font-bold text-[#0a1a3f] transition hover:bg-white/90"
                  >
                    Оставить заказ
                    <ArrowRight className="size-4" />
                  </button>
                  <a
                    href="mailto:hr@orbita.study"
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-white/20 px-6 text-[12.5px] font-semibold text-white transition hover:bg-white/10"
                  >
                    Обсудить с командой
                  </a>
                </div>
              </div>

              <div className="relative">
                <div className="rounded-[24px] border border-white/12 bg-white/[0.05] p-5 backdrop-blur">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/40">
                      Заказ № 214
                    </p>
                    <Badge className="border border-emerald-400/20 bg-emerald-400/10 text-emerald-300">
                      в работе
                    </Badge>
                  </div>
                  <p className="mt-3 text-[15px] font-semibold">Аналитик данных · 2 специалиста</p>
                  <p className="mt-1 text-[10.5px] text-white/45">
                    КаспийТех × АГУ · старт сентября 2027
                  </p>

                  <div className="mt-4 space-y-3">
                    {[
                      { label: "Требования согласованы", value: 100 },
                      { label: "Учебный план обновлён", value: 100 },
                      { label: "Кандидаты отобраны", value: 62 },
                    ].map((row) => (
                      <div key={row.label}>
                        <div className="mb-1 flex justify-between text-[9.5px]">
                          <span className="text-white/60">{row.label}</span>
                          <span className="text-white/80">{row.value}%</span>
                        </div>
                        <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                          <div
                            className="h-full rounded-full bg-brand-400"
                            style={{ width: `${row.value}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 flex items-center gap-2 rounded-xl bg-white/[0.06] p-3">
                    <Users className="size-4 text-brand-300" />
                    <p className="text-[10px] text-white/60">
                      7 студентов подходят под профиль
                    </p>
                    <span className="ml-auto text-[10px] font-bold text-white">7</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ProgramModal program={program} onClose={() => setProgram(null)} />
      <OrderModal open={orderOpen} onClose={() => setOrderOpen(false)} />
    </Page>
  );
}

function ProgramModal({
  program,
  onClose,
}: {
  program: EducationProgram | null;
  onClose: () => void;
}) {
  const [last, setLast] = useState<EducationProgram | null>(program);
  useEffect(() => {
    if (program) setLast(program);
  }, [program]);
  const data = program ?? last;
  if (!data) return null;
  const university = universityMap[data.universityId];
  const company = companyMap[data.companyId];

  return (
    <Modal
      open={!!program}
      onClose={onClose}
      className="sm:max-w-[560px]"
    >
      <p className="pr-10 text-[11px] font-bold uppercase tracking-[0.14em] text-brand">
        {university.short} × {company.name}
      </p>
      <h3 className="mt-2 pr-8 text-[23px] font-semibold leading-tight tracking-[-0.035em]">
        {data.title}
      </h3>
      <p className="mt-3 text-[12.5px] leading-relaxed text-muted">{data.description}</p>

      <div className="mt-4 grid grid-cols-3 gap-2 rounded-2xl border border-line bg-surface-2 p-3 text-center">
        <div>
          <p className="text-[12px] font-bold">{data.duration}</p>
          <p className="text-[9px] text-faint">обучение</p>
        </div>
        <div>
          <p className="text-[12px] font-bold">{data.budgetPlaces}</p>
          <p className="text-[9px] text-faint">бюджетных мест</p>
        </div>
        <div>
          <p className="text-[12px] font-bold">{data.payment}</p>
          <p className="text-[9px] text-faint">контракт</p>
        </div>
      </div>

      <div className="mt-5">
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-faint">Модули</p>
        <div className="mt-2.5 space-y-2">
          {data.modules.map((module) => (
            <div key={module} className="flex items-start gap-2.5 text-[12px] text-muted">
              <span className="mt-0.5 grid size-[18px] shrink-0 place-items-center rounded-full bg-brand-soft text-brand">
                <Check className="size-2.5" />
              </span>
              {module}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 rounded-2xl bg-brand-soft px-4 py-3">
        <p className="flex items-center gap-1.5 text-[10px] font-bold text-brand">
          <Sparkles className="size-3" />
          Результат
        </p>
        <p className="mt-1 text-[11.5px] leading-relaxed text-muted">{data.outcome}</p>
      </div>

      <div className="mt-5 flex flex-col gap-2 sm:flex-row">
        <Link to="/vacancies" onClick={onClose} className="flex-1">
          <Button className="w-full">
            Вакансии по профессии
            <ArrowRight className="size-4" />
          </Button>
        </Link>
        <Link to="/ai" search={{ tab: "test" }} onClick={onClose} className="flex-1">
          <Button variant="secondary" className="w-full">
            Подходит ли мне?
          </Button>
        </Link>
      </div>
    </Modal>
  );
}

function OrderModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({
    company: "",
    name: "",
    email: "",
    profession: "Аналитик данных",
    count: "2",
  });

  useEffect(() => {
    if (open) setSent(false);
  }, [open]);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    setSent(true);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={sent ? undefined : "Заказ на подготовку специалиста"}
      description={
        sent
          ? undefined
          : "Заполните заявку — менеджер Орбиты свяжется и поможет согласовать профиль с вузом."
      }
      className="sm:max-w-[540px]"
    >
      <AnimatePresence mode="wait" initial={false}>
        {sent ? (
          <motion.div key="success" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <SuccessState
              title="Заявка принята"
              description="В течение рабочего дня с вами свяжется менеджер по работе с предприятиями. Согласование профиля с вузом занимает до 5 рабочих дней."
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2 rounded-xl bg-surface-2 px-3.5 py-3 text-left text-[11px] text-muted">
                  <Check className="size-4 shrink-0 text-emerald-500" />
                  Оплата за качество: 30% на старте, 70% после выхода специалиста
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex h-11 w-full items-center justify-center rounded-full bg-brand text-sm font-semibold text-white transition hover:bg-brand-strong"
                >
                  Отлично
                </button>
              </div>
            </SuccessState>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={submit}
            className="space-y-3"
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Компания">
                <Input
                  required
                  value={form.company}
                  onChange={(event) => setForm({ ...form, company: event.target.value })}
                  placeholder="ООО «Пример»"
                  className="h-11"
                />
              </Field>
              <Field label="Контактное лицо">
                <Input
                  required
                  value={form.name}
                  onChange={(event) => setForm({ ...form, name: event.target.value })}
                  placeholder="Имя и фамилия"
                  className="h-11"
                />
              </Field>
            </div>
            <Field label="Рабочая почта">
              <Input
                required
                type="email"
                value={form.email}
                onChange={(event) => setForm({ ...form, email: event.target.value })}
                placeholder="hr@company.ru"
                className="h-11"
              />
            </Field>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Профессия">
                <select
                  value={form.profession}
                  onChange={(event) => setForm({ ...form, profession: event.target.value })}
                  className="h-11 w-full cursor-pointer rounded-2xl border border-line bg-surface-2 px-3 text-[12.5px] outline-none focus:border-brand/40"
                >
                  {[
                    "Аналитик данных",
                    "Frontend-разработчик",
                    "Python-разработчик",
                    "Инженер-энергетик",
                    "Инженер-механик",
                    "Эколог-урбанист",
                    "SMM-специалист",
                  ].map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </Field>
              <Field label="Специалистов">
                <select
                  value={form.count}
                  onChange={(event) => setForm({ ...form, count: event.target.value })}
                  className="h-11 w-full cursor-pointer rounded-2xl border border-line bg-surface-2 px-3 text-[12.5px] outline-none focus:border-brand/40"
                >
                  {["1", "2", "3", "5", "10"].map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </Field>
            </div>

            <label className="flex items-start gap-2.5 pt-1 text-[10.5px] leading-relaxed text-muted">
              <input
                type="checkbox"
                required
                className="mt-0.5 size-3.5 accent-[var(--brand)]"
              />
              Согласен на обработку данных и связь по указанной почте
            </label>

            <Button type="submit" className="w-full" size="lg">
              Отправить заявку
              <ArrowRight className="size-4" />
            </Button>
            <p className="text-center text-[9.5px] text-faint">
              Без предоплаты. Договор и KPI фиксируются до старта подготовки.
            </p>
          </motion.form>
        )}
      </AnimatePresence>
    </Modal>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[10.5px] font-semibold uppercase tracking-[0.1em] text-faint">
        {label}
      </span>
      {children}
    </label>
  );
}
