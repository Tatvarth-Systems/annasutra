"use client";

import { useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { useT } from "@/lib/i18n/provider";
import {
  clearSessionCookie,
  getSessionServerSnapshot,
  getSessionSnapshot,
  subscribeToSession,
} from "@/lib/auth/session";
import { clearDraft } from "@/lib/order/storage";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function WelcomePage() {
  const t = useT();
  const router = useRouter();
  const username = useSyncExternalStore(
    subscribeToSession,
    getSessionSnapshot,
    getSessionServerSnapshot,
  );

  function handleSignOut() {
    clearSessionCookie();
    clearDraft();
    router.replace("/signin");
  }

  if (!username) return null;

  return (
    <main className="flex flex-1 items-center justify-center px-4 py-12">
      <Card className="w-full max-w-sm text-center">
        <h1 className="text-xl font-semibold text-ink">
          {t("welcome.greeting", { name: username })}
        </h1>
        <p className="mt-1 text-sm text-muted">{t("welcome.subtitle")}</p>

        <div className="mt-6 flex flex-col gap-2">
          <Button onClick={() => router.push("/order/client")}>
            {t("welcome.createOrder")}
          </Button>
          <Button variant="ghost" onClick={handleSignOut}>
            {t("auth.signOut")}
          </Button>
        </div>
      </Card>
    </main>
  );
}
