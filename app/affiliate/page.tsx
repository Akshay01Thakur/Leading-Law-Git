import type { Metadata } from "next";
import Link from "next/link";
import { BrandLogo } from "../components/BrandLogo";
import { resolveEmbed } from "./embed";
import { AffiliateItem, affiliateItems } from "./links";

// Unlisted: reachable only by typing or sharing the URL. Nothing on the site
// links here and the sitemap does not list it, so the remaining exposure is a
// search engine stumbling on it through an outside link — which noindex,
// nofollow covers. robots.txt is deliberately left alone; see links.ts.
export const metadata: Metadata = {
  title: "Videos & carousels",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false, noimageindex: true },
  },
};

const sections: { type: AffiliateItem["type"]; heading: string }[] = [
  { type: "video", heading: "Videos" },
  { type: "carousel", heading: "Carousels" },
];

function MediaCard({ item }: { item: AffiliateItem }) {
  const embed = resolveEmbed(item.url);

  return (
    <article className="affiliate-card">
      {embed.kind === "iframe" ? (
        <div className={`affiliate-frame ${embed.shape}`}>
          <iframe
            src={embed.src}
            title={item.title ?? `${embed.provider} embed`}
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      ) : (
        <a className="affiliate-linkcard" href={embed.href} target="_blank" rel="noopener noreferrer">
          <span>{embed.host}</span>
          <strong>Open link ↗</strong>
        </a>
      )}

      {(item.title || item.note) && (
        <div className="affiliate-meta">
          {item.title && <h3>{item.title}</h3>}
          {item.note && <p>{item.note}</p>}
        </div>
      )}

      <a className="affiliate-source" href={item.url} target="_blank" rel="noopener noreferrer">
        View original ↗
      </a>
    </article>
  );
}

export default function AffiliatePage() {
  const populated = sections
    .map((section) => ({ ...section, items: affiliateItems.filter((item) => item.type === section.type) }))
    .filter((section) => section.items.length > 0);

  return (
    <main className="affiliate-page">
      <header className="affiliate-header">
        <Link href="/" aria-label="Leading Law home">
          <BrandLogo width={232} priority />
        </Link>
      </header>

      <section className="affiliate-body">
        <h1>Videos &amp; carousels</h1>

        {populated.length === 0 ? (
          <p className="affiliate-empty">Nothing has been added here yet.</p>
        ) : (
          populated.map((section) => (
            <div className="affiliate-section" key={section.type}>
              <h2>{section.heading}</h2>
              <div className={`affiliate-grid ${section.type}`}>
                {section.items.map((item, index) => (
                  <MediaCard item={item} key={`${item.url}-${index}`} />
                ))}
              </div>
            </div>
          ))
        )}
      </section>
    </main>
  );
}
