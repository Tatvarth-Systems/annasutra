import type { ClientDetails } from "@/lib/order/types";
import { CalendarClock, MapPin, Pencil } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { useT } from "@/lib/i18n/provider";
import { formatDateDisplay, formatTimeDisplay } from "@/lib/utils/date";

type ClientSummaryProps = {
  client: ClientDetails;
  onEdit?: () => void;
};

/** Summary card displaying client details. */
export const ClientSummary = ({ client, onEdit }: ClientSummaryProps) => {
  const t = useT();

  return (
    <div className="mb-6 flex flex-col gap-3 rounded-md border border-line bg-brand-soft px-4 py-3 text-sm text-ink sm:flex-row sm:items-start sm:justify-between sm:gap-4">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
        <span className="font-medium">{client.clientName}</span>
        <span className="inline-flex items-center gap-1 text-muted">
          <MapPin className="h-3.5 w-3.5" />
          {client.eventVenue}
        </span>
        <span className="inline-flex items-center gap-1 text-muted">
          <CalendarClock className="h-3.5 w-3.5" />
          {formatDateDisplay(client.eventDate)}{" "}
          {formatTimeDisplay(client.eventTime)}
        </span>
      </div>
      {onEdit && (
        <Button
          variant="secondary"
          className="shrink-0 self-end px-3 py-1.5 sm:self-auto"
          onClick={onEdit}
        >
          <Pencil className="h-3.5 w-3.5" />
          {t("category.editClient")}
        </Button>
      )}
    </div>
  );
};
