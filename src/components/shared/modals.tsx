import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, BadgeCheck, CalendarDays, Check, MapPin, Sparkles, Wand2 } from "lucide-react";
import type { EventItem, Vacancy } from "@/data/types";
import { companyMap } from "@/data/companies";
import { formatDate, formatSalary } from "@/lib/format";
import { useUser } from "@/store/user";
import { useUi } from "@/store/ui";
import { Modal } from "@/components/ui/Modal";
import { Badge, Button, Progress } from "@/components/ui/primitives";
import { cn } from "@/lib/utils";

export function SuccessState({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center py-2 text-center">
      <motion.span
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 320, damping: 20, delay: 0.05 }}
        className="relative grid size-[68px] place-items-center rounded-full bg-emerald-500/12 text-emerald-500"
      >
        <span className="absolute inset-0 animate-ping rounded-full bg-emerald-500/10 [animation-duration:2.4s]" />
        <svg viewBox="0 0 24 24" className="relative size-8" fill="none">
          <motion.path
            d="M5 12.5 10 17.5 19 7.5"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
          />
        </svg>
      </motion.span>
      <h4 className="mt-5 text-[20px] font-semibold tracking-[-0.03em]">{title}</h4>
      <p className="mt-2 max-w-[340px] text-[13px] leading-relaxed text-muted">{description}</p>
      {children && <div className="mt-6 w-full">{children}</div>}
    </div>
  );
}

const aiCoverLetter = (vacancy: Vacancy) => {
  const company = companyMap[vacancy.companyId];
  return `Здравствуйте! Меня заинтересовала вакансия «${vacancy.title}» в ${company.name}. Я студент 4 курса АГТУ, прошёл стажировку в продуктовой команде: собрал 14 компонентов личного кабинета и ускорил загрузку страницы на 18%. Готов уделять 20–25 часов в неделю, совмещая с учёбой.\n\nБуду рад обсудить, как могу помочь вашей команде.`;
};

