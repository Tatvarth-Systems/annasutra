"use client";

import { Code2 } from "lucide-react";

import { useT } from "@/lib/i18n/provider";

const VENDOR_NAME = "Tatvarth Systems LLP";
const VENDOR_URL = "https://www.tatvarthsystems.com";

/** Site footer with vendor branding. */
export const Footer = () => {
  const t = useT();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line bg-surface">
      <div className="mx-auto flex w-full max-w-3xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-muted sm:flex-row">
        <a
          href={VENDOR_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 transition-colors hover:text-ink"
        >
          <Code2 className="h-3.5 w-3.5 text-brand" />
          {t("footer.poweredBy", { name: VENDOR_NAME })}
        </a>
        <span>{t("footer.copyright", { year })}</span>
      </div>
    </footer>
  );
};
