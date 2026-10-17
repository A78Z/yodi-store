import "server-only";
import { unstable_cache } from "next/cache";
import { facebookGalleryConfig, fetchFacebookGallery } from "@/lib/facebook-gallery";

export async function getFacebookGallery() {
  const config = facebookGalleryConfig(process.env);
  if (!config) return [];
  // A shared server cache, including empty/error responses, rather than one Graph call per visitor.
  // No token is passed as a cache argument or included in its key.
  return unstable_cache(() => fetchFacebookGallery(config),
    ["yodi-facebook-gallery-v1", config.pageId, config.version], { revalidate: 300 })();
}
