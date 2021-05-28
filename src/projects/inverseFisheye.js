import Project from "./project-wrapper";
import { spiral, cube } from "./depth";

function draw() {
  proj.init();
  proj.lens = (point) => proj.fisheyeLens(point, -30);
  proj.fov = 30;
  proj.translate(0, -100, 0);
  proj.rotateY(noise(1) * 90);
  proj.rotateX(-20 - noise(0, 1) * 90);
  proj.translate(0, 200, 680);

  background(0);
  spiral();
  cube(0, 0, 0);
}

const name = "Inverse fisheye";

export function InverseFisheye({ ...props }) {
  return <Project name={name} draw={draw} {...props} />;
}

InverseFisheye.prototype.name = name;
InverseFisheye.prototype.description =
  "Make it possible to 'draw' in inverse fisheye 3D";
