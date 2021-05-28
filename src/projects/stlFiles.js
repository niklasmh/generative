import { Project } from ".";
import { Projection } from "../utils/projection";

const proj = new Projection();

function preload() {
  window.data = this.loadModel("/cube.stl");
}

function draw() {
  proj.fisheye = 3;
  proj.fov = 30;
  proj.rotateY(noise(1) * 90);
  proj.rotateX(-20 - noise(0, 1) * 90);
  proj.translate(0, 0, 30);

  const points = data.vertices.map(({ x, y, z }) => [x, y, z]);

  background(0);
  stroke(255);
  stl(points);
}

function stl(points) {
  const beforeDraw = (z) => {
    strokeWeight((z - 30) / 40);
    stroke(z - 30);
  };
  points.forEach((p) => {
    const [x, y, z] = proj.point(...p);
    beforeDraw(z);
    point(x, y);
  });
}

export function StlFiles({ ...props }) {
  return <Project name={name} draw={draw} preload={preload} {...props} />;
}

const name = "STLFile vertices";
StlFiles.prototype.name = name;
StlFiles.prototype.description = "Render vertices from STLFiles";
