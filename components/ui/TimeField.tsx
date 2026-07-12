"use client";

import type { TimeValue } from "react-aria-components";
import { Time } from "@internationalized/date";
import { Clock } from "lucide-react";
import {
  TimeField as AriaTimeField,
  DateInput,
  DateSegment,
} from "react-aria-components";

import { cn } from "@/lib/utils/cn";
import { parseHHMM, toHHMM } from "@/lib/utils/date";

type TimeFieldProps = {
  id: string;
  value: string;
  onChange: (hhmm: string) => void;
  invalid?: boolean;
  minHHMM?: string;
};

/** Converts an HH:mm string to a react-aria Time value, or null if empty/invalid. */
const toTimeValue = (value: string | undefined): Time | null => {
  const parsed = parseHHMM(value);
  return parsed ? new Time(parsed.hour, parsed.minute) : null;
};

/** Time picker built on react-aria-components' segmented TimeField. */
export const TimeField = ({
  id,
  value,
  onChange,
  invalid,
  minHHMM,
}: TimeFieldProps) => {
  return (
    <AriaTimeField
      id={id}
      value={toTimeValue(value)}
      onChange={(next: TimeValue | null) =>
        onChange(next ? toHHMM(next.hour, next.minute) : "")
      }
      minValue={toTimeValue(minHHMM) ?? undefined}
      isInvalid={invalid}
      hourCycle={12}
    >
      <div
        className={cn(
          "flex w-full items-center gap-2 rounded-md border bg-white px-3 py-2 text-sm focus-within:ring-2 focus-within:ring-brand/40",
          invalid ? "border-danger" : "border-line",
        )}
      >
        <Clock className="h-4 w-4 shrink-0 text-muted" />
        <DateInput className="flex flex-1 gap-0.5">
          {(segment) => (
            <DateSegment
              segment={segment}
              className="rounded px-0.5 text-ink tabular-nums outline-none focus:bg-brand focus:text-white data-[placeholder]:text-muted"
            />
          )}
        </DateInput>
      </div>
    </AriaTimeField>
  );
};
