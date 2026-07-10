import { type SelectHTMLAttributes } from "react";
import { ChevronDown, type LucideIcon } from "lucide-react";
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
        <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
      )}
      <select
        className={cn(
          "w-full appearance-none rounded-md border bg-white py-2 pr-9 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand/40",
          Icon ? "pl-9" : "pl-3",
          invalid ? "border-danger" : "border-line",
          className,
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
    </div>
  );
};
