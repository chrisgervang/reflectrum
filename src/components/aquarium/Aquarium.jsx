import React, { useEffect, useRef } from 'react';
import { MirrorEvents } from '../../helpers/events.jsx';
import { advanceAquariumWorld, createAquariumWorld } from '../../providers/aquarium.js';
import './Aquarium.css';

const drawFish = (context, fish, width, height, elapsed) => {
  const x = fish.x * width;
  const y = (fish.y + Math.sin(elapsed * 0.7 + fish.phase) * 0.012) * height;
  const size = Math.min(width, height) * 0.055 * fish.size;
  const tailWave = Math.sin(elapsed * 5 + fish.phase) * 0.14;

  context.save();
  context.translate(x, y);
  context.scale(fish.direction, 1);

  context.fillStyle = fish.color;
  context.beginPath();
  context.moveTo(-size * 0.72, 0);
  context.lineTo(-size * 1.28, -size * (0.55 + tailWave));
  context.lineTo(-size * 1.2, size * (0.55 - tailWave));
  context.closePath();
  context.fill();

  context.beginPath();
  context.ellipse(0, 0, size, size * 0.52, 0, 0, Math.PI * 2);
  context.fill();

  context.globalAlpha = 0.28;
  context.fillStyle = '#fff';
  context.beginPath();
  context.ellipse(size * 0.08, -size * 0.18, size * 0.58, size * 0.12, -0.15, 0, Math.PI * 2);
  context.fill();
  context.globalAlpha = 1;

  context.fillStyle = '#f8fdff';
  context.beginPath();
  context.arc(size * 0.56, -size * 0.12, size * 0.105, 0, Math.PI * 2);
  context.fill();
  context.fillStyle = '#071117';
  context.beginPath();
  context.arc(size * 0.59, -size * 0.12, size * 0.052, 0, Math.PI * 2);
  context.fill();
  context.restore();
};

const drawPlant = (context, x, floor, height, elapsed, color) => {
  context.strokeStyle = color;
  context.lineWidth = 5;
  context.lineCap = 'round';
  context.beginPath();
  context.moveTo(x, floor);
  for (let step = 1; step <= 6; step += 1) {
    const progress = step / 6;
    context.lineTo(
      x + Math.sin(elapsed * 0.35 + x * 0.01 + progress * 3) * 10 * progress,
      floor - height * progress,
    );
  }
  context.stroke();
};

export default function Aquarium({ onBack, onMainMenu }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d', { alpha: false });
    const world = createAquariumWorld();
    let frame;
    let lastDraw = performance.now();
    let gradient;

    const resize = () => {
      const width = Math.max(1, Math.floor(canvas.clientWidth));
      const height = Math.max(1, Math.floor(canvas.clientHeight));
      canvas.width = width;
      canvas.height = height;
      gradient = context.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, '#082d3a');
      gradient.addColorStop(0.58, '#075367');
      gradient.addColorStop(1, '#062d32');
    };

    const draw = (timestamp) => {
      frame = requestAnimationFrame(draw);
      if (document.hidden || timestamp - lastDraw < 33) return;
      const seconds = (timestamp - lastDraw) / 1000;
      lastDraw = timestamp;
      advanceAquariumWorld(world, seconds);

      const { width, height } = canvas;
      context.fillStyle = gradient;
      context.fillRect(0, 0, width, height);

      context.globalAlpha = 0.18;
      context.fillStyle = '#baf6ff';
      for (let ray = 0; ray < 4; ray += 1) {
        context.beginPath();
        context.moveTo(width * (0.08 + ray * 0.27), 0);
        context.lineTo(width * (0.2 + ray * 0.27), height * 0.68);
        context.lineTo(width * (0.35 + ray * 0.27), height * 0.68);
        context.closePath();
        context.fill();
      }
      context.globalAlpha = 1;

      world.bubbles.forEach((bubble) => {
        const x = (bubble.x + Math.sin(world.elapsed + bubble.phase) * 0.008) * width;
        const y = bubble.y * height;
        context.strokeStyle = 'rgba(210, 250, 255, 0.48)';
        context.lineWidth = 1.3;
        context.beginPath();
        context.arc(x, y, bubble.radius, 0, Math.PI * 2);
        context.stroke();
      });

      const floor = height * 0.96;
      for (let plant = 0; plant < 9; plant += 1) {
        drawPlant(
          context,
          width * (0.04 + plant * 0.12),
          floor,
          height * (0.08 + (plant % 3) * 0.035),
          world.elapsed,
          plant % 2 ? '#2aa88b' : '#45c58f',
        );
      }

      context.fillStyle = '#876f58';
      context.beginPath();
      context.moveTo(0, height * 0.94);
      for (let point = 0; point <= 12; point += 1) {
        context.lineTo((point / 12) * width, height * (0.935 + (point % 2) * 0.014));
      }
      context.lineTo(width, height);
      context.lineTo(0, height);
      context.closePath();
      context.fill();

      world.fish.forEach((fish) => drawFish(context, fish, width, height, world.elapsed));
    };

    resize();
    window.addEventListener('resize', resize);
    const backListener = MirrorEvents.addListener('SECONDARY_CLICK', onBack);
    const mainListener = MirrorEvents.addListener('SECONDARY_HOLD', onMainMenu);
    frame = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
      backListener.remove();
      mainListener.remove();
    };
  }, [onBack, onMainMenu]);

  return (
    <div className="aquarium">
      <canvas ref={canvasRef} aria-label="Animated aquarium screensaver" />
    </div>
  );
}
