"use client";

import type { LucideIcon } from "lucide-react";
import {
  Input as AriaInput,
  NumberField as AriaNumberField,
  Group,
} from "react-aria-components";

import { cn } from "@/lib/utils/cn";

type NumberFieldProps = {
  id: string;
  value: number | undefined;
  onChange: (value: number | undefined) => void;
  icon?: LucideIcon;
  minValue?: number;
  maxValue?: number;
  step?: number;
  invalid?: boolean;
  "aria-label": string;
};

/** Numeric input that accepts both Latin and locale-native digits (e.g. Devanagari in mr), via react-aria's NumberField. */
export const NumberField = ({
  id,
  value,
  onChange,
  icon: Icon,
  minValue,
  maxValue,
  step,
  invalid,
  "aria-label": ariaLabel,
}: NumberFieldProps) => {
  const field = (
    <AriaNumberField
      value={value ?? NaN}
      onChange={(next) => onChange(Number.isNaN(next) ? undefined : next)}
      minValue={minValue}
      maxValue={maxValue}
      step={step}
      isInvalid={invalid}
      aria-label={ariaLabel}
    >
      <Group className="block">
        <AriaInput
          id={id}
          className={cn(
            "w-full rounded-md border bg-white px-3 py-2 text-sm text-ink placeholder:text-muted focus:ring-2 focus:ring-brand/40 focus:outline-none",
            Icon && "pl-9",
            invalid ? "border-danger" : "border-line",
          )}
        />
      </Group>
    </AriaNumberField>
  );

  if (!Icon) return field;

  return (
    <div className="relative">
      <Icon className="pointer-events-none absolute top-1/2 left-3 z-10 h-4 w-4 -translate-y-1/2 text-muted" />
      {field}
    </div>
  );
};
