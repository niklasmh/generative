import { ProjectWrapper } from ".";

let rayTraceShader;

function preload() {
  rayTraceShader = loadShader("/shaders/CornellBoxGpu.vert", "/shaders/CornellBoxGpu.frag");
}

function draw() {
  shader(rayTraceShader);

  // P5 bug fix for big WebGL canvases in Chrome
  rayTraceShader.setUniform("screen", [Math.min(3000, this.width), Math.min(3000, this.height)]);

  rayTraceShader.setUniform("time", 0);

  rect(0, 0, this.width, this.height);
}

export function Project({ ...props }) {
  return <ProjectWrapper draw={draw} preload={preload} {...props} webgl />;
}

Project.prototype.name = "Cornell box (GPU)";
Project.prototype.description = "Using fragment shader to ray trace";
Project.prototype.finished = false;
