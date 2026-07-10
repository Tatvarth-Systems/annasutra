import { type HTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

/** Card container with standard border and shadow styling. */
export const Card = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn(
        "rounded-lg border border-line bg-white p-5 shadow-sm",
        className,
      )}
      {...props}
    />
  );
};
