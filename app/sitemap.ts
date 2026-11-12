import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/company";

export const dynamic = "force-static";

/**
 * Every canonical page, and only those: retired URLs 301 elsewhere (next.config.ts) and /apply
 * hands off to New American Funding, so neither belongs here. No lastModified, because the build
 * time is not when the content changed.
 */
const PAGES: {
  path: string;
  priority: number;
  changeFrequency: NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>;
}[] = [
  { path: "/", priority: 1, changeFrequency: "daily" },
  { path: "/programs", priority: 0.9, changeFrequency: "monthly" },
  { path: "/va-loans", priority: 0.9, changeFrequency: "weekly" },
  { path: "/fha-loans", priority: 0.8, changeFrequency: "weekly" },
  { path: "/calculators", priority: 0.7, changeFrequency: "monthly" },
  { path: "/licensing", priority: 0.3, changeFrequency: "yearly" },
  { path: "/privacy", priority: 0.3, changeFrequency: "yearly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return PAGES.map(({ path, priority, changeFrequency }) => ({
    url: new URL(path, SITE_URL).toString(),
    changeFrequency,
    priority,
  }));
}
