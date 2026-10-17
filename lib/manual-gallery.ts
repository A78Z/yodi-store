export type ManagedGalleryMedia = { id: string; kind: "photo" | "video"; thumbnail: string; permalink: string; viewerUrl: string; label: string };
export function galleryBlobUrl(value: unknown, host: string | undefined): value is string {
  if (typeof value !== "string" || !host || !/^[a-z0-9-]+\.public\.blob\.vercel-storage\.com$/.test(host)) return false;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname === host && !url.port && !url.username && !url.password && !url.search && !url.hash && url.pathname.startsWith("/gallery/refonte/");
  } catch { return false; }
}
export function publishedGalleryMedia(records: Record<string, unknown>[], host: string | undefined): ManagedGalleryMedia[] {
  const seen = new Set<string>();
  return records.flatMap(record => {
    if (record.published !== true || !["photo", "video"].includes(String(record.kind)) || !galleryBlobUrl(record.url, host) || !galleryBlobUrl(record.thumbnail, host) || typeof record.alt !== "string" || !record.alt.trim() || seen.has(record.url)) return [];
    seen.add(record.url);
    return [{ id: String(record._id), kind: record.kind as "photo" | "video", thumbnail: record.thumbnail, permalink: "", viewerUrl: record.url, label: record.alt.slice(0, 180) }];
  }).slice(0, 24);
}
