import { ProjectWrapper } from ".";
import {
  dottedCircle,
  dottedSphere,
  sort,
  union,
  mapTo3D,
  d2r,
} from "../utils/generator";

function draw() {
  proj.fov = 30;
  proj.rotateZ(noise(1) * 360);
  proj.rotateX(45);
  proj.translate(0, 1, 5);

  background(0);
  sort(
    union([
      sun(1, [255, 200, 120], 190, 5),
      planet(2, -280, 0.3, [0, 255, 0], 50, 30),
      planet(3, -45, 0.3, [0, 255, 255], 50, 30),
      planet(3.7, -140, 0.5, [100, 100, 100], 50, 30),
    ])
  ).forEach(([x, y, _, color, pointSize]) => {
    strokeWeight(pointSize);
    stroke(...color);
    point(x, y);
  });
}

function sun(radius, color, details, dotSize) {
  stroke(255, 255, 0);
  return mapTo3D(dottedSphere(0, 0, 0, radius, details), true).map(
    ([x, y, size, ox, oy, oz]) => {
      const s = 2;
      const o = 10;
      const depth = noise(s * (ox + o), s * (oy + o), s * (oz + o));
      const colorScale = size * 20 * depth;
      return [
        x * (1 + depth / 10),
        y * (1 + depth / 10),
        size,
        [colorScale * color[0], colorScale * color[1], colorScale * color[2]],
        size * dotSize,
      ];
    }
  );
}

function planet(distance, angle, radius, color, details = 50, dotSize = 10) {
  stroke(255);
  const circumference = Math.PI * distance * 2;
  const stepSize = 0.2;
  const steps = Math.floor(circumference / stepSize);

  const angleRad = d2r(angle);
  const x0 = Math.cos(angleRad) * distance;
  const y0 = Math.sin(angleRad) * distance;

  return union([
    mapTo3D(dottedCircle(0, 0, distance, steps)).map(([x, y, size]) => {
      return [x, y, size, [255, 255, 255], size * 10];
    }),
    mapTo3D(dottedSphere(x0, y0, 0, radius, details), true).map(
      ([x, y, size, ox, oy, oz]) => {
        const dx = ox - x0;
        const dy = oy - y0;
        const dotProduct = dx * x0 + dy * y0;
        const scale = Math.max(-dotProduct / (distance * radius), 0.1);
        return [
          x,
          y,
          size,
          [color[0] * scale, color[1] * scale, color[2] * scale],
          size * dotSize * radius,
        ];
      }
    ),
  ]);
}

const name = "Solar system";

export function Project({ ...props }) {
  return <ProjectWrapper name={name} draw={draw} {...props} />;
}

Project.prototype.name = name;
Project.prototype.category = "finished";
