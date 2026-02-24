export const GRID_WIDTH = 50;
export const GRID_HEIGHT = 50;
export const TICK_INTERVAL_MS = 100;

export const COLOR_PRESETS = {
  'blue-red': {
    label: 'Azul / Rojo (Clásico)',
    colorA: [0, 80, 255],
    colorB: [255, 30, 30],
  },
  'green-purple': {
    label: 'Verde / Púrpura',
    colorA: [16, 185, 129],
    colorB: [168, 85, 247],
  },
  'cyan-orange': {
    label: 'Cian / Naranja',
    colorA: [6, 182, 212],
    colorB: [249, 115, 22],
  },
  'yellow-indigo': {
    label: 'Amarillo / Índigo',
    colorA: [234, 179, 8],
    colorB: [99, 102, 241],
  },
  'pink-teal': {
    label: 'Rosa / Teal',
    colorA: [236, 72, 153],
    colorB: [20, 184, 166],
  },
  'custom': {
    label: 'Personalizado',
    colorA: [0, 80, 255],
    colorB: [255, 30, 30],
  },
};

export function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]
    : [0, 0, 0];
}

export function rgbToHex([r, g, b]) {
  return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
}

export function lerpColor(colorA, colorB, t) {
  return [
    Math.round(colorA[0] + (colorB[0] - colorA[0]) * t),
    Math.round(colorA[1] + (colorB[1] - colorA[1]) * t),
    Math.round(colorA[2] + (colorB[2] - colorA[2]) * t),
  ];
}
