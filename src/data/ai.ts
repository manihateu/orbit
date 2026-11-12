export type SphereId = "it" | "engineering" | "media" | "eco" | "management" | "science";

export interface Sphere {
  id: SphereId;
  title: string;
  tagline: string;
  description: string;
  roles: string[];
  vacancyIds: string[];
  courseIds: string[];
  c1: string;
  c2: string;
}

export const spheres: Sphere[] = [
  {
    id: "it",
    title: "IT и данные",
    tagline: "Создавать продукты и находить закономерности",
    description:
      "Тебе близки код, интерфейсы и работа с данными. Ты быстро учишься и любишь, когда всё работает точно. В регионе растёт спрос на frontend, backend и аналитиков — стартовать можно уже со 2 курса.",
    roles: ["Frontend-разработчик", "Аналитик данных", "Backend-разработчик"],
    vacancyIds: ["frontend-react-kaspiytech", "data-analyst-kaspiytech", "python-astrasoft"],
    courseIds: ["react-foundations", "sql-analytics", "python-start"],
    c1: "#3b82f6",
    c2: "#1d4ed8",
  },
  {
    id: "engineering",
    title: "Инженерия и производство",
    tagline: "Понимать, как устроен мир вокруг",
    description:
      "Тебе интересно, почему механизм работает именно так. Практика на реальном оборудовании и наставник на предприятии дадут тебе преимущество ещё до выпуска.",
    roles: ["Инженер-энергетик", "Инженер-механик", "Техник-судоремонтник"],
    vacancyIds: ["power-engineer-delta", "mechanic-promtech", "ship-technician-yug"],
    courseIds: ["autocad-engineering", "project-management", "python-start"],
    c1: "#0ea5e9",
    c2: "#0369a1",
  },
  {
    id: "media",
    title: "Медиа и креатив",
    tagline: "Рассказывать так, чтобы слушали",
    description:
      "Ты замечаешь тренды и умеешь превращать идею в контент. Портфолио важнее диплома: начинай с проектов медиацентра, городских событий и агентств.",
    roles: ["SMM-специалист", "Контент-мейкер", "Event-менеджер"],
    vacancyIds: ["smm-meridian", "video-content-meridian", "event-manager-meridian"],
    courseIds: ["content-video", "ux-figma", "interview-skills"],
    c1: "#8b5cf6",
    c2: "#6d28d9",
  },
  {
    id: "eco",
    title: "Экология и город",
    tagline: "Делать среду вокруг лучше",
    description:
      "Тебе важно видеть результат в реальной жизни: чистый воздух, зелёные дворы, удобные пространства. Здесь ценятся и полевые исследования, и работа с данными.",
    roles: ["Эколог-урбанист", "Оператор БПЛА", "ГИС-аналитик"],
    vacancyIds: ["ecologist-greencity", "drone-operator-greencity", "data-analyst-kaspiytech"],
    courseIds: ["urban-eco-data", "sql-analytics", "project-management"],
    c1: "#22c55e",
    c2: "#15803d",
  },
  {
    id: "management",
    title: "Менеджмент и люди",
    tagline: "Собирать команды и доводить до результата",
    description:
      "Ты хорошо чувствуешь людей и умеешь организовывать процесс. HR, логистика и управление проектами — направления, где студенту легко получить первый опыт.",
    roles: ["HR-специалист", "Логист", "Помощник event-менеджера"],
    vacancyIds: ["hr-intern-kaspiytech", "logist-volga", "event-manager-meridian"],
    courseIds: ["project-management", "interview-skills", "content-video"],
    c1: "#14b8a6",
    c2: "#0f766e",
  },
  {
    id: "science",
    title: "Наука и образование",
    tagline: "Объяснять сложное простыми словами",
    description:
      "Тебе нравится разбираться в теме до конца и делиться знаниями. Преподавание, исследования и аналитика дают возможность расти и помогать другим.",
    roles: ["Репетитор", "Аналитик", "Ассистент-исследователь"],
    vacancyIds: ["tutor-vector", "data-analyst-kaspiytech", "mechanic-promtech"],
    courseIds: ["python-start", "interview-skills", "sql-analytics"],
    c1: "#f59e0b",
    c2: "#b45309",
  },
];

export const sphereMap = Object.fromEntries(spheres.map((s) => [s.id, s])) as Record<
  SphereId,
  Sphere
>;

export interface TestOption {
  text: string;
  sphere: SphereId;
}

export interface TestQuestion {
  id: number;
  question: string;
  hint: string;
  options: TestOption[];
}

export const testQuestions: TestQuestion[] = [
  {
    id: 1,
    question: "Какая задача в проекте тебе ближе всего?",
    hint: "Выбери то, за чем ты готов просидеть допоздна",
    options: [
      { text: "Собрать интерфейс и написать логику", sphere: "it" },
      { text: "Разобраться, как работает механизм", sphere: "engineering" },
      { text: "Придумать, как рассказать о проекте", sphere: "media" },
    ],
  },
  {
    id: 2,
    question: "Идеальные условия работы — это…",
    hint: "Без правильных ответов, только твои ощущения",
    options: [
      { text: "Ноутбук, гибкий день и тишина", sphere: "it" },
      { text: "Поле, датчики и свежий воздух", sphere: "eco" },
      { text: "Люди, встречи и движение", sphere: "management" },
    ],
  },
  {
    id: 3,
    question: "Какую задачу ты выберешь из списка?",
    hint: "Представь, что за неё сразу заплатят",
    options: [
      { text: "Найти причину падения метрики", sphere: "science" },
      { text: "Снизить загрязнение района", sphere: "eco" },
      { text: "Снять ролик, который завирусится", sphere: "media" },
    ],
  },
  {
    id: 4,
    question: "Что тебе чаще говорят друзья?",
    hint: "Честно, это только между нами",
    options: [
      { text: "«Ты так понятно объясняешь»", sphere: "science" },
      { text: "«Ты замечаешь все детали»", sphere: "engineering" },
      { text: "«Ты классно всё организуешь»", sphere: "management" },
    ],
  },
  {
    id: 5,
    question: "Какой предмет давался легче всего?",
    hint: "Даже если это было в школе",
    options: [
      { text: "Информатика", sphere: "it" },
      { text: "Физика", sphere: "engineering" },
      { text: "Биология и химия", sphere: "science" },
    ],
  },
  {
    id: 6,
    question: "Где ты видишь себя через пять лет?",
    hint: "Фантазируй свободно",
    options: [
      { text: "Веду команду и запускаю проекты", sphere: "management" },
      { text: "Исследую город и его экологию", sphere: "eco" },
      { text: "Продюсирую контент и события", sphere: "media" },
    ],
  },
];

