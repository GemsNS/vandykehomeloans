import { ProgramArticle } from "@/components/programs/ProgramArticle";
import { PROGRAMS } from "@/lib/programs";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: PROGRAMS["self-employed"].seoTitle,
  description: PROGRAMS["self-employed"].description,
  path: "/self-employed-loans",
  keywords: ["self employed mortgage Virginia", "bank statement loan Hampton Roads"],
});

export default function SelfEmployedLoansPage() {
  return <ProgramArticle slug="self-employed" />;
}
