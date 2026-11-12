import { useEffect, useMemo, useState } from "react";
import { Link, getRouteApi } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  CalendarCheck,
  CalendarDays,
  Check,
  Clock3,
  MapPin,
  Search,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";
import { events as seedEvents } from "@/data/events";
import type { EventItem } from "@/data/types";
import { formatDate, plural } from "@/lib/format";
import { useTitle } from "@/lib/useTitle";
import { useUi } from "@/store/ui";
import { useUser } from "@/store/user";
import { Badge, Button, Card, FilterChip, Input, Progress } from "@/components/ui/primitives";
import { EventCard } from "@/components/shared/cards";
import { EventRegisterModal } from "@/components/shared/modals";
import { Page, PageHero } from "@/components/layout/Page";
import { cn } from "@/lib/utils";

const routeApi = getRouteApi("/events");

const filters = [
  "Все",
  "Ярмарка вакансий",
  "День открытых дверей",
  "Семинар",
  "Хакатон",
  "Воркшоп",
  "Экскурсия",
  "Кейс-чемпионат",
] as const;

export function EventsPage() {
  useTitle("Мероприятия и практика");
  const search = routeApi.useSearch();
  const [query, setQuery] = useState(search.q ?? "");
  const [filter, setFilter] = useState<(typeof filters)[number]>("Все");
  const [selected, setSelected] = useState<EventItem | null>(null);
  const registrations = useUser((state) => state.registrations);
  const activities = useUser((state) => state.activities);
  const toast = useUi((state) => state.toast);

  useEffect(() => {
    setQuery(search.q ?? "");
  }, [search.q]);

  const sorted = useMemo(() => {
    let list = [...seedEvents].sort((a, b) => a.date.localeCompare(b.date));
    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter((event) =>
        [event.title, event.type, event.place, event.organizer, ...event.tags]
          .join(" ")
          .toLowerCase()
          .includes(q),
      );
    }
    if (filter !== "Все") list = list.filter((event) => event.type === filter);
    return list;
  }, [query, filter]);

  const featured = seedEvents.find((event) => event.featured) ?? seedEvents[0];
  const showFeatured = filter === "Все" && !query.trim();
  const grid = showFeatured ? sorted.filter((event) => event.id !== featured.id) : sorted;
  const registeredCount = registrations.length;

  return (
    <Page>
      <PageHero
        eyebrow="Модуль 03 · Мероприятия"
        title={
          <>
            События, которые остаются <span className="text-gradient">в резюме</span>
          </>
        }
        description="Дни открытых дверей, ярмарки вакансий, семинары и хакатоны. Каждое участие — подтверждённые часы активности и отметка, которую видят работодатели."
      >
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="brand">
            <Zap className="size-3" />
            8 событий в ноябре–декабре
          </Badge>
          <Badge variant="outline">
            <Users className="size-3" />
            1 240 участников
          </Badge>
          {registeredCount > 0 && (
            <Link
              to="/profile"
              search={{ tab: "activities" }}
              className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400"
            >
              <CalendarCheck className="size-3.5" />
              Вы записаны на {registeredCount}{" "}
              {plural(registeredCount, "событие", "события", "событий")}
            </Link>
          )}
        </div>
      </PageHero>

      <section className="pb-8">
        <div className="container-page">
          {showFeatured && <FeaturedEvent event={featured} onRegister={setSelected} />}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative sm:max-w-[400px] sm:flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-faint" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Найти событие, компанию или место"
                className="h-11 rounded-2xl bg-surface pl-11"
              />
            </div>
            <span className="text-[11.5px] text-muted">
              {grid.length} {plural(grid.length, "событие", "события", "событий")} впереди
            </span>
          </div>

          <div className="no-scrollbar scroll-fade mt-4 flex gap-1.5 overflow-x-auto pb-1">
            {filters.map((item) => (
              <FilterChip
                key={item}
                active={filter === item}
                onClick={() => setFilter(item)}
                className="shrink-0"
              >
                {item}
              </FilterChip>
            ))}
          </div>

          {grid.length === 0 ? (
            <div className="mt-6 rounded-[24px] border border-dashed border-line p-12 text-center">
              <p className="text-[13px] font-semibold">Ничего не нашлось</p>
              <p className="mt-1 text-[11.5px] text-muted">Попробуй другой запрос или тип события.</p>
            </div>
          ) : (
            <motion.div layout className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              <AnimatePresence mode="popLayout">
                {grid.map((event) => (
                  <motion.div
                    key={event.id}
                    layout
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{ duration: 0.25 }}
                  >
                    <EventCard event={event} onRegister={setSelected} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </section>

      {registeredCount > 0 && (
        <section className="py-6">
          <div className="container-page">
            <Card className="p-6">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                  <p className="flex items-center gap-2 text-[13px] font-semibold">
                    <CalendarCheck className="size-4 text-emerald-500" />
                    Твоя активность в резюме
                  </p>
                  <p className="mt-1 text-[11.5px] text-muted">
                    Отметки уже в резюме — работодатель увидит их в разделе активности.
                  </p>
                </div>
                <Link to="/profile" search={{ tab: "activities" }}>
                  <Button variant="secondary" size="sm">
                    Мои мероприятия
                    <ArrowRight className="size-3.5" />
                  </Button>
                </Link>
              </div>
              <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {activities
                  .filter((activity) => activity.source === "event")
                  .slice(0, 3)
                  .map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-center gap-3 rounded-xl border border-line bg-surface-2 px-3 py-2.5"
                    >
                      <span className="grid size-8 place-items-center rounded-lg bg-emerald-500/10 text-emerald-500">
                        <Check className="size-4" />
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-[11px] font-semibold">{activity.title}</p>
                        <p className="text-[9.5px] text-muted">
                          {formatDate(activity.date)} · +{activity.hours} ч
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </Card>
          </div>
        </section>
      )}

      <section className="py-10">
        <div className="container-page">
          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                icon: CalendarCheck,
                title: "Отметка в резюме",
                text: "Участие подтверждается организатором и автоматически добавляется в профиль.",
              },
              {
                icon: Zap,
                title: "Часы активности",
                text: "Часы суммируются и показывают вовлечённость — это ценят работодатели.",
              },
              {
                icon: Sparkles,
                title: "Нетворкинг",
                text: "Прямой контакт с HR и инженерами без формального отбора.",
              },
            ].map((benefit) => (
              <div key={benefit.title} className="rounded-[24px] border border-line bg-surface p-6">
                <span className="grid size-10 place-items-center rounded-2xl bg-brand-soft text-brand">
                  <benefit.icon className="size-[18px]" />
                </span>
                <p className="mt-4 text-[13.5px] font-semibold">{benefit.title}</p>
                <p className="mt-1.5 text-[11.5px] leading-relaxed text-muted">{benefit.text}</p>
              </div>
            ))}
          </div>

          <div className="mt-4 flex flex-col items-start justify-between gap-4 rounded-[24px] border border-line bg-surface-2 px-6 py-5 sm:flex-row sm:items-center">
            <div>
              <p className="text-[13px] font-semibold">Проводите мероприятие для студентов?</p>
              <p className="mt-1 text-[11.5px] text-muted">
                Разместим событие, соберём регистрации и подтвердим участие каждого.
              </p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={() =>
                toast({
                  title: "Заявка отправлена",
                  description: "Команда Орбиты свяжется в течение рабочего дня.",
                  variant: "success",
                })
              }
            >
              Предложить событие
              <ArrowRight className="size-3.5" />
            </Button>
          </div>
        </div>
      </section>

      <EventRegisterModal event={selected} onClose={() => setSelected(null)} />
    </Page>
  );
}

function FeaturedEvent({
  event,
  onRegister,
}: {
  event: EventItem;
  onRegister: (event: EventItem) => void;
}) {
  const registered = useUser((state) => state.registrations.includes(event.id));
  const day = new Date(event.date).getDate();
  const month = formatDate(event.date).split(" ")[1];
  const filled = Math.round((event.taken / event.seats) * 100);

  return (
    <div className="noise relative overflow-hidden rounded-[32px] bg-linear-to-br from-brand-500 via-brand-600 to-[#0c2457] p-6 text-white shadow-[0_30px_80px_-40px_var(--glow)] sm:p-9">
      <div className="pointer-events-none absolute inset-0">
        <svg
          className="absolute -right-20 -top-32 h-[520px] w-[520px] text-white/10"
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
            transform="rotate(58 200 200)"
          />
        </svg>
        <div className="absolute -bottom-24 -left-16 size-64 rounded-full bg-white/10 blur-3xl" />
      </div>

      <div className="relative grid gap-8 lg:grid-cols-[1.35fr_0.65fr] lg:items-center">
        <div>
          <div className="flex flex-wrap items-center gap-1.5">
            <Badge className="border border-white/20 bg-white/10 text-white">
              <Sparkles className="size-3" />
              Главное событие сезона
            </Badge>
            <Badge className="border border-white/20 bg-white/10 text-white">{event.format}</Badge>
          </div>
          <h2 className="mt-4 max-w-[620px] text-[clamp(1.8rem,3.6vw,2.9rem)] font-semibold leading-[1.04] tracking-[-0.04em] text-balance">
            {event.title}
          </h2>
          <p className="mt-3 max-w-[520px] text-[12.5px] leading-relaxed text-white/70">
            {event.description}
          </p>

          <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-[11.5px] text-white/80">
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="size-3.5" />
              {formatDate(event.date)} · {event.time}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="size-3.5" />
              {event.place}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Zap className="size-3.5 text-amber-300" />+{event.hours} ч в резюме
            </span>
          </div>

          <div className="mt-6 flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={() => onRegister(event)}
              disabled={registered}
              className={cn(
                "inline-flex h-11 items-center justify-center gap-2 rounded-full px-6 text-[12.5px] font-bold transition",
                registered
                  ? "bg-emerald-400/20 text-emerald-200"
                  : "bg-white text-brand-800 hover:bg-white/90",
              )}
            >
              {registered ? (
                <>
                  <CalendarCheck className="size-4" />
                  Вы записаны
                </>
              ) : (
                <>
                  Зарегистрироваться
                  <ArrowRight className="size-4" />
                </>
              )}
            </button>
            <Link
              to="/profile"
              search={{ tab: "activities" }}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-white/25 px-6 text-[12.5px] font-semibold text-white transition hover:bg-white/10"
            >
              Мои мероприятия
            </Link>
          </div>
        </div>

        <div className="relative">
          <div className="rounded-[26px] border border-white/15 bg-white/[0.08] p-5 backdrop-blur-md">
            <div className="flex items-center gap-4">
              <div className="grid w-[72px] shrink-0 place-items-center rounded-2xl bg-white py-2.5 text-brand-800">
                <span className="text-[30px] font-bold leading-none tracking-[-0.05em]">{day}</span>
                <span className="mt-1 text-[9.5px] font-bold uppercase tracking-wide">{month}</span>
              </div>
              <div>
                <p className="text-[11.5px] font-semibold">{event.time}</p>
                <p className="mt-1 text-[10px] leading-relaxed text-white/60">{event.place}</p>
              </div>
            </div>

            <div className="mt-4 border-t border-white/15 pt-4">
              <div className="mb-1.5 flex items-center justify-between text-[10px] text-white/60">
                <span className="inline-flex items-center gap-1">
                  <Users className="size-3" />
                  {event.taken} из {event.seats} мест
                </span>
                <span className="font-semibold text-white">{filled}%</span>
              </div>
              <Progress
                value={filled}
                className="bg-white/15"
                barClassName="bg-linear-to-r from-emerald-300 to-emerald-400"
              />
              <div className="mt-3 flex items-center justify-between">
                <div className="flex -space-x-2">
                  {["ПС", "МД", "АБ", "КУ"].map((initials, index) => (
                    <span
                      key={initials}
                      className="grid size-6 place-items-center rounded-full bg-white/20 text-[8px] font-bold text-white ring-2 ring-brand-600"
                      style={{ opacity: 1 - index * 0.12 }}
                    >
                      {initials}
                    </span>
                  ))}
                </div>
                <span className="text-[9.5px] text-white/60">уже идут</span>
              </div>
            </div>
          </div>

          <div className="absolute -bottom-4 -right-2 hidden items-center gap-1.5 rounded-full bg-white px-3 py-2 text-brand-800 shadow-xl sm:flex">
            <Clock3 className="size-3.5" />
            <span className="text-[9.5px] font-bold">
              Осталось {event.seats - event.taken}{" "}
              {plural(event.seats - event.taken, "место", "места", "мест")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
