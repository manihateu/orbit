import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Mail, MessageCircle, Send } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { Badge } from "@/components/ui/primitives";

const platformLinks = [
  { to: "/vacancies", label: "Вакансии" },
  { to: "/resumes", label: "Резюме студентов" },
  { to: "/internships", label: "Стажировки" },
  { to: "/events", label: "Мероприятия" },
] as const;

const featureLinks = [
  { to: "/ai", label: "ИИ-профориентация" },
  { to: "/education", label: "Траектория обучения" },
  { to: "/profile", label: "Личный кабинет" },
  { to: "/profile", label: "Проверка через Госуслуги" },
] as const;

export function Footer() {
  return (
    <footer className="relative mt-14 border-t border-line bg-bg-soft/60 sm:mt-24">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-brand/40 to-transparent" />
      <div className="container-page py-10 sm:py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1.1fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-[280px] text-[12.5px] leading-relaxed text-muted">
              Карьерная платформа для студентов Астраханской области: первая работа, стажировки и
              обучение в одном месте.
            </p>
            <div className="mt-5 flex flex-wrap gap-1.5">
              <Badge variant="brand">Программа «Карьерный старт»</Badge>
              <Badge variant="outline">Госуслуги</Badge>
            </div>
            <div className="mt-6 flex gap-2">
              {[
                { icon: Send, label: "Telegram", href: "https://t.me" },
                { icon: MessageCircle, label: "Чат поддержки", href: "https://t.me" },
                { icon: Mail, label: "Почта", href: "mailto:hello@orbita.study" },
              ].map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="grid size-9 place-items-center rounded-full border border-line bg-surface text-muted transition hover:border-brand/30 hover:text-brand"
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          <FooterColumn title="Платформа" links={[...platformLinks]} />
          <FooterColumn title="Возможности" links={[...featureLinks]} />

          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-[0.18em] text-faint">
              Связаться
            </h4>
            <ul className="mt-4 space-y-2.5 text-[12.5px] text-muted">
              <li>
                <a
                  href="mailto:hello@orbita.study"
                  className="group inline-flex items-center gap-1.5 transition hover:text-fg"
                >
                  hello@orbita.study
                  <ArrowUpRight className="size-3 text-faint transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </a>
              </li>
              <li className="leading-relaxed">
                Астрахань, ул. Татищева, 16
                <br />
                Пн–Пт, 09:00–18:00
              </li>
              <li>
                <span className="text-faint">Для работодателей:</span>
                <br />
                <a href="mailto:hr@orbita.study" className="font-semibold text-fg hover:text-brand">
                  hr@orbita.study
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-line pt-6 text-[11px] text-faint sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Орбита. Карьера начинается со студента.</p>
          <p className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <span>Демо-прототип: данные и вакансии вымышлены</span>
            <span className="hidden h-3 w-px bg-line sm:block" />
            <span>Сделано для Астраханской области</span>
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { to: string; label: string }[];
}) {
  return (
    <div>
      <h4 className="text-[11px] font-bold uppercase tracking-[0.18em] text-faint">{title}</h4>
      <ul className="mt-4 space-y-2.5">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              to={link.to}
              className="text-[12.5px] text-muted transition hover:text-fg hover:underline hover:decoration-brand/40 hover:underline-offset-4"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
