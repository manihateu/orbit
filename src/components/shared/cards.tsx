import { Link } from "@tanstack/react-router";
import {
  ArrowUpRight,
  BadgeCheck,
  CalendarDays,
  Clock3,
  GraduationCap,
  Heart,
  MapPin,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";
import type { Company, EventItem, Internship, Resume, Vacancy } from "@/data/types";
import { companyMap } from "@/data/companies";
import { formatDate, formatSalary, relativeDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import { useUser } from "@/store/user";
import { useUi } from "@/store/ui";
import { Badge, Card, Progress } from "@/components/ui/primitives";

export function CompanyLogo({
  company,
  size = "md",
  className,
}: {
  company: Company;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const sizeClass = {
    sm: "size-10 rounded-[13px] text-[11px]",
    md: "size-12 rounded-[15px] text-[13px]",
    lg: "size-16 rounded-[20px] text-lg",
  }[size];

  return (
    <span
      className={cn(
        "relative grid shrink-0 place-items-center font-bold tracking-tight text-white shadow-[inset_0_1px_0_rgba(255,255,255,.25),0_8px_20px_-10px_rgba(0,0,0,.4)]",
        sizeClass,
        className,
      )}
      style={{ backgroundImage: `linear-gradient(140deg, ${company.c1}, ${company.c2})` }}
      aria-hidden="true"
    >
      {company.initials}
    </span>
  );
}

export function MatchBadge({ value, className }: { value: number; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full bg-brand-soft px-2 py-1 text-[11px] font-bold text-brand",
        className,
      )}
    >
      <Sparkles className="size-3" />
      {value}% совпадение
    </span>
  );
}

export function VacancyCard({ vacancy, className }: { vacancy: Vacancy; className?: string }) {
  const company = companyMap[vacancy.companyId];
  const favorite = useUser((state) => state.favorites.includes(vacancy.id));
  const toggleFavorite = useUser((state) => state.toggleFavorite);
  const toast = useUi((state) => state.toast);

  return (
    <Card hover className={cn("group relative p-5", className)}>
      <button
        type="button"
        aria-label={favorite ? "Убрать из избранного" : "Добавить в избранное"}
        aria-pressed={favorite}
        onClick={() => {
          const added = toggleFavorite(vacancy.id);
          toast({
            title: added ? "Добавлено в избранное" : "Убрано из избранного",
            description: vacancy.title,
            variant: "info",
          });
        }}
        className={cn(
          "absolute right-4 top-4 z-10 grid size-9 place-items-center rounded-full border transition-all duration-300",
          favorite
            ? "border-rose-400/30 bg-rose-500/10 text-rose-500"
            : "border-line bg-surface-2/60 text-faint hover:border-line-strong hover:text-fg",
        )}
      >
        <Heart className={cn("size-4", favorite && "fill-current")} />
      </button>

      <Link
        to="/vacancies/$vacancyId"
        params={{ vacancyId: vacancy.id }}
        className="block outline-none"
      >
        <div className="flex items-start gap-3.5 pr-10">
          <CompanyLogo company={company} />
          <div className="min-w-0">
            <h3 className="line-clamp-2 text-[15px] font-semibold leading-snug tracking-[-0.02em] transition-colors group-hover:text-brand">
              {vacancy.title}
            </h3>
            <p className="mt-1 flex items-center gap-1.5 text-[12.5px] text-muted">
              <span className="truncate">{company.name}</span>
              {company.verified && <BadgeCheck className="size-3.5 shrink-0 text-brand" />}
            </p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1.5">
          <span className="text-[15px] font-bold tracking-[-0.02em]">
            {formatSalary(vacancy.salaryFrom, vacancy.salaryTo)}
          </span>
          <span className="hidden text-faint sm:inline">·</span>
          <span className="text-[12.5px] text-muted">
            <span className="sm:hidden">{vacancy.employment.replace(" занятость", "")}</span>
            <span className="hidden sm:inline">{vacancy.employment}</span>
          </span>
          {vacancy.hot && (
            <Badge variant="warning">
              <Zap className="size-3" />
              Срочно
            </Badge>
          )}
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {vacancy.skills.slice(0, 4).map((skill) => (
            <Badge key={skill} className="bg-surface-2">
              {skill}
            </Badge>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between gap-2 border-t border-line pt-3.5">
          <span className="flex min-w-0 items-center gap-1 text-[11.5px] text-muted">
            <MapPin className="size-3.5 shrink-0" />
            <span className="truncate">
              {vacancy.city}
              {vacancy.remote ? " · можно удалённо" : ""} · {relativeDate(vacancy.publishedAt)}
            </span>
          </span>
          <MatchBadge value={vacancy.match} className="shrink-0" />
        </div>
      </Link>
    </Card>
  );
}

export function ResumeCard({
  resume,
  onInvite,
  className,
}: {
  resume: Resume;
  onInvite: (resume: Resume) => void;
  className?: string;
}) {
  return (
    <Card hover className={cn("flex h-full flex-col p-5", className)}>
      <div className="flex items-start gap-3.5">
        <span
          className="grid size-12 shrink-0 place-items-center rounded-full text-[13px] font-bold text-white"
          style={{ backgroundImage: `linear-gradient(140deg, ${resume.c1}, ${resume.c2})` }}
        >
          {resume.name
            .split(" ")
            .map((part) => part[0])
            .join("")}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <h3 className="truncate text-[15px] font-semibold tracking-[-0.01em]">{resume.name}</h3>
            {resume.verified && <BadgeCheck className="size-4 shrink-0 text-brand" />}
          </div>
          <p className="mt-0.5 truncate text-[12px] text-muted">
            {resume.age} лет · {resume.university} · {resume.course} курс
          </p>
          <p className="mt-2 text-[13px] font-semibold text-brand">{resume.role}</p>
        </div>
        <span className="rounded-full bg-emerald-500/10 px-2 py-1 text-[10.5px] font-bold text-emerald-600 dark:text-emerald-400">
          {resume.match}%
        </span>
      </div>

      <p className="mt-4 line-clamp-3 text-[12.5px] leading-relaxed text-muted">{resume.about}</p>

      <div className="mt-3.5 flex flex-wrap gap-1.5">
        {resume.skills.slice(0, 4).map((skill) => (
          <Badge key={skill} className="bg-surface-2">
            {skill}
          </Badge>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 rounded-2xl bg-surface-2 p-3 text-center">
        <div>
          <p className="text-[13px] font-bold">{resume.experience.length}</p>
          <p className="text-[10px] text-faint">опыт</p>
        </div>
        <div>
          <p className="text-[13px] font-bold">{resume.activityHours} ч</p>
          <p className="text-[10px] text-faint">активность</p>
        </div>
        <div>
          <p className="text-[13px] font-bold">{resume.events}</p>
          <p className="text-[10px] text-faint">событий</p>
        </div>
      </div>

      <div className="mt-auto flex items-center justify-between gap-3 pt-4">
        <span className="text-[11px] text-faint">Можно пригласить</span>
        <button
          type="button"
          onClick={() => onInvite(resume)}
          className="inline-flex h-9 items-center gap-1.5 rounded-full bg-fg px-4 text-[12px] font-semibold text-bg transition hover:opacity-85"
        >
          Пригласить
          <ArrowUpRight className="size-3.5" />
        </button>
      </div>
    </Card>
  );
}

export function InternshipCard({
  internship,
  onOpen,
  className,
}: {
  internship: Internship;
  onOpen: (internship: Internship) => void;
  className?: string;
}) {
  const company = companyMap[internship.companyId];
  return (
    <Card hover className={cn("flex h-full flex-col p-5", className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <CompanyLogo company={company} size="sm" />
          <div>
            <p className="text-[12px] font-medium text-muted">{company.name}</p>
            <Badge variant="brand" className="mt-1">
              {internship.direction}
            </Badge>
          </div>
        </div>
        <span className="text-right">
          <span className="block text-[17px] font-bold leading-none tracking-[-0.03em]">
            {new Intl.NumberFormat("ru-RU").format(internship.stipend)} ₽
          </span>
          <span className="mt-1 block text-[10.5px] text-faint">в месяц</span>
        </span>
      </div>

      <h3 className="mt-4 text-[16px] font-semibold leading-snug tracking-[-0.02em]">
        {internship.title}
      </h3>
      <p className="mt-2 line-clamp-2 text-[12.5px] leading-relaxed text-muted">
        {internship.description}
      </p>

      <div className="mt-4 space-y-2 text-[12px] text-muted">
        <div className="flex items-center gap-2">
          <Clock3 className="size-3.5 text-faint" />
          {internship.duration} · {internship.format}
        </div>
        <div className="flex items-center gap-2">
          <CalendarDays className="size-3.5 text-faint" />
          Заявки до {formatDate(internship.deadline)}
        </div>
        <div className="flex items-center gap-2">
          <Users className="size-3.5 text-faint" />
          {internship.seats} мест · договор о практике
        </div>
      </div>

      <div className="mt-4">
        <div className="mb-1.5 flex items-center justify-between text-[10.5px] text-faint">
          <span>Вероятность офера</span>
          <span className="font-bold text-emerald-600 dark:text-emerald-400">
            {internship.hiringChance}%
          </span>
        </div>
        <Progress
          value={internship.hiringChance}
          barClassName="bg-linear-to-r from-emerald-400 to-emerald-500"
        />
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {internship.tags.slice(0, 2).map((tag) => (
          <Badge key={tag} className="bg-surface-2">
            {tag}
          </Badge>
        ))}
      </div>

      <button
        type="button"
        onClick={() => onOpen(internship)}
        className="mt-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded-full border border-line bg-surface-2 text-[12.5px] font-semibold transition hover:border-brand/30 hover:bg-brand-soft hover:text-brand"
      >
        Подробнее о программе
        <ArrowUpRight className="size-3.5" />
      </button>
    </Card>
  );
}

export function EventCard({
  event,
  onRegister,
  className,
}: {
  event: EventItem;
  onRegister: (event: EventItem) => void;
  className?: string;
}) {
  const registered = useUser((state) => state.registrations.includes(event.id));
  const isFull = event.taken >= event.seats;
  const [day, ...rest] = formatDate(event.date).split(" ");
  const month = rest.join(" ");

  return (
    <Card hover className={cn("flex h-full flex-col p-5", className)}>
      <div className="flex items-start gap-4">
        <div
          className={cn(
            "grid w-[58px] shrink-0 place-items-center rounded-2xl border py-2",
            event.featured
              ? "border-brand/20 bg-brand-soft text-brand"
              : "border-line bg-surface-2 text-fg",
          )}
        >
          <span className="text-[21px] font-bold leading-none tracking-[-0.04em]">{day}</span>
          <span className="mt-1 text-[9.5px] font-semibold uppercase tracking-wide text-muted">
            {month}
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <Badge variant={event.featured ? "brand" : "default"}>{event.type}</Badge>
            <Badge variant="outline">{event.format}</Badge>
          </div>
          <h3 className="mt-2 text-[15px] font-semibold leading-snug tracking-[-0.02em]">
            {event.title}
          </h3>
          <p className="mt-1.5 flex items-center gap-1.5 text-[11.5px] text-muted">
            <MapPin className="size-3.5 shrink-0" />
            <span className="truncate">{event.place}</span>
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11.5px] text-muted">
        <span className="inline-flex items-center gap-1">
          <Clock3 className="size-3.5" />
          {event.time}
        </span>
        <span className="inline-flex items-center gap-1">
          <Zap className="size-3.5 text-amber-500" />+{event.hours} ч в резюме
        </span>
      </div>

      <div className="mt-auto pt-4">
        <div className="mb-2 flex items-center justify-between text-[10.5px] text-faint">
          <span className="flex items-center gap-1">
            <Users className="size-3" />
            {event.taken} из {event.seats} мест
          </span>
          {isFull && <span className="font-semibold text-rose-500">Мест нет</span>}
        </div>
        <button
          type="button"
          disabled={isFull && !registered}
          onClick={() => onRegister(event)}
          className={cn(
            "inline-flex h-10 w-full items-center justify-center gap-2 rounded-full text-[12.5px] font-semibold transition",
            registered
              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
              : isFull
                ? "cursor-not-allowed bg-surface-3 text-faint"
                : "bg-brand text-white shadow-[0_10px_24px_-14px_var(--glow)] hover:bg-brand-strong",
          )}
        >
          {registered ? (
            <>
              <BadgeCheck className="size-4" />
              Вы записаны
            </>
          ) : isFull ? (
            "Мест нет"
          ) : (
            "Зарегистрироваться"
          )}
        </button>
      </div>
    </Card>
  );
}

export function CompanyCard({ company }: { company: Company }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-line bg-surface px-4 py-3 transition hover:border-line-strong">
      <CompanyLogo company={company} size="sm" />
      <div className="min-w-0">
        <p className="flex items-center gap-1 truncate text-[13px] font-semibold">
          {company.name}
          {company.verified && <BadgeCheck className="size-3.5 shrink-0 text-brand" />}
        </p>
        <p className="truncate text-[11px] text-muted">{company.industry}</p>
      </div>
    </div>
  );
}

export function UniversityChip({ name, short }: { name: string; short: string }) {
  return (
    <div className="flex items-center gap-2.5 rounded-2xl border border-line bg-surface px-3.5 py-2.5">
      <span className="grid size-8 place-items-center rounded-xl bg-brand-soft text-brand">
        <GraduationCap className="size-4" />
      </span>
      <div className="min-w-0">
        <p className="text-[12px] font-semibold">{short}</p>
        <p className="truncate text-[10px] text-faint">{name}</p>
      </div>
    </div>
  );
}
