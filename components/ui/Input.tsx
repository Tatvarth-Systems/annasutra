import { type InputHTMLAttributes } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils/cn";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  invalid?: boolean;
  icon?: LucideIcon;
};

export function Input({
  className,
  invalid,
  icon: Icon,
  ...props
}: InputProps) {
  const input = (
    <input
      className={cn(
        "w-full rounded-md border bg-white px-3 py-2 text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-brand/40",
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
      <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
      {input}
    </div>
  );
}
