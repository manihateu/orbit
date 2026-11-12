import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import { Link, getRouteApi, useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  Briefcase,
  Check,
  ChevronLeft,
  Compass,
  Download,
  FileText,
  Lightbulb,
  MessageSquare,
  RefreshCw,
  Save,
  Send,
  Sparkles,
  Target,
  Wand2,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  aiSuggestions,
  getAssistantReply,
  sphereMap,
  spheres,
  testQuestions,
  type AssistantLink,
  type AssistantReply,
  type SphereId,
} from "@/data/ai";
import { courseMap } from "@/data/education";
import { companyMap } from "@/data/companies";
import { vacancyById } from "@/data/vacancies";
import { demoUser } from "@/data/profile";
import { formatSalary, initials } from "@/lib/format";
import { cn } from "@/lib/utils";
import { useTitle } from "@/lib/useTitle";
import { useUi } from "@/store/ui";
import { useUser } from "@/store/user";
import { Badge, Button, Card, Input, Progress } from "@/components/ui/primitives";
import { Page, PageHero } from "@/components/layout/Page";

const routeApi = getRouteApi("/ai");
type Tab = "chat" | "test" | "resume";

const tabsMeta: { id: Tab; label: string; icon: LucideIcon }[] = [
  { id: "chat", label: "Чат-помощник", icon: MessageSquare },
  { id: "test", label: "Профориентация", icon: Compass },
  { id: "resume", label: "Резюме", icon: FileText },
];

export function AiPage() {
  useTitle("ИИ-помощник");
  const search = routeApi.useSearch();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>(search.tab ?? "chat");

  useEffect(() => {
    if (search.tab) setTab(search.tab);
  }, [search.tab]);

  const changeTab = (next: Tab) => {
    setTab(next);
    void navigate({ to: "/ai", search: { tab: next }, replace: true });
  };

  return (
    <Page>
      <PageHero
        compact
        eyebrow="Модуль 05 · Орби AI"
        title={
          <>
            Карьерный навигатор, <span className="text-gradient">который знает тебя</span>
          </>
        }
        description="Помогает выбрать профессию, найти стажировку, собрать резюме и подготовиться к собеседованию — на данных регионального рынка труда."
      >
        <div className="inline-flex w-full rounded-full border border-line bg-surface p-1 shadow-[var(--shadow-soft)] sm:w-auto">
          {tabsMeta.map((item) => {
            const active = tab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => changeTab(item.id)}
                className={cn(
                  "relative inline-flex h-10 flex-1 items-center justify-center gap-1.5 rounded-full px-2 text-[11.5px] font-semibold transition-colors sm:flex-none sm:gap-2 sm:px-4 sm:text-[12px]",
                  active ? "text-white" : "text-muted hover:text-fg",
                )}
              >
                {active && (
                  <motion.span
                    layoutId="ai-tab"
                    className="absolute inset-0 rounded-full bg-brand shadow-[0_10px_24px_-12px_var(--glow)]"
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  />
                )}
                <item.icon className="relative size-3.5 shrink-0" />
                <span className="relative truncate">{item.label}</span>
              </button>
            );
          })}
        </div>
      </PageHero>

      <section className="pb-10">
        <div className="container-page">
          <AnimatePresence mode="wait" initial={false}>
            {tab === "chat" && (
              <motion.div
                key="chat"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
              >
                <ChatPanel />
              </motion.div>
            )}
            {tab === "test" && (
              <motion.div
                key="test"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
              >
                <CareerTest />
              </motion.div>
            )}
            {tab === "resume" && (
              <motion.div
                key="resume"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
              >
                <ResumeBuilder />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </Page>
  );
}

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  reply?: AssistantReply;
}

const initialMessages: ChatMessage[] = [
  {
    id: "hello",
    role: "assistant",
    text:
      "Привет, Даниил! Я Орби — карьерный ассистент. Вижу, что ты учишься на 4 курсе АГТУ и уже прошёл стажировку в КаспийТехе. Могу подобрать вакансии, курсы или помочь с резюме. С чего начнём?",
  },
];

