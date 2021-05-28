import Project from "./project-wrapper";
import { spiral, cube } from "./Depth";

function draw() {
  proj.lens = (point) => proj.fisheyeLens(point, 30);
  proj.fov = 30;
  proj.translate(0, -100, 0);
  proj.rotateY(noise(1) * 90);
  proj.rotateX(-20 - noise(0, 1) * 90);
  proj.translate(0, 200, 680);

  background(0);
  spiral();
  cube(0, 0, 0);
}

const name = "Fisheye";

export function Fisheye({ ...props }) {
  return <Project name={name} draw={draw} {...props} />;
}

Fisheye.prototype.name = name;
Fisheye.prototype.description = "Make it possible to 'draw' in fisheye 3D";
