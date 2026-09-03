import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SITE_TITLE } from "@/lib/company";

export const metadata: Metadata = {
  title: {
    absolute: SITE_TITLE,
  },
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return children;
}
