import { cn } from "@/lib/utils/cn";

type CategoryCardProps = {
  label: string;
  selected?: boolean;
  onClick: () => void;
};

export function CategoryCard({ label, selected, onClick }: CategoryCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-lg border p-4 text-left text-sm font-medium transition-colors",
        selected
          ? "border-brand bg-brand-soft text-brand"
          : "border-line bg-white text-ink hover:border-brand hover:bg-brand-soft",
      )}
    >
      {label}
    </button>
  );
}
