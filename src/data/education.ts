import type { Course, EducationProgram, University } from "./types";

export const universities: University[] = [
  {
    id: "agtu",
    name: "Астраханский государственный технический университет",
    short: "АГТУ",
    city: "Астрахань",
    programs: 42,
    students: "9 800 студентов",
    c1: "#2563eb",
    c2: "#1e40af",
  },
  {
    id: "agu",
    name: "Астраханский государственный университет им. В. Н. Татищева",
    short: "АГУ",
    city: "Астрахань",
    programs: 36,
    students: "8 200 студентов",
    c1: "#6366f1",
    c2: "#4338ca",
  },
  {
    id: "agasu",
    name: "Астраханский государственный архитектурно-строительный университет",
    short: "АГАСУ",
    city: "Астрахань",
    programs: 18,
    students: "4 100 студентов",
    c1: "#0ea5e9",
    c2: "#075985",
  },
  {
    id: "agmu",
    name: "Астраханский государственный медицинский университет",
    short: "АГМУ",
    city: "Астрахань",
    programs: 12,
    students: "3 400 студентов",
    c1: "#14b8a6",
    c2: "#0f766e",
  },
  {
    id: "college-digital",
    name: "Астраханский колледж цифровых технологий",
    short: "АКЦТ",
    city: "Астрахань",
    programs: 14,
    students: "1 900 студентов",
    c1: "#8b5cf6",
    c2: "#6d28d9",
  },
];

export const universityMap = Object.fromEntries(
  universities.map((u) => [u.id, u]),
) as Record<string, University>;

export const programs: EducationProgram[] = [
  {
    id: "digital-engineering",
    title: "Цифровая инженерия",
    universityId: "agtu",
    companyId: "kaspiytech",
    profession: "Frontend / Backend-разработчик",
    duration: "4 года",
    budgetPlaces: 25,
    payment: "от 128 000 ₽ в год",
    description:
      "Совместная программа АГТУ и КаспийТеха: академическая база плюс реальные проекты с первого курса. Студенты проходят стажировки в продуктовых командах и защищают диплом на кейсах компании.",
    modules: [
      "Алгоритмы и структуры данных",
      "Веб-разработка и мобильные приложения",
      "Проектная работа с ментором из индустрии",
    ],
    outcome: "Оффер в КаспийТех или партнёрской IT-компании к выпуску",
    order: true,
    hiringChance: 87,
  },
  {
    id: "data-ai",
    title: "Аналитика данных и ИИ",
    universityId: "agu",
    companyId: "kaspiytech",
    profession: "Аналитик данных / ML-инженер",
    duration: "4 года",
    budgetPlaces: 20,
    payment: "от 134 000 ₽ в год",
    description:
      "Программа про данные и машинное обучение с лабораторией продуктовой аналитики. Партнёры предоставляют реальные датасеты и стажировки во время учёбы.",
    modules: [
      "Математическая статистика и вероятность",
      "SQL, Python и BI-инструменты",
      "Машинное обучение и MLOps",
    ],
    outcome: "Портфолио из 3 продуктовых кейсов и стажировка с офером",
    order: true,
    hiringChance: 84,
  },
  {
    id: "power-engineering",
    title: "Энергетика и цифровые сети",
    universityId: "agtu",
    companyId: "delta-energo",
    profession: "Инженер-энергетик",
    duration: "5 лет",
    budgetPlaces: 30,
    payment: "от 112 000 ₽ в год",
    description:
      "Программа с гарантированной практикой на объектах Дельта-Энерго. Учебные лаборатории оснащены цифровыми моделями подстанций региона.",
    modules: [
      "Электроэнергетические системы",
      "Релейная защита и автоматика",
      "Цифровые сети и учёт энергии",
    ],
    outcome: "Трудоустройство на предприятии-партнёре по итогам практики",
    order: true,
    hiringChance: 78,
  },
  {
    id: "shipbuilding",
    title: "Судостроение и судоремонт",
    universityId: "agtu",
    companyId: "sudoremont-yug",
    profession: "Инженер-кораблестроитель",
    duration: "5 лет",
    budgetPlaces: 18,
    payment: "от 108 000 ₽ в год",
    description:
      "Инженерная программа с производственной практикой на судоремонтном заводе. Студенты участвуют в реальных доковых проектах и получают рабочую профессию.",
    modules: [
      "Конструкция судна и судовые системы",
      "Технологии судоремонта",
      "CAD-проектирование и прочность",
    ],
    outcome: "Диплом на базе предприятия и предложение о работе",
    order: true,
    hiringChance: 81,
  },
  {
    id: "urban-ecology",
    title: "Урбанистика и городская экология",
    universityId: "agasu",
    companyId: "green-city",
    profession: "Эколог-урбанист",
    duration: "4 года",
    budgetPlaces: 15,
    payment: "от 118 000 ₽ в год",
    description:
      "Междисциплинарная программа о комфортном городе: экология, данные, проектирование общественных пространств. Лучшие проекты реализуются администрацией.",
    modules: [
      "Городская экология и мониторинг",
      "ГИС и анализ пространственных данных",
      "Проектирование общественных пространств",
    ],
    outcome: "Реализованный городской проект в портфолио",
    order: false,
    hiringChance: 66,
  },
  {
    id: "media-communications",
    title: "Медиа и коммуникации",
    universityId: "agu",
    companyId: "meridian-media",
    profession: "Продюсер / SMM-специалист",
    duration: "4 года",
    budgetPlaces: 22,
    payment: "от 104 000 ₽ в год",
    description:
      "Практико-ориентированная программа с медиацентром и агентством-партнёром. Студенты ведут реальные проекты и собирают портфолио с первого курса.",
    modules: [
      "Сторителлинг и медиапроизводство",
      "SMM и работа с сообществами",
      "Продюсирование городских событий",
    ],
    outcome: "Портфолио из 5 проектов и стажировка в агентстве",
    order: false,
    hiringChance: 71,
  },
];

