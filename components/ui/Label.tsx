import { type LabelHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

/** Label component with standard styling and spacing. */
export const Label = ({
  className,
  ...props
}: LabelHTMLAttributes<HTMLLabelElement>) => {
  return (
    <label
      className={cn("mb-1 block text-sm font-medium text-ink", className)}
      {...props}
    />
  );
};
