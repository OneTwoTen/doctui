export type DateValue = string | null;

const pad = (value: number) => String(value).padStart(2, "0");
const DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;
const MONTH_PATTERN = /^(\d{4})-(\d{2})$/;

export function parseDate(value?: string | null): Date | null {
  if (!value) return null;
  const match = DATE_PATTERN.exec(value);
  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(year, month - 1, day);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }

  return date;
}

export function toDateValue(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function toMonthValue(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}`;
}

export function parseMonth(value?: string | null): Date | null {
  if (!value) return null;
  const match = MONTH_PATTERN.exec(value);
  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]);
  if (month < 1 || month > 12) return null;

  const date = new Date(year, month - 1, 1);
  return date.getFullYear() === year && date.getMonth() === month - 1
    ? date
    : null;
}

export function monthLabel(date: Date, locale: string): string {
  return new Intl.DateTimeFormat(locale, {
    month: "long",
    year: "numeric",
  }).format(date);
}

export function dayLabels(
  locale: string,
  firstDayOfWeek: number,
): string[] {
  const normalizedFirstDay = ((firstDayOfWeek % 7) + 7) % 7;
  const base = new Date(2024, 0, 7 + normalizedFirstDay);

  return Array.from({ length: 7 }, (_, index) =>
    new Intl.DateTimeFormat(locale, { weekday: "short" }).format(
      new Date(base.getFullYear(), base.getMonth(), base.getDate() + index),
    ),
  );
}

export function isOutsideRange(
  value: string,
  minDate?: string,
  maxDate?: string,
): boolean {
  const date = parseDate(value);
  if (!date) return true;

  const min = parseDate(minDate);
  const max = parseDate(maxDate);
  return Boolean(
    (min && date.getTime() < min.getTime()) ||
      (max && date.getTime() > max.getTime()),
  );
}

export function describedBy(
  ...ids: Array<string | undefined>
): string | undefined {
  return ids.filter(Boolean).join(" ") || undefined;
}

export const dateValue = {
  parseDate,
  parseMonth,
  toDateValue,
  toMonthValue,
};
