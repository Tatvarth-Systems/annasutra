"use client";

import { useEffect } from "react";
import { TriangleAlert } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useT } from "@/lib/i18n/provider";

/** Error boundary shown when a route segment throws an unhandled error. */
const ErrorBoundary = ({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) => {
  const t = useT();

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex flex-1 items-center justify-center px-4 py-12">
      <Card className="w-full max-w-sm text-center">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-soft text-brand">
          <TriangleAlert className="h-6 w-6" />
        </span>

        <h1 className="mt-4 text-xl font-semibold text-ink">
          {t("error.title")}
        </h1>
        <p className="mt-1 text-sm text-muted">{t("error.subtitle")}</p>

        <Button className="mt-6 w-full" onClick={() => unstable_retry()}>
          {t("error.retry")}
        </Button>
      </Card>
    </main>
  );
};

export default ErrorBoundary;
