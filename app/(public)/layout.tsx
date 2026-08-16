import type { ReactNode } from "react";
import { SiteShell } from "@/components/layout/SiteShell";

export const revalidate = 30;

export default function PublicLayout({ children }: { children: ReactNode }) {
  return <SiteShell>{children}</SiteShell>;
}
