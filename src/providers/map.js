export const CARTO_DARK_URL = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png';
const TILE_SIZE = 256;
const MAX_LATITUDE = 85.05112878;
const SUBDOMAINS = ['a', 'b', 'c', 'd'];

export const projectToTile = ({ lat, long }, zoom) => {
  const latitude = Math.max(-MAX_LATITUDE, Math.min(MAX_LATITUDE, lat));
  const scale = 2 ** zoom;
  const radians = latitude * Math.PI / 180;
  return {
    x: ((long + 180) / 360) * scale,
    y: ((1 - Math.asinh(Math.tan(radians)) / Math.PI) / 2) * scale,
  };
};

export const buildTileGrid = (location, {
  zoom = 12, width = 768, height = 1366, tileSize = TILE_SIZE, overscan = 1,
} = {}) => {
  const center = projectToTile(location, zoom);
  const scale = 2 ** zoom;
  const originX = center.x * tileSize - width / 2;
  const originY = center.y * tileSize - height / 2;
  const startX = Math.floor(originX / tileSize) - overscan;
  const endX = Math.floor((originX + width) / tileSize) + overscan;
  const startY = Math.max(0, Math.floor(originY / tileSize) - overscan);
  const endY = Math.min(scale - 1, Math.floor((originY + height) / tileSize) + overscan);
  const tiles = [];

  for (let y = startY; y <= endY; y += 1) {
    for (let x = startX; x <= endX; x += 1) {
      const wrappedX = ((x % scale) + scale) % scale;
      const subdomain = SUBDOMAINS[(wrappedX + y) % SUBDOMAINS.length];
      tiles.push({
        key: `${zoom}-${x}-${y}`,
        left: x * tileSize - originX,
        top: y * tileSize - originY,
        url: CARTO_DARK_URL
          .replace('{s}', subdomain).replace('{z}', zoom)
          .replace('{x}', wrappedX).replace('{y}', y),
      });
    }
  }
  return tiles;
};
