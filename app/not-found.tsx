"use client";

import { useRouter } from "next/navigation";
import { SearchX } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useT } from "@/lib/i18n/provider";

/** 404 page shown when a route doesn't match any page. */
const NotFoundPage = () => {
  const t = useT();
  const router = useRouter();

  return (
    <main className="flex flex-1 items-center justify-center px-4 py-12">
      <Card className="w-full max-w-sm text-center">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-soft text-brand">
          <SearchX className="h-6 w-6" />
        </span>
        <h1 className="mt-4 text-xl font-semibold text-ink">
          {t("notFound.title")}
        </h1>
        <p className="mt-1 text-sm text-muted">{t("notFound.subtitle")}</p>

        <Button className="mt-6 w-full" onClick={() => router.push("/welcome")}>
          {t("notFound.backHome")}
        </Button>
      </Card>
    </main>
  );
};

export default NotFoundPage;
