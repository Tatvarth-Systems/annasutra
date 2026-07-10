export type ISODate = string; // yyyy-mm-dd
export type HHMM = string; // 24h HH:mm

type ParsedDate = { year: number; month: number; day: number };
type ParsedTime = { hour: number; minute: number };

export function parseISODate(iso: string | undefined): ParsedDate | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso ?? "");
  if (!match) return null;
  return {
    year: Number(match[1]),
    month: Number(match[2]) - 1,
    day: Number(match[3]),
  };
}

export function toISODate(year: number, month: number, day: number): ISODate {
  const mm = String(month + 1).padStart(2, "0");
  const dd = String(day).padStart(2, "0");
  return `${year}-${mm}-${dd}`;
}

export function formatDateDisplay(iso: string | undefined): string {
  const parsed = parseISODate(iso);
  if (!parsed) return "";
  const dd = String(parsed.day).padStart(2, "0");
  const mm = String(parsed.month + 1).padStart(2, "0");
  return `${dd}/${mm}/${parsed.year}`;
}

export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

export type MonthCell = { iso: ISODate; day: number } | null;

export function buildMonthGrid(year: number, month: number): MonthCell[] {
  const startWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = getDaysInMonth(year, month);

  const cells: MonthCell[] = [];
  for (let i = 0; i < startWeekday; i += 1) cells.push(null);
  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push({ iso: toISODate(year, month, day), day });
  }
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

export function parseHHMM(value: string | undefined): ParsedTime | null {
  const match = /^(\d{2}):(\d{2})$/.exec(value ?? "");
  if (!match) return null;
  return { hour: Number(match[1]), minute: Number(match[2]) };
}

export function toHHMM(hour: number, minute: number): HHMM {
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

export function formatTimeDisplay(value: string | undefined): string {
  const parsed = parseHHMM(value);
  if (!parsed) return "";
  const period = parsed.hour >= 12 ? "PM" : "AM";
  const hour12 = parsed.hour % 12 === 0 ? 12 : parsed.hour % 12;
  return `${String(hour12).padStart(2, "0")}:${String(parsed.minute).padStart(2, "0")} ${period}`;
}

export function to24Hour(hour12: number, period: "AM" | "PM"): number {
  if (period === "AM") return hour12 === 12 ? 0 : hour12;
  return hour12 === 12 ? 12 : hour12 + 12;
}
