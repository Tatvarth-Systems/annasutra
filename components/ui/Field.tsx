import { type ReactNode } from "react";

import { Label } from "@/components/ui/Label";

type FieldProps = {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: ReactNode;
};

/** Field wrapper with label, children, and optional error or hint message. */
export const Field = ({
  label,
  htmlFor,
  error,
  hint,
  required,
  children,
}: FieldProps) => {
  return (
    <div>
      <Label htmlFor={htmlFor}>
        {label}
        {required && <span className="text-danger"> *</span>}
      </Label>
      {children}
      {error && <p className="mt-1 text-sm text-danger">{error}</p>}
      {!error && hint && <p className="mt-1 text-sm text-muted">{hint}</p>}
    </div>
  );
};
