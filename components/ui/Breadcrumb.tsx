import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils/cn";

export type BreadcrumbItem = {
  key: string;
  label: string;
  /** Omit for the current page — it renders as plain, non-clickable text. */
  href?: string;
};

type BreadcrumbProps = {
  items: BreadcrumbItem[];
};

/** Breadcrumb navigation component. */
export const Breadcrumb = ({ items }: BreadcrumbProps) => {
  if (items.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex flex-wrap items-center gap-1 text-sm">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={item.key} className="flex items-center gap-1">
              {item.href ? (
                <Link href={item.href} className="text-muted hover:text-brand">
                  {item.label}
                </Link>
              ) : (
                <span
                  aria-current={isLast ? "page" : undefined}
                  className={cn(isLast ? "font-medium text-ink" : "text-muted")}
                >
                  {item.label}
                </span>
              )}
              {!isLast && (
                <ChevronRight className="h-3.5 w-3.5 shrink-0 text-line" />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
