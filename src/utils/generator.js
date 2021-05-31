export function range(a, b, step = 1, scale = 1) {
  const numbers = [];
  const stepScaled = Math.abs(step * scale);
  const aScaled = a * scale;
  const bScaled = b * scale;
  if (b < a) {
    for (let number = bScaled; number < aScaled; number += stepScaled) {
      numbers.push(number);
    }
  } else {
    for (let number = aScaled; number < bScaled; number += stepScaled) {
      numbers.push(number);
    }
  }
  if (step * scale < 0) {
    return numbers.reverse();
  }
  return numbers;
}

export function linspace(a, b, steps = 1, endpoint = false, scale = 1) {
  const numbers = [];
  const includeEndpoint = endpoint ? 1 : 0;
  const step = (scale * (b - a)) / (steps - includeEndpoint);
  if (b < a) {
    for (let number = 0; number < steps; number++) {
      numbers.push(a + step * number);
    }
  } else {
    for (let number = 0; number < steps; number++) {
      numbers.push(a + step * number);
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
  angle = 360,
  endpoint = false,
  includeAngle = false
) => {
  return linspace(offset, angle + offset, steps, endpoint, d2r(1)).map((a) => {
    const x = x0 + Math.cos(a) * r;
    const y = y0 + Math.sin(a) * r;
    if (includeAngle) {
      return [x, y, 0, a];
    }
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
  angle = 360,
  includeAngle = false
) => {
  const circumference = 360 * r;
  return dottedCircle(0, 0, r, steps / 2, 0, 180, true, includeAngle)
    .map(([z, newR, , v]) => {
      const newCircumference = 360 * newR;
      const newSteps = Math.floor((steps * newCircumference) / circumference);
      const latitudeCircle = dottedCircle(
        x0,
        y0,
        newR,
        newSteps,
        offset,
        angle,
        false,
        includeAngle
      ).map(([x, y, , u]) => {
        if (includeAngle) {
          return [x, y, z0 + z, u, v];
        }
        return [x, y, z0 + z];
      });
      if (latitudeCircle.length !== newSteps)
        console.log(latitudeCircle.length, newSteps, newR);
      return latitudeCircle;
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
