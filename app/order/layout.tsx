"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { ToastProvider } from "@/components/ui/Toast";
import { StepIndicator } from "@/components/ui/StepIndicator";
import { useT } from "@/lib/i18n/provider";

const STEP_KEYS = ["client", "category", "items", "review"] as const;

export default function OrderLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const t = useT();

  const currentKey =
    STEP_KEYS.find((key) => pathname.includes(`/order/${key}`)) ?? "client";

  const steps = STEP_KEYS.map((key) => ({
    key,
    label: t(`orderSteps.${key}`),
  }));

  return (
    <ToastProvider>
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8">
        <StepIndicator steps={steps} currentKey={currentKey} />
        {children}
      </main>
    </ToastProvider>
  );
}
