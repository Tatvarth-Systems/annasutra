import { Check } from "lucide-react";
import { cn } from "@/lib/utils/cn";

type Step = {
  key: string;
  label: string;
};

type StepIndicatorProps = {
  steps: Step[];
  currentKey: string;
};

export function StepIndicator({ steps, currentKey }: StepIndicatorProps) {
  const currentIndex = steps.findIndex((step) => step.key === currentKey);

  return (
    <ol className="mb-6 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
      {steps.map((step, index) => {
        const isCurrent = index === currentIndex;
        const isDone = index < currentIndex;

        return (
          <li key={step.key} className="flex items-center gap-2">
            <span
              className={cn(
                "flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium",
                isCurrent
                  ? "bg-brand text-white"
                  : isDone
                    ? "bg-brand-soft text-brand"
                    : "bg-line text-muted",
              )}
            >
              {isDone ? <Check className="h-3.5 w-3.5" /> : index + 1}
            </span>
            <span
              className={cn(isCurrent ? "font-medium text-ink" : "text-muted")}
            >
              {step.label}
            </span>
            {index < steps.length - 1 ? (
              <span className="mx-1 text-line">/</span>
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}
