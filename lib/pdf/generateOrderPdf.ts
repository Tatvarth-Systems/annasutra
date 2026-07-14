import type { CategoryId } from "@/data/categories";
import type { Locale } from "@/lib/i18n/config";
import type { TFunction } from "@/lib/i18n/provider";
import type { ClientDetails, OrderItem } from "@/lib/order/types";

import { BUSINESS, BUSINESS_PHONES } from "@/config/business";
import { CUSTOM_ITEM_ID } from "@/data/catalog";
import { toLocaleDigits } from "@/lib/i18n/numerals";
import { buildPdfFilename } from "@/lib/pdf/filename";
import { ensureCanvasFontLoaded, rasterizeText } from "@/lib/pdf/rasterizeText";
import { formatDateDisplay, formatTimeDisplay } from "@/lib/utils/date";
import { canShareFiles, isIOSWebKit } from "@/lib/utils/platform";

type GenerateOrderPdfArgs = {
  client: ClientDetails;
  categoryId: CategoryId;
  items: OrderItem[];
  t: TFunction;
  locale: Locale;
  iosWindow?: Window | null;
};

type PdfDoc = import("jspdf").jsPDF;
type AutoTable = (typeof import("jspdf-autotable"))["default"];

const BRAND_RGB: [number, number, number] = [194, 65, 12];
const BRAND_SOFT_RGB: [number, number, number] = [255, 247, 237];
const STRIPE_RGB: [number, number, number] = [247, 246, 244];
const INK_RGB: [number, number, number] = [28, 25, 23];
const MUTED_RGB: [number, number, number] = [120, 113, 108];
const LINE_RGB: [number, number, number] = [231, 229, 228];

const FONT_FAMILY = "NotoSansDevanagari";
const MARGIN_X = 40;
const BLOB_REVOKE_DELAY_MS = 40000;

/** Registers Noto Sans Devanagari for autotable's column width/wrap math only — jsPDF mis-parses this font's Latin glyphs, so visible text is always painted via helvetica (en) or a rasterized canvas image (mr). */
const registerFont = async (doc: PdfDoc): Promise<void> => {
  const { NOTO_SANS_DEVANAGARI_REGULAR, NOTO_SANS_DEVANAGARI_BOLD } =
    await import("@/lib/pdf/fonts/notoSansDevanagari");
  doc.addFileToVFS(
    "NotoSansDevanagari-Regular.ttf",
    NOTO_SANS_DEVANAGARI_REGULAR,
  );
  doc.addFont("NotoSansDevanagari-Regular.ttf", FONT_FAMILY, "normal");
  doc.addFileToVFS("NotoSansDevanagari-Bold.ttf", NOTO_SANS_DEVANAGARI_BOLD);
  doc.addFont("NotoSansDevanagari-Bold.ttf", FONT_FAMILY, "bold");
};

/** Gets event type label translation if event type is set. */
const eventTypeLabel = (client: ClientDetails, t: TFunction): string | null => {
  if (!client.eventType) return null;
  const key = `client.eventType${client.eventType.charAt(0).toUpperCase()}${client.eventType.slice(1)}`;
  return t(key);
};

type Align = "left" | "center" | "right";

/** Draws text via jsPDF's vector renderer for en, or a canvas-rasterized image for mr — jsPDF has no OpenType shaping engine, so Devanagari matras/conjuncts render incorrectly as plain vector glyphs. */
const drawText = (
  doc: PdfDoc,
  locale: Locale,
  text: string,
  x: number,
  y: number,
  fontSize: number,
  weight: "normal" | "bold",
  color: [number, number, number],
  align: Align = "left",
): void => {
  if (locale !== "mr") {
    doc.setFont("helvetica", weight);
    doc.setFontSize(fontSize);
    doc.setTextColor(...color);
    doc.text(text, x, y, { align });
    return;
  }
  const { dataUrl, widthPt, heightPt } = rasterizeText(
    text,
    fontSize,
    weight,
    color,
  );
  const drawX =
    align === "right" ? x - widthPt : align === "center" ? x - widthPt / 2 : x;
  doc.addImage(dataUrl, "PNG", drawX, y - heightPt * 0.72, widthPt, heightPt);
};

