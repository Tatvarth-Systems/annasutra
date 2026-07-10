"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  CalendarClock,
  ClipboardCheck,
  Download,
  Loader2,
  MapPin,
  Pencil,
  User,
} from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import { CUSTOM_ITEM_ID } from "@/data/catalog";
import { useT } from "@/lib/i18n/provider";
import { CATEGORY_ICONS } from "@/lib/order/categoryIcons";
import { useOrderDraft } from "@/lib/order/useOrderDraft";
import { generateOrderPdf } from "@/lib/pdf/generateOrderPdf";
import { formatDateDisplay, formatTimeDisplay } from "@/lib/utils/date";

/** Order review page with PDF download functionality. */
const ReviewPage = () => {
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

  const CategoryIcon = CATEGORY_ICONS[categoryId];

  /** Generates PDF, resets draft, and navigates back to category page. */
  const handleDownload = async () => {
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
  };

  return (
    <div>
      <PageHeader
        title={t("review.title")}
        description={t("review.subtitle")}
        icon={ClipboardCheck}
      />

      <Card>
        <dl className="grid grid-cols-[auto_1fr] items-center gap-x-4 gap-y-3 text-sm">
          <dt className="flex items-center gap-1.5 text-muted">
            <User className="h-4 w-4" />
            {t("review.client")}
          </dt>
          <dd className="text-ink">{client.clientName}</dd>

          <dt className="flex items-center gap-1.5 text-muted">
            <MapPin className="h-4 w-4" />
            {t("review.venue")}
          </dt>
          <dd className="text-ink">{client.eventVenue}</dd>

          <dt className="flex items-center gap-1.5 text-muted">
            <CalendarClock className="h-4 w-4" />
            {t("review.dateTime")}
          </dt>
          <dd className="text-ink">
            {formatDateDisplay(client.eventDate)} ·{" "}
            {formatTimeDisplay(client.eventTime)}
          </dd>

          <dt className="flex items-center gap-1.5 text-muted">
            <CategoryIcon className="h-4 w-4" />
            {t("review.category")}
          </dt>
          <dd className="text-ink">{t(`category.${categoryId}`)}</dd>
        </dl>

        <p className="mt-4 text-sm font-medium text-ink">
          {t("review.itemCount", { count: items.length })}
        </p>

        <ul className="mt-2 divide-y divide-line overflow-hidden rounded-md border border-line">
          {items.map((item) => (
            <li
              key={item.uid}
              className="flex items-center justify-between gap-3 px-4 py-2 text-sm odd:bg-white even:bg-line/20"
            >
              <div className="min-w-0">
                <p className="truncate text-ink">
                  {item.itemId === CUSTOM_ITEM_ID
                    ? item.customName
                    : t(`item.${item.itemId}`)}
                </p>
                {item.note && (
                  <p className="truncate text-xs text-muted">{item.note}</p>
                )}
              </div>
              <span className="shrink-0 text-muted">
                {item.qty} {t(`unit.${item.unit}`)}
              </span>
            </li>
          ))}
        </ul>

        {error && (
          <p className="mt-4 flex items-center gap-1.5 text-sm text-danger">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {t("review.downloadError")}
          </p>
        )}

        <div className="mt-6 flex justify-end gap-2">
          <Button
            variant="secondary"
            onClick={() => router.push("/order/items")}
          >
            <Pencil className="h-4 w-4" />
            {t("review.edit")}
          </Button>
          <Button onClick={handleDownload} disabled={downloading}>
            {downloading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            {downloading ? t("review.generating") : t("review.download")}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ReviewPage;
