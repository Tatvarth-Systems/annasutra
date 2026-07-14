"use client";

import { useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  CalendarClock,
  ClipboardCheck,
  Download,
  Loader2,
  MapPin,
  Pencil,
  Share2,
  User,
} from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import { CUSTOM_ITEM_ID } from "@/data/catalog";
import { toLocaleDigits } from "@/lib/i18n/numerals";
import { useLocale, useT } from "@/lib/i18n/provider";
import { CATEGORY_ICONS } from "@/lib/order/categoryIcons";
import { useOrderDraft } from "@/lib/order/useOrderDraft";
import { useOrderStepGuard } from "@/lib/order/useOrderStepGuard";
import { withQty } from "@/lib/order/visibleItems";
import { generateOrderPdf, shareOrderPdf } from "@/lib/pdf/generateOrderPdf";
import { formatDateDisplay, formatTimeDisplay } from "@/lib/utils/date";
import {
  canShareFiles,
  getShareSupportServerSnapshot,
  isIOSWebKit,
  subscribeToShareSupport,
} from "@/lib/utils/platform";

/** Order review page with PDF download and WhatsApp share functionality. */
const ReviewPage = () => {
  const t = useT();
  const locale = useLocale();
  const router = useRouter();
  const { client, categoryId, items, resetAfterDownload } = useOrderDraft();
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [shareError, setShareError] = useState(false);
  const canShare = useSyncExternalStore(
    subscribeToShareSupport,
    canShareFiles,
    getShareSupportServerSnapshot,
  );

  const ready = useOrderStepGuard("review", { client, categoryId, items });
  const visibleItems = withQty(items);

  if (!ready || !client || !categoryId || visibleItems.length === 0)
    return null;

  const CategoryIcon = CATEGORY_ICONS[categoryId];

  /** Generates PDF, resets draft, and navigates back to category page. */
  const handleDownload = async () => {
    if (!client || !categoryId) return;

    // Only needed as a fallback for iOS versions without Web Share file support (see
    // generateOrderPdf); opened synchronously, before any await, so it stays tied to the
    // user gesture and isn't popup-blocked.
    const iosWindow =
      isIOSWebKit() && !canShareFiles() ? window.open("", "_blank") : null;

    setError(false);
    setDownloading(true);
    try {
      await generateOrderPdf({
        client,
        categoryId,
        items,
        t,
        locale,
        iosWindow,
      });
      resetAfterDownload();
      router.replace("/order/category");
    } catch (err) {
      iosWindow?.close();
      if (err instanceof Error && err.name === "AbortError") return;
      setError(true);
    } finally {
      setDownloading(false);
    }
  };

  /** Generates PDF, hands it to the OS share sheet, resets draft, and navigates back to category page. */
  const handleShare = async () => {
    if (!client || !categoryId) return;

    setShareError(false);
    setSharing(true);
    try {
      await shareOrderPdf({ client, categoryId, items, t, locale });
      resetAfterDownload();
      router.replace("/order/category");
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") return;
      setShareError(true);
    } finally {
      setSharing(false);
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
            {toLocaleDigits(formatDateDisplay(client.eventDate), locale)} ·{" "}
            {toLocaleDigits(formatTimeDisplay(client.eventTime), locale)}
          </dd>

          <dt className="flex items-center gap-1.5 text-muted">
            <CategoryIcon className="h-4 w-4" />
            {t("review.category")}
          </dt>
          <dd className="text-ink">{t(`category.${categoryId}`)}</dd>
        </dl>

        <p className="mt-4 text-sm font-medium text-ink">
          {t("review.itemCount", { count: visibleItems.length })}
        </p>

        <ul className="mt-2 divide-y divide-line overflow-hidden rounded-md border border-line">
          {visibleItems.map((item) => (
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
                {toLocaleDigits(item.qty, locale)} {t(`unit.${item.unit}`)}
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
        {shareError && (
          <p className="mt-4 flex items-center gap-1.5 text-sm text-danger">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {t("review.shareError")}
          </p>
        )}

        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-end">
          <Button
            variant="secondary"
            className="w-full sm:w-auto"
            onClick={() => router.push("/order/items")}
          >
            <Pencil className="h-4 w-4" />
            {t("review.edit")}
          </Button>
          {canShare && (
            <Button
              variant="secondary"
              className="w-full sm:w-auto"
              onClick={handleShare}
              disabled={sharing || downloading}
            >
              {sharing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Share2 className="h-4 w-4" />
              )}
              {sharing ? t("review.sharing") : t("review.shareWhatsapp")}
            </Button>
          )}
          <Button
            className="w-full sm:w-auto"
            onClick={handleDownload}
            disabled={downloading || sharing}
          >
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
