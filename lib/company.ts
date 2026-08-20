export const SITE_URL = "https://vandykehomeloans.net";
export const SITE_NAME = "VanDyke Home Loans";
export const TEAM_NAME = "VanDyke Mortgage Team";
export const TAGLINE = "Mortgage guidance designed for today’s homebuyer.";

export const LENDER = {
  name: "New American Funding, LLC",
  dba: "New American Funding",
  nmls: "6606",
  website: "https://www.newamericanfunding.com/",
  nmlsLookup: "https://www.nmlsconsumeraccess.org/",
  licensing: "https://www.newamericanfunding.com/legal/state-licensing/",
};

export const OFFICE = {
  street: "425 West Washington Street, Suite 4, Office 219",
  city: "Suffolk",
  region: "VA",
  postalCode: "23434",
  area: "Hampton Roads",
  mapsQuery: "425 West Washington Street Suite 4 Office 219 Suffolk VA 23434",
};

export const CONTACT = {
  phoneDisplay: "(757) 338-3432",
  phoneTel: "+17573383432",
  faxDisplay: "(757) 743-9168",
  email: "VanDykeMortgageTeam@Nafinc.com",
  facebook: "https://www.facebook.com/share/1G8iJ39nX1/",
  portal: "https://share.google/Qjz5J06xzG2dlyaFv",
  corporateRates: "https://share.google/EDnFMezGxLaJh3SQt",
  preQual: "https://www.newamericanfunding.com/lps/prequal/anthonyvandyke/",
  publishedRates: "https://www.newamericanfunding.com/mortgage-rates/",
};

/** Snapshot of NAF's public rate table. Update whenever https://www.newamericanfunding.com/mortgage-rates/ changes. */
export const NAF_PUBLISHED_RATES = {
  asOf: "9:00AM PT on 8/18/2026",
  pointsLabel: "1.000 ($8,065)",
} as const;

export const PEOPLE = {
  anthony: {
    name: "Anthony VanDyke",
    title: "Branch Manager",
    nmlsId: "955777",
    email: CONTACT.email,
    phone: CONTACT.phoneDisplay,
    phoneTel: CONTACT.phoneTel,
    fax: CONTACT.faxDisplay,
    profile: "https://www.newamericanfunding.com/mortgage-loans/anthonyvandyke",
    ratingValue: "4.9",
    reviewCount: 271,
    bio: "Anthony VanDyke leads the VanDyke Mortgage Team in Suffolk, Virginia. With many years originating purchase and refinance loans, he focuses on clear guidance, competitive New American Funding pricing, and consistent communication through closing.",
    licenseStates: "VA",
  },
  gonzalo: {
    name: "Gonzalo Guimoye",
    title: "Loan Consultant",
    nmlsId: "1131706",
    email: CONTACT.email,
    phone: "(757) 289-4581",
    phoneTel: "+17572894581",
    profile: "https://www.newamericanfunding.com/mortgage-loans/gonzaloguimoye",
    ratingValue: "4.96",
    reviewCount: 76,
    bio: "Gonzalo Guimoye is a dedicated loan consultant serving Hampton Roads borrowers. Clients regularly note that he explains each step, stays available, and keeps purchase and refinance files moving without surprises.",
    licenseStates: "VA",
  },
} as const;

export const REVIEWS = [
  {
    quote:
      "From start to finish, my experience with NAF was outstanding. Gonzalo went the extra mile to ensure I was confident in each decision, educated on each step in the process, and flexible with his time.",
    author: "Vincent D.",
    location: "Amherst, VA",
    date: "April 3, 2026",
  },
  {
    quote: "Absolutely phenomenal experience, with intentional communication on every level.",
    author: "Linda Chisolm",
    location: "Review from Anthony VanDyke’s New American Funding page",
    date: null,
  },
  {
    quote: "Always a smooth transaction. Thank you.",
    author: "LESLEY G.",
    location: "Amherst, VA",
    date: "March 28, 2026",
  },
] as const;

export const FAQS = [
  {
    question: "How early should I reach out before buying a home?",
    answer:
      "As soon as you start shopping — ideally before you write an offer. The VanDyke Mortgage Team can walk through program fit, payment range, and documentation so pre-qualification is ready when you need it.",
  },
  {
    question: "Can I speak with someone before completing a full application?",
    answer:
      "Yes. If you are not ready to apply, you can still review FAQs, check current rates, or speak with Anthony VanDyke or Gonzalo Guimoye first.",
  },
  {
    question: "What loan types can I ask about?",
    answer:
      "Conventional, FHA, VA, first-time buyer paths, self-employed and non-QM options, investor financing, reverse mortgages, 30-year and 15-year fixed, and ARM loans — all originated through New American Funding.",
  },
  {
    question: "Where can I find licensing and compliance information?",
    answer:
      "New American Funding, LLC is an Equal Housing Lender, NMLS #6606. Anthony VanDyke is NMLS #955777. Gonzalo Guimoye is NMLS #1131706. Confirm licenses at NMLS Consumer Access. The footer of this site also includes Equal Housing and fair-lending language.",
  },
] as const;

export function fullAddress(): string {
  return `${OFFICE.street}, ${OFFICE.city}, ${OFFICE.region} ${OFFICE.postalCode}`;
}
