import type { ReactNode } from "react";
import { Footer } from "@/components/layout/Footer";
import { MobileActionBar, Navbar } from "@/components/layout/Navbar";

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    // Bottom padding on phones equals the action bar's height, so the bar never covers the
    // footer's compliance text.
    <div className="flex min-h-screen flex-col pb-[calc(4rem+env(safe-area-inset-bottom))] md:pb-0">
      <Navbar />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer />
      <MobileActionBar />
    </div>
  );
}
