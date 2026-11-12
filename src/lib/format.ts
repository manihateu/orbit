const MONTHS = [
  "января",
  "февраля",
  "марта",
  "апреля",
  "мая",
  "июня",
  "июля",
  "августа",
  "сентября",
  "октября",
  "ноября",
  "декабря",
];

const WEEKDAYS = ["вс", "пн", "вт", "ср", "чт", "пт", "сб"];

export function formatSalary(from?: number, to?: number): string {
  if (from && to) return `${formatMoney(from)} – ${formatMoney(to)} ₽`;
  if (from) return `от ${formatMoney(from)} ₽`;
  if (to) return `до ${formatMoney(to)} ₽`;
  return "Оплата по итогам";
}

export function formatMoney(value: number): string {
  return new Intl.NumberFormat("ru-RU").format(value);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("ru-RU").format(value);
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getDate()} ${MONTHS[d.getMonth()]}`;
}

export function formatMonth(iso: string): string {
  const d = new Date(iso);
  return `${MONTHS[d.getMonth()][0].toUpperCase()}${MONTHS[d.getMonth()].slice(1)}`;
}

export function formatWeekday(iso: string): string {
  return WEEKDAYS[new Date(iso).getDay()];
}

export function formatFullDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

export function relativeDate(iso: string): string {
  const now = new Date("2026-11-13T10:00:00");
  const date = new Date(iso);
  const diff = Math.round((now.getTime() - date.getTime()) / 86_400_000);
  if (diff <= 0) return "сегодня";
  if (diff === 1) return "вчера";
  if (diff < 5) return `${diff} дня назад`;
  if (diff < 21) return `${diff} дней назад`;
  return formatDate(iso);
}

export function plural(n: number, one: string, few: string, many: string): string {
  const abs = Math.abs(n) % 100;
  const last = abs % 10;
  if (abs > 10 && abs < 20) return many;
  if (last > 1 && last < 5) return few;
  if (last === 1) return one;
  return many;
}

export function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function declensionOfYears(age: number): string {
  return `${age} ${plural(age, "год", "года", "лет")}`;
}
