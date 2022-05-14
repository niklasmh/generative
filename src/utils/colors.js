import { normal, darken } from "color-blend";

export function combineColors(c1, c2) {
  if (c2[3] === 255) return c2;
  const { r, g, b, a } = normal(
    {
      r: c1[0],
      g: c1[1],
      b: c1[2],
      a: c1[3] / 255,
    },
    {
      r: c2[0],
      g: c2[1],
      b: c2[2],
      a: c2[3] / 255,
    }
  );
  return [r, g, b, a * 255];
}

export function darkenColor(color, value, withAlpha = false) {
  const [r, g, b, a] = color;
  if (withAlpha) {
    return [r * value, g * value, b * value, a * value];
  }
  return [r * value, g * value, b * value, a];
}

export function hexToColor(hex) {
  if (hex.length < 3) return [0, 0, 0, 0];
  if (hex.length < 6) {
    const [r, g, b, a = 255] = hex.match(/\w/g).map((x) => parseInt(x + x, 16));
    return [r, g, b, a];
  } else {
    const [r, g, b, a = 255] = hex.match(/\w\w/g).map((x) => parseInt(x, 16));
    return [r, g, b, a];
  }
}

export function hueToColor(deg, alpha = 255) {
  const phase = (Math.PI * 2) / 3;
  const amp = 255;
  const rad = (deg * Math.PI) / 180;
  const r = 0.5 * (1 + Math.cos(rad)) * amp;
  const g = 0.5 * (1 + Math.cos(rad + phase * 2)) * amp;
  const b = 0.5 * (1 + Math.cos(rad + phase)) * amp;
  return [r, g, b, alpha];
}
