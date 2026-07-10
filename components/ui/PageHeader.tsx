import type { LucideIcon } from "lucide-react";
import { type ReactNode } from "react";

type PageHeaderProps = {
  title: string;
  description?: string;
  icon?: LucideIcon;
  action?: ReactNode;
};

/** Page header with title, optional description, icon, and action. */
export const PageHeader = ({
  title,
  description,
  icon: Icon,
  action,
}: PageHeaderProps) => {
  return (
    <div className="mb-6 flex items-start justify-between gap-4">
      <div className="flex items-start gap-3">
        {Icon && (
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-brand-soft text-brand">
            <Icon className="h-5 w-5" />
          </span>
        )}
        <div>
          <h1 className="text-xl font-semibold text-ink">{title}</h1>
          {description && (
            <p className="mt-1 text-sm text-muted">{description}</p>
          )}
        </div>
      </div>
      {action}
    </div>
  );
};
