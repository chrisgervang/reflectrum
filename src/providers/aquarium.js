const palette = ['#ff8f70', '#ffcf66', '#58d6c7', '#67a7ff', '#b693ff', '#f47fb0'];

const seededRandom = (seed = 9173) => {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
};

export const createAquariumWorld = ({ fishCount = 14, bubbleCount = 34, seed = 9173 } = {}) => {
  const random = seededRandom(seed);
  return {
    elapsed: 0,
    fish: Array.from({ length: fishCount }, (_, index) => ({
      x: random(),
      y: 0.12 + random() * 0.7,
      speed: 0.018 + random() * 0.025,
      direction: random() > 0.5 ? 1 : -1,
      size: 0.65 + random() * 0.75,
      phase: random() * Math.PI * 2,
      color: palette[index % palette.length],
    })),
    bubbles: Array.from({ length: bubbleCount }, () => ({
      x: 0.04 + random() * 0.92,
      y: random(),
      speed: 0.018 + random() * 0.035,
      radius: 1.5 + random() * 3.5,
      phase: random() * Math.PI * 2,
    })),
  };
};

export const advanceAquariumWorld = (world, seconds) => {
  const delta = Math.min(Math.max(seconds, 0), 0.1);
  world.elapsed += delta;
  world.fish.forEach((fish) => {
    fish.x += fish.speed * fish.direction * delta;
    if (fish.direction > 0 && fish.x > 1.13) fish.x = -0.13;
    if (fish.direction < 0 && fish.x < -0.13) fish.x = 1.13;
  });
  world.bubbles.forEach((bubble) => {
    bubble.y -= bubble.speed * delta;
    if (bubble.y < -0.02) bubble.y = 1.02;
  });
  return world;
};
