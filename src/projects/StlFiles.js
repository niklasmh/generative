import { ProjectWrapper } from ".";

function preload() {
  window.data = this.loadModel("/cube.stl");
}

function draw() {
  proj.lens = (point) => proj.fisheyeLens(point, 30);
  proj.fov = 30;
  proj.rotateY(noise(1) * 90);
  proj.rotateX(noise(0, 1) * 90);
  proj.translate(0, 0, 30);

  const points = data.vertices.map(({ x, y, z }) => [x, y, z]);

  background(0);
  stroke(255);
  stl(points);
}

function stl(points) {
  const beforeDraw = (z) => {
    strokeWeight(z * 100);
    stroke(z * 10000);
  };
  points.forEach((p) => {
    const [x, y, z] = proj.point(...p);
    beforeDraw(z);
    point(x, y);
  });
}

export function Project({ ...props }) {
  return <ProjectWrapper draw={draw} preload={preload} {...props} />;
}

const name = "STLFile vertices";
Project.prototype.name = name;
Project.prototype.description = "Render vertices from STLFiles";
