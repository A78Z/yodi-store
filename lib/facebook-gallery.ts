export const FACEBOOK_PAGE_URL = "https://www.facebook.com/yyodistores";
export const FACEBOOK_GRAPH_VERSION = "v26.0";
export const FACEBOOK_MEDIA_LIMIT = 24;
const PAGE_SIZE = 12;
const MAX_PAGES = 3;

export type FacebookGalleryMedia = {
  id: string;
  kind: "photo" | "video";
  thumbnail: string;
  permalink: string;
};

type RecordValue = Record<string, unknown>;
const record = (value: unknown): RecordValue => value && typeof value === "object" ? value as RecordValue : {};
const list = (value: unknown): unknown[] => Array.isArray(value) ? value : [];

export function facebookPermalink(value: unknown): string | null {
  if (typeof value !== "string") return null;
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" || !["www.facebook.com", "facebook.com", "m.facebook.com"].includes(url.hostname) || url.username || url.password || url.port) return null;
    if (url.pathname === "/" || url.pathname === "/yyodistores" || url.pathname === "/yyodistores/") return null;
    url.hostname = "www.facebook.com";
    url.hash = "";
    for (const key of [...url.searchParams.keys()]) {
      if (!["id", "story_fbid", "fbid", "set", "v"].includes(key)) url.searchParams.delete(key);
    }
    return url.href;
  } catch { return null; }
}

function thumbnailUrl(value: unknown): string | null {
  if (typeof value !== "string") return null;
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" || url.username || url.password || url.port) return null;
    if (!url.hostname.endsWith(".fbcdn.net") && !url.hostname.endsWith(".fbsbx.com")) return null;
    // Signed CDN query parameters are needed for delivery. Never derive them from a token.
    return url.href;
  } catch { return null; }
}

/** Accept only actual photo/video attachments, never link previews or post text. */
export function normalizeFacebookMedia(posts: unknown[], limit = FACEBOOK_MEDIA_LIMIT): FacebookGalleryMedia[] {
  const result: FacebookGalleryMedia[] = [];
  const seen = new Set<string>();
  const cap = Math.max(0, Math.min(FACEBOOK_MEDIA_LIMIT, Math.floor(limit)));
  for (const rawPost of posts) {
    const post = record(rawPost);
    if (post.is_published === false || typeof post.id !== "string") continue;
    const permalink = facebookPermalink(post.permalink_url);
    if (!permalink) continue;
    const walk = (raw: unknown, depth = 0) => {
      if (result.length >= cap || depth > 2) return;
      const attachment = record(raw);
      const children = list(record(attachment.subattachments).data);
      if (children.length) {
        for (const child of children.slice(0, 12)) walk(child, depth + 1);
        return;
      }
      const type = attachment.type;
      const kind = type === "photo" ? "photo" : typeof type === "string" && /^video(?:_|$)/.test(type) ? "video" : null;
      const thumbnail = thumbnailUrl(record(record(attachment.media).image).src);
      if (!kind || !thumbnail) return;
      const targetId = record(attachment.target).id;
      const key = typeof targetId === "string" && targetId ? targetId : new URL(thumbnail).origin + new URL(thumbnail).pathname;
      if (seen.has(key)) return;
      seen.add(key);
      result.push({ id: key, kind, thumbnail, permalink });
    };
    for (const attachment of list(record(post.attachments).data)) walk(attachment);
    if (result.length >= cap) break;
  }
  return result;
}

export type FacebookGalleryConfig = { pageId: string; token: string; version: string };

export function facebookGalleryConfig(env: Record<string, string | undefined>): FacebookGalleryConfig | null {
  if (env.VERCEL_ENV !== "preview" || env.VERCEL_GIT_COMMIT_REF !== "refonte") return null;
  const pageId = env.FACEBOOK_PAGE_ID?.trim();
  const token = env.FACEBOOK_PAGE_ACCESS_TOKEN?.trim();
  const version = env.FACEBOOK_GRAPH_API_VERSION?.trim() || FACEBOOK_GRAPH_VERSION;
  if (!pageId || !/^\d+$/.test(pageId) || !token || !/^v\d+\.\d+$/.test(version)) return null;
  return { pageId, token, version };
}

/** Bounded, read-only Graph requests. Do not follow API-provided URLs (may contain tokens). */
export async function fetchFacebookGallery(config: FacebookGalleryConfig, request: typeof fetch = fetch): Promise<FacebookGalleryMedia[]> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 6000);
  const get = async (path: string, params: Record<string, string>) => {
    const url = new URL(`https://graph.facebook.com/${config.version}/${path}`);
    for (const [key, value] of Object.entries(params)) url.searchParams.set(key, value);
    const response = await request(url, {
      headers: { Authorization: `Bearer ${config.token}` },
      cache: "no-store", signal: controller.signal, redirect: "error",
    });
    if (!response.ok) throw new Error("Facebook gallery unavailable");
    const payload = record(await response.json());
    if (payload.error) throw new Error("Facebook gallery unavailable");
    return payload;
  };
  try {
    // Fail closed if the configured ID does not resolve to the official page already used by Yodi-K.
    const page = await get(config.pageId, { fields: "id,link" });
    const link = typeof page.link === "string" ? new URL(page.link) : null;
    if (page.id !== config.pageId || !link || !["www.facebook.com", "facebook.com"].includes(link.hostname) || link.pathname.replace(/\/$/, "") !== "/yyodistores") return [];
    const posts: unknown[] = [];
    const cursors = new Set<string>();
    let after = "";
    for (let batch = 0; batch < MAX_PAGES; batch++) {
      const payload = await get(`${config.pageId}/published_posts`, {
        fields: "id,permalink_url,is_published,attachments{type,target,media,subattachments.limit(12){type,target,media}}",
        limit: String(PAGE_SIZE), ...(after ? { after } : {}),
      });
      posts.push(...list(payload.data).slice(0, PAGE_SIZE));
      const media = normalizeFacebookMedia(posts);
      if (media.length >= FACEBOOK_MEDIA_LIMIT) return media;
      const paging = record(payload.paging);
      const cursor = record(paging.cursors).after;
      if (!paging.next || typeof cursor !== "string" || !cursor || cursors.has(cursor)) break;
      cursors.add(cursor);
      after = cursor;
    }
    return normalizeFacebookMedia(posts);
  } catch {
    // No token, raw response, post text, or signed URL is logged or exposed as an error.
    return [];
  } finally { clearTimeout(timer); }
}