/** Normalizes an autotable cell color style down to an RGB tuple. */
const toRgbTuple = (
  color: unknown,
  fallback: [number, number, number],
): [number, number, number] => {
  return Array.isArray(color) && color.length === 3
    ? (color as [number, number, number])
    : fallback;
};

/** Fills a rounded rectangle band, shared by the title band and the info card. */
const drawRoundedBand = (
  doc: PdfDoc,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
  color: [number, number, number],
): void => {
  doc.setFillColor(...color);
  doc.roundedRect(x, y, width, height, radius, radius, "F");
};

/** Draws the business letterhead (name/proprietor/address/phone) and a divider line, returns the updated cursorY. */
const drawLetterhead = (
  doc: PdfDoc,
  locale: Locale,
  marginX: number,
  pageWidth: number,
  cursorY: number,
): number => {
  const business = BUSINESS[locale];
  let y = cursorY;

  drawText(doc, locale, business.name, marginX, y, 18, "bold", BRAND_RGB);
  y += 16;

  drawText(
    doc,
    locale,
    `${business.proprietor} · ${business.address}`,
    marginX,
    y,
    9,
    "normal",
    MUTED_RGB,
  );
  y += 13;
  drawText(
    doc,
    locale,
    toLocaleDigits(BUSINESS_PHONES.join(" / "), locale),
    marginX,
    y,
    9,
    "normal",
    MUTED_RGB,
  );
  y += 18;

  doc.setDrawColor(...LINE_RGB);
  doc.line(marginX, y, pageWidth - marginX, y);
  return y + 22;
};

/** Draws the order-sheet title band (order sheet + category), returns the updated cursorY. */
const drawTitleBand = (
  doc: PdfDoc,
  locale: Locale,
  t: TFunction,
  categoryId: CategoryId,
  marginX: number,
  contentWidth: number,
  cursorY: number,
): number => {
  const bandHeight = 30;
  drawRoundedBand(
    doc,
    marginX,
    cursorY,
    contentWidth,
    bandHeight,
    4,
    BRAND_RGB,
  );
  drawText(
    doc,
    locale,
    `${t("pdf.orderSheet")} — ${t(`category.${categoryId}`)}`,
    marginX + 10,
    cursorY + bandHeight / 2 + 4,
    13,
    "bold",
    [255, 255, 255],
  );
  return cursorY + bandHeight + 18;
};

/** Builds the client/event summary lines shown in the info card. */
const buildInfoLines = (
  client: ClientDetails,
  t: TFunction,
  locale: Locale,
): string[] => {
  const lines: string[] = [`${t("pdf.client")}: ${client.clientName}`];
  const eventType = eventTypeLabel(client, t);
  if (eventType) lines.push(`${t("client.eventType")}: ${eventType}`);
  lines.push(`${t("pdf.venue")}: ${client.eventVenue}`);
  lines.push(
    `${t("pdf.date")}: ${toLocaleDigits(formatDateDisplay(client.eventDate), locale)}    ${t("pdf.time")}: ${toLocaleDigits(formatTimeDisplay(client.eventTime), locale)}`,
  );
  if (client.guestCount) {
    lines.push(
      `${t("pdf.guests")}: ${toLocaleDigits(client.guestCount, locale)}`,
    );
  }
  return lines;
};

/** Draws the client/event info card, returns the updated cursorY. */
const drawInfoCard = (
  doc: PdfDoc,
  locale: Locale,
  lines: string[],
  marginX: number,
  contentWidth: number,
  cursorY: number,
): number => {
  const cardPadding = 12;
  const infoLineHeight = 16;
  const cardHeight = cardPadding * 2 + infoLineHeight * lines.length;

  drawRoundedBand(
    doc,
    marginX,
    cursorY,
    contentWidth,
    cardHeight,
    6,
    BRAND_SOFT_RGB,
  );

  let infoY = cursorY + cardPadding + 10;
  for (const line of lines) {
    drawText(
      doc,
      locale,
      line,
      marginX + cardPadding,
      infoY,
      11,
      "normal",
      INK_RGB,
    );
    infoY += infoLineHeight;
  }
  return cursorY + cardHeight + 22;
};

