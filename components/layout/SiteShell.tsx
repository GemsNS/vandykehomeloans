import type { ReactNode } from "react";
import { MobileSplash } from "@/components/brand/MobileSplash";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <MobileSplash />
      <Navbar />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
