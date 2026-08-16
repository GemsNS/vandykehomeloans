import { ProgramArticle } from "@/components/programs/ProgramArticle";
import { PROGRAMS } from "@/lib/programs";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: PROGRAMS.fha.seoTitle,
  description: PROGRAMS.fha.description,
  path: "/fha-loans",
  keywords: ["FHA loans Suffolk", "FHA mortgage Hampton Roads"],
});

export default function FhaLoansPage() {
  return <ProgramArticle slug="fha" />;
}
