import { ProjectWrapper } from ".";
import { dottedSphere, sort, union, mapTo3D } from "../utils/generator";

function draw() {
  proj.fov = 30;
  proj.lens = (point) => proj.fisheyeLens(point, 90);
  proj.rotateZ(noise(1) * 360);
  proj.rotateX(45);
  proj.translate(0, 0, 3);

  const details = Math.sqrt(this.width / 500);

  background(0);
  sort(union([planet(1, 400 * details, 5 / details / 4)])).forEach(
    ([x, y, _, color, pointSize]) => {
      strokeWeight(pointSize);
      stroke(...color);
      point(x, y);
    }
  );
}

function planet(radius, details, dotSize) {
  stroke(255, 255, 0);
  const oceanColor = [100, 120, 255];
  const landColor = [100, 255, 100];
  const landFrom = 0.5;
  const landScale = 0.5;
  const iceColor = [255, 255, 255];
  const iceFrom = 0.7;
  const iceScale = 1;
  const [, , backZ] = proj.point(0, 0, 0);
  return mapTo3D(dottedSphere(0, 0, 0, radius, details), true)
    .filter(([, , z]) => z > backZ)
    .map(([x, y, size, ox, oy, oz]) => {
      const s = 2;
      const o = 10;
      const depth = noise(s * (ox + o), s * (oy + o), s * (oz + o));
      const isLand = depth > landFrom;
      const isIce = depth > iceFrom;
      if (isIce) {
        const color = iceColor;
        const colorScale = size * 20 * depth;
        return [
          x *
            (1 +
              landFrom +
              (depth - landFrom) * landScale +
              (depth - iceFrom) * iceScale),
          y *
            (1 +
              landFrom +
              (depth - landFrom) * landScale +
              (depth - iceFrom) * iceScale),
          size,
          [colorScale * color[0], colorScale * color[1], colorScale * color[2]],
          size * dotSize,
        ];
      } else if (isLand) {
        const color = landColor;
        const colorScale = size * 20 * depth;
        return [
          x * (1 + landFrom + (depth - landFrom) * landScale),
          y * (1 + landFrom + (depth - landFrom) * landScale),
          size,
          [colorScale * color[0], colorScale * color[1], colorScale * color[2]],
          size * dotSize,
        ];
      } else {
        const color = oceanColor;
        const colorScale = size * 20 * depth;
        return [
          x * (1 + landFrom),
          y * (1 + landFrom),
          size,
          [colorScale * color[0], colorScale * color[1], colorScale * color[2]],
          size * dotSize,
        ];
      }
    });
}

const name = "Planet";

export function Project({ ...props }) {
  return <ProjectWrapper name={name} draw={draw} {...props} />;
}

Project.prototype.name = name;
Project.prototype.finished = true;
