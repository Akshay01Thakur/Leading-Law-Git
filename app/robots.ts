import type { MetadataRoute } from "next";
import { absoluteUrl } from "./seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          // Passcode-gated advocate view — must never be indexed.
          "/confirm",
          // Booking funnel: query-param driven, no search value.
          "/consultation/",
        ],
      },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
