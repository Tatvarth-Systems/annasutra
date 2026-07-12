"use client";

import { useState } from "react";
import { Clock } from "lucide-react";

import { toAsciiDigits, toLocaleDigits } from "@/lib/i18n/numerals";
import { useLocale, useT } from "@/lib/i18n/provider";
import { cn } from "@/lib/utils/cn";
import { parseHHMM, to24Hour, toHHMM } from "@/lib/utils/date";

type Period = "AM" | "PM";

type TimeFieldProps = {
  id: string;
  value: string;
  onChange: (hhmm: string) => void;
  invalid?: boolean;
  minHHMM?: string;
};

type Segments = { hour: string; minute: string; period: Period };

/** Converts a 24-hour value to a 12-hour display value (1-12). */
const to12Hour = (hour24: number): number =>
  hour24 % 12 === 0 ? 12 : hour24 % 12;

/** Derives display segments (hour, minute, period) from an HH:mm 24-hour string. */
const deriveSegments = (value: string | undefined): Segments => {
  const parsed = parseHHMM(value);
  if (!parsed) return { hour: "", minute: "", period: "AM" };
  return {
    hour: String(to12Hour(parsed.hour)).padStart(2, "0"),
    minute: String(parsed.minute).padStart(2, "0"),
    period: parsed.hour >= 12 ? "PM" : "AM",
  };
};

/** Clamps a digit string to a range and pads it to 2 digits. */
const clampPad = (digits: string, min: number, max: number): string => {
  const clamped = Math.min(max, Math.max(min, Number(digits)));
  return String(clamped).padStart(2, "0");
};

/** Time picker built from masked hour/minute inputs, accepting both English and Marathi digits. */
export const TimeField = ({ id, value, onChange, invalid }: TimeFieldProps) => {
  const locale = useLocale();
  const t = useT();

  const [hour, setHour] = useState(() => deriveSegments(value).hour);
  const [minute, setMinute] = useState(() => deriveSegments(value).minute);
  const [period, setPeriod] = useState<Period>(
    () => deriveSegments(value).period,
  );
  const [prevValue, setPrevValue] = useState(value);

  if (value !== prevValue) {
    setPrevValue(value);
    const next = deriveSegments(value);
    setHour(next.hour);
    setMinute(next.minute);
    setPeriod(next.period);
  }

  /** Emits the composed HH:mm value once both segments are complete, else clears. */
  const emit = (
    hourDigits: string,
    minuteDigits: string,
    nextPeriod: Period,
  ) => {
    const hourNum = Number(hourDigits);
    const minuteNum = Number(minuteDigits);
    const isComplete =
      hourDigits.length > 0 &&
      hourNum >= 1 &&
      hourNum <= 12 &&
      minuteDigits.length === 2 &&
      minuteNum >= 0 &&
      minuteNum <= 59;
    onChange(
      isComplete ? toHHMM(to24Hour(hourNum, nextPeriod), minuteNum) : "",
    );
  };

  const handleHourChange = (raw: string) => {
    let digits = toAsciiDigits(raw).replace(/\D/g, "").slice(0, 2);
    if (digits.length === 2) digits = clampPad(digits, 1, 12);
    setHour(digits);
    emit(digits, minute, period);
  };

  const handleMinuteChange = (raw: string) => {
    let digits = toAsciiDigits(raw).replace(/\D/g, "").slice(0, 2);
    if (digits.length === 2) digits = clampPad(digits, 0, 59);
    setMinute(digits);
    emit(hour, digits, period);
  };

  const handleHourBlur = () => {
    if (!hour) return;
    const padded = clampPad(hour, 1, 12);
    setHour(padded);
    emit(padded, minute, period);
  };

  const handleMinuteBlur = () => {
    if (!minute) return;
    const padded = clampPad(minute, 0, 59);
    setMinute(padded);
    emit(hour, padded, period);
  };

  const handlePeriodChange = (next: Period) => {
    setPeriod(next);
    emit(hour, minute, next);
  };

  return (
    <div
      className={cn(
        "flex w-full items-center gap-2 rounded-md border bg-white px-3 py-2 text-sm focus-within:ring-2 focus-within:ring-brand/40",
        invalid ? "border-danger" : "border-line",
      )}
    >
      <Clock className="h-4 w-4 shrink-0 text-muted" />
      <input
        id={id}
        type="text"
        inputMode="numeric"
        placeholder="hh"
        aria-label="Hour"
        className="w-9 rounded px-0.5 text-center text-ink tabular-nums outline-none placeholder:text-muted focus:bg-brand focus:text-white"
        value={toLocaleDigits(hour, locale)}
        onChange={(event) => handleHourChange(event.target.value)}
        onBlur={handleHourBlur}
      />
      <span className="text-muted">:</span>
      <input
        type="text"
        inputMode="numeric"
        placeholder="mm"
        aria-label="Minute"
        className="w-9 rounded px-0.5 text-center text-ink tabular-nums outline-none placeholder:text-muted focus:bg-brand focus:text-white"
        value={toLocaleDigits(minute, locale)}
        onChange={(event) => handleMinuteChange(event.target.value)}
        onBlur={handleMinuteBlur}
      />
      <select
        aria-label="AM/PM"
        className="ml-auto rounded border-none bg-transparent text-sm text-ink outline-none"
        value={period}
        onChange={(event) => handlePeriodChange(event.target.value as Period)}
      >
        <option value="AM">{t("client.am")}</option>
        <option value="PM">{t("client.pm")}</option>
      </select>
    </div>
  );
};
