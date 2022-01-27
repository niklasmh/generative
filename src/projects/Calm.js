import { ProjectWrapper } from ".";
import { hueToColor, darkenColor } from "../utils/colors";
import { range } from "../utils/generator";
import { getCOM, getAABB, closedBezier } from "../utils/geometry";

function draw() {
  proj.fov = 30;
  proj.lens = (point) => proj.fisheyeLens(point, 90);
  proj.translate(0, 0, 23);

  background(0);
  noFill();
  const steps = 100;
  const numberOfEdges = [5, 5, 5, 5, 7, 7, 11][Math.floor(random() * 12345) % 7];
  const agressiveZ = random([1, 1, 1.5, 1.5, 2]);

  const createPoints = (z) => {
    const points = [];
    for (let a = 0, i = 0; a < 360; a += 360 / numberOfEdges, i++) {
      const r = noise(sin(a) + 1, cos(a) + 1, agressiveZ * z + 1) * 24;
      const y = r * cos(a);
      points.push([r * sin(a), y, z]);
    }
    return points;
  };

  const setStyle = (z, alpha = 1, scale = 1) => {
    strokeWeight((scale * 100 * z) / 500);
    stroke(...darkenColor(hueToColor(noise(123) * 360 + z * 100), (((2 * z) / 10) * 500 * alpha) / 255));
  };

  const tailLayers = range(0, 1, 1 / steps).map(createPoints);
  const glowLayers = range(1, 1.1, 1).map(createPoints);

  let [offsetX, offsetY] = getCOM(glowLayers[0]).map((i) => -i);
  const bottom = tailLayers.reduce((b, layer) => Math.max(b, getAABB(layer).max[1]), 0) + 1;

  const mapTo3D = ([x, y, z]) => proj.point(x, -y, -z);

  tailLayers.forEach((points) => {
    const z = points[0][2];
    setStyle(z, 1);
    closedBezier(points.map(([x, y, z]) => [x + offsetX, y + offsetY, (z - 1) * 23]).map(mapTo3D));
    setStyle(z, 0.5);
    closedBezier(points.map(([x, y, z]) => [x + offsetX, bottom * 2 - y + offsetY, (z - 1) * 23]).map(mapTo3D));
  });

  glowLayers.forEach((points) => {
    const z = points[0][2];
    setStyle(z, 3, 1);
    closedBezier(points.map(([x, y, z]) => [x + offsetX, y + offsetY, (z - 1) * 23]).map(mapTo3D));
    setStyle(z, 1.5, 1);
    closedBezier(points.map(([x, y, z]) => [x + offsetX, bottom * 2 - y + offsetY, (z - 1) * 23]).map(mapTo3D));
  });
}

const name = "Calm";

export function Project({ ...props }) {
  return <ProjectWrapper draw={draw} {...props} />;
}

Project.prototype.name = name;
Project.prototype.description = "Timeless shape hovering above a reflecting surface";
Project.prototype.finished = true;
Project.prototype.nft = true;
