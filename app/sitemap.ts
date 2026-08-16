import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/company";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const paths = [
    "/",
    "/purchase",
    "/refinance",
    "/calculators",
    "/calculators/payment",
    "/calculators/affordability",
    "/calculators/refinance",
    "/programs",
    "/programs/conventional",
    "/programs/fha",
    "/fha-loans",
    "/programs/va",
    "/va-loans",
    "/programs/usda",
    "/programs/jumbo",
    "/programs/self-employed",
    "/self-employed-loans",
    "/programs/non-qm",
    "/programs/reverse",
    "/programs/investors",
    "/team",
    "/about",
    "/apply",
  ];

  return paths.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency: path === "/" ? "daily" : "weekly",
    priority: path === "/" ? 1 : path.includes("va") || path.includes("fha") ? 0.9 : 0.7,
  }));
}
