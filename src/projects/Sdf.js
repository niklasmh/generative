import { ProjectWrapper } from ".";

let sdfShader;

function preload() {
  sdfShader = loadShader("/shaders/SDF.vert", "/shaders/SDF.frag");
}

function draw() {
  shader(sdfShader);

  // P5 bug fix for big WebGL canvases in Chrome
  sdfShader.setUniform("screen", [Math.min(3000, this.width), Math.min(3000, this.height)]);

  sdfShader.setUniform("time", 0);

  rect(0, 0, this.width, this.height);
}

export function Project({ ...props }) {
  return <ProjectWrapper draw={draw} preload={preload} {...props} webgl />;
}

Project.prototype.name = "SDF";
Project.prototype.description = "Signed Distance Field example";
Project.prototype.finished = false;
