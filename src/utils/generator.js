import { Project } from "../projects/ClosedBezier";

export function range(a, b, step = 1) {
  const numbers = [];
  if (a > b) {
    for (let number = a; number < b; number += step) {
      numbers.push(number);
    }
  } else {
    for (let number = a; number < b; number += step) {
      numbers.push(number);
    }
  }
  return numbers;
}

export const union = (pointArrays) => {
  return pointArrays.flat();
};

export const sort = (points, ascending = true, dim = 2) => {
  if (ascending) {
    return points.sort((a, b) => a[dim] - b[dim]);
  }
  return points.sort((a, b) => b[dim] - a[dim]);
};

export const mapTo3D = (points, withOriginalPoints = false) =>
  withOriginalPoints
    ? points.map((point) => proj.point(...point).concat(point))
    : points.map((point) => proj.point(...point));

export const dottedLine = (x0, w, dx = 1) => {
  return range(x0, x0 + w, dx);
};

export const dottedRect = (x0, y0, w = 1, h = 1, dx = 1, dy = 1) => {
  return dottedLine(x0, w, dx)
    .map((x) => {
      const points = [];
      dottedLine(y0, h, dy).forEach((y) => points.push([x, y]));
      return points;
    })
    .flat();
};

export const dottedBox = (
  x0,
  y0,
  z0,
  w = 1,
  h = 1,
  d = 1,
  dx = 1,
  dy = 1,
  dz = 1
) => {
  return dottedRect(x0, y0, w, h, dx, dy)
    .map(([x, y]) => {
      const points = [];
      dottedLine(z0, d, dz).forEach((z) => points.push([x, y, z]));
      return points;
    })
    .flat();
};

export function d2r(deg) {
  return (deg * Math.PI) / 180;
}

export const dottedCircle = (
  x0,
  y0,
  r = 1,
  steps = 10,
  offset = 0,
  angle = 360
) => {
  const angleRad = d2r(angle);
  const step = angleRad / steps;
  const offsetRad = d2r(offset);
  return range(offsetRad, angleRad + offsetRad, step).map((a) => {
    const x = x0 + Math.cos(a) * r;
    const y = y0 + Math.sin(a) * r;
    return [x, y, 0];
  });
};

export const dottedSphere = (
  x0,
  y0,
  z0,
  r = 1,
  steps = 10,
  offset = 0,
  angle = 360
) => {
  const circumference = Math.PI * r * 2;
  return dottedCircle(0, 0, r, steps / 2, -90, 180)
    .map(([newR, z]) => {
      const newCircumference = Math.PI * newR * 2;
      const newSteps = Math.floor((steps * newCircumference) / circumference);
      return dottedCircle(x0, y0, newR, newSteps, offset, angle).map(
        ([x, y]) => {
          return [x, y, z0 + z];
        }
      );
    })
    .flat();
};

export const newLayer = (width) => {
  const layer = createGraphics(width, width);
  layer.scale(width / 100);
  layer.translate(50, 50);
  return layer;
};

export const drawLayer = (layer, width, opacity = 1) => {
  tint(255, 255 * opacity);
  scale(100 / width);
  image(layer, (-50 * width) / 100, (-50 * width) / 100, width, width);
  scale(width / 100);
};
