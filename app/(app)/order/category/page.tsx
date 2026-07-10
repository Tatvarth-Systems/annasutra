"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LayoutGrid, UserPlus } from "lucide-react";
import { useT } from "@/lib/i18n/provider";
import { useOrderDraft } from "@/lib/order/useOrderDraft";
import { CATEGORIES } from "@/data/categories";
import { CATEGORY_ICONS } from "@/lib/order/categoryIcons";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { CategoryCard } from "@/components/order/CategoryCard";
import { ClientSummary } from "@/components/order/ClientSummary";

export default function CategoryPage() {
  const t = useT();
  const router = useRouter();
  const { client, categoryId, setCategory, startNewClient } = useOrderDraft();

  useEffect(() => {
    if (!client) {
      router.replace("/order/client");
    }
  }, [client, router]);

  if (!client) return null;

  function handleSelect(id: (typeof CATEGORIES)[number]["id"]) {
    setCategory(id);
    router.push("/order/items");
  }

  function handleNewClient() {
    startNewClient();
    router.push("/order/client");
  }

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

      <ClientSummary client={client} />

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
}
