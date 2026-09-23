const item = (name, art, answer) => ({ name, art, answer });

const LEVELS = [
  {
    title: "Weight or Capacity?",
    instruction: "Sort by the measurement normally used when buying or pouring.",
    showNames: true,
    maxOnBelt: 4,
    beltTravelRate: 0.08,
    bins: [
      { id: "weight", label: "Weight", art: "rice" },
      { id: "capacity", label: "Capacity", art: "water" },
    ],
    items: [
      item("Bananas", "bananas", "weight"), item("Potatoes", "potatoes", "weight"),
      item("Tomatoes", "tomatoes", "weight"), item("Rice packet", "rice", "weight"), item("Sugar packet", "sugar", "weight"),
      item("Water in a bottle", "water", "capacity"), item("Glass of water", "glass", "capacity"), item("Mug of milk", "mug", "capacity"),
      item("Cough syrup", "syrup", "capacity"), item("Cooking oil", "oil", "capacity"),
    ],
  },
  {
    title: "Choose the Unit",
    instruction: "Choose kg, g, litre, or ml for each object.",
    showNames: true,
    maxOnBelt: 3,
    beltTravelRate: 0.07,
    bins: [
      { id: "kg", label: "kg", art: "rice" }, { id: "g", label: "g", art: "haldi" },
      { id: "litre", label: "litre", art: "water" }, { id: "ml", label: "ml", art: "syrup" },
    ],
    items: [
      item("Large rice bag", "rice", "kg"), item("Large atta bag", "atta", "kg"), item("Large sugar bag", "sugar", "kg"),
      item("Large daal bag", "daal", "kg"), item("Pinch of haldi", "haldi", "g"), item("Small salt packet", "salt", "g"),
      item("Water jug", "jug", "litre"), item("1 litre water bottle", "water", "litre"), item("Bucket of water", "bucket", "litre"),
      item("Cough syrup dose", "syrup", "ml"),
    ],
  },
];

function buildTutorial(level, levelIndex) {
  const examples = level.bins.map((bin) => level.items.find((entry) => entry.answer === bin.id)).filter(Boolean);
  const demonstration = examples[0] ?? level.items[0]; const interactive = examples[1] ?? level.items[1];
  const labelFor = (entry) => level.bins.find((bin) => bin.id === entry.answer)?.label ?? entry.answer;
  return { concept: level.title, intro: level.instruction, mandatory: levelIndex === 0, steps: [
    { type: "concept", instruction: level.instruction },
    { type: "demonstration", objectName: demonstration.name, instruction: `${demonstration.name} → ${labelFor(demonstration)}` },
    { type: "interactive", objectName: interactive.name, instruction: `Sort ${interactive.name}!`, allowHints: true },
    { type: "completion", instruction: "You're ready!" },
  ] };
}

export const MATH_LEVELS = LEVELS.map((level, index) => ({
  ...level, goal: level.items.length, requiredCorrectPerItem: 1, assetSet: `level${index + 1}`,
  bins: level.bins.map((entry) => ({ ...entry, assetSet: `level${index + 1}` })),
  items: level.items.map((entry) => ({ ...entry, assetSet: `level${index + 1}` })), tutorial: buildTutorial(level, index),
}));
export const getLevel = (index) => MATH_LEVELS[index];
