"use client";

import { useRouter } from "next/navigation";
import { ClipboardPlus } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useT } from "@/lib/i18n/provider";
import { useOrderDraft } from "@/lib/order/useOrderDraft";

/** Welcome page with new order button. */
const WelcomePage = () => {
  const t = useT();
  const router = useRouter();
  const { startNewClient } = useOrderDraft();

  /** Starts a fresh order draft and navigates to the client details step. */
  const handleCreateOrder = () => {
    startNewClient();
    router.push("/order/client");
  };

  return (
    <main className="flex flex-1 items-center justify-center px-4 py-12">
      <Card className="w-full max-w-sm text-center">
        <h1 className="text-xl font-semibold text-ink">
          {t("welcome.greeting")}
        </h1>
        <p className="mt-1 text-sm text-muted">{t("welcome.subtitle")}</p>

        <div className="mt-6 flex flex-col gap-2">
          <Button onClick={handleCreateOrder}>
            <ClipboardPlus className="h-4 w-4" />
            {t("welcome.createOrder")}
          </Button>
        </div>
      </Card>
    </main>
  );
};

export default WelcomePage;
