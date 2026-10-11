/**
 * Turns a pasted share link into something the page can embed. Kept separate
 * from the page so the URL rules can be read (and extended) in one place.
 * Anything unrecognised falls back to a plain link card rather than a broken
 * iframe.
 */

export type Embed =
  | {
      kind: "iframe";
      src: string;
      provider: string;
      /** landscape = 16:9 video, portrait = 9:16 short/reel, post = social post with its own chrome */
      shape: "landscape" | "portrait" | "post";
    }
  | { kind: "link"; href: string; host: string };

const youtubeId = /^[\w-]{11}$/;

export function resolveEmbed(raw: string): Embed {
  let url: URL;
  try {
    url = new URL(raw.trim());
  } catch {
    return { kind: "link", href: raw, host: raw };
  }

  const host = url.hostname.replace(/^(www|m)\./, "");
  const parts = url.pathname.split("/").filter(Boolean);
  const fallback: Embed = { kind: "link", href: url.toString(), host };

  // youtube-nocookie keeps YouTube from setting tracking cookies until the
  // viewer actually presses play.
  const youtube = (id: string | null | undefined, shape: "landscape" | "portrait"): Embed =>
    id && youtubeId.test(id)
      ? { kind: "iframe", provider: "YouTube", shape, src: `https://www.youtube-nocookie.com/embed/${id}` }
      : fallback;

  if (host === "youtu.be") return youtube(parts[0], "landscape");
  if (host === "youtube.com") {
    if (url.pathname === "/watch") return youtube(url.searchParams.get("v"), "landscape");
    if (parts[0] === "shorts") return youtube(parts[1], "portrait");
    if (parts[0] === "embed" || parts[0] === "live") return youtube(parts[1], "landscape");
    return fallback;
  }

  // Instagram's /embed/ view supports swiping through carousel posts inline.
  if (host === "instagram.com" && ["p", "reel", "reels", "tv"].includes(parts[0]) && parts[1]) {
    const kind = parts[0] === "p" ? "p" : "reel";
    return {
      kind: "iframe",
      provider: "Instagram",
      shape: "post",
      src: `https://www.instagram.com/${kind}/${parts[1]}/embed/captioned/`,
    };
  }

  if (host === "linkedin.com") {
    if (parts[0] === "embed") return { kind: "iframe", provider: "LinkedIn", shape: "post", src: url.toString() };
    // Share links come in two shapes; both carry the post's numeric id.
    const urn = url.pathname.match(/urn:li:(?:activity|share|ugcPost):\d+/)?.[0];
    const activityId = url.pathname.match(/activity-(\d{15,})/)?.[1];
    const target = urn ?? (activityId ? `urn:li:activity:${activityId}` : null);
    return target
      ? { kind: "iframe", provider: "LinkedIn", shape: "post", src: `https://www.linkedin.com/embed/feed/update/${target}` }
      : fallback;
  }

  if (host === "vimeo.com" && /^\d+$/.test(parts[0] ?? "")) {
    return { kind: "iframe", provider: "Vimeo", shape: "landscape", src: `https://player.vimeo.com/video/${parts[0]}` };
  }

  if (host === "drive.google.com" && parts[0] === "file" && parts[1] === "d" && parts[2]) {
    return { kind: "iframe", provider: "Google Drive", shape: "landscape", src: `https://drive.google.com/file/d/${parts[2]}/preview` };
  }

  return fallback;
}
