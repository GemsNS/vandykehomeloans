import { ProgramArticle } from "@/components/programs/ProgramArticle";
import { PROGRAMS, type ProgramSlug } from "@/lib/programs";
import { pageMetadata } from "@/lib/seo";

export function generateStaticParams() {
  const aliases = new Set(["va", "fha", "self-employed"]);
  return (Object.keys(PROGRAMS) as ProgramSlug[])
    .filter((slug) => !aliases.has(slug))
    .map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const program = PROGRAMS[slug as ProgramSlug];
  if (!program) return {};
  return pageMetadata({
    title: program.seoTitle,
    description: program.description,
    path: program.path,
    keywords: [program.title, "Hampton Roads", "New American Funding"],
  });
}

export default async function ProgramPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <ProgramArticle slug={slug} />;
}
