import { Link } from "@tanstack/react-router";
import { ArrowLeft, Compass, Home } from "lucide-react";
import { buttonStyles } from "@/components/ui/primitives";
import { Page } from "@/components/layout/Page";

export function NotFoundPage() {
  return (
    <Page>
      <section className="relative flex min-h-[82vh] items-center overflow-hidden pt-24">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="grid-bg absolute inset-0 opacity-50" />
          <div className="absolute left-1/2 top-1/3 size-[520px] -translate-x-1/2 rounded-full bg-brand/10 blur-[120px]" />
        </div>
        <div className="container-page relative text-center">
          <p className="text-[clamp(6rem,18vw,12rem)] font-extrabold leading-none tracking-[-0.07em] text-gradient">
            404
          </p>
          <h1 className="mt-2 text-[clamp(1.6rem,3.4vw,2.6rem)] font-semibold tracking-[-0.04em]">
            Кажется, эта орбита пуста
          </h1>
          <p className="mx-auto mt-3 max-w-[420px] text-[13.5px] leading-relaxed text-muted">
            Страница не найдена или уже переехала. Вернитесь на главную — там вакансии, стажировки и
            ИИ-помощник.
          </p>
          <div className="mt-7 flex flex-col items-center justify-center gap-2 sm:flex-row">
            <Link to="/" className={buttonStyles({ size: "lg" })}>
              <Home className="size-4" />
              На главную
            </Link>
            <Link to="/vacancies" className={buttonStyles({ variant: "secondary", size: "lg" })}>
              <Compass className="size-4" />
              К вакансиям
            </Link>
          </div>
          <button
            type="button"
            onClick={() => window.history.back()}
            className="mt-5 inline-flex items-center gap-1.5 text-[11px] font-semibold text-muted transition hover:text-brand"
          >
            <ArrowLeft className="size-3.5" />
            Вернуться назад
          </button>
        </div>
      </section>
    </Page>
  );
}
