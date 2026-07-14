"use client";

import type { LucideIcon } from "lucide-react";
import { Minus, Plus } from "lucide-react";
import {
  Button as AriaButton,
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
  showStepper?: boolean;
  "aria-label": string;
};

const STEPPER_BUTTON_CLASSES =
  "flex h-11 w-11 shrink-0 touch-manipulation items-center justify-center text-ink hover:bg-brand-soft disabled:cursor-not-allowed disabled:text-muted disabled:hover:bg-transparent";

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
  showStepper,
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
      <Group
        className={cn(
          "block",
          showStepper &&
            cn(
              "flex h-11 w-36 items-stretch overflow-hidden rounded-md border bg-white",
              invalid ? "border-danger" : "border-line",
            ),
        )}
      >
        {showStepper && (
          <AriaButton slot="decrement" className={STEPPER_BUTTON_CLASSES}>
            <Minus className="h-4 w-4" />
          </AriaButton>
        )}
        <AriaInput
          id={id}
          className={cn(
            "w-full min-w-0 text-sm text-ink placeholder:text-muted focus:outline-none",
            showStepper
              ? "border-0 bg-transparent text-center focus:ring-0"
              : cn(
                  "rounded-md border bg-white px-3 py-2 focus:ring-2 focus:ring-brand/40",
                  Icon && "pl-9",
                  invalid ? "border-danger" : "border-line",
                ),
          )}
        />
        {showStepper && (
          <AriaButton slot="increment" className={STEPPER_BUTTON_CLASSES}>
            <Plus className="h-4 w-4" />
          </AriaButton>
        )}
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
