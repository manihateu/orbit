export interface Company {
  id: string;
  name: string;
  industry: string;
  about: string;
  city: string;
  employees: string;
  site: string;
  verified: boolean;
  c1: string;
  c2: string;
  initials: string;
}

export type Employment =
  | "Полная занятость"
  | "Частичная занятость"
  | "Стажировка"
  | "Проектная работа";

export interface Vacancy {
  id: string;
  title: string;
  companyId: Company["id"];
  city: string;
  remote: boolean;
  salaryFrom?: number;
  salaryTo?: number;
  employment: Employment;
  schedule: string;
  experience: string;
  studentFriendly: boolean;
  skills: string[];
  tags: string[];
  publishedAt: string;
  match: number;
  hot?: boolean;
  description: string;
  tasks: string[];
  requirements: string[];
  conditions: string[];
  hr: { name: string; role: string };
}

export interface Resume {
  id: string;
  name: string;
  age: number;
  university: string;
  faculty: string;
  course: number;
  role: string;
  city: string;
  salary: number;
  about: string;
  skills: string[];
  experience: { place: string; role: string; period: string; result: string }[];
  languages: string[];
  verified: boolean;
  activityHours: number;
  events: number;
  updatedAt: string;
  match: number;
  c1: string;
  c2: string;
}

export interface Internship {
  id: string;
  title: string;
  companyId: Company["id"];
  direction: string;
  duration: string;
  stipend: number;
  format: string;
  deadline: string;
  seats: number;
  description: string;
  program: string[];
  mentor: string;
  hiringChance: number;
  tags: string[];
}

export type EventType =
  | "Ярмарка вакансий"
  | "День открытых дверей"
  | "Семинар"
  | "Хакатон"
  | "Воркшоп"
  | "Экскурсия"
  | "Кейс-чемпионат";

export interface EventItem {
  id: string;
  title: string;
  type: EventType;
  date: string;
  time: string;
  format: "Офлайн" | "Онлайн" | "Гибрид";
  place: string;
  organizer: string;
  companyId?: Company["id"];
  seats: number;
  taken: number;
  hours: number;
  description: string;
  agenda: string[];
  tags: string[];
  featured?: boolean;
}

export interface University {
  id: string;
  name: string;
  short: string;
  city: string;
  programs: number;
  students: string;
  c1: string;
  c2: string;
}

export interface EducationProgram {
  id: string;
  title: string;
  universityId: University["id"];
  companyId: Company["id"];
  profession: string;
  duration: string;
  budgetPlaces: number;
  payment: string;
  description: string;
  modules: string[];
  outcome: string;
  order: boolean;
  hiringChance: number;
}

export interface Course {
  id: string;
  title: string;
  provider: string;
  weeks: number;
  level: string;
  free: boolean;
  skills: string[];
}

export interface WorkRecord {
  id: string;
  company: string;
  role: string;
  start: string;
  end: string;
  type: string;
  result: string;
}

export interface ActivityEntry {
  id: string;
  title: string;
  kind: string;
  date: string;
  organizer: string;
  hours: number;
  source: "event" | "internship" | "course";
}

export interface Application {
  id: string;
  vacancyId: string;
  appliedAt: string;
  status: "sent" | "review" | "invited";
}
