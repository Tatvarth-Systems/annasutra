import type { ClientDetails, OrderItem } from "@/lib/order/types";
import type { CategoryId } from "@/data/categories";
import { CUSTOM_ITEM_ID } from "@/data/catalog";
import { BUSINESS } from "@/config/business";
import { buildPdfFilename } from "@/lib/pdf/filename";
import { formatDateDisplay, formatTimeDisplay } from "@/lib/utils/date";
import type { TFunction } from "@/lib/i18n/provider";

type GenerateOrderPdfArgs = {
  client: ClientDetails;
  categoryId: CategoryId;
  items: OrderItem[];
  t: TFunction;
};

const BRAND_RGB: [number, number, number] = [194, 65, 12];
const BRAND_SOFT_RGB: [number, number, number] = [255, 247, 237];
const STRIPE_RGB: [number, number, number] = [247, 246, 244];
const INK_RGB: [number, number, number] = [28, 25, 23];
const MUTED_RGB: [number, number, number] = [120, 113, 108];
const LINE_RGB: [number, number, number] = [231, 229, 228];

function eventTypeLabel(client: ClientDetails, t: TFunction): string | null {
  if (!client.eventType) return null;
  const key = `client.eventType${client.eventType.charAt(0).toUpperCase()}${client.eventType.slice(1)}`;
  return t(key);
}

export async function generateOrderPdf({
  client,
  categoryId,
  items,
  t,
}: GenerateOrderPdfArgs): Promise<void> {
  const { jsPDF } = await import("jspdf");
  const { default: autoTable } = await import("jspdf-autotable");

  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const marginX = 40;
  let cursorY = 48;

  // Letterhead
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
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(255, 255, 255);
  doc.text(
    `${t("pdf.orderSheet")} — ${t(`category.${categoryId}`)}`,
    marginX + 10,
    cursorY + bandHeight / 2 + 4,
  );
  cursorY += bandHeight + 18;

  // Client & event info card
  const infoLines: string[] = [`${t("pdf.client")}: ${client.clientName}`];
  const eventType = eventTypeLabel(client, t);
  if (eventType) infoLines.push(`${t("client.eventType")}: ${eventType}`);
  infoLines.push(`${t("pdf.venue")}: ${client.eventVenue}`);
  infoLines.push(
    `${t("pdf.date")}: ${formatDateDisplay(client.eventDate)}    ${t("pdf.time")}: ${formatTimeDisplay(client.eventTime)}`,
  );
  if (client.guestCount) {
    infoLines.push(`${t("pdf.guests")}: ${client.guestCount}`);
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

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(...INK_RGB);
  let infoY = cursorY + cardPadding + 10;
  for (const line of infoLines) {
    doc.text(line, marginX + cardPadding, infoY);
    infoY += infoLineHeight;
  }
  cursorY += cardHeight + 22;

  // Item count
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(...INK_RGB);
  doc.text(t("pdf.itemCount", { count: items.length }), marginX, cursorY);
  doc.setFont("helvetica", "normal");
  cursorY += 12;

  const body = items.map((item, index) => [
    String(index + 1),
    item.itemId === CUSTOM_ITEM_ID
      ? (item.customName ?? "")
      : t(`item.${item.itemId}`),
    String(item.qty),
    t(`unit.${item.unit}`),
    item.note ?? "",
  ]);

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
    headStyles: { fillColor: BRAND_RGB, textColor: [255, 255, 255] },
    styles: { fontSize: 10, textColor: INK_RGB },
    alternateRowStyles: { fillColor: STRIPE_RGB },
    columnStyles: {
      0: { cellWidth: 28, halign: "center" },
      2: { cellWidth: 50, halign: "right" },
      3: { cellWidth: 60, halign: "center" },
    },
  });

  const totalPages = doc.getNumberOfPages();
  const generatedOn = new Date().toLocaleString();
  const pageHeight = doc.internal.pageSize.getHeight();

  for (let page = 1; page <= totalPages; page += 1) {
    doc.setPage(page);
    doc.setFontSize(8);
    doc.setTextColor(...MUTED_RGB);
    doc.text(
      t("pdf.generatedOn", { date: generatedOn }),
      marginX,
      pageHeight - 20,
    );
    doc.text(`${page} / ${totalPages}`, pageWidth - marginX, pageHeight - 20, {
      align: "right",
    });
  }

  doc.save(buildPdfFilename(client, categoryId, t));
}
