import type { Metadata } from "next";
import type { ReactNode } from "react";

import { OrderShell } from "@/app/(app)/order/OrderShell";

export const metadata: Metadata = {
  title: "Create Order · AnnaSutra",
  robots: {
    index: false,
    follow: false,
  },
};

/** Order flow layout wrapping the shared breadcrumb/toast shell. */
const OrderLayout = ({ children }: { children: ReactNode }) => {
  return <OrderShell>{children}</OrderShell>;
};

export default OrderLayout;
