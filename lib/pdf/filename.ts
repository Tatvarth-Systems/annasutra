import type { CategoryId } from "@/data/categories";
import type { Locale } from "@/lib/i18n/config";
import type { TFunction } from "@/lib/i18n/provider";
import type { ClientDetails } from "@/lib/order/types";

import { toLocaleDigits } from "@/lib/i18n/numerals";
import { formatDateDisplay } from "@/lib/utils/date";

const MAX_FILENAME_LENGTH = 120;

/** Converts text to CamelCase filename-safe segment, preserving non-Latin scripts (NFC-normalized). */
const toFilenameSegment = (text: string): string => {
  return text
    .normalize("NFC")
    .trim()
    .split(/[^\p{L}\p{N}\p{M}]+/u)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
};

/** Builds PDF filename from client details, category, and translation function. */
export const buildPdfFilename = (
  client: ClientDetails,
  categoryId: CategoryId,
  t: TFunction,
  locale: Locale,
): string => {
  const dateSegment = toLocaleDigits(
    formatDateDisplay(client.eventDate).replace(/\//g, "-"),
    locale,
  );
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

  const filename = `${parts.join("_")}.pdf`;
  return filename.length > MAX_FILENAME_LENGTH
    ? `${filename.slice(0, MAX_FILENAME_LENGTH - 4)}.pdf`
    : filename;
};
