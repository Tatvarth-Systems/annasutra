"use client";

import { useRouter } from "next/navigation";
import { LayoutGrid, UserPlus } from "lucide-react";

import { CategoryCard } from "@/components/order/CategoryCard";
import { ClientSummary } from "@/components/order/ClientSummary";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/PageHeader";
import { CATEGORIES } from "@/data/categories";
import { useT } from "@/lib/i18n/provider";
import { CATEGORY_ICONS } from "@/lib/order/categoryIcons";
import { useOrderDraft } from "@/lib/order/useOrderDraft";
import { useOrderStepGuard } from "@/lib/order/useOrderStepGuard";

/** Category selection page with redirect to client page if no client. */
const CategoryPage = () => {
  const t = useT();
  const router = useRouter();
  const { client, categoryId, items, setCategory, startNewClient } =
    useOrderDraft();
  const ready = useOrderStepGuard("category", { client, categoryId, items });

  if (!ready || !client) return null;

  /** Sets category and navigates to items page. */
  const handleSelect = (id: (typeof CATEGORIES)[number]["id"]) => {
    setCategory(id);
    router.push("/order/items");
  };

  /** Clears draft and returns to client entry. */
  const handleNewClient = () => {
    startNewClient();
    router.push("/order/client");
  };

  return (
    <div>
      <PageHeader
        title={t("category.title")}
        description={t("category.subtitle", { name: client.clientName })}
        icon={LayoutGrid}
        action={
          <Button variant="secondary" onClick={handleNewClient}>
            <UserPlus className="h-4 w-4" />
            {t("category.newClient")}
          </Button>
        }
      />

      <ClientSummary
        client={client}
        onEdit={() => router.push("/order/client")}
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {CATEGORIES.map((category) => (
          <CategoryCard
            key={category.id}
            label={t(`category.${category.id}`)}
            icon={CATEGORY_ICONS[category.id]}
            selected={category.id === categoryId}
            onClick={() => handleSelect(category.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default CategoryPage;
