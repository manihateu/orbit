import { createRootRoute, createRoute, createRouter } from "@tanstack/react-router";
import { Layout } from "@/components/layout/Layout";
import { HomePage } from "@/pages/Home";
import { VacanciesPage } from "@/pages/Vacancies";
import { VacancyDetailPage } from "@/pages/VacancyDetail";
import { ResumesPage } from "@/pages/Resumes";
import { InternshipsPage } from "@/pages/Internships";
import { EventsPage } from "@/pages/Events";
import { EducationPage } from "@/pages/Education";
import { AiPage } from "@/pages/Ai";
import { ProfilePage } from "@/pages/Profile";
import { NotFoundPage } from "@/pages/NotFound";

const rootRoute = createRootRoute({
  component: Layout,
  notFoundComponent: NotFoundPage,
});

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

interface TextSearch {
  q?: string;
  city?: string;
}

const vacanciesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/vacancies",
  validateSearch: (search: Record<string, unknown>): TextSearch => ({
    q: typeof search.q === "string" ? search.q : undefined,
    city: typeof search.city === "string" ? search.city : undefined,
  }),
  component: VacanciesPage,
});

const vacancyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/vacancies/$vacancyId",
  component: VacancyDetailPage,
});

const resumesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/resumes",
  component: ResumesPage,
});

const internshipsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/internships",
  validateSearch: (search: Record<string, unknown>): TextSearch => ({
    q: typeof search.q === "string" ? search.q : undefined,
  }),
  component: InternshipsPage,
});

const eventsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/events",
  validateSearch: (search: Record<string, unknown>): TextSearch => ({
    q: typeof search.q === "string" ? search.q : undefined,
  }),
  component: EventsPage,
});

const educationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/education",
  component: EducationPage,
});

type AiTab = "chat" | "test" | "resume";

const aiRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/ai",
  validateSearch: (search: Record<string, unknown>): { tab?: AiTab } => {
    const tab = search.tab;
    return {
      tab: tab === "chat" || tab === "test" || tab === "resume" ? tab : undefined,
    };
  },
  component: AiPage,
});

type ProfileTab = "overview" | "applications" | "activities" | "workbook" | "documents";

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/profile",
  validateSearch: (search: Record<string, unknown>): { tab?: ProfileTab } => {
    const tab = search.tab;
    const allowed: ProfileTab[] = [
      "overview",
      "applications",
      "activities",
      "workbook",
      "documents",
    ];
    return {
      tab: typeof tab === "string" && allowed.includes(tab as ProfileTab)
        ? (tab as ProfileTab)
        : undefined,
    };
  },
  component: ProfilePage,
});

const routeTree = rootRoute.addChildren([
  homeRoute,
  vacanciesRoute,
  vacancyRoute,
  resumesRoute,
  internshipsRoute,
  eventsRoute,
  educationRoute,
  aiRoute,
  profileRoute,
]);

export const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  defaultPreloadStaleTime: 0,
  scrollRestoration: true,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
