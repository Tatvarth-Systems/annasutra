export type ISODate = string; // yyyy-mm-dd
export type HHMM = string; // 24h HH:mm

type ParsedDate = { year: number; month: number; day: number };
type ParsedTime = { hour: number; minute: number };

/** Parses ISO date string (yyyy-mm-dd) into date components. */
export const parseISODate = (iso: string | undefined): ParsedDate | null => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso ?? "");
  if (!match) return null;
  return {
    year: Number(match[1]),
    month: Number(match[2]) - 1,
    day: Number(match[3]),
  };
};

/** Converts date components to ISO date string (yyyy-mm-dd). */
export const toISODate = (
  year: number,
  month: number,
  day: number,
): ISODate => {
  const mm = String(month + 1).padStart(2, "0");
  const dd = String(day).padStart(2, "0");
  return `${year}-${mm}-${dd}`;
};

/** Formats ISO date string for display (dd/mm/yyyy). */
export const formatDateDisplay = (iso: string | undefined): string => {
  const parsed = parseISODate(iso);
  if (!parsed) return "";
  const dd = String(parsed.day).padStart(2, "0");
  const mm = String(parsed.month + 1).padStart(2, "0");
  return `${dd}/${mm}/${parsed.year}`;
};

/** Returns number of days in month. */
export const getDaysInMonth = (year: number, month: number): number => {
  return new Date(year, month + 1, 0).getDate();
};

export type MonthCell = { iso: ISODate; day: number } | null;

/** Builds a calendar grid for a month with day cells and padding. */
export const buildMonthGrid = (year: number, month: number): MonthCell[] => {
  const startWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = getDaysInMonth(year, month);

  const cells: MonthCell[] = [];
  for (let i = 0; i < startWeekday; i += 1) cells.push(null);
  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push({ iso: toISODate(year, month, day), day });
  }
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
};

/** Parses HH:mm time string into hour and minute components. */
export const parseHHMM = (value: string | undefined): ParsedTime | null => {
  const match = /^(\d{2}):(\d{2})$/.exec(value ?? "");
  if (!match) return null;
  return { hour: Number(match[1]), minute: Number(match[2]) };
};

/** Converts hour and minute to HH:mm string format. */
export const toHHMM = (hour: number, minute: number): HHMM => {
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
};

/** Formats HH:mm time string for display (12-hour format with AM/PM). */
export const formatTimeDisplay = (value: string | undefined): string => {
  const parsed = parseHHMM(value);
  if (!parsed) return "";
  const period = parsed.hour >= 12 ? "PM" : "AM";
  const hour12 = parsed.hour % 12 === 0 ? 12 : parsed.hour % 12;
  return `${String(hour12).padStart(2, "0")}:${String(parsed.minute).padStart(2, "0")} ${period}`;
};

/** Converts 12-hour format to 24-hour format. */
export const to24Hour = (hour12: number, period: "AM" | "PM"): number => {
  if (period === "AM") return hour12 === 12 ? 0 : hour12;
  return hour12 === 12 ? 12 : hour12 + 12;
};

/** Returns today's date as an ISO date string (yyyy-mm-dd). */
export const getTodayIso = (): ISODate => {
  const now = new Date();
  return toISODate(now.getFullYear(), now.getMonth(), now.getDate());
};

/** Returns the current time as an HH:mm string. */
export const getNowHHMM = (): HHMM => {
  const now = new Date();
  return toHHMM(now.getHours(), now.getMinutes());
};
