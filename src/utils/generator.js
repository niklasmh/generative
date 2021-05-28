function range(a, b, step = 1) {
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
