import { ProjectWrapper } from ".";
import { closedBezierFunction } from "./ClosedBezier";

function draw() {
  background(0);
  noStroke();
  smooth();
  const points = [];
  const rs = [];
  for (let a = 0, i = 0; a < 360; a += 60, i++) {
    let r = noise(sin(a) + 1, cos(a) + 1) * 20 + 20;
    rs.push(r);
    points.push([r * sin(a), r * cos(a)]);
  }
  fill(255);
  closedBezierFunction(points);
  let m = 13;
  for (let n = 0; n < m; n++) {
    for (let a = 0, i = 0; a < 360; a += 60, i++) {
      let r = rs[i] - noise(sin(a) + 10, cos(a) + 1) * 0.5;
      rs[i] = r;
      points[i] = [r * sin(a), r * cos(a)];
    }
    fill(0);
    closedBezierFunction(points);
    for (let a = 0, i = 0; a < 360; a += 60, i++) {
      let r = rs[i] - noise(sin(a) + 1, cos(a) + 20) * 2;
      rs[i] = r;
      points[i] = [r * sin(a), r * cos(a)];
    }
    fill(255);
    if (n < m - 1) closedBezierFunction(points);
  }
}

const name = "Uneven circle";

export function Project({ ...props }) {
  return <ProjectWrapper draw={draw} {...props} />;
}

Project.prototype.name = name;
Project.prototype.description = "Uneven circle with uneven stripes";
