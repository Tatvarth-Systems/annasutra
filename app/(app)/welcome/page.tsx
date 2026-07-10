"use client";

import { useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { ClipboardPlus } from "lucide-react";
import { useT } from "@/lib/i18n/provider";
import {
  getSessionServerSnapshot,
  getSessionSnapshot,
  subscribeToSession,
} from "@/lib/auth/session";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

/** Welcome page with new order button for authenticated users. */
const WelcomePage = () => {
  const t = useT();
  const router = useRouter();
  const username = useSyncExternalStore(
    subscribeToSession,
    getSessionSnapshot,
    getSessionServerSnapshot,
  );

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
            <ClipboardPlus className="h-4 w-4" />
            {t("welcome.createOrder")}
          </Button>
        </div>
      </Card>
    </main>
  );
};

export default WelcomePage;
