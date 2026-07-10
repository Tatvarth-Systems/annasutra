import type { LucideIcon } from "lucide-react";
import { type SelectHTMLAttributes } from "react";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils/cn";

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  invalid?: boolean;
  icon?: LucideIcon;
};

/** Select component with optional icon and invalid state styling. */
export const Select = ({
  className,
  invalid,
  icon: Icon,
  children,
  ...props
}: SelectProps) => {
  return (
    <div className="relative">
      {Icon && (
        <Icon className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted" />
      )}
      <select
        className={cn(
          "w-full appearance-none rounded-md border bg-white py-2 pr-9 text-sm text-ink focus:ring-2 focus:ring-brand/40 focus:outline-none",
          Icon ? "pl-9" : "pl-3",
          invalid ? "border-danger" : "border-line",
          className,
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-muted" />
    </div>
  );
};
