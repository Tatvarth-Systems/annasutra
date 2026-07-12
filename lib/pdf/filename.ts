import type { CategoryId } from "@/data/categories";
import type { TFunction } from "@/lib/i18n/provider";
import type { ClientDetails } from "@/lib/order/types";

import { formatDateDisplay } from "@/lib/utils/date";

/** Converts text to CamelCase filename-safe segment, preserving non-Latin scripts. */
const toFilenameSegment = (text: string): string => {
  return text
    .trim()
    .split(/[^\p{L}\p{N}]+/u)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
};

/** Builds PDF filename from client details, category, and translation function. */
export const buildPdfFilename = (
  client: ClientDetails,
  categoryId: CategoryId,
  t: TFunction,
): string => {
  const dateSegment = formatDateDisplay(client.eventDate).replace(/\//g, "-");
  const clientSegment = toFilenameSegment(client.clientName);
  const eventTypeSegment = client.eventType
    ? toFilenameSegment(
        t(
          `client.eventType${client.eventType.charAt(0).toUpperCase()}${client.eventType.slice(1)}`,
        ),
      )
    : "";
  const categorySegment = toFilenameSegment(t(`category.${categoryId}`));

  const parts = [
    dateSegment,
    clientSegment,
    eventTypeSegment,
    categorySegment,
  ].filter(Boolean);

  return `${parts.join("_")}.pdf`;
};
