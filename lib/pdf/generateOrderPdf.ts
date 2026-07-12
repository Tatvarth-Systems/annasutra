import type { CategoryId } from "@/data/categories";
import type { Locale } from "@/lib/i18n/config";
import type { TFunction } from "@/lib/i18n/provider";
import type { ClientDetails, OrderItem } from "@/lib/order/types";

import { BUSINESS } from "@/config/business";
import { CUSTOM_ITEM_ID } from "@/data/catalog";
import { toLocaleDigits } from "@/lib/i18n/numerals";
import { buildPdfFilename } from "@/lib/pdf/filename";
import { ensureCanvasFontLoaded, rasterizeText } from "@/lib/pdf/rasterizeText";
import { formatDateDisplay, formatTimeDisplay } from "@/lib/utils/date";

type GenerateOrderPdfArgs = {
  client: ClientDetails;
  categoryId: CategoryId;
  items: OrderItem[];
  t: TFunction;
  locale: Locale;
};

const BRAND_RGB: [number, number, number] = [194, 65, 12];
const BRAND_SOFT_RGB: [number, number, number] = [255, 247, 237];
const STRIPE_RGB: [number, number, number] = [247, 246, 244];
const INK_RGB: [number, number, number] = [28, 25, 23];
const MUTED_RGB: [number, number, number] = [120, 113, 108];
const LINE_RGB: [number, number, number] = [231, 229, 228];

const FONT_FAMILY = "NotoSansDevanagari";

/**
 * Registers Noto Sans Devanagari for autotable's column width/wrap math in mr mode only.
 * jsPDF's own vector text renderer mis-parses this font's Latin glyphs (digits/# render,
 * letters don't) — a jsPDF TTF-parsing quirk, not a shaping issue — so actual painted text
 * always uses "helvetica" for en and rasterized canvas images for mr; this font is never
 * used to paint a visible glyph directly via doc.text().
 */
const registerFont = async (doc: import("jspdf").jsPDF): Promise<void> => {
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
  doc: import("jspdf").jsPDF,
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

/** Generates and downloads an order PDF with client details, items, and letterhead. */
export const generateOrderPdf = async ({
  client,
  categoryId,
  items,
  t,
  locale,
}: GenerateOrderPdfArgs): Promise<void> => {
  const { jsPDF } = await import("jspdf");
  const { default: autoTable } = await import("jspdf-autotable");

  const doc = new jsPDF({ unit: "pt", format: "a4" });
  if (locale === "mr") {
    await registerFont(doc);
    await ensureCanvasFontLoaded();
  }
  const pageWidth = doc.internal.pageSize.getWidth();
  const marginX = 40;
  let cursorY = 48;

  // Letterhead (always Latin — business name/address, not translated)
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(...BRAND_RGB);
  doc.text(BUSINESS.name, marginX, cursorY);
  cursorY += 16;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...MUTED_RGB);
  doc.text(`${BUSINESS.proprietor} · ${BUSINESS.address}`, marginX, cursorY);
  cursorY += 13;
  doc.text(BUSINESS.phones.join(" / "), marginX, cursorY);
  cursorY += 18;

  doc.setDrawColor(...LINE_RGB);
  doc.line(marginX, cursorY, pageWidth - marginX, cursorY);
  cursorY += 22;

  // Document title band: order sheet + category
  const bandHeight = 30;
  doc.setFillColor(...BRAND_RGB);
  doc.roundedRect(
    marginX,
    cursorY,
    pageWidth - marginX * 2,
    bandHeight,
    4,
    4,
    "F",
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
  cursorY += bandHeight + 18;

  // Client & event info card
  const infoLines: string[] = [`${t("pdf.client")}: ${client.clientName}`];
  const eventType = eventTypeLabel(client, t);
  if (eventType) infoLines.push(`${t("client.eventType")}: ${eventType}`);
  infoLines.push(`${t("pdf.venue")}: ${client.eventVenue}`);
  infoLines.push(
    `${t("pdf.date")}: ${toLocaleDigits(formatDateDisplay(client.eventDate), locale)}    ${t("pdf.time")}: ${toLocaleDigits(formatTimeDisplay(client.eventTime), locale)}`,
  );
  if (client.guestCount) {
    infoLines.push(
      `${t("pdf.guests")}: ${toLocaleDigits(client.guestCount, locale)}`,
    );
  }

  const cardPadding = 12;
  const infoLineHeight = 16;
  const cardHeight = cardPadding * 2 + infoLineHeight * infoLines.length;

  doc.setFillColor(...BRAND_SOFT_RGB);
  doc.roundedRect(
    marginX,
    cursorY,
    pageWidth - marginX * 2,
    cardHeight,
    6,
    6,
    "F",
  );

  let infoY = cursorY + cardPadding + 10;
  for (const line of infoLines) {
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
  cursorY += cardHeight + 22;

  // Item count
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
  cursorY += 12;

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

  autoTable(doc, {
    startY: cursorY,
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
      font: locale === "mr" ? FONT_FAMILY : "helvetica",
      fontStyle: "bold",
    },
    styles: {
      fontSize: 10,
      textColor: INK_RGB,
      font: locale === "mr" ? FONT_FAMILY : "helvetica",
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

  const filename = buildPdfFilename(client, categoryId, t, locale);
  const blobUrl = URL.createObjectURL(doc.output("blob"));
  const anchor = document.createElement("a");
  anchor.href = blobUrl;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(blobUrl);
};
