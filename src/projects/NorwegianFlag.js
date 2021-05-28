import { Project } from ".";
import { dottedBox, union } from "../utils/generator";

function draw() {
  background(0);

  proj.lens = (point) => proj.fisheyeLens(point, 90);
  proj.setZToSize = true;
  proj.fov = 120;
  proj.far = 1;
  proj.near = -1;
  proj.rotateY(-10);
  proj.translate(-6, -8, 2);

  const scale = 4;
  const step = 1 / scale;
  const map = ([x, y, z]) => {
    const point = [
      x,
      y,
      (noise(x / 20, y / 20) - 0.5) * (Math.pow(x, 1.2) / 5) + z,
    ];
    return point;
  };

  const redPoints = union([
    dottedBox(0, 0, 0, 6, 6, 1, step, step),
    dottedBox(0, 10, 0, 6, 6, 1, step, step),
    dottedBox(10, 0, 0, 12, 6, 1, step, step),
    dottedBox(10, 10, 0, 12, 6, 1, step, step),
  ]).map(map);

  const whitePoints = union([
    dottedBox(0, 6, 0, 7, 1, 1, step, step),
    dottedBox(0, 9, 0, 7, 1, 1, step, step),
    dottedBox(6, 0, 0, 1, 6, 1, step, step),
    dottedBox(6, 10, 0, 1, 6, 1, step, step),
    dottedBox(9, 0, 0, 1, 6, 1, step, step),
    dottedBox(9, 10, 0, 1, 6, 1, step, step),
    dottedBox(9, 6, 0, 13, 1, 1, step, step),
    dottedBox(9, 9, 0, 13, 1, 1, step, step),
  ]).map(map);

  const bluePoints = union([
    dottedBox(0, 7, 0, 22, 2, 1, step, step),
    dottedBox(7, 0, 0, 2, 7, 1, step, step),
    dottedBox(7, 9, 0, 2, 7, 1, step, step),
  ]).map(map);

  redPoints.forEach((p) => {
    const [x, y, size] = proj.point(...p);
    strokeWeight(size * 10);
    stroke(size * 8000, 0, 0);
    point(x, y);
  });

  bluePoints.forEach((p) => {
    const [x, y, size] = proj.point(...p);
    strokeWeight(size * 10);
    stroke(0, 0, size * 8000);
    point(x, y);
  });

  whitePoints.forEach((p) => {
    const [x, y, size] = proj.point(...p);
    strokeWeight(size * 10);
    stroke(size * 8000);
    point(x, y);
  });
}

export function NorwegianFlag({ ...props }) {
  return <Project name={name} draw={draw} {...props} />;
}

const name = "Norwegian flag";
NorwegianFlag.prototype.name = name;
