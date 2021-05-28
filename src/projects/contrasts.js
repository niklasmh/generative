import Project from "./project-wrapper";
import { closedBezierFunction } from "./closedBezier";

function draw() {
  background(0);
  noFill();
  strokeWeight(23 / this.width);
  const steps = 100;

  for (let z = 0; z < 1; z += 1 / steps) {
    stroke(255, (z / 10) * this.width);
    const points = [];
    const rs = [];
    for (let a = 0, i = 0; a < 360; a += 80, i++) {
      let r = noise(sin(a) + 1, cos(a) + 1, z) * 40 + z * 5;
      rs.push(r);
      points.push([r * sin(a), r * cos(a)]);
    }
    closedBezierFunction(points);
  }
}

const name = "Contrast";

export function Contrasts({ ...props }) {
  return <Project name={name} draw={draw} {...props} />;
}

Contrasts.prototype.name = name;
Contrasts.prototype.description = "Multiple layers causing different contrasts";
