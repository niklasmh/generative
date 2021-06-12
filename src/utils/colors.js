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
