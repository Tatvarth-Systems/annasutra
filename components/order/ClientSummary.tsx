import type { ClientDetails } from "@/lib/order/types";
import { CalendarClock, MapPin } from "lucide-react";

import { formatDateDisplay, formatTimeDisplay } from "@/lib/utils/date";

/** Summary card displaying client details. */
export const ClientSummary = ({ client }: { client: ClientDetails }) => {
  return (
    <div className="mb-6 flex flex-wrap items-center gap-x-4 gap-y-1 rounded-md border border-line bg-brand-soft px-4 py-3 text-sm text-ink">
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
  );
};