function ChatPanel() {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<number | null>(null);

  const favorites = useUser((state) => state.favorites.length);
  const applications = useUser((state) => state.applications.length);
  const navigate = useNavigate();

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (messages.length <= 1 && !typing) return;
    const element = listRef.current;
    if (element) element.scrollTo({ top: element.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  const send = (text: string) => {
    const clean = text.trim();
    if (!clean || typing) return;
    setMessages((prev) => [...prev, { id: `u-${Date.now()}`, role: "user", text: clean }]);
    setInput("");
    setTyping(true);
    timerRef.current = window.setTimeout(() => {
      const reply = getAssistantReply(clean);
      setMessages((prev) => [
        ...prev,
        { id: `a-${Date.now()}`, role: "assistant", text: reply.text, reply },
      ]);
      setTyping(false);
    }, 1150);
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    send(input);
  };

  return (
    <div className="grid items-start gap-4 lg:grid-cols-[1fr_296px]">
      <Card className="flex flex-col overflow-hidden">
        <div className="flex items-center gap-3 border-b border-line px-4 py-3.5 sm:px-5">
          <span className="relative grid size-9 shrink-0 place-items-center rounded-xl bg-linear-to-br from-brand-400 to-brand-700 text-white">
            <Sparkles className="size-4" />
            <span className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full border-2 border-surface bg-emerald-400" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="flex items-center gap-1.5 text-[13px] font-semibold">
              Орби
              <Badge variant="brand" className="px-1.5 py-0.5 text-[8.5px]">
                beta
              </Badge>
            </p>
            <p className="hidden text-[10px] text-muted sm:block">
              Карьерный ассистент · отвечает мгновенно
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setMessages(initialMessages);
              setTyping(false);
              if (timerRef.current) window.clearTimeout(timerRef.current);
            }}
            className="inline-flex h-8 items-center gap-1.5 rounded-full border border-line px-3 text-[10.5px] font-semibold text-muted transition hover:text-fg"
          >
            <RefreshCw className="size-3" />
            Новый диалог
          </button>
        </div>

        <div
          ref={listRef}
          className="h-[300px] min-h-0 space-y-5 overflow-y-auto px-4 py-5 sm:h-[400px] sm:px-5"
        >
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
          {messages.length === 1 && !typing && (
            <div className="grid gap-2 sm:grid-cols-3">
              {[
                {
                  icon: Briefcase,
                  title: "Найти стажировку",
                  note: "3 варианта по профилю",
                  onClick: () => send("Подбери стажировку в IT"),
                },
                {
                  icon: FileText,
                  title: "Собрать резюме",
                  note: "за 2 минуты",
                  onClick: () => void navigate({ to: "/ai", search: { tab: "resume" } }),
                },
                {
                  icon: Compass,
                  title: "Профориентация",
                  note: "6 вопросов",
                  onClick: () => void navigate({ to: "/ai", search: { tab: "test" } }),
                },
              ].map((action) => (
                <button
                  key={action.title}
                  type="button"
                  onClick={action.onClick}
                  className="group rounded-2xl border border-line bg-surface-2 p-3 text-left transition hover:border-brand/30 hover:bg-brand-soft/40"
                >
                  <span className="grid size-7 place-items-center rounded-lg bg-brand-soft text-brand">
                    <action.icon className="size-3.5" />
                  </span>
                  <p className="mt-2 text-[10.5px] font-semibold">{action.title}</p>
                  <p className="text-[9px] text-muted">{action.note}</p>
                </button>
              ))}
            </div>
          )}
          {typing && <TypingBubble />}
        </div>

        <div className="border-t border-line p-3 sm:p-4">
          <div
            className="no-scrollbar mb-2.5 flex gap-1.5 overflow-x-auto pb-0.5"
            style={{ maskImage: "linear-gradient(to right, black 90%, transparent)" }}
          >
            {aiSuggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => send(suggestion)}
                className="shrink-0 rounded-full border border-line bg-surface-2 px-3 py-1.5 text-[10.5px] font-medium text-muted transition hover:border-brand/30 hover:text-brand"
              >
                {suggestion}
              </button>
            ))}
          </div>
          <form onSubmit={onSubmit} className="flex items-center gap-2">
            <Input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Спроси Орби о работе, курсах или резюме…"
              className="h-11 rounded-2xl bg-surface-2"
              aria-label="Сообщение"
            />
            <button
              type="submit"
              disabled={!input.trim() || typing}
              aria-label="Отправить"
              className="grid size-11 shrink-0 place-items-center rounded-full bg-brand text-white shadow-[0_10px_24px_-12px_var(--glow)] transition hover:bg-brand-strong disabled:opacity-40"
            >
              <Send className="size-4" />
            </button>
          </form>
          <p className="mt-2 text-center text-[9px] text-faint">
            ИИ может ошибаться — важные решения проверяй с куратором
          </p>
        </div>
      </Card>

      <div className="space-y-3">
        <Card className="p-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-faint">Твой профиль</p>
          <div className="mt-3 flex items-center gap-3">
            <span
              className="grid size-11 place-items-center rounded-full text-[11px] font-bold text-white"
              style={{
                backgroundImage: `linear-gradient(140deg, ${demoUser.avatarC1}, ${demoUser.avatarC2})`,
              }}
            >
              {initials(demoUser.name)}
            </span>
            <div className="min-w-0">
              <p className="flex items-center gap-1 truncate text-[12px] font-semibold">
                {demoUser.name}
                <BadgeCheck className="size-3.5 shrink-0 text-brand" />
              </p>
              <p className="text-[9.5px] text-muted">
                {demoUser.university} · {demoUser.course} курс
              </p>
            </div>
          </div>
          <div className="mt-4">
            <div className="mb-1.5 flex justify-between text-[9.5px] text-faint">
              <span>Заполненность профиля</span>
              <span className="font-semibold text-brand">92%</span>
            </div>
            <Progress value={92} />
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {["React", "TypeScript", "Git", "B2 English"].map((skill) => (
              <span key={skill} className="rounded-full bg-surface-2 px-2 py-1 text-[9px] text-muted">
                {skill}
              </span>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-faint">Орби знает</p>
          <div className="mt-3 space-y-2.5">
            {[
              { icon: Briefcase, label: "2 400 вакансий", note: "в регионе" },
              { icon: Target, label: "96 предприятий", note: "с практиками" },
              { icon: BookOpen, label: "86 программ", note: "обучения" },
              { icon: BadgeCheck, label: `${applications} отклика`, note: "в работе" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2.5">
                <span className="grid size-7 place-items-center rounded-lg bg-surface-2 text-brand">
                  <item.icon className="size-3.5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[10.5px] font-semibold">{item.label}</p>
                  <p className="text-[9px] text-faint">{item.note}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-xl bg-brand-soft p-3">
            <p className="flex items-center gap-1.5 text-[10px] font-bold text-brand">
              <Sparkles className="size-3" />
              Совет дня
            </p>
            <p className="mt-1 text-[10px] leading-relaxed text-muted">
              Добавь в резюме 2–3 измеримых результата — отклики вырастут в среднем на 30%.
            </p>
          </div>
        </Card>

        <Card className="p-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-faint">
            Быстрые действия
          </p>
          <div className="mt-3 space-y-1.5">
            {[
              { label: "Пройти профориентацию", to: "/ai", tab: "test" as Tab },
              { label: "Собрать резюме", to: "/ai", tab: "resume" as Tab },
              { label: "Смотреть вакансии", to: "/vacancies" as const },
            ].map((action) => (
              <Link
                key={action.label}
                to={action.to}
                search={"tab" in action ? { tab: action.tab } : undefined}
                className="flex items-center justify-between rounded-xl border border-line bg-surface-2 px-3 py-2.5 text-[10.5px] font-semibold transition hover:border-brand/30 hover:text-brand"
              >
                {action.label}
                <ArrowRight className="size-3" />
              </Link>
            ))}
          </div>
          <p className="mt-3 text-[9px] leading-relaxed text-faint">
            Уже {favorites} вакансии в избранном — Орби учтёт их в следующем подборе.
          </p>
        </Card>
      </div>
    </div>
  );
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={cn("flex gap-2.5", isUser ? "justify-end" : "justify-start")}
    >
      {!isUser && (
        <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-linear-to-br from-brand-400 to-brand-700 text-white">
          <Sparkles className="size-3.5" />
        </span>
      )}
      <div className={cn("max-w-[86%]", isUser && "flex flex-col items-end")}>
        <div
          className={cn(
            "rounded-2xl px-3.5 py-2.5 text-[12px] leading-relaxed",
            isUser
              ? "rounded-br-md bg-brand text-white"
              : "rounded-bl-md border border-line bg-surface-2 text-fg",
          )}
        >
          {message.text}
        </div>

        {message.reply?.vacancyIds && (
          <div className="mt-2 w-full space-y-1.5">
            {message.reply.vacancyIds.map((id) => {
              const vacancy = vacancyById[id];
              if (!vacancy) return null;
              const company = companyMap[vacancy.companyId];
              return (
                <Link
                  key={id}
                  to="/vacancies/$vacancyId"
                  params={{ vacancyId: id }}
                  className="group flex items-center gap-2.5 rounded-xl border border-line bg-surface px-3 py-2 transition hover:border-brand/30"
                >
                  <span
                    className="grid size-8 shrink-0 place-items-center rounded-lg text-[9px] font-bold text-white"
                    style={{ backgroundImage: `linear-gradient(140deg, ${company.c1}, ${company.c2})` }}
                  >
                    {company.initials}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[10.5px] font-semibold">{vacancy.title}</p>
                    <p className="text-[9px] text-muted">
                      {formatSalary(vacancy.salaryFrom, vacancy.salaryTo)} · {company.name}
                    </p>
                  </div>
                  <ArrowRight className="size-3.5 shrink-0 text-faint transition group-hover:translate-x-0.5 group-hover:text-brand" />
                </Link>
              );
            })}
          </div>
        )}

        {message.reply?.courseIds && (
          <div className="mt-2 w-full space-y-1.5">
            {message.reply.courseIds.map((id) => {
              const course = courseMap[id];
              if (!course) return null;
              return (
                <div
                  key={id}
                  className="flex items-center gap-2.5 rounded-xl border border-line bg-surface px-3 py-2"
                >
                  <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-brand-soft text-brand">
                    <BookOpen className="size-3.5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[10.5px] font-semibold">{course.title}</p>
                    <p className="text-[9px] text-muted">
                      {course.provider} · {course.weeks} недель · бесплатно
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {message.reply?.links && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {message.reply.links.map((link) => (
              <AssistantNavLink key={link.label} link={link} />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

function AssistantNavLink({ link }: { link: AssistantLink }) {
  const navigate = useNavigate();
  return (
    <button
      type="button"
      onClick={() => {
        if (link.to === "/ai") void navigate({ to: "/ai", search: { tab: link.tab ?? "chat" } });
        else void navigate({ to: link.to });
      }}
      className="inline-flex items-center gap-1.5 rounded-full border border-brand/25 bg-brand-soft px-2.5 py-1 text-[10px] font-bold text-brand transition hover:bg-brand/15"
    >
      {link.label}
      <ArrowRight className="size-3" />
    </button>
  );
}

function TypingBubble() {
  return (
    <div className="flex gap-2.5">
      <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-linear-to-br from-brand-400 to-brand-700 text-white">
        <Sparkles className="size-3.5" />
      </span>
      <div className="flex items-center gap-1 rounded-2xl rounded-bl-md border border-line bg-surface-2 px-3.5 py-3">
        {[0, 1, 2].map((dot) => (
          <motion.span
            key={dot}
            className="size-1.5 rounded-full bg-brand/50"
            animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 0.9, repeat: Infinity, delay: dot * 0.15 }}
          />
        ))}
      </div>
    </div>
  );
}

function CareerTest() {
  const [phase, setPhase] = useState<"intro" | "quiz" | "result">("intro");
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, SphereId>>({});
  const [picked, setPicked] = useState<SphereId | null>(null);
  const timerRef = useRef<number | null>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const toast = useUi((state) => state.toast);
  const addCourseActivity = useUser((state) => state.addCourseActivity);

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (phase === "intro") return;
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [phase]);

  const question = testQuestions[index];
  const result = useMemo(() => {
    if (phase !== "result") return null;
    const counts = new Map<SphereId, number>();
    Object.values(answers).forEach((sphere) => {
      counts.set(sphere, (counts.get(sphere) ?? 0) + 1);
    });
    let best: SphereId = spheres[0].id;
    let bestCount = -1;
    spheres.forEach((sphere) => {
      const value = counts.get(sphere.id) ?? 0;
      if (value > bestCount) {
        best = sphere.id;
        bestCount = value;
      }
    });
    return sphereMap[best];
  }, [phase, answers]);

  const start = () => {
    setAnswers({});
    setIndex(0);
    setPicked(null);
    setPhase("quiz");
  };

  const choose = (sphere: SphereId) => {
    if (picked) return;
    setPicked(sphere);
    setAnswers((prev) => ({ ...prev, [question.id]: sphere }));
    timerRef.current = window.setTimeout(() => {
      setPicked(null);
      if (index === testQuestions.length - 1) setPhase("result");
      else setIndex((value) => value + 1);
    }, 320);
  };

  return (
    <div ref={topRef} className="mx-auto max-w-[820px] scroll-mt-28">
      <AnimatePresence mode="wait" initial={false}>
        {phase === "intro" && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <Card className="overflow-hidden">
              <div className="relative overflow-hidden bg-linear-to-br from-brand-500 via-brand-600 to-[#0c2457] p-7 text-white sm:p-10">
                <div className="pointer-events-none absolute -right-16 -top-16 size-64 rounded-full bg-white/10 blur-2xl" />
                <Badge className="border border-white/20 bg-white/10 text-white">
                  <Compass className="size-3" />
                  Профориентация · 2 минуты
                </Badge>
                <h2 className="relative mt-4 max-w-[520px] text-[clamp(1.6rem,3.2vw,2.4rem)] font-semibold leading-[1.06] tracking-[-0.04em]">
                  Найдём направление, в котором тебе будет интересно
                </h2>
                <p className="relative mt-3 max-w-[500px] text-[12.5px] leading-relaxed text-white/70">
                  Шесть вопросов о том, что тебе нравится делать. Без правильных ответов — только
                  твои предпочтения.
                </p>
              </div>
              <div className="p-6 sm:p-8">
                <div className="grid gap-3 sm:grid-cols-3">
                  {[
                    { icon: Target, title: "Сфера", text: "6 направлений рынка" },
                    { icon: Briefcase, title: "Вакансии", text: "подходящие в регионе" },
                    { icon: BookOpen, title: "Курсы", text: "чтобы закрыть пробелы" },
                  ].map((item) => (
                    <div key={item.title} className="rounded-2xl border border-line bg-surface-2 p-4">
                      <span className="grid size-8 place-items-center rounded-lg bg-brand-soft text-brand">
                        <item.icon className="size-4" />
                      </span>
                      <p className="mt-2.5 text-[11.5px] font-semibold">{item.title}</p>
                      <p className="text-[10px] text-muted">{item.text}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex flex-col items-center gap-3 border-t border-line pt-5 sm:flex-row sm:justify-between">
                  <p className="text-[10.5px] text-faint">Результат сохранится в профиле</p>
                  <Button onClick={start} size="lg" className="w-full sm:w-auto">
                    Начать тест
                    <ArrowRight className="size-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {phase === "quiz" && question && (
          <motion.div
            key={`q-${index}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="p-6 sm:p-8">
              <div className="flex items-center justify-between text-[10.5px] text-muted">
                <span className="font-semibold">
                  Вопрос {index + 1} из {testQuestions.length}
                </span>
                <span>{Math.round(((index + 1) / testQuestions.length) * 100)}%</span>
              </div>
              <Progress
                value={((index + 1) / testQuestions.length) * 100}
                className="mt-2.5"
              />

              <h2 className="mt-7 text-[clamp(1.35rem,2.6vw,1.9rem)] font-semibold leading-[1.12] tracking-[-0.035em] text-balance">
                {question.question}
              </h2>
              <p className="mt-2 text-[11.5px] text-muted">{question.hint}</p>

              <div className="mt-6 space-y-2.5">
                {question.options.map((option) => {
                  const active = picked === option.sphere;
                  return (
                    <button
                      key={option.text}
                      type="button"
                      onClick={() => choose(option.sphere)}
                      className={cn(
                        "group flex w-full items-center gap-3 rounded-2xl border p-4 text-left transition-all duration-200",
                        active
                          ? "border-brand bg-brand-soft"
                          : "border-line bg-surface-2 hover:border-brand/35 hover:bg-brand-soft/40",
                      )}
                    >
                      <span
                        className={cn(
                          "grid size-5 shrink-0 place-items-center rounded-full border transition",
                          active
                            ? "border-brand bg-brand text-white"
                            : "border-line-strong bg-surface group-hover:border-brand/50",
                        )}
                      >
                        {active && <Check className="size-3" />}
                      </span>
                      <span className="text-[13px] font-medium">{option.text}</span>
                      <ArrowRight
                        className={cn(
                          "ml-auto size-4 shrink-0 transition",
                          active ? "text-brand" : "text-faint opacity-0 group-hover:opacity-100",
                        )}
                      />
                    </button>
                  );
                })}
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-line pt-4">
                <button
                  type="button"
                  disabled={index === 0}
                  onClick={() => setIndex((value) => Math.max(0, value - 1))}
                  className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-muted transition hover:text-fg disabled:opacity-30"
                >
                  <ChevronLeft className="size-3.5" />
                  Назад
                </button>
                <span className="text-[10px] text-faint">Ответы не сохраняются публично</span>
              </div>
            </Card>
          </motion.div>
        )}

        {phase === "result" && result && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-4"
          >
            <Card className="overflow-hidden">
              <div
                className="relative overflow-hidden p-7 text-white sm:p-9"
                style={{ backgroundImage: `linear-gradient(135deg, ${result.c1}, ${result.c2})` }}
              >
                <div className="pointer-events-none absolute -right-10 -top-16 size-64 rounded-full bg-white/15 blur-3xl" />
                <Badge className="border border-white/25 bg-white/15 text-white">
                  <Sparkles className="size-3" />
                  Твоё направление
                </Badge>
                <h2 className="relative mt-3 text-[clamp(1.7rem,3.4vw,2.5rem)] font-semibold tracking-[-0.04em]">
                  {result.title}
                </h2>
                <p className="relative mt-1 text-[12.5px] text-white/70">{result.tagline}</p>
                <p className="relative mt-4 max-w-[560px] text-[12.5px] leading-relaxed text-white/85">
                  {result.description}
                </p>
              </div>

              <div className="p-6 sm:p-7">
                <div className="flex flex-wrap gap-1.5">
                  {result.roles.map((role) => (
                    <Badge key={role} variant="brand" className="px-3 py-1.5 text-[11px]">
                      {role}
                    </Badge>
                  ))}
                </div>

                <div className="mt-6 grid gap-6 border-t border-line pt-5 sm:grid-cols-2">
                  <div>
                    <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-faint">
                      <Briefcase className="size-3.5 text-brand" />
                      Подходящие вакансии
                    </p>
                    <div className="mt-2.5 space-y-2">
                      {result.vacancyIds.map((id) => {
                        const vacancy = vacancyById[id];
                        if (!vacancy) return null;
                        return (
                          <Link
                            key={id}
                            to="/vacancies/$vacancyId"
                            params={{ vacancyId: id }}
                            className="group flex items-center justify-between gap-2 rounded-xl border border-line bg-surface-2 px-3 py-2.5 transition hover:border-brand/30"
                          >
                            <div className="min-w-0">
                              <p className="truncate text-[11px] font-semibold">{vacancy.title}</p>
                              <p className="text-[9.5px] text-muted">
                                {formatSalary(vacancy.salaryFrom, vacancy.salaryTo)} ·{" "}
                                {vacancy.city}
                              </p>
                            </div>
                            <ArrowRight className="size-3.5 shrink-0 text-faint group-hover:text-brand" />
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                  <div>
                    <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-faint">
                      <BookOpen className="size-3.5 text-brand" />
                      Курсы для старта
                    </p>
                    <div className="mt-2.5 space-y-2">
                      {result.courseIds.map((id) => {
                        const course = courseMap[id];
                        if (!course) return null;
                        return (
                          <div
                            key={id}
                            className="rounded-xl border border-line bg-surface-2 px-3 py-2.5"
                          >
                            <p className="text-[11px] font-semibold">{course.title}</p>
                            <p className="text-[9.5px] text-muted">
                              {course.provider} · {course.weeks} недель
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex flex-col gap-2 border-t border-line pt-5 sm:flex-row">
                  <Button
                    className="flex-1"
                    onClick={() => {
                      const course = courseMap[result.courseIds[0]];
                      if (course) {
                        addCourseActivity(course.title, course.provider, course.weeks * 3);
                      }
                      toast({
                        title: "Результат сохранён",
                        description: `Направление «${result.title}» добавлено в профиль и резюме.`,
                        variant: "success",
                      });
                    }}
                  >
                    <Save className="size-4" />
                    Сохранить в профиль
                  </Button>
                  <Link to="/vacancies" className="flex-1">
                    <Button variant="secondary" className="w-full">
                      Смотреть вакансии
                      <ArrowRight className="size-4" />
                    </Button>
                  </Link>
                  <Button variant="ghost" onClick={start}>
                    <RefreshCw className="size-4" />
                    Заново
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ResumeBuilder() {
  const stored = useUser((state) => state.resume);
  const updateResume = useUser((state) => state.updateResume);
  const [draft, setDraft] = useState(stored);
  const toast = useUi((state) => state.toast);

  useEffect(() => {
    setDraft(stored);
  }, [stored]);

  const improve = () => {
    setDraft((prev) => ({
      ...prev,
      about:
        "Студент 4 курса АГТУ, frontend-разработчик. За три месяца стажировки собрал 14 компонентов личного кабинета и ускорил загрузку ключевой страницы на 18%. Владею React, TypeScript и Git, ищу команду с ментором и гибким графиком 20–25 часов в неделю.",
    }));
    toast({
      title: "Блок «О себе» улучшен",
      description: "Добавили измеримые результаты и формат занятости.",
      variant: "info",
    });
  };

  const save = () => {
    updateResume(draft);
    toast({
      title: "Резюме сохранено",
      description: "Изменения уже видны работодателям в твоём профиле.",
      variant: "success",
    });
  };

  const skills = draft.skills
    .split(",")
    .map((skill) => skill.trim())
    .filter(Boolean);

  return (
    <div className="grid items-start gap-4 lg:grid-cols-[1fr_1fr]">
      <Card className="p-5 sm:p-6">
        <div className="flex items-start justify-between">
          <div>
            <Badge variant="brand">
              <Wand2 className="size-3" />
              Конструктор с ИИ
            </Badge>
            <h2 className="mt-3 text-[20px] font-semibold tracking-[-0.03em]">
              Собери резюме за пару минут
            </h2>
            <p className="mt-1.5 text-[11.5px] leading-relaxed text-muted">
              Заполняй поля — превью обновится сразу. Черновик хранится локально.
            </p>
          </div>
        </div>

        <div className="mt-5 space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <FormField label="Имя и фамилия">
              <Input
                value={draft.name}
                onChange={(event) => setDraft({ ...draft, name: event.target.value })}
                placeholder="Как тебя зовут"
              />
            </FormField>
            <FormField label="Желаемая роль">
              <Input
                value={draft.role}
                onChange={(event) => setDraft({ ...draft, role: event.target.value })}
                placeholder="Frontend-разработчик"
              />
            </FormField>
          </div>
          <FormField label="Контакт">
            <Input
              value={draft.contact}
              onChange={(event) => setDraft({ ...draft, contact: event.target.value })}
              placeholder="Почта и телефон"
            />
          </FormField>
          <FormField label="Университет и курс">
            <Input
              value={draft.university}
              onChange={(event) => setDraft({ ...draft, university: event.target.value })}
              placeholder="АГТУ · 4 курс"
            />
          </FormField>
          <FormField label="О себе" hint={`${draft.about.length}/320`}>
            <textarea
              value={draft.about}
              onChange={(event) => setDraft({ ...draft, about: event.target.value.slice(0, 320) })}
              rows={4}
              className="w-full resize-none rounded-2xl border border-line bg-surface-2 p-3.5 text-[12px] leading-relaxed outline-none transition placeholder:text-faint focus:border-brand/50 focus:bg-surface focus:ring-4 focus:ring-brand/10"
              placeholder="Коротко о себе, навыках и целях"
            />
          </FormField>
          <FormField label="Навыки через запятую">
            <Input
              value={draft.skills}
              onChange={(event) => setDraft({ ...draft, skills: event.target.value })}
              placeholder="React, TypeScript, Git"
            />
          </FormField>
          <FormField label="Опыт и проекты">
            <textarea
              value={draft.experience}
              onChange={(event) => setDraft({ ...draft, experience: event.target.value })}
              rows={3}
              className="w-full resize-none rounded-2xl border border-line bg-surface-2 p-3.5 text-[12px] leading-relaxed outline-none transition placeholder:text-faint focus:border-brand/50 focus:bg-surface focus:ring-4 focus:ring-brand/10"
              placeholder="Стажировки, проекты, достижения"
            />
          </FormField>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <Button onClick={improve} variant="soft" size="sm">
            <Wand2 className="size-3.5" />
            Улучшить с ИИ
          </Button>
          <Button onClick={save} size="sm">
            <Save className="size-3.5" />
            Сохранить
          </Button>
          <Button onClick={() => window.print()} variant="secondary" size="sm">
            <Download className="size-3.5" />
            Скачать PDF
          </Button>
        </div>

        <div className="mt-4 space-y-2 rounded-xl bg-surface-2 p-3.5">
          {[
            "Добавь цифры: «собрал 14 компонентов», «+18% скорости»",
            "Укажи график — работодатели фильтруют по занятости",
            "Сократи абзац до 3 строк: рекрутер читает 7 секунд",
          ].map((tip) => (
            <p key={tip} className="flex items-start gap-2 text-[10px] leading-relaxed text-muted">
              <Lightbulb className="mt-0.5 size-3 shrink-0 text-amber-500" />
              {tip}
            </p>
          ))}
        </div>
      </Card>

      <div className="lg:sticky lg:top-24">
        <div className="mb-2 flex items-center justify-between px-1">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-faint">
            Предпросмотр
          </p>
          <span className="text-[9.5px] text-emerald-600 dark:text-emerald-400">✓ без ошибок</span>
        </div>
        <div className="print-area rounded-[24px] border border-line bg-white p-6 text-[#0f172a] shadow-[var(--shadow-float)] sm:p-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-[22px] font-bold leading-tight tracking-[-0.03em]">
                {draft.name || "Твоё имя"}
              </h3>
              <p className="mt-1 text-[12px] font-semibold text-[#2563eb]">
                {draft.role || "Должность"}
              </p>
              <p className="mt-2 text-[10px] text-[#5b6472]">{draft.university}</p>
              <p className="mt-0.5 text-[10px] text-[#5b6472]">{draft.contact}</p>
            </div>
            <span className="grid size-12 shrink-0 place-items-center rounded-full bg-[#eff5ff] text-[12px] font-bold text-[#1d4ed8]">
              {initials(draft.name || "О")}
            </span>
          </div>

          <div className="mt-5 border-t border-[#e5e9f0] pt-4">
            <p className="text-[8.5px] font-bold uppercase tracking-[0.16em] text-[#8b95a5]">
              О себе
            </p>
            <p className="mt-1.5 text-[10.5px] leading-relaxed text-[#3d4757]">
              {draft.about || "Расскажи о себе — это увидит работодатель."}
            </p>
          </div>

          <div className="mt-4 border-t border-[#e5e9f0] pt-4">
            <p className="text-[8.5px] font-bold uppercase tracking-[0.16em] text-[#8b95a5]">
              Навыки
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {skills.length > 0 ? (
                skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full bg-[#eff5ff] px-2 py-1 text-[9px] font-semibold text-[#1d4ed8]"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <span className="text-[10px] text-[#8b95a5]">Добавь навыки</span>
              )}
            </div>
          </div>

          <div className="mt-4 border-t border-[#e5e9f0] pt-4">
            <p className="text-[8.5px] font-bold uppercase tracking-[0.16em] text-[#8b95a5]">
              Опыт и проекты
            </p>
            <p className="mt-1.5 text-[10.5px] leading-relaxed text-[#3d4757]">
              {draft.experience || "Добавь стажировки и проекты."}
            </p>
          </div>

          <div className="mt-5 flex items-center justify-between border-t border-[#e5e9f0] pt-3 text-[8px] text-[#8b95a5]">
            <span>Сформировано в Орбите</span>
            <span>orbita.study</span>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between rounded-2xl border border-line bg-surface-2 px-4 py-3">
          <div>
            <p className="text-[10.5px] font-semibold">Проверка ИИ</p>
            <p className="text-[9px] text-muted">5 из 6 блоков заполнены</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[15px] font-bold text-emerald-600 dark:text-emerald-400">86</span>
            <span className="text-[9px] text-faint">/100</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function FormField({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-faint">{label}</span>
        {hint && <span className="text-[9px] text-faint">{hint}</span>}
      </span>
      {children}
    </label>
  );
}
