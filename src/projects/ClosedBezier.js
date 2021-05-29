import { ProjectWrapper } from ".";

export const closedBezierFunction = (points) => {
  beginShape();
  curveVertex(...points[points.length - 1]);
  points.forEach((point) => curveVertex(...point));
  curveVertex(...points[0]);
  curveVertex(...points[1]);
  endShape();
};

function draw() {
  background(0);
  fill(25);
  stroke(255);
  const points = [];
  for (let a = 0; a < 360; a += 60) {
    let r = noise(sin(a) + 1, cos(a) + 1) * 30 + 10;
    points.push([r * sin(a), r * cos(a)]);
  }
  closedBezierFunction(points);
  points.forEach((point) => circle(...point, 3));
}

const name = "Closed bezier curve";

export function Project({ ...props }) {
  return <ProjectWrapper name={name} draw={draw} {...props} />;
}

Project.prototype.name = name;
