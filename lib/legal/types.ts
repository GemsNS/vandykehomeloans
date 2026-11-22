/** Structured, verbatim copy of a New American Funding legal page. */

export type LegalTag =
  | "h2"
  | "h3"
  | "h4"
  | "p"
  | "ul"
  | "ol"
  | "li"
  | "table"
  | "tbody"
  | "thead"
  | "tr"
  | "th"
  | "td"
  | "a"
  | "strong"
  | "em"
  | "u"
  | "br"
  /** Screen-reader-only text present in the source (NAF "visually-hidden"). */
  | "sr";

export type LegalNode = string | LegalElement;

export type LegalElement = {
  tag: LegalTag;
  id?: string;
  href?: string;
  children: LegalNode[];
};

export type LegalTocEntry = { id: string; label: string };

export type LegalDocument = {
  title: string;
  sourceUrl: string;
  /** The source's own date line, e.g. "Last Updated: October 8, 2026". */
  effective: string;
  /** Source table of contents (pulled out of the flow for an "On this page" list). */
  toc: LegalTocEntry[] | null;
  /** Article body in source order. blocks[0] is the date line paragraph. */
  blocks: LegalElement[];
};
