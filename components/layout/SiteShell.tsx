import type { ReactNode } from "react";
import { Footer } from "@/components/layout/Footer";
import { MobileActionBar, Navbar } from "@/components/layout/Navbar";

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer />
      <MobileActionBar />
    </div>
  );
}
