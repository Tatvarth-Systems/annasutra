"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { ToastProvider } from "@/components/ui/Toast";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { useT } from "@/lib/i18n/provider";

const STEP_KEYS = ["client", "category", "items", "review"] as const;

export default function OrderLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const t = useT();

  const currentIndex = Math.max(
    0,
    STEP_KEYS.findIndex((key) => pathname.includes(`/order/${key}`)),
  );

  const crumbs = STEP_KEYS.slice(0, currentIndex + 1).map((key, index) => ({
    key,
    label: t(`orderSteps.${key}`),
    href: index === currentIndex ? undefined : `/order/${key}`,
  }));

  return (
    <ToastProvider>
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8">
        <Breadcrumb items={crumbs} />
        {children}
      </main>
    </ToastProvider>
  );
}
