import { Project } from ".";

function draw() {
  proj.fisheye = false;
  proj.fov = 30;
  proj.translate(0, -100, 0);
  proj.rotateY(noise(1) * 90);
  proj.rotateX(-20 - noise(0, 1) * 90);
  proj.translate(0, 200, 680);

  background(0);
  spiral(0);
  cube(0, 0, 0);
}

export function pointLine(x0, y0, z0, x1, y1, z1, beforeDraw = () => {}) {
  const dx = x1 - x0;
  const dy = y1 - y0;
  const dz = z1 - z0;
  const steps = 30;
  const dt = 1 / steps;
  let prevX = null,
    prevY = null,
    prevZ = null;
  for (let t = 0; t <= 1; t += dt) {
    const [x, y, z] = proj.point(x0 + dx * t, y0 + dy * t, z0 + dz * t);
    if (prevX !== null) {
      beforeDraw((z + prevZ) / 2);
      line(prevX, prevY, x, y);
    }
    prevX = x;
    prevY = y;
    prevZ = z;
  }
}

export function cube(x, y, z) {
  const w = 200;
  const d = 200;
  const beforeDraw = (z) => {
    strokeWeight(z * 1500);
    stroke(z * 220000);
  };
  pointLine(x - w, y - w, z + d, x + w, y - w, z + d, beforeDraw);
  pointLine(x - w, y - w, z - d, x + w, y - w, z - d, beforeDraw);
  pointLine(x - w, y - w, z - d, x - w, y - w, z + d, beforeDraw);
  pointLine(x + w, y - w, z - d, x + w, y - w, z + d, beforeDraw);

  pointLine(x - w, y + w, z + d, x - w, y - w, z + d, beforeDraw);
  pointLine(x + w, y + w, z + d, x - w, y + w, z + d, beforeDraw);
  pointLine(x + w, y - w, z + d, x + w, y + w, z + d, beforeDraw);

  pointLine(x - w, y + w, z - d, x - w, y - w, z - d, beforeDraw);
  pointLine(x + w, y + w, z - d, x - w, y + w, z - d, beforeDraw);
  pointLine(x + w, y - w, z - d, x + w, y + w, z - d, beforeDraw);

  pointLine(x - w, y + w, z - d, x - w, y + w, z + d, beforeDraw);
  pointLine(x + w, y + w, z - d, x + w, y + w, z + d, beforeDraw);
}

export function spiral() {
  let prevX = null,
    prevY,
    prevZ;
  for (let i = -23; i < 360 * 2; i++) {
    const a = (i / 180) * Math.PI;
    const r = 300 + i / 4;
    const x = Math.cos(a) * r;
    const y = -200;
    const z = Math.sin(a) * r;
    if (prevX !== null)
      pointLine(prevX, prevY, prevZ, x, y, z, (z) => {
        strokeWeight(z * 1700);
        stroke(z * 180000, 0, 0);
      });
    prevX = x;
    prevY = y;
    prevZ = z;
  }
}

const name = "Depth test";

export function Depth({ ...props }) {
  return <Project name={name} draw={draw} {...props} />;
}

Depth.prototype.name = name;
Depth.prototype.description = "Make it possible to 'draw' in 3D";
