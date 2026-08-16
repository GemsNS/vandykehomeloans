import { ProgramArticle } from "@/components/programs/ProgramArticle";
import { PROGRAMS } from "@/lib/programs";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: PROGRAMS.va.seoTitle,
  description: PROGRAMS.va.description,
  path: "/va-loans",
  keywords: ["VA loans Virginia", "VA mortgage Hampton Roads", "Certificate of Eligibility"],
});

export default function VaLoansPage() {
  return <ProgramArticle slug="va" />;
}
