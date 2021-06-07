import { ProjectWrapper } from ".";
import {
  dottedSphere,
  sort,
  mapTo3D,
  drawLayer,
  newLayer,
} from "../utils/generator";

function draw() {
  proj.lens = (point) => proj.fisheyeLens(point, 90);
  proj.fov = 30;
  proj.rotateZ(noise(1) * 360);
  proj.rotateX(45);
  proj.translate(0, 0, 3);

  const details = Math.sqrt(Math.min(500, this.width) / 500);

  background(0);

  const blur1 = newLayer(this.width);
  const blur2 = newLayer(this.width);
  const blur3 = newLayer(this.width);
  const blur4 = newLayer(this.width);
  const topLayer = newLayer(this.width);

  const pointWithBlur = (x, y, size, color, blur = 0) => {
    const blurStep = (size * 1000) / (blur * blur);
    blur4.strokeWeight(size + blur * 0.25);
    blur4.stroke(...color);
    blur4.point(x, y);
    blur3.strokeWeight(size + blur * 0.5);
    blur3.stroke(...color);
    blur3.point(x, y);
    blur2.strokeWeight(size + blur * 0.75);
    blur2.stroke(...color);
    blur2.point(x, y);
    blur1.strokeWeight(size + blur);
    blur1.stroke(...color);
    blur1.point(x, y);
    topLayer.strokeWeight(size + blur * 0.1);
    topLayer.stroke(...color, blurStep);
    topLayer.point(x, y);
  };

  const points = sort(planet(1, 400 * details, 1));
  points.forEach(([x, y, size, color, pointSize]) => {
    const blur = Math.abs(size - 0.16) * 30;
    pointWithBlur(x, y, pointSize, color, blur);
  });

  drawLayer(blur4, this.width, 0.05);
  drawLayer(blur3, this.width, 0.05);
  drawLayer(blur2, this.width, 0.05);
  drawLayer(blur1, this.width, 0.05);
  drawLayer(topLayer, this.width);
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
  return <ProjectWrapper draw={draw} {...props} />;
}

Project.prototype.name = name;
Project.prototype.finished = true;
