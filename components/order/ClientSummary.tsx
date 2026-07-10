import type { ClientDetails } from "@/lib/order/types";

export function ClientSummary({ client }: { client: ClientDetails }) {
  return (
    <div className="mb-6 rounded-md border border-line bg-brand-soft px-4 py-3 text-sm text-ink">
      <span className="font-medium">{client.clientName}</span>
      <span className="text-muted"> · {client.eventVenue}</span>
      <span className="text-muted">
        {" "}
        · {client.eventDate} {client.eventTime}
      </span>
    </div>
  );
}
