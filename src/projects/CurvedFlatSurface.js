import { ProjectWrapper } from ".";

function draw() {
  background(0);

  proj.lens = (point) => proj.fisheyeLens(point, 40);
  proj.setZToSize = true;
  proj.fov = 120;
  proj.far = 1;
  proj.near = -1;
  proj.translate(0, 0, 5);
  proj.rotateZ(noise(1) * 180 - 90);
  proj.rotateX(noise(0, 1) * 90);

  const points = [];
  const size = 50;
  for (let y = -size; y <= 0; y += 2) {
    for (let x = -size; x <= 0; x++) {
      points.push([x, y, 0]);
    }
  }
  for (let y = size; y > 0; y -= 2) {
    for (let x = -size; x <= 0; x++) {
      points.push([x, y, 0]);
    }
  }
  for (let y = size; y > 0; y -= 2) {
    for (let x = size; x > 0; x--) {
      points.push([x, y, 0]);
    }
  }
  for (let y = -size; y <= 0; y += 2) {
    for (let x = size; x > 0; x--) {
      points.push([x, y, 0]);
    }
  }

  points.forEach((p) => {
    const [x, y, size] = proj.point(...p);
    strokeWeight(size * 30);
    if (p[1] % 4 === 0) stroke(size * 12000);
    else stroke(0, size * 12000, 0);
    point(x, y);
  });
}

export function Project({ ...props }) {
  return <ProjectWrapper name={name} draw={draw} {...props} />;
}

const name = "Curved flat surface";
Project.prototype.name = name;
Project.prototype.finished = true;
