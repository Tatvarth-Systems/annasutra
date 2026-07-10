"use client";

import { useEffect, useRef, useState } from "react";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import {
  formatTimeDisplay,
  parseHHMM,
  to24Hour,
  toHHMM,
} from "@/lib/utils/date";
import { useT } from "@/lib/i18n/provider";

const HOURS = Array.from({ length: 12 }, (_, index) => index + 1);
const MINUTES = [0, 15, 30, 45];
const PERIODS = ["AM", "PM"] as const;

type Period = (typeof PERIODS)[number];

type TimeFieldProps = {
  id: string;
  value: string;
  onChange: (hhmm: string) => void;
  invalid?: boolean;
  placeholder?: string;
};

export function TimeField({
  id,
  value,
  onChange,
  invalid,
  placeholder = "hh:mm AM/PM",
}: TimeFieldProps) {
  const t = useT();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const parsed = parseHHMM(value);
  const currentPeriod: Period = parsed && parsed.hour >= 12 ? "PM" : "AM";
  const currentHour12 = parsed
    ? parsed.hour % 12 === 0
      ? 12
      : parsed.hour % 12
    : null;
  const currentMinute = parsed ? parsed.minute : null;

  function commit(hour12: number, minute: number, period: Period) {
    onChange(toHHMM(to24Hour(hour12, period), minute));
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        id={id}
        onClick={() => setOpen((current) => !current)}
        aria-haspopup="dialog"
        aria-expanded={open}
        className={cn(
          "flex w-full items-center gap-2 rounded-md border bg-white px-3 py-2 text-left text-sm focus:outline-none focus:ring-2 focus:ring-brand/40",
          invalid ? "border-danger" : "border-line",
          value ? "text-ink" : "text-muted",
        )}
      >
        <Clock className="h-4 w-4 shrink-0 text-muted" />
        {value ? formatTimeDisplay(value) : placeholder}
      </button>

      {open ? (
        <div
          role="dialog"
          aria-label="Choose time"
          className="absolute z-20 mt-2 w-56 rounded-md border border-line bg-white shadow-lg"
        >
          <div className="flex divide-x divide-line">
            <div className="max-h-48 flex-1 overflow-y-auto py-1">
              {HOURS.map((hour) => (
                <button
                  key={hour}
                  type="button"
                  onClick={() =>
                    commit(hour, currentMinute ?? 0, currentPeriod)
                  }
                  className={cn(
                    "block w-full px-2 py-1.5 text-center text-sm",
                    currentHour12 === hour
                      ? "bg-brand text-white"
                      : "text-ink hover:bg-brand-soft",
                  )}
                >
                  {String(hour).padStart(2, "0")}
                </button>
              ))}
            </div>
            <div className="max-h-48 flex-1 overflow-y-auto py-1">
              {MINUTES.map((minute) => (
                <button
                  key={minute}
                  type="button"
                  onClick={() =>
                    commit(currentHour12 ?? 12, minute, currentPeriod)
                  }
                  className={cn(
                    "block w-full px-2 py-1.5 text-center text-sm",
                    currentMinute === minute
                      ? "bg-brand text-white"
                      : "text-ink hover:bg-brand-soft",
                  )}
                >
                  {String(minute).padStart(2, "0")}
                </button>
              ))}
            </div>
            <div className="flex-1 py-1">
              {PERIODS.map((period) => (
                <button
                  key={period}
                  type="button"
                  onClick={() =>
                    commit(currentHour12 ?? 12, currentMinute ?? 0, period)
                  }
                  className={cn(
                    "block w-full px-2 py-1.5 text-center text-sm",
                    currentPeriod === period && parsed
                      ? "bg-brand text-white"
                      : "text-ink hover:bg-brand-soft",
                  )}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="w-full border-t border-line px-3 py-2 text-center text-sm font-medium text-brand hover:bg-brand-soft"
          >
            {t("common.done")}
          </button>
        </div>
      ) : null}
    </div>
  );
}
