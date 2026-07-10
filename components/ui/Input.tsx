import type { LucideIcon } from "lucide-react";
import { type InputHTMLAttributes } from "react";

import { cn } from "@/lib/utils/cn";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  invalid?: boolean;
  icon?: LucideIcon;
};

/** Input component with optional icon and invalid state styling. */
export const Input = ({
  className,
  invalid,
  icon: Icon,
  ...props
}: InputProps) => {
  const input = (
    <input
      className={cn(
        "w-full rounded-md border bg-white px-3 py-2 text-sm text-ink placeholder:text-muted focus:ring-2 focus:ring-brand/40 focus:outline-none",
        Icon && "pl-9",
        invalid ? "border-danger" : "border-line",
        className,
      )}
      {...props}
    />
  );

  if (!Icon) return input;

  return (
    <div className="relative">
      <Icon className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted" />
      {input}
    </div>
  );
};