export function ApplyModal({
  vacancy,
  onClose,
}: {
  vacancy: Vacancy | null;
  onClose: () => void;
}) {
  const [lastVacancy, setLastVacancy] = useState<Vacancy | null>(vacancy);
  const [sent, setSent] = useState(false);
  const [letter, setLetter] = useState("");
  const [generated, setGenerated] = useState(false);
  const apply = useUser((state) => state.apply);
  const toast = useUi((state) => state.toast);
  const alreadyApplied = useUser((state) =>
    vacancy ? state.applications.some((item) => item.vacancyId === vacancy.id) : false,
  );

  useEffect(() => {
    if (vacancy) {
      setLastVacancy(vacancy);
      setSent(false);
      setLetter("");
      setGenerated(false);
    }
  }, [vacancy]);

  const data = vacancy ?? lastVacancy;
  if (!data) return null;
  const company = companyMap[data.companyId];

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    apply(data);
    toast({
      title: "Отклик отправлен",
      description: `${company.name} получит ваше резюме и письмо.`,
      variant: "success",
    });
    setSent(true);
  };

  return (
    <Modal open={!!vacancy} onClose={onClose} title={sent ? undefined : "Откликнуться"} className="sm:max-w-[560px]">
      <AnimatePresence mode="wait" initial={false}>
        {sent ? (
          <motion.div
            key="sent"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <SuccessState
              title="Отклик отправлен"
              description={`Резюме ушло в ${company.name}. HR обычно отвечает в течение 3–5 рабочих дней — статус появится в личном кабинете.`}
            >
              <div className="space-y-2">
                <Link
                  to="/profile"
                  search={{ tab: "applications" }}
                  onClick={onClose}
                  className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-brand text-sm font-semibold text-white transition hover:bg-brand-strong"
                >
                  Мои отклики
                  <ArrowRight className="size-4" />
                </Link>
                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex h-11 w-full items-center justify-center rounded-full text-[13px] font-semibold text-muted transition hover:bg-surface-2 hover:text-fg"
                >
                  Продолжить поиск
                </button>
              </div>
            </SuccessState>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            onSubmit={handleSubmit}
          >
            <div className="rounded-2xl border border-line bg-surface-2 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-[13.5px] font-semibold">{data.title}</p>
                  <p className="mt-1 text-[11.5px] text-muted">
                    {company.name} · {data.city}
                  </p>
                </div>
                <span className="shrink-0 text-[13px] font-bold">
                  {formatSalary(data.salaryFrom, data.salaryTo)}
                </span>
              </div>
              <div className="mt-3 flex items-center gap-2 border-t border-line pt-3 text-[11px] text-muted">
                <BadgeCheck className="size-3.5 text-brand" />
                Ваше резюме прикреплено автоматически
              </div>
            </div>

            <div className="mt-5">
              <div className="mb-2 flex items-center justify-between">
                <label htmlFor="cover-letter" className="flex items-center gap-2 text-[12.5px] font-semibold">
                  Сопроводительное письмо
                  {generated && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-brand-soft px-1.5 py-0.5 text-[9px] font-bold text-brand">
                      <Sparkles className="size-2.5" />
                      ИИ
                    </span>
                  )}
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setLetter(aiCoverLetter(data));
                    setGenerated(true);
                    toast({
                      title: "Письмо готово",
                      description: "ИИ-помощник собрал черновик — можно отредактировать.",
                      variant: "info",
                    });
                  }}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-brand transition hover:opacity-75"
                >
                  <Wand2 className="size-3" />
                  Написать с ИИ
                </button>
              </div>
              <div className="relative">
                <textarea
                  id="cover-letter"
                  value={letter}
                  onChange={(event) => setLetter(event.target.value)}
                  rows={6}
                  placeholder="Расскажите, почему вам интересна эта вакансия. Коротко — 3–4 предложения."
                  className="w-full resize-none rounded-2xl border border-line bg-surface-2 p-4 text-[12.5px] leading-relaxed outline-none transition placeholder:text-faint focus:border-brand/50 focus:bg-surface focus:ring-4 focus:ring-brand/10"
                />
              </div>
            </div>

            {alreadyApplied ? (
              <div className="mt-5 flex items-center gap-2 rounded-2xl bg-emerald-500/10 px-4 py-3 text-[12px] font-medium text-emerald-600 dark:text-emerald-400">
                <Check className="size-4" />
                Вы уже откликались на эту вакансию
              </div>
            ) : (
              <Button type="submit" className="mt-5 w-full" size="lg">
                Отправить отклик
                <ArrowRight className="size-4" />
              </Button>
            )}
            <p className="mt-3 text-center text-[10.5px] leading-relaxed text-faint">
              Работодатель увидит ваш профиль и отметки об активности в резюме
            </p>
          </motion.form>
        )}
      </AnimatePresence>
    </Modal>
  );
}

