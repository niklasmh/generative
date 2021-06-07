import { hexToColor } from "./colors";

export function lineSphereIntersection(
  lx1,
  ly1,
  lz1,
  lx2,
  ly2,
  lz2,
  cx,
  cy,
  cz,
  cr,
  includeNormal = false
) {
  const vx = lx2 - lx1;
  const vy = ly2 - ly1;
  const vz = lz2 - lz1;

  const A = vx * vx + vy * vy + vz * vz;
  const B =
    2.0 * (lx1 * vx + ly1 * vy + lz1 * vz - vx * cx - vy * cy - vz * cz);
  const C =
    lx1 * lx1 -
    2 * lx1 * cx +
    cx * cx +
    ly1 * ly1 -
    2 * ly1 * cy +
    cy * cy +
    lz1 * lz1 -
    2 * lz1 * cz +
    cz * cz -
    cr * cr;

  const D = B * B - 4 * A * C;

  if (D < 0) return [null, null];

  const t1 = (-B - Math.sqrt(D)) / (2.0 * A);

  if (t1 < -0.001) return [null, null];

  const s1 = [
    lx1 * (1 - t1) + t1 * lx2,
    ly1 * (1 - t1) + t1 * ly2,
    lz1 * (1 - t1) + t1 * lz2,
  ];
  if (D == 0) {
    return [s1, null];
  }

  const t2 = (-B + Math.sqrt(D)) / (2.0 * A);
  const s2 = [
    lx1 * (1 - t2) + t2 * lx2,
    ly1 * (1 - t2) + t2 * ly2,
    lz1 * (1 - t2) + t2 * lz2,
  ];

  if (includeNormal) {
    const [nx1, ny1, nz1] = normalVector(cx, cy, cz, s1[0], s1[1], s1[2]);
    const [nx2, ny2, nz2] = normalVector(cx, cy, cz, s2[0], s2[1], s2[2]);
    s1.push(nx1);
    s1.push(ny1);
    s1.push(nz1);
    s2.push(nx2);
    s2.push(ny2);
    s2.push(nz2);
  }

  if (Math.abs(t1 - 0.5) < Math.abs(t2 - 0.5)) {
    return [s1, s2];
  }

  return [s2, s1];
}

function normalVector(x1, y1, z1, x2, y2, z2) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const dz = z2 - z1;
  const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
  return [dx / dist, dy / dist, dz / dist];
}

function dot(ax, ay, az, bx, by, bz) {
  return ax * bx + ay * by + az * bz;
}

export function distance(x1, y1, z1, x2, y2, z2) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const dz = z2 - z1;
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

export function getReflection(vx, vy, vz, nx, ny, nz) {
  const dotProduct = 2 * dot(vx, vy, vz, nx, ny, nz);
  return [vx - dotProduct * nx, vy - dotProduct * ny, vz - dotProduct * nz];
}

export class Sphere {
  constructor(x, y, z, r, color) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.r = r;
    if (typeof color === "string") {
      this.color = hexToColor(color);
    } else {
      this.color = color;
    }
  }
  intersectLine(x1, y1, z1, x2, y2, z2, includeNormal = false) {
    return lineSphereIntersection(
      x1,
      y1,
      z1,
      x2,
      y2,
      z2,
      this.x,
      this.y,
      this.z,
      this.r,
      includeNormal
    );
  }
}
