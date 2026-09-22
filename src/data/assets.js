const measureArt = (path) => new URL(`../../assets/GRADE 4/maths game/${path}`, import.meta.url).href;
const levelArt = {
  level1: {
    bananas: measureArt("level 1/banana.png"), potatoes: measureArt("level 1/potato (1).png"),
    tomatoes: measureArt("level 1/tomato (1) (1).png"), rice: measureArt("level 1/rice packet (1).png"),
    sugar: measureArt("level 1/sugar (1).png"), water: measureArt("level 1/water bottle (1).png"),
    glass: measureArt("level 1/drinking_glass (1).png"), mug: measureArt("level 1/cup (1).png"),
    syrup: measureArt("level 1/cough syrup.png"), oil: measureArt("level 1/cooking oil (1).png"),
  },
  level2: {
    rice: measureArt("level 2/rice_packet.png"), atta: measureArt("level 2/atta packet.png"), sugar: measureArt("level 2/sugar.png"),
    daal: measureArt("level 2/daal packet.png"), haldi: measureArt("level 2/haldi.png"), salt: measureArt("level 2/salt (1).png"),
    jug: measureArt("level 2/jug.png"), water: measureArt("level 2/water_bottle.png"), bucket: measureArt("level 2/bucket.png"),
    syrup: measureArt("level 2/cough syrup.png"),
  },
};
export function resolveMathArt(artId, assetSet) { return levelArt?.[assetSet]?.[artId] ?? levelArt.level1.rice; }
const blankBin = "assets/ui/sorting-bin-blank.png";
const binIds = ["weight", "capacity", "kg", "g", "litre", "ml"];
export const assets = {
  characters: { idle: "assets/characters/idle.png", presentation: "assets/characters/final_presentation_clean.png" },
  backgrounds: {}, items: { math: levelArt.level1, mathByLevel: levelArt },
  ui: { conveyorRims: "assets/ui/conveyor-rims.png", conveyorFrame: "assets/ui/conveyor-frame.png", conveyorTrackMask: "assets/ui/conveyor-track.png",
    sortingBins: Object.fromEntries(binIds.map((id) => [id, blankBin])), boxLeaves: "assets/ui/ui-box-leaves.png" }, audio: {}, fx: {},
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
