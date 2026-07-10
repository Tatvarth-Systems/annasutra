"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import {
  buildMonthGrid,
  formatDateDisplay,
  parseISODate,
  toISODate,
} from "@/lib/utils/date";

const WEEKDAY_LABELS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTH_LABELS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

type DateFieldProps = {
  id: string;
  value: string;
  onChange: (iso: string) => void;
  invalid?: boolean;
  placeholder?: string;
};

/** Date picker component with calendar view. */
export const DateField = ({
  id,
  value,
  onChange,
  invalid,
  placeholder = "dd/mm/yyyy",
}: DateFieldProps) => {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const today = useMemo(() => new Date(), []);

  const [viewYear, setViewYear] = useState(
    () => parseISODate(value)?.year ?? today.getFullYear(),
  );
  const [viewMonth, setViewMonth] = useState(
    () => parseISODate(value)?.month ?? today.getMonth(),
  );

  useEffect(() => {
    /** Closes picker when clicking outside. */
    const handleClickOutside = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /** Opens picker and sets view to current or selected date. */
  const openPicker = () => {
    const parsed = parseISODate(value);
    setViewYear(parsed?.year ?? today.getFullYear());
    setViewMonth(parsed?.month ?? today.getMonth());
    setOpen(true);
  };

  /** Navigates to previous month. */
  const goPrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((year) => year - 1);
    } else {
      setViewMonth((month) => month - 1);
    }
  };

  /** Navigates to next month. */
  const goNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((year) => year + 1);
    } else {
      setViewMonth((month) => month + 1);
    }
  };

  const grid = useMemo(
    () => buildMonthGrid(viewYear, viewMonth),
    [viewYear, viewMonth],
  );
  const todayIso = toISODate(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        id={id}
        onClick={() => (open ? setOpen(false) : openPicker())}
        aria-haspopup="dialog"
        aria-expanded={open}
        className={cn(
          "flex w-full items-center gap-2 rounded-md border bg-white px-3 py-2 text-left text-sm focus:outline-none focus:ring-2 focus:ring-brand/40",
          invalid ? "border-danger" : "border-line",
          value ? "text-ink" : "text-muted",
        )}
      >
        <CalendarDays className="h-4 w-4 shrink-0 text-muted" />
        {value ? formatDateDisplay(value) : placeholder}
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Choose date"
          className="absolute z-20 mt-2 w-72 rounded-md border border-line bg-white p-3 shadow-lg"
        >
          <div className="mb-2 flex items-center justify-between">
            <button
              type="button"
              onClick={goPrevMonth}
              aria-label="Previous month"
              className="rounded p-1 text-muted hover:bg-brand-soft hover:text-brand"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-sm font-medium text-ink">
              {MONTH_LABELS[viewMonth]} {viewYear}
            </span>
            <button
              type="button"
              onClick={goNextMonth}
              aria-label="Next month"
              className="rounded p-1 text-muted hover:bg-brand-soft hover:text-brand"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-xs text-muted">
            {WEEKDAY_LABELS.map((weekday) => (
              <span key={weekday}>{weekday}</span>
            ))}
          </div>
          <div className="mt-1 grid grid-cols-7 gap-1">
            {grid.map((cell, index) =>
              cell ? (
                <button
                  key={cell.iso}
                  type="button"
                  onClick={() => {
                    onChange(cell.iso);
                    setOpen(false);
                  }}
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full text-sm",
                    cell.iso === value
                      ? "bg-brand text-white"
                      : cell.iso === todayIso
                        ? "border border-brand text-brand"
                        : "text-ink hover:bg-brand-soft",
                  )}
                >
                  {cell.day}
                </button>
              ) : (
                <span key={`empty-${index}`} />
              ),
            )}
          </div>
        </div>
      )}
    </div>
  );
};
