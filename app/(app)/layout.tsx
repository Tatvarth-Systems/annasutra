import type { ReactNode } from "react";
import { Navbar } from "@/components/layout/Navbar";

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
