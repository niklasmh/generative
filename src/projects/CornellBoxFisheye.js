import { ProjectWrapper } from ".";
import { combineColors } from "../utils/colors";
import { Sphere, Cube } from "../utils/geometry";
import { getColorFromRay } from "./CornellBox";

const X = 0;
const Y = -20;
const Z = -10;
const W = 37;
const H = 50;
const D = 80;
const top = Y - H;
const bottom = Y + H;
const left = X - W;
const right = X + W;
const far = Z + D;
const near = Z;
const objects = [
  new Sphere(right - 20, bottom - 15, Z + 40, 15, "#fff", "mirror"),
  new Sphere(left + 20, bottom - 25, Z + 35, 5, "#80f", "matte"),
  ...new Cube(
    left,
    bottom,
    near,
    W * 2,
    H * 2,
    D,
    0,
    0,
    0,
    ["#fff", "#0ff", "#800", "#080", "#ff0", "#f11"],
    ["light", "matte", "matte", "matte", "matte", "matte"]
  ),
  ...new Cube(left + 5, bottom, Z + 30, 20, 20, 20, 0, -20, 0, "#f00", "mirror"),
  ...new Cube(right - Math.cos((50 / 180) * Math.PI) * 20, bottom, Z + 14, 20, 8, 8, 0, 0, 50, "#00f", "matte"),
];

function getDxBasedOnWidth(width) {
  return 500 / width;
}

function draw() {
  const dx = getDxBasedOnWidth(this.width);

  if (frame === 0) {
    background(0);
  }

  strokeWeight(dx);
  const y = frame * dx - 50 + dx;
  for (let x = -50 + dx; x < 50; x += dx) {
    stroke(...getPixel(x, y));
    point(x, y);
  }
}

function getPixel(x, y) {
  const backgroundColor = [0, 0, 0, 255];
  const [lx, ly] = proj.fisheyeLens([x, y, 0], -60);
  return combineColors(backgroundColor, getColorFromRay(objects, 0, 0, 0, lx, ly, 20, 5));
}

export function Project({ ...props }) {
  return (
    <ProjectWrapper draw={draw} frameRate={100} frames={(width) => 100 / getDxBasedOnWidth(width) - 1} {...props} />
  );
}

Project.prototype.name = "Cornell box (fisheye)";
Project.prototype.description = "Create light and matte effect using ray tracing (this time using fisheye)";
Project.prototype.finished = true;
