import type { Metadata } from "next";
import {
  CONTACT,
  LENDER,
  OFFICE,
  PEOPLE,
  SITE_NAME,
  SITE_TITLE,
  SITE_URL,
  TEAM_NAME,
  fullAddress,
} from "@/lib/company";

const OG_IMAGE = {
  url: "/brand/vandyke-home-loans-logo.png",
  width: 1024,
  height: 683,
  alt: `${SITE_NAME} logo`,
} as const;

/** Every page uses the same document/social title. */
export function brandTitle(_pageTitle?: string): string {
  return SITE_TITLE;
}

export function pageMetadata({
  title,
  description,
  path = "/",
  keywords = [],
}: {
  title: string;
  description: string;
  path?: string;
  keywords?: string[];
}): Metadata {
  const url = new URL(path, SITE_URL).toString();
  const fullTitle = brandTitle(title);
  return {
    title: { absolute: fullTitle },
    description,
    applicationName: SITE_NAME,
    appleWebApp: { title: SITE_NAME },
    keywords: [
      "VanDyke Home Loans",
      "VanDyke Mortgage Team",
      "Anthony VanDyke",
      "Gonzalo Guimoye",
      "Hampton Roads mortgage",
      "Suffolk VA mortgage",
      "New American Funding",
      "VA loans Virginia",
      "FHA loans Hampton Roads",
      ...keywords,
    ],
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      locale: "en_US",
      url,
      siteName: SITE_NAME,
      title: fullTitle,
      description,
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [OG_IMAGE.url],
    },
    robots: { index: true, follow: true },
  };
}

export function localBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": ["MortgageBroker", "FinancialService", "LocalBusiness"],
    name: SITE_NAME,
    alternateName: TEAM_NAME,
    url: SITE_URL,
    telephone: CONTACT.phoneTel,
    email: CONTACT.email,
    description:
      "The VanDyke Mortgage Team helps Hampton Roads homebuyers and homeowners with conventional, FHA, VA, self-employed, Non-QM, and investor financing through New American Funding.",
    address: {
      "@type": "PostalAddress",
      streetAddress: OFFICE.street,
      addressLocality: OFFICE.city,
      addressRegion: OFFICE.region,
      postalCode: OFFICE.postalCode,
      addressCountry: "US",
    },
    areaServed: ["Hampton Roads", "Suffolk VA", "Virginia Beach", "Norfolk", "Chesapeake", "Newport News"],
    parentOrganization: {
      "@type": "Organization",
      name: LENDER.dba,
      url: LENDER.website,
      identifier: `NMLS ${LENDER.nmls}`,
    },
    employee: [
      {
        "@type": "Person",
        name: PEOPLE.anthony.name,
        jobTitle: PEOPLE.anthony.title,
        identifier: `NMLS ${PEOPLE.anthony.nmlsId}`,
        url: PEOPLE.anthony.profile,
        telephone: PEOPLE.anthony.phoneTel,
        email: PEOPLE.anthony.email,
      },
      {
        "@type": "Person",
        name: PEOPLE.gonzalo.name,
        jobTitle: PEOPLE.gonzalo.title,
        identifier: `NMLS ${PEOPLE.gonzalo.nmlsId}`,
        url: PEOPLE.gonzalo.profile,
        telephone: PEOPLE.gonzalo.phoneTel,
        email: PEOPLE.gonzalo.email,
      },
    ],
    sameAs: [CONTACT.facebook, PEOPLE.anthony.profile, PEOPLE.gonzalo.profile, LENDER.website],
    potentialAction: {
      "@type": "ApplyAction",
      name: "Start pre-qualification",
      target: CONTACT.preQual,
    },
  };
}

export function faqJsonLd(faqs: readonly { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: new URL(item.path, SITE_URL).toString(),
    })),
  };
}

export { fullAddress, OG_IMAGE };
