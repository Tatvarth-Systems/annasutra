"use client";

import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChefHat,
  ClipboardList,
  ClipboardPlus,
  Languages,
  LayoutGrid,
  Share2,
} from "lucide-react";

import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { CATEGORIES } from "@/data/categories";
import { useT } from "@/lib/i18n/provider";
import { CATEGORY_ICONS } from "@/lib/order/categoryIcons";

type Feature = { icon: LucideIcon; titleKey: string; descKey: string };

const FEATURES: Feature[] = [
  {
    icon: ClipboardList,
    titleKey: "landing.feature1Title",
    descKey: "landing.feature1Desc",
  },
  {
    icon: Share2,
    titleKey: "landing.feature2Title",
    descKey: "landing.feature2Desc",
  },
  {
    icon: Languages,
    titleKey: "landing.feature3Title",
    descKey: "landing.feature3Desc",
  },
  {
    icon: LayoutGrid,
    titleKey: "landing.feature4Title",
    descKey: "landing.feature4Desc",
  },
];

/** Public landing page introducing AnnaSutra and linking into the order-creation flow. */
const LandingPage = () => {
  const t = useT();
  const router = useRouter();

  /** Navigates to the welcome/order-creation entry point. */
  const handleGetStarted = () => router.push("/welcome");

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-line bg-surface/95 backdrop-blur">
        <div className="mx-auto flex h-14 w-full max-w-3xl items-center justify-between px-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-semibold text-ink"
          >
            <ChefHat className="h-5 w-5 text-brand" />
            {t("common.appName")}
          </Link>
          <LanguageSwitcher />
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-12">
        <section className="text-center">
          <h1 className="text-3xl font-semibold text-ink sm:text-4xl">
            {t("landing.headline")}
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-muted">
            {t("landing.subhead")}
          </p>
          <div className="mt-6 flex justify-center">
            <Button onClick={handleGetStarted}>
              <ClipboardPlus className="h-4 w-4" />
              {t("landing.cta")}
            </Button>
          </div>
        </section>

        <section className="mt-16 grid gap-4 sm:grid-cols-2">
          {FEATURES.map(({ icon: Icon, titleKey, descKey }) => (
            <Card key={titleKey} className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-brand-soft text-brand">
                <Icon className="h-5 w-5" />
              </span>
              <div>
                <h2 className="font-semibold text-ink">{t(titleKey)}</h2>
                <p className="mt-1 text-sm text-muted">{t(descKey)}</p>
              </div>
            </Card>
          ))}
        </section>

        <section className="mt-16">
          <h2 className="text-center text-xl font-semibold text-ink">
            {t("landing.categoriesTitle")}
          </h2>
          <div className="mt-6 grid grid-cols-3 gap-3 sm:grid-cols-3">
            {CATEGORIES.map((category) => {
              const Icon = CATEGORY_ICONS[category.id];
              return (
                <div
                  key={category.id}
                  className="flex flex-col items-center gap-2 rounded-lg border border-line bg-white p-4 text-center shadow-sm"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-soft text-brand">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="text-sm text-ink">
                    {t(`category.${category.id}`)}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        <section className="mt-16 rounded-lg border border-line bg-brand-soft p-8 text-center">
          <h2 className="text-xl font-semibold text-ink">
            {t("landing.ctaBandTitle")}
          </h2>
          <p className="mt-1 text-sm text-muted">
            {t("landing.ctaBandSubtitle")}
          </p>
          <div className="mt-5 flex justify-center">
            <Button onClick={handleGetStarted}>
              <ClipboardPlus className="h-4 w-4" />
              {t("landing.cta")}
            </Button>
          </div>
        </section>
      </main>
    </>
  );
};

export default LandingPage;
