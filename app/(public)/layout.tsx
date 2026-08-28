import type { ReactNode } from "react";
import { SiteShell } from "@/components/layout/SiteShell";

// Always read data/naf-rates-meta.json at request time (not from a stale static build).
export const dynamic = "force-dynamic";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return <SiteShell>{children}</SiteShell>;
}
