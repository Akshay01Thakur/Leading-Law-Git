/**
 * Affiliate media page — https://leadinglaw.in/affiliate
 *
 * TO ADD A VIDEO OR CAROUSEL: copy one of the example lines below, remove the
 * leading "//", and paste your link. Use the normal share link from the app —
 * the page works out how to embed it. Saving this file on GitHub (main branch)
 * redeploys the site automatically within a minute or two.
 *
 * Embeds automatically:
 *   - YouTube videos and Shorts
 *   - Instagram posts, reels and carousels
 *   - LinkedIn posts and document carousels
 *   - Vimeo videos
 *   - Google Drive videos (file must be shared as "Anyone with the link")
 * Any other link still appears, as a card that opens it in a new tab.
 *
 * The page is unlisted on purpose: nothing on the site links to it, it is not
 * in the sitemap, and it tells search engines not to index it. Do NOT add it
 * to robots.txt — that file is public, so listing the path there would
 * advertise exactly what this page is meant to keep quiet.
 */

export type AffiliateItem = {
  /** Which section the item appears under. */
  type: "video" | "carousel";
  /** The share link, exactly as copied from YouTube / Instagram / LinkedIn etc. */
  url: string;
  /** Optional heading shown under the embed. */
  title?: string;
  /** Optional one-line description. */
  note?: string;
};

export const affiliateItems: AffiliateItem[] = [
  // { type: "video", url: "https://www.youtube.com/watch?v=XXXXXXXXXXX", title: "Video title" },
  // { type: "video", url: "https://www.youtube.com/shorts/XXXXXXXXXXX", title: "Short title" },
  // { type: "carousel", url: "https://www.instagram.com/p/XXXXXXXXXXX/", title: "Carousel title" },
  // { type: "carousel", url: "https://www.linkedin.com/posts/your-post-activity-1234567890123456789-abcd", title: "LinkedIn carousel" },
];
