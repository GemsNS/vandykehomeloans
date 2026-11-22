import type { ReactNode } from "react";
import { TEAM_NAME } from "@/lib/company";
import type { LegalDocument as LegalDoc, LegalNode } from "@/lib/legal/types";

const LINK =
  "font-semibold text-brand-600 underline underline-offset-2 hover:text-brand-700 break-words";

function linkProps(href: string) {
  if (href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) {
    return { href };
  }
  return { href, target: "_blank", rel: "noopener noreferrer" };
}

function render(node: LegalNode, key: number | string): ReactNode {
  if (typeof node === "string") return node;
  const kids = node.children.map((c, i) => render(c, i));
  const id = node.id;
  switch (node.tag) {
    case "h2":
      return (
        <h2
          key={key}
          id={id}
          className="scroll-mt-28 pt-6 font-display text-2xl font-bold tracking-tight text-ink"
        >
          {kids}
        </h2>
      );
    case "h3":
      return (
        <h3 key={key} id={id} className="scroll-mt-28 pt-2 font-display text-lg font-bold text-ink">
          {kids}
        </h3>
      );
    case "h4":
      return (
        <h4 key={key} id={id} className="scroll-mt-28 font-semibold text-ink">
          {kids}
        </h4>
      );
    case "p":
      return (
        <p key={key} id={id}>
          {kids}
        </p>
      );
    case "ul":
      return (
        <ul key={key} id={id} className="list-disc space-y-2 pl-5 marker:text-brand-500">
          {kids}
        </ul>
      );
    case "ol":
      return (
        <ol key={key} id={id} className="list-decimal space-y-2 pl-5 marker:text-slate-500">
          {kids}
        </ol>
      );
    case "li":
      return (
        <li key={key} id={id} className="space-y-2 pl-1 [&>ul]:mt-2 [&>ol]:mt-2">
          {kids}
        </li>
      );
    case "table":
      return (
        <div key={key} className="overflow-x-auto rounded-board border border-ink/15">
          <table id={id} className="w-full min-w-[36rem] border-collapse text-left align-top">
            {kids}
          </table>
        </div>
      );
    case "thead":
      return <thead key={key}>{kids}</thead>;
    case "tbody":
      return <tbody key={key}>{kids}</tbody>;
    case "tr":
      return (
        <tr key={key} className="border-b border-ink/10 last:border-0 even:bg-ink-50">
          {kids}
        </tr>
      );
    case "th":
      return (
        <th key={key} scope="col" className="w-1/2 bg-ink-100 px-4 py-3 font-semibold text-ink">
          {kids}
        </th>
      );
    case "td":
      return (
        <td key={key} className="w-1/2 space-y-2 px-4 py-3 align-top">
          {kids}
        </td>
      );
    case "a":
      if (!node.href) return <span key={key}>{kids}</span>;
      return (
        <a key={key} id={id} className={LINK} {...linkProps(node.href)}>
          {kids}
        </a>
      );
    case "strong":
      return (
        <strong key={key} className="font-semibold text-ink">
          {kids}
        </strong>
      );
    case "em":
      return <em key={key}>{kids}</em>;
    case "u":
      return <u key={key}>{kids}</u>;
    case "br":
      return <br key={key} />;
    case "sr":
      return (
        <span key={key} className="sr-only">
          {kids}
        </span>
      );
  }
}

/** Intro box shown above a reproduced NAF document. */
export function LegalIntro({
  kind,
  doc,
}: {
  kind: "privacy policy" | "terms of use";
  doc: LegalDoc;
}) {
  const display = doc.sourceUrl.replace(/^https:\/\/www\./, "").replace(/\/$/, "");
  return (
    <aside className="rounded-board border border-brand-500/40 bg-brand-50 p-5 text-sm leading-relaxed text-slate-700">
      <p>
        This website is operated by the {TEAM_NAME}, loan officers with New American Funding, LLC
        (NMLS #6606). The {kind} below {kind === "terms of use" ? "are" : "is"} New American
        Funding&apos;s, reproduced from newamericanfunding.com. The current version is always at{" "}
        <a href={doc.sourceUrl} target="_blank" rel="noopener noreferrer" className={LINK}>
          {display}
        </a>
        .
      </p>
    </aside>
  );
}

export function LegalToc({ doc }: { doc: LegalDoc }) {
  if (!doc.toc?.length) return null;
  return (
    <nav
      aria-labelledby="on-this-page"
      className="rounded-board border border-ink/15 bg-white p-5 text-sm"
    >
      <h2 id="on-this-page" className="eyebrow text-slate-500">
        On this page
      </h2>
      <ol className="mt-3 list-decimal space-y-1.5 pl-5 marker:text-slate-500 sm:columns-2 sm:gap-8">
        {doc.toc.map((entry) => (
          <li key={entry.id} className="break-inside-avoid">
            <a
              href={`#${entry.id}`}
              className="text-ink underline-offset-2 hover:text-brand-600 hover:underline"
            >
              {entry.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

/**
 * Renders the verbatim NAF document body: the date line, then the "On this page" contents
 * (where NAF has one, in the same position as NAF's own list), then the sections.
 */
export function LegalBody({ doc }: { doc: LegalDoc }) {
  const [dateLine, ...rest] = doc.blocks;
  return (
    <div className="space-y-4 text-[0.95rem] leading-relaxed text-slate-700">
      <p className="text-sm font-semibold text-slate-500">
        {dateLine.children.map((c, i) => render(c, i))}
      </p>
      <LegalToc doc={doc} />
      {rest.map((b, i) => render(b, i))}
    </div>
  );
}
