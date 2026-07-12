"use client";

import type { LucideIcon } from "lucide-react";
import type { InputHTMLAttributes } from "react";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

import { cn } from "@/lib/utils/cn";

type PasswordInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type"
> & {
  invalid?: boolean;
  icon?: LucideIcon;
  showLabel?: string;
  hideLabel?: string;
};

/** Password input with a toggle button to reveal or mask the entered value. */
export const PasswordInput = ({
  className,
  invalid,
  icon: Icon,
  showLabel = "Show password",
  hideLabel = "Hide password",
  ...props
}: PasswordInputProps) => {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      {Icon && (
        <Icon className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted" />
      )}
      <input
        type={visible ? "text" : "password"}
        className={cn(
          "w-full rounded-md border bg-white px-3 py-2 pr-9 text-sm text-ink placeholder:text-muted focus:ring-2 focus:ring-brand/40 focus:outline-none",
          Icon && "pl-9",
          invalid ? "border-danger" : "border-line",
          className,
        )}
        {...props}
      />
      <button
        type="button"
        tabIndex={-1}
        onClick={() => setVisible((prev) => !prev)}
        aria-label={visible ? hideLabel : showLabel}
        className="absolute top-1/2 right-3 -translate-y-1/2 text-muted hover:text-ink"
      >
        {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );
};
