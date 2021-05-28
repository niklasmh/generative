import p5 from "p5";
import { useCallback, useEffect, useRef } from "react";
import { Projection } from "../utils/projection";

function useRenderSketch(sketch, canvasContainer, seed) {
  useEffect(() => {
    if (canvasContainer) canvasContainer.innerHTML = "";
    new p5(sketch);
    return () => {
      if (canvasContainer) canvasContainer.innerHTML = "";
    };
  }, [sketch, canvasContainer, seed]);
}

function Project({
  seed = -1,
  noDownload = false,
  name,
  draw,
  preload = null,
  webgl = false,
  margin = 5,
  width = 500,
  height = 500,
  finalWidth = 8000,
}) {
  const uniqueIDRef = useRef("project-" + Math.floor(Math.random() * 10000));
  const canvasContainerRef = useRef();
  const printCanvasContainerRef = useRef();
  const projectRef = useRef();

  useEffect(() => {
    if (seed !== -1) console.log("Seed:", seed);
  }, [seed]);

  const sketch = useCallback(
    (project) => {
      projectRef.current = project;

      Object.keys(project.__proto__)
        .filter((key) => key.charAt(0) !== "_")
        .forEach(
          (key) =>
            (window[key] =
              typeof project.__proto__[key] === "function"
                ? project.__proto__[key].bind(project)
                : project.__proto__[key])
        );

      if (preload) {
        project.preload = preload.bind(project);
      }

      project.setup = () => {
        const canvas = project.createCanvas(
          width,
          height,
          webgl ? project.WEBGL : project.P2D
        );
        const parent = document.getElementById(uniqueIDRef.current);
        if (parent) parent.innerHTML = "";
        canvas.parent(uniqueIDRef.current);
        project.noLoop();
        project.angleMode(project.DEGREES);
      };

      const scaleDraw = () => {
        if (seed >= 0) project.noiseSeed(seed);
        project.scale(width / 100);
        project.translate(50, 50);
        Object.keys(project.__proto__)
          .filter((key) => key.charAt(0) !== "_")
          .forEach(
            (key) =>
              (window[key] =
                typeof project.__proto__[key] === "function"
                  ? project.__proto__[key].bind(project)
                  : project.__proto__[key])
          );
        window.proj = new Projection();
        draw.bind(project)();
        project.translate(-50, -50);
        project.fill(255);
        project.noStroke();
        project.rect(0, 0, margin, 100);
        project.rect(0, 0, 100, margin);
        project.rect(100 - margin, 0, margin, 100);
        project.rect(0, (height / width) * 100 - margin, 100, margin);
        project.scale(1);
      };
      project.draw = scaleDraw.bind(project);
    },
    [seed, draw, height, margin, width]
  );

  useRenderSketch(sketch, canvasContainerRef.current, seed);

  const generatePrint = useCallback(() => {
    const sketch = (project) => {
      projectRef.current = project;

      Object.keys(project.__proto__)
        .filter((key) => key.charAt(0) !== "_")
        .forEach(
          (key) =>
            (window[key] =
              typeof project.__proto__[key] === "function"
                ? project.__proto__[key].bind(project)
                : project.__proto__[key])
        );

      if (preload) {
        project.preload = preload.bind(project);
      }

      project.setup = () => {
        const canvas = project.createCanvas(
          finalWidth,
          (height / width) * finalWidth,
          webgl ? project.WEBGL : project.P2D
        );
        canvas.parent(uniqueIDRef.current + "-hidden");
        project.noLoop();
        project.angleMode(project.DEGREES);
      };

      const scaleDrawThenSave = () => {
        if (seed >= 0) project.noiseSeed(seed);
        project.scale(finalWidth / 100);
        project.translate(50, 50);
        Object.keys(project.__proto__)
          .filter((key) => key.charAt(0) !== "_")
          .forEach(
            (key) =>
              (window[key] =
                typeof project.__proto__[key] === "function"
                  ? project.__proto__[key].bind(project)
                  : project.__proto__[key])
          );
        window.proj = new Projection();
        draw.bind(project)();
        project.translate(-50, -50);
        project.fill(255);
        project.noStroke();
        project.rect(0, 0, margin, 100);
        project.rect(0, 0, 100, margin);
        project.rect(100 - margin, 0, margin, 100);
        project.rect(0, (height / width) * 100 - margin, 100, margin);
        project.scale(1);
        project.save(name + "-" + seed + ".png");
      };
      project.draw = scaleDrawThenSave;
    };
    new p5(sketch);
  }, [seed, draw, finalWidth, height, margin, name, width]);

  return (
    <>
      <div
        id={uniqueIDRef.current}
        ref={canvasContainerRef}
        title="Click to download"
        style={{ cursor: "pointer" }}
        onClick={() => noDownload || generatePrint()}
      ></div>
      <div
        id={uniqueIDRef.current + "-hidden"}
        style={{ display: "none" }}
        ref={printCanvasContainerRef}
      ></div>
    </>
  );
}

export { Project };
