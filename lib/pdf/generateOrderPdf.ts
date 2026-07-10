import type { ClientDetails, OrderItem } from "@/lib/order/types";
import type { CategoryId } from "@/data/categories";
import { CUSTOM_ITEM_ID } from "@/data/catalog";
import { BUSINESS } from "@/config/business";
import { buildPdfFilename } from "@/lib/pdf/filename";

type TranslateFn = (
  key: string,
  vars?: Record<string, string | number>,
) => string;

type GenerateOrderPdfArgs = {
  client: ClientDetails;
  categoryId: CategoryId;
  items: OrderItem[];
  t: TranslateFn;
};

const BRAND_RGB: [number, number, number] = [194, 65, 12];
const INK_RGB: [number, number, number] = [28, 25, 23];
const MUTED_RGB: [number, number, number] = [120, 113, 108];
const LINE_RGB: [number, number, number] = [231, 229, 228];

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

  doc.setFontSize(18);
  doc.setTextColor(...BRAND_RGB);
  doc.text(BUSINESS.name, marginX, cursorY);
  cursorY += 18;

  doc.setFontSize(10);
  doc.setTextColor(...INK_RGB);
  doc.text(`${BUSINESS.proprietor} · ${BUSINESS.address}`, marginX, cursorY);
  cursorY += 14;
  doc.text(BUSINESS.phones.join(" / "), marginX, cursorY);
  cursorY += 20;

  doc.setDrawColor(...LINE_RGB);
  doc.line(marginX, cursorY, pageWidth - marginX, cursorY);
  cursorY += 22;

  doc.setFontSize(12);
  doc.setTextColor(...INK_RGB);
  doc.text(`${t("pdf.client")}: ${client.clientName}`, marginX, cursorY);
  cursorY += 16;
  doc.text(`${t("pdf.venue")}: ${client.eventVenue}`, marginX, cursorY);
  cursorY += 16;
  doc.text(
    `${t("pdf.date")}: ${client.eventDate}    ${t("pdf.time")}: ${client.eventTime}`,
    marginX,
    cursorY,
  );
  cursorY += 16;
  if (client.guestCount) {
    doc.text(`${t("pdf.guests")}: ${client.guestCount}`, marginX, cursorY);
    cursorY += 16;
  }
  cursorY += 10;

  doc.setFillColor(...BRAND_RGB);
  doc.rect(marginX, cursorY, pageWidth - marginX * 2, 24, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.text(
    `${t("pdf.category")}: ${t(`category.${categoryId}`)}`,
    marginX + 8,
    cursorY + 16,
  );
  cursorY += 36;

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
    columnStyles: {
      0: { cellWidth: 28 },
      2: { cellWidth: 50 },
      3: { cellWidth: 60 },
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

  doc.save(buildPdfFilename(client, categoryId));
}
