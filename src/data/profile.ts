import type { ActivityEntry, Application, WorkRecord } from "./types";

export interface DemoUser {
  name: string;
  email: string;
  phone: string;
  birthDate: string;
  city: string;
  university: string;
  faculty: string;
  course: number;
  role: string;
  about: string;
  snils: string;
  verified: boolean;
  verifiedAt: string;
  avatarC1: string;
  avatarC2: string;
}

export const demoUser: DemoUser = {
  name: "Даниил Ветров",
  email: "daniil.vetrov@example.ru",
  phone: "+7 900 123-45-67",
  birthDate: "14 марта 2005",
  city: "Астрахань",
  university: "АГТУ",
  faculty: "Институт информационных технологий",
  course: 4,
  role: "Frontend-разработчик",
  about:
    "Студент 4 курса АГТУ. Пишу интерфейсы на React и TypeScript, прошёл стажировку в КаспийТехе. Ищу команду, где смогу расти от задач к самостоятельным фичам.",
  snils: "123-456-789 00",
  verified: true,
  verifiedAt: "2 октября 2026",
  avatarC1: "#3b82f6",
  avatarC2: "#1e3a8a",
};

export const workRecords: WorkRecord[] = [
  {
    id: "w1",
    company: "КаспийТех",
    role: "Стажёр-разработчик",
    start: "01.07.2026",
    end: "30.09.2026",
    type: "Срочный трудовой договор",
    result:
      "Разработал 14 компонентов личного кабинета на React, ускорил загрузку ключевой страницы на 18%.",
  },
  {
    id: "w2",
    company: "АстраСофт",
    role: "Практикант",
    start: "15.06.2025",
    end: "31.08.2025",
    type: "Договор о практической подготовке",
    result:
      "Участвовал в разработке внутреннего сервиса заявок, подготовил 12 автотестов.",
  },
  {
    id: "w3",
    company: "Медиацентр АГТУ",
    role: "Контент-мейкер",
    start: "01.09.2024",
    end: "31.12.2024",
    type: "Договор ГПХ",
    result: "Вёл телеграм-канал института, подготовил 40 публикаций.",
  },
];

export const seedActivities: ActivityEntry[] = [
  {
    id: "a1",
    title: "Хакатон «Волга Digital 2025»",
    kind: "Хакатон",
    date: "2025-12-14",
    organizer: "АстраСофт × АГУ",
    hours: 24,
    source: "event",
  },
  {
    id: "a2",
    title: "Стажировка «Product Analytics»",
    kind: "Стажировка",
    date: "2026-07-01",
    organizer: "КаспийТех",
    hours: 120,
    source: "internship",
  },
  {
    id: "a3",
    title: "Семинар «Резюме, которое читают»",
    kind: "Семинар",
    date: "2026-10-24",
    organizer: "Карьерный центр Орбиты",
    hours: 2,
    source: "event",
  },
  {
    id: "a4",
    title: "День открытых дверей КаспийТех",
    kind: "День открытых дверей",
    date: "2026-10-15",
    organizer: "КаспийТех",
    hours: 3,
    source: "event",
  },
];

export const seedApplications: Application[] = [
  {
    id: "app1",
    vacancyId: "data-analyst-kaspiytech",
    appliedAt: "2026-11-04",
    status: "invited",
  },
  {
    id: "app2",
    vacancyId: "ux-ui-kaspiytech",
    appliedAt: "2026-11-08",
    status: "review",
  },
  {
    id: "app3",
    vacancyId: "smm-meridian",
    appliedAt: "2026-11-11",
    status: "sent",
  },
];

export interface ResumeDraft {
  name: string;
  role: string;
  university: string;
  about: string;
  skills: string;
  experience: string;
  contact: string;
}

export const resumeDraftSeed: ResumeDraft = {
  name: "Даниил Ветров",
  role: "Frontend-разработчик",
  university: "АГТУ · Институт информационных технологий · 4 курс",
  about:
    "Студент 4 курса, пишу интерфейсы на React и TypeScript. Собрал три учебных проекта и прошёл стажировку в продуктовой команде. Ищу работу с гибким графиком.",
  skills: "React, TypeScript, Tailwind CSS, Git, Figma",
  experience:
    "Стажировка в КаспийТех (июль — сентябрь 2026): собрал 14 компонентов личного кабинета и ускорил загрузку страницы на 18%.",
  contact: "daniil.vetrov@example.ru · +7 900 123-45-67",
};
