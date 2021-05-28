import Project from "./project-wrapper";
import { Projection } from "../utils/projection";

const proj = new Projection();

function draw() {
  background(0);

  proj.lens = (point) => proj.fisheyeLens(point, 30);
  proj.setZToSize = true;
  proj.fov = 90;
  proj.far = 1;
  proj.near = -1;
  proj.rotateZ(noise(1) * 180);
  proj.translate(0, 0, 5);

  const points = [];
  const size = 50;
  for (let y = -size; y <= 0; y++) {
    for (let x = -size; x <= 0; x++) {
      points.push([x, y, 0]);
    }
  }
  for (let y = size; y > 0; y--) {
    for (let x = -size; x <= 0; x++) {
      points.push([x, y, 0]);
    }
  }
  for (let y = size; y > 0; y--) {
    for (let x = size; x > 0; x--) {
      points.push([x, y, 0]);
    }
  }
  for (let y = -size; y <= 0; y++) {
    for (let x = size; x > 0; x--) {
      points.push([x, y, 0]);
    }
  }

  points.forEach((p) => {
    const [x, y, size] = proj.point(...p);
    strokeWeight(size * 30);
    stroke(size * 12000);
    point(x, y);
  });
}

export function CurvedFlatSurface({ ...props }) {
  return <Project name={name} draw={draw} {...props} />;
}

const name = "Curved flat surface";
CurvedFlatSurface.prototype.name = name;