export function EventRegisterModal({
  event,
  onClose,
}: {
  event: EventItem | null;
  onClose: () => void;
}) {
  const [lastEvent, setLastEvent] = useState<EventItem | null>(event);
  const registerEvent = useUser((state) => state.registerEvent);
  const toast = useUi((state) => state.toast);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (event) {
      setLastEvent(event);
      setDone(useUser.getState().registrations.includes(event.id));
    }
  }, [event]);

  const data = event ?? lastEvent;
  if (!data) return null;

  const filled = Math.round((data.taken / data.seats) * 100);

  return (
    <Modal open={!!event} onClose={onClose} className="sm:max-w-[540px]">
      <AnimatePresence mode="wait" initial={false}>
        {done ? (
          <motion.div key="done" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <SuccessState
              title="Вы зарегистрированы"
              description={`${data.title} — ${formatDate(data.date)}, ${data.time}. Отметка об участии уже добавлена в резюме, а ${data.hours} часов пойдут в активность профиля.`}
            >
              <div className="space-y-2">
                <Link
                  to="/profile"
                  search={{ tab: "activities" }}
                  onClick={onClose}
                  className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-brand text-sm font-semibold text-white transition hover:bg-brand-strong"
                >
                  Посмотреть в профиле
                  <ArrowRight className="size-4" />
                </Link>
                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex h-11 w-full items-center justify-center rounded-full text-[13px] font-semibold text-muted transition hover:bg-surface-2 hover:text-fg"
                >
                  Закрыть
                </button>
              </div>
            </SuccessState>
          </motion.div>
        ) : (
          <motion.div key="info" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <ModalHeader event={data} />
            <div className="mt-5 rounded-2xl border border-line bg-surface-2 p-4">
              <p className="text-[12.5px] leading-relaxed text-muted">{data.description}</p>
              <div className="mt-3 grid gap-2 border-t border-line pt-3">
                {data.agenda.slice(0, 3).map((item) => (
                  <div key={item} className="flex items-start gap-2 text-[11.5px] text-muted">
                    <span className="mt-1.5 size-1 shrink-0 rounded-full bg-brand" />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 rounded-2xl bg-brand-soft p-4">
              <div className="flex items-center gap-2 text-[12px] font-semibold text-brand">
                <CalendarDays className="size-4" />
                Участие добавится в резюме
              </div>
              <p className="mt-1.5 text-[11.5px] leading-relaxed text-brand/80">
                За событие начислим {data.hours} часов активности и подтверждённую отметку в разделе
                «Мероприятия и практика».
              </p>
            </div>

            <div className="mt-5">
              <div className="mb-1.5 flex items-center justify-between text-[10.5px] text-faint">
                <span>Заполненность</span>
                <span>{data.taken} из {data.seats} мест</span>
              </div>
              <Progress value={filled} />
            </div>

            <Button
              className="mt-5 w-full"
              size="lg"
              onClick={() => {
                const added = registerEvent(data);
                if (added) {
                  toast({
                    title: "Регистрация подтверждена",
                    description: `«${data.title}» добавлено в ваши мероприятия.`,
                    variant: "success",
                  });
                  setDone(true);
                }
              }}
            >
              Зарегистрироваться
              <ArrowRight className="size-4" />
            </Button>
            <p className="mt-3 text-center text-[10.5px] text-faint">
              Напомним за день до события в личном кабинете
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </Modal>
  );
}

function ModalHeader({ event }: { event: EventItem }) {
  return (
    <div>
      <div className="flex flex-wrap items-center gap-1.5 pr-10">
        <Badge variant="brand">{event.type}</Badge>
        <Badge variant="outline">{event.format}</Badge>
        <span className="ml-auto text-[11px] font-semibold text-muted">
          +{event.hours} ч активности
        </span>
      </div>
      <h3 className="mt-3 pr-8 text-[23px] font-semibold leading-[1.12] tracking-[-0.035em]">
        {event.title}
      </h3>
      <div className="mt-3 space-y-1.5 text-[12px] text-muted">
        <p className="flex items-center gap-2">
          <CalendarDays className="size-3.5 text-brand" />
          {formatDate(event.date)} · {event.time}
        </p>
        <p className="flex items-start gap-2">
          <MapPin className="mt-0.5 size-3.5 shrink-0 text-brand" />
          {event.place}
        </p>
      </div>
    </div>
  );
}

export function InviteModal({
  resumeName,
  open,
  onClose,
}: {
  resumeName: string | null;
  open: boolean;
  onClose: () => void;
}) {
  const [name, setName] = useState<string | null>(resumeName);
  const toast = useUi((state) => state.toast);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (resumeName) {
      setName(resumeName);
      setMessage(
        "Здравствуйте! Нам понравился ваш профиль. Приглашаем на стажировку в продуктовую команду КаспийТех с гибким графиком. Расскажем детали на коротком звонке.",
      );
    }
  }, [resumeName]);

  if (!name) return null;

  return (
    <Modal open={open} onClose={onClose} title="Приглашение на стажировку">
      <p className="text-[13px] leading-relaxed text-muted">
        Кандидат: <span className="font-semibold text-fg">{name}</span>
      </p>
      <textarea
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        rows={5}
        className="mt-4 w-full resize-none rounded-2xl border border-line bg-surface-2 p-4 text-[12.5px] leading-relaxed outline-none transition focus:border-brand/50 focus:bg-surface focus:ring-4 focus:ring-brand/10"
      />
      <div className="mt-3 flex flex-wrap gap-1.5">
        {["Стажировка", "Гибкий график", "Оплата 45 000 ₽"].map((tag) => (
          <Badge key={tag} className={cn("bg-surface-2")}>
            {tag}
          </Badge>
        ))}
      </div>
      <Button
        className="mt-5 w-full"
        size="lg"
        onClick={() => {
          toast({
            title: "Приглашение отправлено",
            description: `${name} получит уведомление и сможет ответить.`,
            variant: "success",
          });
          onClose();
        }}
      >
        Отправить приглашение
        <ArrowRight className="size-4" />
      </Button>
    </Modal>
  );
}
