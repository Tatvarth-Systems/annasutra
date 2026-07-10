"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useT } from "@/lib/i18n/provider";
import { useOrderDraft } from "@/lib/order/useOrderDraft";
import { CUSTOM_ITEM_ID } from "@/data/catalog";
import { generateOrderPdf } from "@/lib/pdf/generateOrderPdf";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function ReviewPage() {
  const t = useT();
  const router = useRouter();
  const { client, categoryId, items, resetAfterDownload } = useOrderDraft();
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!client) {
      router.replace("/order/client");
    } else if (!categoryId) {
      router.replace("/order/category");
    } else if (items.length === 0) {
      router.replace("/order/items");
    }
  }, [client, categoryId, items, router]);

  if (!client || !categoryId || items.length === 0) return null;

  async function handleDownload() {
    if (!client || !categoryId) return;

    setError(false);
    setDownloading(true);
    try {
      await generateOrderPdf({
        client,
        categoryId,
        items,
        t,
      });
      resetAfterDownload();
      router.replace("/order/category");
    } catch {
      setError(true);
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div>
      <PageHeader
        title={t("review.title")}
        description={t("review.subtitle")}
      />

      <Card>
        <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
          <dt className="text-muted">{t("review.client")}</dt>
          <dd className="text-ink">{client.clientName}</dd>

          <dt className="text-muted">{t("review.venue")}</dt>
          <dd className="text-ink">{client.eventVenue}</dd>

          <dt className="text-muted">{t("review.dateTime")}</dt>
          <dd className="text-ink">
            {client.eventDate} · {client.eventTime}
          </dd>

          <dt className="text-muted">{t("review.category")}</dt>
          <dd className="text-ink">{t(`category.${categoryId}`)}</dd>
        </dl>

        <p className="mt-4 text-sm font-medium text-ink">
          {t("review.itemCount", { count: items.length })}
        </p>

        <ul className="mt-2 divide-y divide-line rounded-md border border-line">
          {items.map((item) => (
            <li
              key={item.uid}
              className="flex items-center justify-between px-4 py-2 text-sm"
            >
              <span className="text-ink">
                {item.itemId === CUSTOM_ITEM_ID
                  ? item.customName
                  : t(`item.${item.itemId}`)}
              </span>
              <span className="text-muted">
                {item.qty} {t(`unit.${item.unit}`)}
              </span>
            </li>
          ))}
        </ul>

        {error ? (
          <p className="mt-4 text-sm text-danger">
            {t("review.downloadError")}
          </p>
        ) : null}

        <div className="mt-6 flex justify-end gap-2">
          <Button
            variant="secondary"
            onClick={() => router.push("/order/items")}
          >
            {t("review.edit")}
          </Button>
          <Button onClick={handleDownload} disabled={downloading}>
            {downloading ? t("review.generating") : t("review.download")}
          </Button>
        </div>
      </Card>
    </div>
  );
}
