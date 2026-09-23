const measureArt = (path) => new URL(`../../assets/GRADE 4/maths game/${path}`, import.meta.url).href;
const levelArt = {
  level1: {
    bananas: measureArt("level 1/banana.webp"), potatoes: measureArt("level 1/potato (1).webp"),
    tomatoes: measureArt("level 1/tomato (1) (1).webp"), rice: measureArt("level 1/rice packet (1).webp"),
    sugar: measureArt("level 1/sugar (1).webp"), water: measureArt("level 1/water bottle (1).webp"),
    glass: measureArt("level 1/drinking_glass (1).webp"), mug: measureArt("level 1/cup (1).webp"),
    syrup: measureArt("level 1/cough syrup.webp"), oil: measureArt("level 1/cooking oil (1).webp"),
  },
  level2: {
    rice: measureArt("level 2/rice_packet.webp"), atta: measureArt("level 2/atta packet.webp"), sugar: measureArt("level 2/sugar.webp"),
    daal: measureArt("level 2/daal packet.webp"), haldi: measureArt("level 2/haldi.webp"), salt: measureArt("level 2/salt (1).webp"),
    jug: measureArt("level 2/jug.webp"), water: measureArt("level 2/water_bottle.webp"), bucket: measureArt("level 2/bucket.webp"),
    syrup: measureArt("level 2/cough syrup.webp"),
  },
};
export function resolveMathArt(artId, assetSet) { return levelArt?.[assetSet]?.[artId] ?? levelArt.level1.rice; }
const blankBin = "assets/ui/sorting-bin-blank.webp";
const binIds = ["weight", "capacity", "kg", "g", "litre", "ml"];
export const assets = {
  characters: {
    idle: "assets/characters/idle.webp",
    presentation: "assets/characters/final_presentation_clean.webp",
    correct: "assets/characters/modified_thubms_up.webp",
    nod: "assets/characters/updated_nod.webp",
    happy: "assets/characters/happy.webp",
    thinking: "assets/characters/thinking.webp",
    surprised: "assets/characters/surprised.webp",
    successDance: "assets/characters/moon_walk_normalized.webp",
  },
  backgrounds: {}, items: { math: levelArt.level1, mathByLevel: levelArt },
  ui: {
    success: ["assets/backgrounds/bg.webp", "assets/backgrounds/badge.webp", "assets/ui/image 18.webp", "assets/ui/success-star-1.webp", "assets/ui/success-star-2.webp", "assets/ui/success-star-3.webp"],
    conveyorRims: "assets/ui/conveyor-rims.webp", conveyorFrame: "assets/ui/conveyor-frame.webp", conveyorTrackMask: "assets/ui/conveyor-track.webp",
    sortingBins: Object.fromEntries(binIds.map((id) => [id, blankBin])), boxLeaves: "assets/ui/ui-box-leaves.webp" }, audio: {}, fx: {},
};
const imageRequests = new Map();
export function preloadImage(src) {
  if (!src) return Promise.resolve(); if (imageRequests.has(src)) return imageRequests.get(src);
  const request = new Promise((resolve) => { const image = new Image(); image.decoding = "async";
    image.onload = async () => { await image.decode?.().catch(() => {}); resolve({ src, loaded: true }); };
    image.onerror = () => resolve({ src, loaded: false }); image.src = src; });
  imageRequests.set(src, request); return request;
}
export function hydrateDeferredImages(root = document) {
  return Promise.all([...root.querySelectorAll("img[data-src]")].map((image) => { const src = image.dataset.src; delete image.dataset.src;
    image.src = src; return image.decode?.().catch(() => {}) ?? preloadImage(src); }));
}
export function preloadLevelAssets(level) {
  if (!level) return Promise.resolve([]);
  const urls = new Set([assets.ui.boxLeaves, ...level.items.map((entry) => resolveMathArt(entry.art, entry.assetSet)),
    ...level.bins.flatMap((entry) => [resolveMathArt(entry.art, entry.assetSet), assets.ui.sortingBins[entry.id] ?? blankBin])]);
  return Promise.all([...urls].map(preloadImage));
}
