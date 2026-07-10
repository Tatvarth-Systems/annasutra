"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  CalendarDays,
  Clock,
  ClipboardList,
  MapPin,
  Phone,
  StickyNote,
  Tag,
  User,
  Users,
} from "lucide-react";
import { useT } from "@/lib/i18n/provider";
import { useOrderDraft } from "@/lib/order/useOrderDraft";
import type { ClientDetails, EventType } from "@/lib/order/types";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils/cn";

const EVENT_TYPES: EventType[] = ["wedding", "engagement", "birthday", "other"];

type FormState = {
  clientName: string;
  contactNumber: string;
  eventType: EventType | "";
  eventVenue: string;
  eventDate: string;
  eventTime: string;
  guestCount: string;
  notes: string;
};

function toFormState(client: ClientDetails | null): FormState {
  return {
    clientName: client?.clientName ?? "",
    contactNumber: client?.contactNumber ?? "",
    eventType: client?.eventType ?? "",
    eventVenue: client?.eventVenue ?? "",
    eventDate: client?.eventDate ?? "",
    eventTime: client?.eventTime ?? "",
    guestCount: client?.guestCount ? String(client.guestCount) : "",
    notes: client?.notes ?? "",
  };
}

export default function ClientDetailsPage() {
  const t = useT();
  const router = useRouter();
  const { client, setClientDetails } = useOrderDraft();

  const [form, setForm] = useState<FormState>(() => toFormState(client));
  const [errors, setErrors] = useState<
    Partial<Record<keyof FormState, boolean>>
  >({});

  const [prevClient, setPrevClient] = useState(client);
  if (client !== prevClient) {
    setPrevClient(client);
    setForm(toFormState(client));
  }

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: false }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors: Partial<Record<keyof FormState, boolean>> = {
      clientName: form.clientName.trim() === "",
      eventVenue: form.eventVenue.trim() === "",
      eventDate: form.eventDate.trim() === "",
      eventTime: form.eventTime.trim() === "",
    };
    setErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) return;

    const details: ClientDetails = {
      clientName: form.clientName.trim(),
      contactNumber: form.contactNumber.trim() || undefined,
      eventType: form.eventType || undefined,
      eventVenue: form.eventVenue.trim(),
      eventDate: form.eventDate,
      eventTime: form.eventTime,
      guestCount: form.guestCount ? Number(form.guestCount) : undefined,
      notes: form.notes.trim() || undefined,
    };

    setClientDetails(details);
    router.push("/order/category");
  }

  return (
    <div>
      <PageHeader
        title={t("client.title")}
        description={t("client.subtitle")}
        icon={ClipboardList}
      />

      <Card>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <Field
            label={t("client.clientName")}
            htmlFor="clientName"
            required
            error={errors.clientName ? t("client.requiredError") : undefined}
          >
            <Input
              id="clientName"
              icon={User}
              value={form.clientName}
              invalid={errors.clientName}
              onChange={(event) => update("clientName", event.target.value)}
            />
          </Field>

          <Field
            label={t("client.contactNumber")}
            htmlFor="contactNumber"
            hint={t("common.optional")}
          >
            <Input
              id="contactNumber"
              type="tel"
              icon={Phone}
              value={form.contactNumber}
              onChange={(event) => update("contactNumber", event.target.value)}
            />
          </Field>

          <div>
            <Label htmlFor="eventType">
              {t("client.eventType")}
              <span className="ml-1 text-muted">({t("common.optional")})</span>
            </Label>
            <div className="relative">
              <Tag className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
              <select
                id="eventType"
                className="w-full rounded-md border border-line bg-white py-2 pl-9 pr-3 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand/40"
                value={form.eventType}
                onChange={(event) =>
                  update("eventType", event.target.value as EventType | "")
                }
              >
                <option value=""></option>
                {EVENT_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {t(
                      `client.eventType${type[0].toUpperCase()}${type.slice(1)}`,
                    )}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <Field
            label={t("client.eventVenue")}
            htmlFor="eventVenue"
            required
            error={errors.eventVenue ? t("client.requiredError") : undefined}
          >
            <Input
              id="eventVenue"
              icon={MapPin}
              value={form.eventVenue}
              invalid={errors.eventVenue}
              onChange={(event) => update("eventVenue", event.target.value)}
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field
              label={t("client.eventDate")}
              htmlFor="eventDate"
              required
              error={errors.eventDate ? t("client.requiredError") : undefined}
            >
              <Input
                id="eventDate"
                type="date"
                icon={CalendarDays}
                value={form.eventDate}
                invalid={errors.eventDate}
                onChange={(event) => update("eventDate", event.target.value)}
              />
            </Field>

            <Field
              label={t("client.eventTime")}
              htmlFor="eventTime"
              required
              error={errors.eventTime ? t("client.requiredError") : undefined}
            >
              <Input
                id="eventTime"
                type="time"
                icon={Clock}
                value={form.eventTime}
                invalid={errors.eventTime}
                onChange={(event) => update("eventTime", event.target.value)}
              />
            </Field>
          </div>

          <Field
            label={t("client.guestCount")}
            htmlFor="guestCount"
            hint={t("common.optional")}
          >
            <Input
              id="guestCount"
              type="number"
              min={0}
              icon={Users}
              value={form.guestCount}
              onChange={(event) => update("guestCount", event.target.value)}
            />
          </Field>

          <div>
            <Label htmlFor="notes">
              <span className="inline-flex items-center gap-1.5">
                <StickyNote className="h-3.5 w-3.5 text-muted" />
                {t("client.notes")}
              </span>
              <span className="ml-1 text-muted">({t("common.optional")})</span>
            </Label>
            <textarea
              id="notes"
              rows={3}
              className={cn(
                "w-full rounded-md border border-line bg-white px-3 py-2 text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-brand/40",
              )}
              value={form.notes}
              onChange={(event) => update("notes", event.target.value)}
            />
          </div>

          <Button type="submit" className="w-full">
            {t("common.continue")}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </form>
      </Card>
    </div>
  );
}
