import type { Metadata } from "next";
import type { ReactNode } from "react";

import { Navbar } from "@/components/layout/Navbar";

export const metadata: Metadata = {
  title: "Welcome",
  description:
    "Start a new catering order in AnnaSutra — pick a category, add items, and generate a shareable order-sheet PDF.",
  alternates: {
    canonical: "/welcome",
  },
};

/** App layout with navbar and children. */
const AppLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
};

export default AppLayout;
