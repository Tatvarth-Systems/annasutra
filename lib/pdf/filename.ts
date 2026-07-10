import type { ClientDetails } from "@/lib/order/types";
import type { CategoryId } from "@/data/categories";
import { slugify } from "@/lib/utils/slugify";

export function buildPdfFilename(
  client: ClientDetails,
  categoryId: CategoryId,
): string {
  const clientSlug = slugify(client.clientName);
  const categorySlug = slugify(categoryId);
  return `${clientSlug}_${categorySlug}_${client.eventDate}.pdf`;
}
