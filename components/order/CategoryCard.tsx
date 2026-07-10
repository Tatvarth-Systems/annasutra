import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils/cn";

type CategoryCardProps = {
  label: string;
  icon: LucideIcon;
  selected?: boolean;
  onClick: () => void;
};

/** Category selector card with icon and selection state. */
export const CategoryCard = ({
  label,
  icon: Icon,
  selected,
  onClick,
}: CategoryCardProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 rounded-lg border p-4 text-left text-sm font-medium transition-colors",
        selected
          ? "border-brand bg-brand-soft text-brand"
          : "border-line bg-white text-ink hover:border-brand hover:bg-brand-soft",
      )}
    >
      <Icon className="h-5 w-5 shrink-0" />
      {label}
    </button>
  );
};