/** Draws the item count line and the itemized table, rasterizing cell text for mr. */
const drawItemsTable = (
  doc: PdfDoc,
  autoTable: AutoTable,
  locale: Locale,
  t: TFunction,
  items: OrderItem[],
  marginX: number,
  cursorY: number,
): void => {
  drawText(
    doc,
    locale,
    t("pdf.itemCount", { count: items.length }),
    marginX,
    cursorY,
    11,
    "bold",
    INK_RGB,
  );

  const body = items.map((item, index) => [
    toLocaleDigits(index + 1, locale),
    item.itemId === CUSTOM_ITEM_ID
      ? (item.customName ?? "")
      : t(`item.${item.itemId}`),
    toLocaleDigits(item.qty, locale),
    t(`unit.${item.unit}`),
    item.note ?? "",
  ]);

  let pendingCellText: string[] | null = null;
  const tableFont = locale === "mr" ? FONT_FAMILY : "helvetica";

  autoTable(doc, {
    startY: cursorY + 12,
    margin: { left: marginX, right: marginX },
    head: [
      [
        t("pdf.columnIndex"),
        t("pdf.columnItem"),
        t("pdf.columnQty"),
        t("pdf.columnUnit"),
        t("pdf.columnNote"),
      ],
    ],
    body,
    theme: "grid",
    headStyles: {
      fillColor: BRAND_RGB,
      textColor: [255, 255, 255],
      font: tableFont,
      fontStyle: "bold",
    },
    styles: {
      fontSize: 10,
      textColor: INK_RGB,
      font: tableFont,
    },
    alternateRowStyles: { fillColor: STRIPE_RGB },
    // font/styles above still drive autotable's own width/wrap math (glyph metrics are
    // fine, only visual shaping is broken) — willDrawCell/didDrawCell below swap the
    // actual painted glyphs for a rasterized image when locale is mr.
    willDrawCell: (data) => {
      if (locale === "mr") {
        pendingCellText = data.cell.text;
        data.cell.text = [];
      }
    },
    didDrawCell: (data) => {
      if (locale !== "mr" || !pendingCellText) return;
      const lines = pendingCellText;
      pendingCellText = null;

      const fontSize = data.cell.styles.fontSize;
      const weight: "normal" | "bold" =
        data.cell.styles.fontStyle === "bold" ? "bold" : "normal";
      const color = toRgbTuple(data.cell.styles.textColor, INK_RGB);
      const align = data.cell.styles.halign as Align;

      const lineHeight = fontSize * 1.15;
      const blockHeight = lineHeight * lines.length;
      let lineY =
        data.cell.y + (data.cell.height - blockHeight) / 2 + fontSize * 0.85;

      const leftX = data.cell.x + data.cell.padding("left");
      const rightX = data.cell.x + data.cell.width - data.cell.padding("right");
      const centerX = data.cell.x + data.cell.width / 2;
      const drawX =
        align === "right" ? rightX : align === "center" ? centerX : leftX;

      for (const line of lines) {
        if (line)
          drawText(
            doc,
            locale,
            line,
            drawX,
            lineY,
            fontSize,
            weight,
            color,
            align,
          );
        lineY += lineHeight;
      }
    },
    columnStyles: {
      0: { cellWidth: 28, halign: "center" },
      2: { cellWidth: 50, halign: "right" },
      3: { cellWidth: 70, halign: "center" },
    },
  });
};

/** Stamps the generated-on timestamp and page numbers on every page. */
const drawFooter = (
  doc: PdfDoc,
  locale: Locale,
  t: TFunction,
  marginX: number,
  pageWidth: number,
): void => {
  const totalPages = doc.getNumberOfPages();
  const generatedOn = new Date().toLocaleString();
  const pageHeight = doc.internal.pageSize.getHeight();

  for (let page = 1; page <= totalPages; page += 1) {
    doc.setPage(page);
    drawText(
      doc,
      locale,
      t("pdf.generatedOn", { date: generatedOn }),
      marginX,
      pageHeight - 20,
      8,
      "normal",
      MUTED_RGB,
    );
    drawText(
      doc,
      locale,
      toLocaleDigits(`${page} / ${totalPages}`, locale),
      pageWidth - marginX,
      pageHeight - 20,
      8,
      "normal",
      MUTED_RGB,
      "right",
    );
  }
};

