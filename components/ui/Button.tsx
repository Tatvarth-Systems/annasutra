import { type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: "bg-brand text-white hover:bg-brand/90 disabled:bg-brand/40",
  secondary:
    "bg-white text-ink border border-line hover:bg-brand-soft disabled:text-muted disabled:bg-white",
  ghost: "bg-transparent text-ink hover:bg-brand-soft disabled:text-muted",
  danger: "bg-danger text-white hover:bg-danger/90 disabled:bg-danger/40",
};

/** Button component with variant styles and standard HTML button attributes. */
export const Button = ({
  variant = "primary",
  className,
  disabled,
  ...props
}: ButtonProps) => {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed",
        VARIANT_CLASSES[variant],
        className,
      )}
      disabled={disabled}
      {...props}
    />
  );
};
