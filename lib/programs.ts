export type ProgramSlug =
  | "conventional"
  | "fha"
  | "va"
  | "usda"
  | "jumbo"
  | "self-employed"
  | "non-qm"
  | "reverse"
  | "investors";

export type Program = {
  title: string;
  headline: string;
  description: string;
  bullets: string[];
  type: string;
  path: string;
  seoTitle: string;
};

export const PROGRAMS: Record<ProgramSlug, Program> = {
  conventional: {
    title: "Conventional loans",
    seoTitle: "Conventional Loans in Hampton Roads",
    headline: "Conventional financing for buyers who want flexibility.",
    description:
      "A strong fit for well-qualified buyers, repeat homeowners, and households looking for stable payment planning with competitive New American Funding options.",
    bullets: [
      "3–20% down depending on occupancy and credit",
      "Second homes and investment properties available",
      "High-balance conforming in designated counties",
    ],
    type: "conventional",
    path: "/programs/conventional",
  },
  fha: {
    title: "FHA loans",
    seoTitle: "FHA Loans in Suffolk & Hampton Roads",
    headline: "A more approachable starting point.",
    description:
      "FHA loans are often useful for buyers who need a more accessible entry into homeownership, especially when they want a structured path before applying.",
    bullets: [
      "Lower down-payment paths for many first-time buyers",
      "Gift funds and down-payment assistance may be permitted",
      "Education first: compare payment scenarios, then pre-qualify",
    ],
    type: "fha",
    path: "/fha-loans",
  },
  va: {
    title: "VA loans",
    seoTitle: "VA Loans for Virginia Veterans & Active Duty",
    headline: "Use the VA benefit with more confidence.",
    description:
      "A VA loan is backed by the U.S. Department of Veterans Affairs. For qualified borrowers it can mean no down payment, no monthly PMI, and a process designed with military service in mind.",
    bullets: [
      "Confirm eligibility, occupancy, and entitlement early",
      "Prepare your Certificate of Eligibility to reduce surprises",
      "Start secure New American Funding pre-qualification when ready",
    ],
    type: "va",
    path: "/va-loans",
  },
  usda: {
    title: "USDA loans",
    seoTitle: "USDA Loans in Eligible Virginia Areas",
    headline: "Zero down outside the urban core — when the map qualifies.",
    description:
      "USDA guarantees 100% financing in eligible geographies, subject to household income limits the VanDyke team checks first through New American Funding.",
    bullets: [
      "Property must map into a USDA-eligible area",
      "Income caps by county and household size",
      "Guarantee fee typically financed into the loan",
    ],
    type: "usda",
    path: "/programs/usda",
  },
  jumbo: {
    title: "Jumbo loans",
    seoTitle: "Jumbo Mortgages through New American Funding",
    headline: "High-balance files without the runaround.",
    description:
      "True jumbo and high-balance conventional for primary, second, and select investment properties originated by the VanDyke Mortgage Team.",
    bullets: [
      "Full-doc options for W-2 and self-employed borrowers",
      "15- and 30-year fixed where overlays allow",
      "Local Suffolk conversation, national NAF lock desk",
    ],
    type: "jumbo",
    path: "/programs/jumbo",
  },
  "self-employed": {
    title: "Self-employed mortgages",
    seoTitle: "Self-Employed Mortgages in Hampton Roads",
    headline: "Mortgage planning for business owners and independent earners.",
    description:
      "Self-employed borrowers often need a more careful review of business structure, deposits, write-offs, and income consistency. The VanDyke team organizes that conversation up front.",
    bullets: [
      "Outline how you earn and how long the business has operated",
      "Prepare tax returns, P&L, and deposit questions before intake",
      "Enter NAF pre-qualification once the income story is organized",
    ],
    type: "conventional",
    path: "/self-employed-loans",
  },
  "non-qm": {
    title: "Non-QM loans",
    seoTitle: "Non-QM Mortgage Options in Virginia",
    headline: "When a conventional box is not the right fit.",
    description:
      "Non-qualified mortgage options help borrowers whose income or credit profile does not match a standard agency overlay. The first step is a clear conversation, not a teaser rate.",
    bullets: [
      "Bank-statement and alternative documentation conversations",
      "Investor and self-employed scenarios often overlap here",
      "Qualification still depends on the full borrower profile",
    ],
    type: "conventional",
    path: "/programs/non-qm",
  },
  reverse: {
    title: "Reverse mortgages",
    seoTitle: "Reverse Mortgage Guidance in Hampton Roads",
    headline: "Understand whether a reverse mortgage belongs in the plan.",
    description:
      "Eligible homeowners can review how a reverse mortgage may affect cash flow, occupancy, and estate goals. The VanDyke Mortgage Team will tell you if it is not the right tool.",
    bullets: [
      "Counseling and eligibility come before any application",
      "Designed for eligible older homeowners, not every borrower",
      "Compare against a traditional refinance when that is cleaner",
    ],
    type: "conventional",
    path: "/programs/reverse",
  },
  investors: {
    title: "Investor financing",
    seoTitle: "Investment Property Loans in Hampton Roads",
    headline: "Investor financing with a practical next step.",
    description:
      "Real estate investors working with the VanDyke Mortgage Team can compare conventional investment, Non-QM, and cash-out paths through New American Funding.",
    bullets: [
      "Occupancy and reserve requirements reviewed early",
      "Purchase and refinance conversations for 1–4 unit properties",
      "Local Suffolk origination with NAF product access",
    ],
    type: "conventional",
    path: "/programs/investors",
  },
};
