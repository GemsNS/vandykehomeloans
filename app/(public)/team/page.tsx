import { BrokerGrid } from "@/components/home/BrokerGrid";
import { PageHero } from "@/components/layout/PageHero";
import { JsonLd } from "@/components/seo/JsonLd";
import { getActiveBrokers } from "@/lib/data/queries";
import { PEOPLE } from "@/lib/company";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Anthony VanDyke & Gonzalo Guimoye",
  description:
    "Meet Branch Manager Anthony VanDyke, NMLS #955777, and Loan Consultant Gonzalo Guimoye, NMLS #1131706, of the VanDyke Mortgage Team in Suffolk, VA.",
  path: "/team",
  keywords: ["Anthony VanDyke NMLS 955777", "Gonzalo Guimoye NMLS 1131706"],
});

export default async function TeamPage() {
  const brokers = await getActiveBrokers();
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Team", path: "/team" },
        ])}
      />
      <PageHero
        eyebrow="Team"
        title="Anthony VanDyke and Gonzalo Guimoye."
        description={`${PEOPLE.anthony.name} is Branch Manager. ${PEOPLE.gonzalo.name} is Loan Consultant. Both originate through New American Funding from the Suffolk branch.`}
      />
      <BrokerGrid brokers={brokers} />
    </>
  );
}
