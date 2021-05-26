import Project from "./project-wrapper";

function draw() {
  background(0);
  fill(255);
  stroke(200);
  for (let a = 0; a < 360; a += 10) {
    let r = noise(sin(a) + 1, cos(a) + 1) * 10 + 20;
    line(0, 0, r * sin(a), r * cos(a));
  }
}

const name = "Lines";

export function Lines({ ...props }) {
  return <Project name={name} draw={draw} {...props} />;
}

Lines.prototype.name = name;
