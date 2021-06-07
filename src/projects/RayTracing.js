import { ProjectWrapper } from ".";
import { combineColors } from "../utils/colors";
import { Sphere, getReflection, distance } from "../utils/geometry";

const objects = [
  new Sphere(-20, -10, 45, 30, "#000"),
  new Sphere(20, 20, 30, 15, "#0a08"),
  new Sphere(25, -20, 20, 10, "#fff"),
  new Sphere(-16, -9, 5, 5, "#f804"),
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
  const backgroundColor = [x + 150, y + 150, 255, 100];
  return combineColors(
    backgroundColor,
    getColorFromRay(objects, x / 2, y / 2, 0, x, y, 20, 5)
  );
}

function getColorFromRay(objects, x1, y1, z1, x2, y2, z2, level = 1) {
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
          },
        ];
      }
      return [
        ...acc,
        {
          solution: s1,
          color: object.color,
        },
        {
          solution: s2,
          color: object.color,
        },
      ];
    }, [])
    .sort(
      (a, b) =>
        distance(x1, y1, z1, ...b.solution) -
        distance(x1, y1, z1, ...a.solution)
    )
    .reduce(
      (backdrop, { solution, color }) => {
        const [x, y, z, nx, ny, nz] = solution;
        if (level > 0) {
          const [rx, ry, rz] = getReflection(
            x2 - x1,
            y2 - y1,
            z2 - z1,
            nx,
            ny,
            nz
          );
          const reflectedColor = getColorFromRay(
            objects,
            x,
            y,
            z,
            x + rx,
            y + ry,
            z + rz,
            level - 1
          );
          const dimmedReflectedColor = reflectedColor.slice();
          dimmedReflectedColor[3] =
            (reflectedColor[3] / 255) * (color[3] / 255) * 255;
          return combineColors(
            backdrop,
            combineColors(color, dimmedReflectedColor)
          );
        }
        return combineColors(backdrop, color);
      },
      [0, 0, 0, 0]
    );
}

const name = "Ray tracing";

export function Project({ ...props }) {
  return (
    <ProjectWrapper
      name={name}
      draw={draw}
      frameRate={100}
      frames={(width) => 100 / getDxBasedOnWidth(width) - 1}
      {...props}
    />
  );
}

Project.prototype.name = name;
Project.prototype.finished = false;
