import { ProjectWrapper } from ".";
import { dottedSphere, sort, mapTo3D, drawLayer, newLayer, dottedCircle } from "../utils/generator";

let oceanColor = [100, 120, 255];
let landColor = [100, 255, 100];
let iceColor = [255, 255, 255];

function hue(deg, a = 1, scale = 1) {
  const rad = (deg * Math.PI) / 180;
  const off = (2 * Math.PI) / 3;
  const r = (0.5 + 0.5 * Math.sin(rad)) * 255 * scale;
  const g = (0.5 + 0.5 * Math.sin(rad + off)) * 255 * scale;
  const b = (0.5 + 0.5 * Math.sin(rad + 2 * off)) * 255 * scale;
  return [r, g, b, a];
}
function draw() {
  oceanColor = hue(0, 1, 0.8); //[100, 120, 255];
  landColor = hue(0);
  iceColor = hue(0);

  //proj.lens = (point) => proj.fisheyeLens(point, 90);
  proj.fov = 30;
  proj.rotateZ(noise(1) * 360);
  proj.rotateX(45);
  proj.translate(0, 0, 6);

  const details = Math.sqrt(Math.min(500, this.width) / 500);

  background(0);

  let blur1 = newLayer(this.width);
  let blur2 = newLayer(this.width);
  let blur3 = newLayer(this.width);
  let blur4 = newLayer(this.width);
  let topLayer = newLayer(this.width);

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

  const dots = dottedSphere(0, 0, 0, 1, 400 * details);
  const dots3D = planet(1, dots);

  const points = sort(dots3D);
  points.forEach(([x, y, size, color, pointSize]) => {
    const blur = Math.abs(size - 0.3) * 30;
    pointWithBlur(-x * 10, -y * 10, pointSize * 5, color, blur);
  });

  drawLayer(blur4, this.width, 0.02);
  drawLayer(blur3, this.width, 0.02);
  drawLayer(blur2, this.width, 0.02);
  drawLayer(blur1, this.width, 0.02);
  drawLayer(topLayer, this.width);

  blur1 = newLayer(this.width);
  blur2 = newLayer(this.width);
  blur3 = newLayer(this.width);
  blur4 = newLayer(this.width);
  topLayer = newLayer(this.width);

  proj.lens = (point) => proj.fisheyeLens(point, 2);
  const dotsFisheye = dottedSphere(0, 0, 0, 1, 400 * details);
  const dots3DFisheye = planet(1, dotsFisheye);

  fill(0);
  noStroke();
  circle(0, 0, 50);

  const points2 = sort(dots3DFisheye);
  points2.forEach(([x, y, size, color, pointSize]) => {
    const blur = Math.abs(size - 0.16) * 15;
    pointWithBlur(x * 8.5, y * 8.5, pointSize, color, blur);
  });

  drawLayer(blur4, this.width, 0.05);
  drawLayer(blur3, this.width, 0.05);
  drawLayer(blur2, this.width, 0.05);
  drawLayer(blur1, this.width, 0.05);
  drawLayer(topLayer, this.width);
}

function planet(dotSize, dots) {
  stroke(255, 255, 0);
  const landFrom = 0.5;
  const landScale = 0.5;
  const iceFrom = 0.7;
  const iceScale = 1;
  const [, , backZ] = proj.point(0, 0, 0);
  return mapTo3D(dots, true)
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
          x * (1 + landFrom),
          y * (1 + landFrom),
          size,
          [colorScale * color[0], colorScale * color[1], colorScale * color[2]],
          size * dotSize,
        ];
      } else if (isLand) {
        const color = landColor;
        const colorScale = size * 20 * depth;
        return [
          x * (1 + landFrom),
          y * (1 + landFrom),
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

const name = "Optical Planet";

export function Project({ ...props }) {
  return <ProjectWrapper draw={draw} {...props} />;
}

Project.prototype.name = name;
Project.prototype.finished = false;