export const courses: Course[] = [
  {
    id: "react-foundations",
    title: "React с нуля до первого проекта",
    provider: "КаспийТех",
    weeks: 6,
    level: "Начальный",
    free: true,
    skills: ["React", "TypeScript", "Git"],
  },
  {
    id: "sql-analytics",
    title: "SQL для анализа данных",
    provider: "АГУ · лаборатория данных",
    weeks: 4,
    level: "Начальный",
    free: true,
    skills: ["SQL", "PostgreSQL", "Дашборды"],
  },
  {
    id: "python-start",
    title: "Python: первые шаги",
    provider: "АстраСофт",
    weeks: 8,
    level: "Начальный",
    free: true,
    skills: ["Python", "ООП", "FastAPI"],
  },
  {
    id: "ux-figma",
    title: "UX/UI в Figma",
    provider: "КаспийТех",
    weeks: 5,
    level: "Начальный",
    free: true,
    skills: ["Figma", "Прототипы", "Дизайн-системы"],
  },
  {
    id: "interview-skills",
    title: "Собеседование без стресса",
    provider: "Карьерный центр Орбиты",
    weeks: 2,
    level: "Любой",
    free: true,
    skills: ["Самопрезентация", "STAR", "Переговоры"],
  },
  {
    id: "autocad-engineering",
    title: "AutoCAD для инженера",
    provider: "АГТУ",
    weeks: 6,
    level: "Начальный",
    free: true,
    skills: ["AutoCAD", "Чертежи", "ГОСТ"],
  },
  {
    id: "urban-eco-data",
    title: "Городские данные и экология",
    provider: "Зелёный Город",
    weeks: 4,
    level: "Средний",
    free: true,
    skills: ["ArcGIS", "Датчики", "Анализ данных"],
  },
  {
    id: "content-video",
    title: "Контент, который смотрят",
    provider: "Меридиан Медиа",
    weeks: 3,
    level: "Начальный",
    free: true,
    skills: ["Сценарии", "CapCut", "SMM"],
  },
  {
    id: "project-management",
    title: "Управление проектами для студентов",
    provider: "Орбита × ПромТехСервис",
    weeks: 4,
    level: "Средний",
    free: true,
    skills: ["Scrum", "Планирование", "Коммуникация"],
  },
];

export const courseMap = Object.fromEntries(courses.map((c) => [c.id, c])) as Record<
  string,
  Course
>;

export interface TrajectoryStep {
  title: string;
  place: string;
  duration: string;
  detail: string;
}

export interface Trajectory {
  id: string;
  label: string;
  icon: "code" | "chart" | "gear" | "sparkles" | "leaf" | "camera";
  steps: TrajectoryStep[];
  vacancyIds: string[];
}

export const trajectories: Trajectory[] = [
  {
    id: "it",
    label: "IT и продукты",
    icon: "code",
    steps: [
      { title: "Профильные дисциплины", place: "АГТУ · Цифровая инженерия", duration: "1–2 курс", detail: "Алгоритмы, базы данных и командная разработка." },
      { title: "Первая стажировка", place: "КаспийТех", duration: "3 курс", detail: "20 часов в неделю с ментором и оплатой." },
      { title: "Проектная работа", place: "Продуктовая команда", duration: "4 курс", detail: "Самостоятельная фича и защита диплома на кейсе." },
      { title: "Оффер", place: "КаспийТех / партнёры", duration: "Выпуск", detail: "Junior-позиция с планом роста до middle." },
    ],
    vacancyIds: ["frontend-react-kaspiytech", "data-analyst-kaspiytech", "python-astrasoft"],
  },
  {
    id: "engineering",
    label: "Инженерия",
    icon: "gear",
    steps: [
      { title: "Базовая подготовка", place: "АГТУ · Энергетика", duration: "1–3 курс", detail: "Электротехника, CAD и материаловедение." },
      { title: "Практика на объекте", place: "Дельта-Энерго", duration: "3 курс", detail: "Подстанции и цифровой учёт под наставничеством." },
      { title: "Рабочая профессия", place: "Судоремонт Юг", duration: "4 курс", detail: "Допуск к работам и реальные производственные задачи." },
      { title: "Трудоустройство", place: "Предприятие-партнёр", duration: "Выпуск", detail: "Инженерная позиция с программой развития." },
    ],
    vacancyIds: ["power-engineer-delta", "mechanic-promtech", "ship-technician-yug"],
  },
  {
    id: "media",
    label: "Медиа и креатив",
    icon: "camera",
    steps: [
      { title: "Портфолио", place: "Медиацентр вуза", duration: "1 курс", detail: "Первые тексты, ролики и публикации." },
      { title: "Проектная работа", place: "Меридиан Медиа", duration: "2–3 курс", detail: "Городские события и бренд-проекты." },
      { title: "Специализация", place: "Продюсерская лаборатория", duration: "4 курс", detail: "Своя кампания от идеи до результата." },
      { title: "Оффер", place: "Агентство / медиа", duration: "Выпуск", detail: "Продюсер или SMM-лид с портфолио." },
    ],
    vacancyIds: ["smm-meridian", "video-content-meridian", "event-manager-meridian"],
  },
];