/** Shares or downloads the finished PDF, branching for Web Share, iOS Safari's blob-URL workaround, and a plain anchor download. */
const outputPdf = async (
  doc: PdfDoc,
  filename: string,
  iosWindow: Window | null | undefined,
): Promise<void> => {
  if (isIOSWebKit() && canShareFiles()) {
    // Web Share hands the OS a real named File, so Share > Save to Files gets the correct
    // name — unlike navigating to a blob: URL, which carries no filename metadata at all.
    const file = new File([doc.output("blob")], filename, {
      type: "application/pdf",
    });
    await navigator.share({ files: [file] });
    return;
  }

  if (iosWindow) {
    // Fallback for iOS versions without Web Share file support: iOS/iPadOS WebKit ignores
    // the download attribute on blob URLs (still-open WebKit bug:
    // https://bugs.webkit.org/show_bug.cgi?id=167341), so a plain navigation is used
    // instead. Safari 14+ blocks top-level JS navigation to data: URLs (anti-phishing), so
    // blob: is used instead of a data URI — renders fine, but the filename isn't preserved.
    const iosBlobUrl = URL.createObjectURL(doc.output("blob"));
    iosWindow.location.href = iosBlobUrl;
    setTimeout(() => URL.revokeObjectURL(iosBlobUrl), BLOB_REVOKE_DELAY_MS);
    return;
  }

  const blobUrl = URL.createObjectURL(doc.output("blob"));
  const anchor = document.createElement("a");
  anchor.href = blobUrl;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  // Revoking immediately races the browser's async download handoff and can invalidate
  // the blob before the download starts; delay it (matches FileSaver.js's own 40s precedent).
  setTimeout(() => URL.revokeObjectURL(blobUrl), BLOB_REVOKE_DELAY_MS);
};

type BuildPdfArgs = Omit<GenerateOrderPdfArgs, "iosWindow">;

/** Draws the full order PDF (letterhead, title band, info card, items table, footer) and returns the doc plus its filename. */
const buildPdfDocument = async ({
  client,
  categoryId,
  items,
  t,
  locale,
}: BuildPdfArgs): Promise<{ doc: PdfDoc; filename: string }> => {
  const { jsPDF } = await import("jspdf");
  const { default: autoTable } = await import("jspdf-autotable");

  const doc = new jsPDF({ unit: "pt", format: "a4" });
  if (locale === "mr") {
    await registerFont(doc);
    await ensureCanvasFontLoaded();
  }
  const pageWidth = doc.internal.pageSize.getWidth();
  const contentWidth = pageWidth - MARGIN_X * 2;

  let cursorY = drawLetterhead(doc, locale, MARGIN_X, pageWidth, 48);
  cursorY = drawTitleBand(
    doc,
    locale,
    t,
    categoryId,
    MARGIN_X,
    contentWidth,
    cursorY,
  );
  cursorY = drawInfoCard(
    doc,
    locale,
    buildInfoLines(client, t, locale),
    MARGIN_X,
    contentWidth,
    cursorY,
  );
  drawItemsTable(doc, autoTable, locale, t, items, MARGIN_X, cursorY);
  drawFooter(doc, locale, t, MARGIN_X, pageWidth);

  const filename = buildPdfFilename(client, categoryId, t, locale);
  return { doc, filename };
};

/** Generates and downloads an order PDF with client details, items, and letterhead. */
export const generateOrderPdf = async ({
  iosWindow,
  ...args
}: GenerateOrderPdfArgs): Promise<void> => {
  const { doc, filename } = await buildPdfDocument(args);
  await outputPdf(doc, filename, iosWindow);
};

/** Generates an order PDF and hands it to the OS share sheet (e.g. WhatsApp) via the Web Share API. */
export const shareOrderPdf = async (args: BuildPdfArgs): Promise<void> => {
  const { doc, filename } = await buildPdfDocument(args);
  const file = new File([doc.output("blob")], filename, {
    type: "application/pdf",
  });
  await navigator.share({ files: [file] });
};
