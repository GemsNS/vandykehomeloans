import type { Metadata } from "next";
import type { ReactNode } from "react";
import { DM_Sans, IBM_Plex_Mono, Inter_Tight, Playfair_Display } from "next/font/google";
import Script from "next/script";
import { JsonLd } from "@/components/seo/JsonLd";
import { CONTACT, SITE_NAME, SITE_URL, TEAM_NAME } from "@/lib/company";
import { OG_IMAGE, localBusinessJsonLd } from "@/lib/seo";
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

// Serif that carries the logo wordmark.
const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-playfair",
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
    default: `${SITE_NAME} | Hampton Roads Mortgages`,
    template: `${SITE_NAME} | %s`,
  },  description:
    "The VanDyke Mortgage Team in Suffolk, VA helps first-time buyers, veterans, FHA clients, self-employed borrowers, and investors. Branch Manager Anthony VanDyke, NMLS #955777. Powered by New American Funding, NMLS #6606.",
  applicationName: SITE_NAME,
  appleWebApp: {
    capable: true,
    title: SITE_NAME,
    statusBarStyle: "black-translucent",
  },
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
  icons: {
    icon: [{ url: OG_IMAGE.url, type: "image/png" }],
    apple: [{ url: OG_IMAGE.url }],
    shortcut: OG_IMAGE.url,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} | Hampton Roads Mortgages`,
    description:
      "Conventional, FHA, VA, self-employed, Non-QM, and investor financing with Anthony VanDyke and the VanDyke Mortgage Team. Powered by New American Funding.",
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | Hampton Roads Mortgages`,
    description:
      "Talk with Anthony VanDyke, NMLS #955777, or Gonzalo Guimoye, NMLS #1131706, in Suffolk, Virginia.",
    images: [OG_IMAGE.url],
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
        <meta name="theme-color" content="#0B192C" />
        <meta name="apple-mobile-web-app-title" content={SITE_NAME} />
        <Script id="vd-splash" strategy="beforeInteractive">
          {`(function(){try{var k="vd-splash-seen";var wide=window.matchMedia("(min-width:768px)").matches;var reduced=window.matchMedia("(prefers-reduced-motion: reduce)").matches;var seen=false;try{seen=!!sessionStorage.getItem(k);}catch(e){seen=true;}if(wide||reduced||seen){document.documentElement.classList.add("splash-done");return;}setTimeout(function(){try{sessionStorage.setItem(k,"1");}catch(e){}document.documentElement.classList.add("splash-done");document.body&&(document.body.style.overflow="");},2600);}catch(e){document.documentElement.classList.add("splash-done");}})();`}
        </Script>
      </head>
      <body
        className={`${dmSans.variable} ${interTight.variable} ${playfair.variable} ${plexMono.variable} font-sans`}
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
