"use client";

import Link from "next/link";
import { ChefHat } from "lucide-react";

import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { useT } from "@/lib/i18n/provider";

/** Navigation header with logo and language switcher. */
export const Navbar = () => {
  const t = useT();

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-surface/95 backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-3xl items-center justify-between px-4">
        <Link
          href="/welcome"
          className="flex items-center gap-2 text-sm font-semibold text-ink"
        >
          <ChefHat className="h-5 w-5 text-brand" />
          {t("common.appName")}
        </Link>

        <div className="flex items-center gap-3">
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
};
