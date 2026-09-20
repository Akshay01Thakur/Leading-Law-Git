import type { MetadataRoute } from "next";
import { topicLibrary } from "./legalKnowledge";
import { absoluteUrl } from "./seo";

/**
 * Only the 110 topic pages are submitted. The 5,390 other phrasing URLs are
 * `noindex, follow` and canonicalise to these, so listing them would just
 * spend crawl budget on pages that are not meant to be indexed.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    { url: absoluteUrl("/"), lastModified, changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/questions"), lastModified, changeFrequency: "weekly", priority: 0.9 },
    { url: absoluteUrl("/consumer"), lastModified, changeFrequency: "monthly", priority: 0.7 },
    ...topicLibrary.map((item) => ({
      url: absoluteUrl(`/questions/${item.slug}`),
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
