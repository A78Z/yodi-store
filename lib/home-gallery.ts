import type { HomeGalleryMedia } from "@/components/home/HomeMediaGallery";

// Visuels fournis par Yodi-K le 17 octobre 2026, réservés à la Preview refonte.
const descriptions = [
  "Baume capillaire ouvert dans une lumière dorée",
  "Baume Barbe Yodi-K, boîte bleue de 60 ml",
  "Huile capillaire en flacon compte-gouttes",
  "Collection de soins capillaires avec des fleurs roses",
  "Duo huile capillaire et baume pour cheveux",
  "Huile Barbe Yodi-K dans une lumière dorée",
  "Huile Locks Yodi-K sur une pierre claire",
  "Duo capillaire Yodi-K, Baume Hair et Hair Oil",
  "Un homme présente deux baumes pour la barbe",
  "Huile capillaire posée sur un pot de baume",
  "Une femme aux locks présente le soin Huile Locks",
];
export const suppliedGalleryPhotos: HomeGalleryMedia[] = descriptions.map((label, index) => {
  const url = `/gallery/refonte/soin-${String(index + 1).padStart(2, "0")}.jpg`;
  return { id: `supplied-${index + 1}`, kind: "photo", thumbnail: url, viewerUrl: url, permalink: "", label };
});

// Keep admin publications first and fill both six-card rows, including an empty feed.
export function completeHomeGallery(managed: HomeGalleryMedia[]): HomeGalleryMedia[] {
  const result = [...managed, ...suppliedGalleryPhotos].slice(0, 12);
  while (result.length < 12) {
    const item = suppliedGalleryPhotos[(result.length - managed.length) % suppliedGalleryPhotos.length];
    result.push({ ...item, id: `${item.id}-repeat-${result.length}` });
  }
  return result;
}
