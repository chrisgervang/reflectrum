import React, { useEffect, useRef } from 'react';
import { MirrorEvents } from '../../helpers/events';
import { advanceRace, applyBoost, applySteering, createRaceState } from '../../providers/racing';
import './RacingGame.css';

const WIDTH = 384;
const HEIGHT = 683;
const HORIZON = 178;
const roadCenter = (state, depth) => WIDTH / 2
  + Math.sin(state.distance * 0.012 + depth * 2.6) * 48 * depth
  - state.carX * 92 * depth;

const drawBackground = (context, state) => {
  const sky = context.createLinearGradient(0, 0, 0, HORIZON);
  sky.addColorStop(0, '#07152e');
  sky.addColorStop(1, '#e55946');
  context.fillStyle = sky;
  context.fillRect(0, 0, WIDTH, HORIZON);
  context.fillStyle = '#131b35';
  context.beginPath();
  context.moveTo(0, HORIZON);
  for (let x = 0; x <= WIDTH; x += 24) {
    context.lineTo(x, HORIZON - 24 - Math.sin(x * .043 + state.distance * .002) * 23);
  }
  context.lineTo(WIDTH, HORIZON);
  context.fill();
  context.fillStyle = '#183c2b';
  context.fillRect(0, HORIZON, WIDTH, HEIGHT - HORIZON);
};

const drawRoad = (context, state) => {
  const segments = 34;
  const phase = (state.distance * 1.4) % 1;
  for (let index = segments; index >= 0; index -= 1) {
    const nearDepth = Math.min(1, (index + phase) / segments);
    const farDepth = Math.min(1, (index - 1 + phase) / segments);
    const nearY = HORIZON + nearDepth * nearDepth * (HEIGHT - HORIZON);
    const farY = HORIZON + farDepth * farDepth * (HEIGHT - HORIZON);
    const nearHalf = 18 + nearDepth * 210;
    const farHalf = 18 + farDepth * 210;
    const nearCenter = roadCenter(state, nearDepth);
    const farCenter = roadCenter(state, farDepth);
    const alternate = (Math.floor(state.distance * .06) + index) % 2 === 0;
    context.fillStyle = alternate ? '#d9d9d4' : '#ef4b3e';
    context.beginPath();
    context.moveTo(farCenter - farHalf - 10 * farDepth, farY);
    context.lineTo(farCenter + farHalf + 10 * farDepth, farY);
    context.lineTo(nearCenter + nearHalf + 10 * nearDepth, nearY);
    context.lineTo(nearCenter - nearHalf - 10 * nearDepth, nearY);
    context.fill();
    context.fillStyle = alternate ? '#24252a' : '#292a2f';
    context.beginPath();
    context.moveTo(farCenter - farHalf, farY);
    context.lineTo(farCenter + farHalf, farY);
    context.lineTo(nearCenter + nearHalf, nearY);
    context.lineTo(nearCenter - nearHalf, nearY);
    context.fill();
    if (alternate && nearDepth > .12) {
      context.strokeStyle = 'rgba(255,255,255,.82)';
      context.lineWidth = Math.max(1, nearDepth * 4);
      [-1 / 3, 1 / 3].forEach((lane) => {
        context.beginPath();
        context.moveTo(farCenter + lane * farHalf, farY);
        context.lineTo(nearCenter + lane * nearHalf, nearY);
        context.stroke();
      });
    }
  }
};

const drawTraffic = (context, state) => {
  [0.17, 0.39, 0.67].forEach((baseDepth, index) => {
    const depth = (baseDepth + state.distance * .0014 * (index + 1)) % .82 + .08;
    const lane = [-.46, .38, -.08][index];
    const size = 10 + depth * 34;
    const x = roadCenter(state, depth) + lane * (18 + depth * 190);
    const y = HORIZON + depth * depth * (HEIGHT - HORIZON);
    context.fillStyle = ['#54b9ff', '#ffd54a', '#ee6677'][index];
    context.fillRect(x - size / 2, y - size, size, size * .72);
    context.fillStyle = '#111';
    context.fillRect(x - size * .32, y - size * .82, size * .64, size * .24);
  });
};

const drawCar = (context, state) => {
  const x = WIDTH / 2 + state.carX * 42;
  const y = HEIGHT - 86;
  context.save();
  context.translate(x, y);
  context.rotate(state.steering * .08);
  context.fillStyle = state.offRoad ? '#ffb13b' : '#ff3b30';
  context.beginPath();
  context.moveTo(-31, 30);
  context.lineTo(-24, -25);
  context.lineTo(-13, -43);
  context.lineTo(13, -43);
  context.lineTo(24, -25);
  context.lineTo(31, 30);
  context.closePath();
  context.fill();
  context.fillStyle = '#bde8ff';
  context.fillRect(-14, -28, 28, 18);
  context.fillStyle = '#0c1016';
  context.fillRect(-34, 12, 8, 20);
  context.fillRect(26, 12, 8, 20);
  context.restore();
};

const drawFrame = (context, state) => {
  drawBackground(context, state);
  drawRoad(context, state);
  drawTraffic(context, state);
  drawCar(context, state);
};

export const RacingGame = ({ secondaryClick, secondaryHold }) => {
  const canvasRef = useRef(null);
  const fpsRef = useRef(null);
  const speedRef = useRef(null);
  const stateRef = useRef(createRaceState());

  useEffect(() => {
    const handlers = [
      MirrorEvents.addListener('STEER_LEFT', () => { stateRef.current = applySteering(stateRef.current, -1); }),
      MirrorEvents.addListener('STEER_RIGHT', () => { stateRef.current = applySteering(stateRef.current, 1); }),
      MirrorEvents.addListener('PRIMARY_CLICK', () => { stateRef.current = applyBoost(stateRef.current); }),
      MirrorEvents.addListener('SECONDARY_CLICK', secondaryClick),
      MirrorEvents.addListener('SECONDARY_HOLD', secondaryHold),
    ];
    const context = canvasRef.current.getContext('2d', { alpha: false });
    let animationFrame;
    let previousTime = performance.now();
    let sampleStart = previousTime;
    let sampleFrames = 0;
    const animate = (time) => {
      stateRef.current = advanceRace(stateRef.current, (time - previousTime) / 1000);
      previousTime = time;
      drawFrame(context, stateRef.current);
      sampleFrames += 1;
      if (time - sampleStart >= 500) {
        fpsRef.current.textContent = `${Math.round(sampleFrames * 1000 / (time - sampleStart))} FPS`;
        speedRef.current.textContent = `${Math.round(stateRef.current.speed * 125)} MPH`;
        sampleStart = time;
        sampleFrames = 0;
      }
      animationFrame = requestAnimationFrame(animate);
    };
    animationFrame = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(animationFrame);
      handlers.forEach((handler) => handler.remove());
    };
  }, [secondaryClick, secondaryHold]);

  return (
    <div className="racing-game">
      <canvas ref={canvasRef} width={WIDTH} height={HEIGHT} aria-label="Dial-controlled racing performance test" />
      <div className="racing-hud"><strong ref={speedRef}>90 MPH</strong><span ref={fpsRef}>— FPS</span></div>
      <div className="racing-help">Large dial steers · Forward boosts · Back exits</div>
    </div>
  );
};

export default RacingGame;
