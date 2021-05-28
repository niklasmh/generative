import { Project } from ".";

function draw() {
  background(0);
  fill(255);
  circle(0, 0, 50);
  const dx = 2;
  let prevX = -50;
  let prevY = 0;
  for (let x = prevX; x <= 100; x += 0.01) {
    //let y = noise(i * 0.2) * 10 + 45;
    let y = sin(x * 10) * 5;
    if (dist(prevX, prevY, x, y) > dx) {
      circle(x, y, dx, dx);
      prevX = x;
      prevY = y;
    }
  }
}

const name = "Test";

export function Test({ ...props }) {
  return <Project name={name} draw={draw} {...props} />;
}

Test.prototype.name = name;
