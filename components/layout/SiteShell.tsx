import type { ReactNode } from "react";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { RateTicker } from "@/components/layout/RateTicker";
import { LeadFunnelModal } from "@/components/lead-funnel/LeadFunnelModal";
import { LeadFunnelProvider } from "@/components/lead-funnel/LeadFunnelProvider";

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <LeadFunnelProvider>
      <div className="flex min-h-screen flex-col">
        <RateTicker />
        <Navbar />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
      </div>
      <LeadFunnelModal />
    </LeadFunnelProvider>
  );
}
