import type { Metadata } from "next";
import type { ReactNode } from "react";
import { DM_Sans, IBM_Plex_Mono, Inter_Tight } from "next/font/google";
import { JsonLd } from "@/components/seo/JsonLd";
import { CONTACT, SITE_NAME, SITE_URL, TEAM_NAME } from "@/lib/company";
import { localBusinessJsonLd } from "@/lib/seo";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const interTight = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-inter-tight",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | Hampton Roads Mortgages Powered by New American Funding`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "The VanDyke Mortgage Team in Suffolk, VA helps first-time buyers, veterans, FHA clients, self-employed borrowers, and investors. Branch Manager Anthony VanDyke, NMLS #955777. Powered by New American Funding, NMLS #6606.",
  applicationName: SITE_NAME,
  authors: [{ name: TEAM_NAME, url: SITE_URL }],
  creator: TEAM_NAME,
  publisher: SITE_NAME,
  category: "finance",
  keywords: [
    "VanDyke Home Loans",
    "VanDyke Mortgage Team",
    "Anthony VanDyke mortgage",
    "Gonzalo Guimoye",
    "Suffolk VA mortgage lender",
    "Hampton Roads home loans",
    "VA loans Virginia",
    "FHA loans Suffolk",
    "New American Funding Suffolk",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} | Hampton Roads Mortgages`,
    description:
      "Conventional, FHA, VA, self-employed, Non-QM, and investor financing with Anthony VanDyke and the VanDyke Mortgage Team. Powered by New American Funding.",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | Hampton Roads Mortgages`,
    description:
      "Talk with Anthony VanDyke, NMLS #955777, or Gonzalo Guimoye, NMLS #1131706, in Suffolk, Virginia.",
  },
  robots: { index: true, follow: true },
  formatDetection: { telephone: true, email: true, address: true },
  other: {
    "geo.region": "US-VA",
    "geo.placename": "Suffolk",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="alternate" hrefLang="en-US" href={SITE_URL} />
        <meta name="theme-color" content="#000000" />
      </head>
      <body
        className={`${dmSans.variable} ${interTight.variable} ${plexMono.variable} font-sans`}
      >
        <JsonLd data={localBusinessJsonLd()} />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-white focus:px-4 focus:py-2"
        >
          Skip to content
        </a>
        {children}
        <a className="sr-only" href={`tel:${CONTACT.phoneTel}`}>
          Call {CONTACT.phoneDisplay}
        </a>
      </body>
    </html>
  );
}
