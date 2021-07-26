import { ProjectWrapper } from ".";
import { combineColors, darkenColor } from "../utils/colors";
import { getReflection, getRefraction, distance, Sphere, Square, Cube } from "../utils/geometry";

const X = 0;
const Y = -20;
const Z = -10;
const W = 37;
const H = 50;
const D = 150;
const top = Y - H;
const bottom = Y + H;
const left = X - W;
const right = X + W;
const far = Z + D;
const near = Z;
const objects = [
  new Sphere(10, bottom - 25, Z + 20, 8, "#fff", "glass"),
  new Sphere(-5, bottom - 35, Z + 20, 5, "#fff", "glass"),
  //new Sphere(right - 35, bottom - 10, Z + 50, 10, '#f80', 'matte'),
  //new Sphere(left + 20, bottom - 20, Z + 40, 15, '#fff', 'mirror'),
  ...new Cube(
    left,
    bottom,
    near,
    W * 2,
    H * 2,
    D,
    0,
    0,
    0,
    ["#fff", "#0ff", "#800", "#080", "#ff0", "#f11"],
    ["light", "matte", "matte", "matte", "matte", "matte"]
  ),
  //...new Cube(left + 30, bottom - 20, Z + 11, 10, 10, 10, -45, -45, 0, '#00f', 'glass'),
  ...new Cube(left + 5, bottom - 0.1, Z + 30, 30, 20, 20, 0, -20, 0, "#f00", "glass"),
];

function getDxBasedOnWidth(width) {
  return 500 / width;
}

function draw() {
  const dx = getDxBasedOnWidth(this.width);

  if (frame === 0) {
    background(0);
  }

  strokeWeight(dx);
  const y = frame * dx - 50 + dx;
  for (let x = -50 + dx; x < 50; x += dx) {
    stroke(...getPixel(x, y));
    point(x, y);
  }
}

function getPixel(x, y) {
  const backgroundColor = [0, 0, 0, 255];
  return combineColors(backgroundColor, getColorFromRay(objects, x / 2, y / 2, 0, x, y, 20, 5));
}

export function getColorFromRay(objects, x1, y1, z1, x2, y2, z2, level = 1, totalLevels = -1) {
  const levels = totalLevels === -1 ? level : totalLevels;
  return objects
    .reduce((acc, object) => {
      const [s1, s2] = object.intersectLine(x1, y1, z1, x2, y2, z2, true);
      if (s1 === null) return acc;
      if (s2 === null || object.color[3] === 255) {
        return [
          ...acc,
          {
            solution: s1,
            color: object.color,
            material: object.material,
          },
        ];
      }
      return [
        ...acc,
        {
          solution: s1,
          color: object.color,
          material: object.material,
        },
        {
          solution: s2,
          color: object.color,
          material: object.material,
        },
      ];
    }, [])
    .sort((a, b) => distance(x1, y1, z1, ...b.solution) - distance(x1, y1, z1, ...a.solution))
    .reduce(
      (backdrop, { solution, color, material }) => {
        const [x, y, z, nx, ny, nz] = solution;
        if (level > 0) {
          if (material.type === "glass") {
            let refractionRatio = 1 / 1.5;
            const [rx, ry, rz] = getRefraction(x2 - x1, y2 - y1, z2 - z1, nx, ny, nz, refractionRatio);
            const reflectedColor = getColorFromRay(objects, x, y, z, x + rx, y + ry, z + rz, level - 1, levels);
            const dimmedReflectedColor = reflectedColor.slice();
            dimmedReflectedColor[3] = (reflectedColor[3] / 255) * (color[3] / 255) * 255;
            return combineColors(backdrop, combineColors(color, dimmedReflectedColor));
          }
          if (material.type === "mirror") {
            const [rx, ry, rz] = getReflection(x2 - x1, y2 - y1, z2 - z1, nx, ny, nz);
            const reflectedColor = getColorFromRay(objects, x, y, z, x + rx, y + ry, z + rz, level - 1, levels);
            const dimmedReflectedColor = reflectedColor.slice();
            dimmedReflectedColor[3] = (reflectedColor[3] / 255) * (color[3] / 255) * 255;
            return combineColors(backdrop, combineColors(color, dimmedReflectedColor));
          }
          if (material.type === "matte") {
            const [rx, ry, rz] = getReflection(x2 - x1, y2 - y1, z2 - z1, nx, ny, nz);
            const [noEffect, effect] = [1 - material.value, material.value];
            const reflectedColor = getColorFromRay(
              objects,
              x,
              y,
              z,
              x + rx * (noEffect + effect * Math.random()),
              y + ry * (noEffect + effect * Math.random()),
              z + rz * (noEffect + effect * Math.random()),
              level - 1,
              levels
            );
            const dimmedReflectedColor = reflectedColor.slice();
            const dim = 1 / (levels + 1 - level);
            dimmedReflectedColor[3] = (dimmedReflectedColor[3] / 255) * (color[3] / 255) * 255 * 0.3;
            return combineColors(backdrop, combineColors(darkenColor(color, 1), darkenColor(dimmedReflectedColor, 1)));
          }
          if (material.type === "light") {
            return color;
          }
        }
        return combineColors(backdrop, color);
      },
      [0, 0, 0, 0]
    );
}

export function Project({ ...props }) {
  return (
    <ProjectWrapper
      draw={draw}
      frameRate={100}
      finalWidth={4000}
      frames={(width) => 100 / getDxBasedOnWidth(width) - 1}
      {...props}
    />
  );
}

Project.prototype.name = "Glass effect";
Project.prototype.description = "Create glass effect using ray tracing";
Project.prototype.finished = true;