export const aiSuggestions = [
  "Подбери стажировку в IT",
  "Как улучшить моё резюме?",
  "Какие курсы мне нужны?",
  "Как пройти собеседование?",
  "Что даёт Госуслуги?",
];

export type AssistantTab = "chat" | "test" | "resume";

export type AssistantLinkTarget =
  | "/vacancies"
  | "/resumes"
  | "/internships"
  | "/events"
  | "/education"
  | "/profile"
  | "/ai";

export interface AssistantLink {
  label: string;
  to: AssistantLinkTarget;
  tab?: AssistantTab;
}

export interface AssistantReply {
  text: string;
  vacancyIds?: string[];
  courseIds?: string[];
  links?: AssistantLink[];
}

const contains = (source: string, words: string[]) =>
  words.some((word) => source.includes(word));

export function getAssistantReply(raw: string): AssistantReply {
  const message = raw.toLowerCase();

  if (contains(message, ["стажир", "ваканс", "работу", "работ", "подбер"])) {
    return {
      text:
        "Собрал для тебя три варианта, которые лучше всего совпадают с профилем «Frontend-разработчик» и твоим опытом стажировки в КаспийТехе. У всех гибкий график — можно совмещать с учёбой.",
      vacancyIds: ["frontend-react-kaspiytech", "ux-ui-kaspiytech", "python-astrasoft"],
      links: [{ label: "Все вакансии", to: "/vacancies" }],
    };
  }

  if (contains(message, ["курс", "обуч", "навык", "чему"])) {
    return {
      text:
        "По твоему профилю я бы закрыл два пробела: TypeScript-паттерны и уверенная самопрезентация. Оба курса бесплатные, а сертификат автоматически попадёт в раздел активности резюме.",
      courseIds: ["react-foundations", "interview-skills", "sql-analytics"],
      links: [{ label: "Программы и обучение", to: "/education" }],
    };
  }

  if (contains(message, ["резюме", "сопровод", "cv"])) {
    return {
      text:
        "В твоём резюме сильный блок с проектом «Расписание»: 1 200 пользователей — отличная цифра. Добавь измеримый результат к стажировке и подтяни первые два предложения — рекрутер читает их дольше всего. Могу переписать блок «О себе» в конструкторе.",
      links: [{ label: "Открыть конструктор", to: "/ai", tab: "resume" }],
    };
  }

  if (contains(message, ["собес", "интервью", "вопросы", "приглаш"])) {
    return {
      text:
        "Подготовь три истории по схеме STAR: задача, действие, результат. На собеседовании в КаспийТех часто спрашивают про React-хуки и Git-flow — потренируйся на демо-вопросах. И возьми с собой один вопрос работодателю: это повышает оценку кандидата.",
      links: [{ label: "Семинар по собеседованиям", to: "/events" }],
    };
  }

  if (contains(message, ["госуслуг", "трудов", "подтверд", "верифик"])) {
    return {
      text:
        "Подтверждение через Госуслуги занимает около двух минут: мы проверяем СНИЛС и подтягиваем данные электронной трудовой книжки из СФР. Работодатели видят бейдж «Проверенный профиль», а записи о стажировках добавляются автоматически.",
      links: [{ label: "Мой профиль", to: "/profile" }],
    };
  }

  if (contains(message, ["мероприят", "ярмарк", "ивент", "событ"])) {
    return {
      text:
        "Ближайшее крупное событие — ярмарка вакансий «Старт карьеры» 20 ноября в АГТУ: 60 работодателей и быстрые собеседования. За участие начисляем 6 часов активности и отметку в резюме.",
      links: [{ label: "Все мероприятия", to: "/events" }],
    };
  }

  if (contains(message, ["профориент", "кем", "специальн", "направлен", "тест"])) {
    return {
      text:
        "Давай сузим круг: пройди короткий тест из шести вопросов — он подберёт сферу, роли и конкретные вакансии региона. Займёт меньше двух минут.",
      links: [{ label: "Пройти профориентацию", to: "/ai", tab: "test" }],
    };
  }

  if (contains(message, ["привет", "здравств", "хай", "help"])) {
    return {
      text:
        "Привет! Я Орби — карьерный ассистент. Помогаю найти стажировку, собрать резюме, выбрать курсы и подготовиться к собеседованию. С чего начнём?",
      links: [{ label: "Посмотреть вакансии", to: "/vacancies" }],
    };
  }

  return {
    text:
      "Я могу помочь с четырьмя вещами: подобрать вакансии и стажировки, собрать или улучшить резюме, рекомендовать курсы и подготовить к собеседованию. Напиши, что из этого сейчас важнее — и я предложу конкретный следующий шаг.",
    links: [
      { label: "Вакансии", to: "/vacancies" },
      { label: "Профориентация", to: "/ai", tab: "test" },
    ],
  };
}

