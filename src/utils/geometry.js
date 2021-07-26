import { hexToColor } from "./colors";
import { Projection } from "./projection";

export function lineSphereIntersection(lx1, ly1, lz1, lx2, ly2, lz2, cx, cy, cz, cr, includeNormal = false) {
  const vx = lx2 - lx1;
  const vy = ly2 - ly1;
  const vz = lz2 - lz1;

  const A = vx * vx + vy * vy + vz * vz;
  const B = 2.0 * (lx1 * vx + ly1 * vy + lz1 * vz - vx * cx - vy * cy - vz * cz);
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

  if (t1 < 0.001) return [null, null];

  const s1 = [lx1 * (1 - t1) + t1 * lx2, ly1 * (1 - t1) + t1 * ly2, lz1 * (1 - t1) + t1 * lz2];
  if (D == 0) {
    return [s1, null];
  }

  const t2 = (-B + Math.sqrt(D)) / (2.0 * A);
  const s2 = [lx1 * (1 - t2) + t2 * lx2, ly1 * (1 - t2) + t2 * ly2, lz1 * (1 - t2) + t2 * lz2];

  if (includeNormal) {
    const [nx1, ny1, nz1] = unitVector(s1[0] - cx, s1[1] - cy, s1[2] - cz);
    const [nx2, ny2, nz2] = unitVector(s2[0] - cx, s2[1] - cy, s2[2] - cz);
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

export function lineTriangleIntersection(
  lx1,
  ly1,
  lz1,
  lx2,
  ly2,
  lz2,
  tx1,
  ty1,
  tz1,
  tx2,
  ty2,
  tz2,
  tx3,
  ty3,
  tz3,
  includeNormal = false
) {
  // Möller–Trumbore intersection algorithm
  const eps = 0.0000001;
  const [vx, vy, vz] = [lx2 - lx1, ly2 - ly1, lz2 - lz1];
  const [ex1, ey1, ez1] = [tx2 - tx1, ty2 - ty1, tz2 - tz1];
  const [ex2, ey2, ez2] = [tx3 - tx1, ty3 - ty1, tz3 - tz1];
  const [hx, hy, hz] = cross(vx, vy, vz, ex2, ey2, ez2);
  const a = dot(ex1, ey1, ez1, hx, hy, hz);

  if (a > -eps && a < eps) {
    return null;
  }

  const f = 1 / a;
  const [sx, sy, sz] = [lx1 - tx1, ly1 - ty1, lz1 - tz1];
  const u = f * dot(sx, sy, sz, hx, hy, hz);

  if (u < 0.0 || u > 1.0) {
    return null;
  }

  const [qx, qy, qz] = cross(sx, sy, sz, ex1, ey1, ez1);
  const v = f * dot(vx, vy, vz, qx, qy, qz);

  if (v < 0.0 || u + v > 1.0) {
    return null;
  }

  const t = f * dot(ex2, ey2, ez2, qx, qy, qz);
  if (t > eps) {
    if (includeNormal) {
      const [nx, ny, nz] = cross(ex1, ey1, ez1, ex2, ey2, ez2);
      const dist = distance(0, 0, 0, nx, ny, nz);
      return [lx1 + vx * t, ly1 + vy * t, lz1 + vz * t, nx / dist, ny / dist, nz / dist];
    }

    return [lx1 + vx * t, ly1 + vy * t, lz1 + vz * t];
  }

  return null;
}

export function unitVector(x, y, z) {
  const dist = Math.sqrt(x * x + y * y + z * z);
  return [x / dist, y / dist, z / dist];
}

export function dot(ax, ay, az, bx, by, bz) {
  return ax * bx + ay * by + az * bz;
}

export function cross(ax, ay, az, bx, by, bz) {
  return [ay * bz - az * by, az * bx - ax * bz, ax * by - ay * bx];
}

export function distance(x1, y1, z1, x2 = 0, y2 = 0, z2 = 0) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const dz = z2 - z1;
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

export function angle(ux, uy, uz, vx, vy, vz) {
  const uDist = distance(ux, uy, uz);
  const vDist = distance(vx, vy, vz);
  return Math.acos(dot(ux, uy, uz, vx, vy, vz) / (uDist * vDist));
}

export function getReflection(vx, vy, vz, nx, ny, nz) {
  const dotProduct = 2 * dot(vx, vy, vz, nx, ny, nz);
  return [vx - dotProduct * nx, vy - dotProduct * ny, vz - dotProduct * nz];
}

export function getRefraction(vx, vy, vz, nx, ny, nz, refractionRatio) {
  const isInside = dot(vx, vy, vz, nx, ny, nz) > 0;

  if (isInside) {
    // If we ray go with the normal (aka going from inside to outside)
    refractionRatio = 1 / refractionRatio;
  } else {
    //refractionRatio *= 2;
    nx *= -1;
    ny *= -1;
    nz *= -1;
  }

  const theta = angle(vx, vy, vz, nx, ny, nz);
  const sinTheta = Math.sin(theta);
  const sinThetaTimesRatio = sinTheta * refractionRatio;

  if (Math.abs(sinThetaTimesRatio) <= 1) {
    // We can continue with the refraction

    const rotationPlane = cross(vx, vy, vz, -nx, -ny, -nz);

    if (distance(...rotationPlane) === 0) {
      // No direction => just continue
      return [vx, vy, vz];
    }

    const newTheta = Math.asin(sinThetaTimesRatio);

    return rotateVectorAroundAxis(nx, ny, nz, ...rotationPlane, newTheta);
  } else {
    // Now we have to reflect the ray instead (edge case)

    return unitVector(...getReflection(vx, vy, vz, nx, ny, nz));
  }
}

export function rotateVectorAroundAxis(vx, vy, vz, rx, ry, rz, theta) {
  // Using the Rodrigues' rotation formula to rotate old ray vector to a new
  // ray vector along the rotationPlane
  const [nrx, nry, nrz] = unitVector(rx, ry, rz);
  const cos = Math.cos(-theta);
  const sin = Math.sin(-theta);
  const [vxrx, vxry, vxrz] = cross(vx, vy, vz, nrx, nry, nrz);
  const vdotr = dot(vx, vy, vz, nrx, nry, nrz);
  return [
    vx * cos + vxrx * sin + nrx * vdotr * (1 - cos),
    vy * cos + vxry * sin + nry * vdotr * (1 - cos),
    vz * cos + vxrz * sin + nrz * vdotr * (1 - cos),
  ];
}

function parseColor(color) {
  if (typeof color === "string") {
    return hexToColor(color);
  } else {
    return color;
  }
}

function parseMaterial(material) {
  if (typeof material === "string") {
    return { type: material, value: 1 };
  } else if (typeof material === "object") {
    return material;
  } else {
    return { type: "mirror", value: 1 };
  }
}

export class Sphere {
  constructor(x, y, z, r, color, material = "mirror") {
    this.x = x;
    this.y = y;
    this.z = z;
    this.r = r;
    this.color = parseColor(color);
    this.material = parseMaterial(material);
  }
  intersectLine(x1, y1, z1, x2, y2, z2, includeNormal = false) {
    return lineSphereIntersection(x1, y1, z1, x2, y2, z2, this.x, this.y, this.z, this.r, includeNormal);
  }
}

export class Triangle {
  constructor(x1, y1, z1, x2, y2, z2, x3, y3, z3, color, material = "mirror") {
    this.x1 = x1;
    this.y1 = y1;
    this.z1 = z1;
    this.x2 = x2;
    this.y2 = y2;
    this.z2 = z2;
    this.x3 = x3;
    this.y3 = y3;
    this.z3 = z3;
    this.color = parseColor(color);
    this.material = parseMaterial(material);
  }
  intersectLine(x1, y1, z1, x2, y2, z2, includeNormal = false) {
    return [
      lineTriangleIntersection(
        x1,
        y1,
        z1,
        x2,
        y2,
        z2,
        this.x1,
        this.y1,
        this.z1,
        this.x2,
        this.y2,
        this.z2,
        this.x3,
        this.y3,
        this.z3,
        includeNormal
      ),
      null,
    ];
  }
}

export class Square {
  constructor(x1, y1, z1, x2, y2, z2, x3, y3, z3, x4, y4, z4, color, material = "mirror") {
    this.x1 = x1;
    this.y1 = y1;
    this.z1 = z1;
    this.x2 = x2;
    this.y2 = y2;
    this.z2 = z2;
    this.x3 = x3;
    this.y3 = y3;
    this.z3 = z3;
    this.x4 = x4;
    this.y4 = y4;
    this.z4 = z4;
    this.color = parseColor(color);
    this.material = parseMaterial(material);
  }
  intersectLine(x1, y1, z1, x2, y2, z2, includeNormal = false) {
    const triangle1 = lineTriangleIntersection(
      x1,
      y1,
      z1,
      x2,
      y2,
      z2,
      this.x1,
      this.y1,
      this.z1,
      this.x2,
      this.y2,
      this.z2,
      this.x3,
      this.y3,
      this.z3,
      includeNormal
    );
    if (triangle1 !== null) return [triangle1, null];
    const triangle2 = lineTriangleIntersection(
      x1,
      y1,
      z1,
      x2,
      y2,
      z2,
      this.x3,
      this.y3,
      this.z3,
      this.x4,
      this.y4,
      this.z4,
      this.x1,
      this.y1,
      this.z1,
      includeNormal
    );
    return [triangle2, null];
  }
}

export function Cube(x, y, z, w, h, d, rx, ry, rz, colors, materials = "matte", insideOut = false) {
  const projection = new Projection();
  projection.skipProjection = true;
  projection.setZToSize = false;
  projection.zoom = 1;
  const scale = insideOut ? -1 : 1;
  projection.scale(-w * scale, -h * scale, d * scale);
  projection.rotateX(rx);
  projection.rotateY(ry);
  projection.rotateZ(rz);
  projection.translate(-x, y, z);
  const p000 = projection.point(0, 0, 0);
  const p001 = projection.point(0, 0, 1);
  const p010 = projection.point(0, 1, 0);
  const p011 = projection.point(0, 1, 1);
  const p100 = projection.point(1, 0, 0);
  const p101 = projection.point(1, 0, 1);
  const p110 = projection.point(1, 1, 0);
  const p111 = projection.point(1, 1, 1);
  const getColor = (color) => {
    if (typeof colors === "string") return parseColor(colors);
    return parseColor(color);
  };
  const getMaterial = (material) => {
    if (typeof materials === "string") return parseMaterial(materials);
    return parseMaterial(material);
  };
  return [
    // Top
    new Square(...p010, ...p110, ...p111, ...p011, getColor(colors[0]), getMaterial(materials[0])),
    // Bottom
    new Square(...p000, ...p001, ...p101, ...p100, getColor(colors[1]), getMaterial(materials[1])),
    // Left
    new Square(...p010, ...p011, ...p001, ...p000, getColor(colors[2]), getMaterial(materials[2])),
    // Right
    new Square(...p110, ...p100, ...p101, ...p111, getColor(colors[3]), getMaterial(materials[3])),
    // Far
    new Square(...p001, ...p011, ...p111, ...p101, getColor(colors[4]), getMaterial(materials[4])),
    // Near
    new Square(...p000, ...p100, ...p110, ...p010, getColor(colors[5]), getMaterial(materials[5])),
  ];
}
