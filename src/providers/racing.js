const clamp = (value, minimum, maximum) => Math.max(minimum, Math.min(maximum, value));

export const createRaceState = () => ({ carX: 0, steering: 0, speed: 0.72, distance: 0, offRoad: false });

export const applySteering = (state, direction) => ({
  ...state,
  steering: clamp(state.steering + Math.sign(direction) * 0.34, -1, 1),
});

export const applyBoost = (state) => ({ ...state, speed: clamp(state.speed + 0.12, 0, 1) });

export const advanceRace = (state, elapsedSeconds) => {
  const dt = clamp(elapsedSeconds, 0, 0.05);
  const carX = clamp(state.carX + state.steering * dt * 1.65, -1.35, 1.35);
  const offRoad = Math.abs(carX) > 0.82;
  const targetSpeed = offRoad ? 0.34 : 0.78;
  const speed = clamp(state.speed + (targetSpeed - state.speed) * dt * 2.4, 0.25, 1);
  return {
    carX,
    offRoad,
    speed,
    distance: state.distance + speed * dt * 95,
    steering: state.steering * Math.max(0, 1 - dt * 3.1),
  };
};
