import p5 from "p5";
import { useCallback, useEffect, useRef } from "react";
import { Projection } from "../utils/projection";

p5.disableFriendlyErrors = true;

function useRenderSketch(sketch, canvasContainer, seed) {
  useEffect(() => {
    if (canvasContainer) canvasContainer.innerHTML = "";
    new p5(sketch);
    return () => {
      if (canvasContainer) canvasContainer.innerHTML = "";
    };
  }, [sketch, canvasContainer, seed]);
}

function ProjectWrapper({
  seed = -1,
  noDownload = false,
  name,
  fileName,
  draw,
  setup,
  preload = null,
  frameRate = 0,
  frames = 0,
  webgl = false,
  margin = 0,
  width = 500,
  height = 500,
  finalWidth = 8000,
}) {
  const uniqueIDRef = useRef("project-" + Math.floor(Math.random() * 10000));
  const canvasContainerRef = useRef();
  const printCanvasContainerRef = useRef();
  const projectRef = useRef();
  const statusRef = useRef();

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
        const canvas = project.createCanvas(width, height, webgl ? project.WEBGL : project.P2D);
        const parent = document.getElementById(uniqueIDRef.current);
        if (parent) parent.innerHTML = "";
        canvas.parent(uniqueIDRef.current);
        if (frameRate === 0) project.noLoop();
        else project.frameRate(frameRate);
        project.angleMode(project.DEGREES);
        project.frame = 0;
        if (seed >= 0) {
          project.noiseSeed(seed);
          project.randomSeed(seed);
        }
        if (setup) setup.bind(project)();
      };

      const scaleDraw = () => {
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
        window.frame = project.frame;
        draw.bind(project)();
        project.translate(-50, -50);
        project.fill(255);
        project.noStroke();
        if (margin) {
          project.rect(0, 0, margin, 100);
          project.rect(0, 0, 100, margin);
          project.rect(100 - margin, 0, margin, 100);
          project.rect(0, (height / width) * 100 - margin, 100, margin);
        }
        project.scale(1);
        project.frame++;
        let newFrames = frames;
        if (typeof frames === "function") {
          newFrames = frames(width);
        }
        if (project.frame >= newFrames) {
          project.noLoop();
        }
      };
      project.draw = scaleDraw.bind(project);
    },
    [seed, draw, height, margin, width]
  );

  useRenderSketch(sketch, canvasContainerRef.current, seed);

  const generatePrint = useCallback(() => {
    console.log("Generating image ...");
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
        if (seed >= 0) {
          project.noiseSeed(seed);
          project.randomSeed(seed);
        }
        if (setup) setup.bind(project)();
      };

      const scaleDrawThenSave = () => {
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
        window.frame = 0;
        if (frames) {
          let newFrames = frames;
          if (typeof frames === "function") {
            newFrames = frames(finalWidth);
          }
          for (let frame = 0; frame < newFrames; frame++) {
            window.frame = frame;
            draw.bind(project)();
          }
        } else {
          draw.bind(project)();
        }
        project.translate(-50, -50);
        project.fill(255);
        project.noStroke();
        if (margin) {
          project.rect(0, 0, margin, 100);
          project.rect(0, 0, 100, margin);
          project.rect(100 - margin, 0, margin, 100);
          project.rect(0, (height / width) * 100 - margin, 100, margin);
        }
        project.scale(1);
        statusRef.current.innerHTML = "Saving image...";
        setTimeout(() => {
          console.log("Saving image ...");
          project.save(name + "#" + seed + ".png");
          statusRef.current.innerHTML = "Done!";
          console.log("Ferdig!");
          setTimeout(() => {
            statusRef.current.innerHTML = "";
          }, 3000);
        }, 10);
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
        title={noDownload ? "" : "Click to download"}
        style={{ cursor: "pointer" }}
        onClick={() => {
          if (!noDownload) {
            statusRef.current.innerHTML = "Generating image... (page may freeze)";
            setTimeout(() => {
              generatePrint();
            }, 10);
          }
        }}
      ></div>
      {noDownload ? null : (
        <>
          <p>
            <a href={`https://github.com/niklasmh/generative/blob/master/src/projects/${fileName}.js`} target="_blank">
              Link to the code on GitHub
            </a>
          </p>
          <p>
            <button
              onClick={(e) => {
                e.preventDefault();
                if (!noDownload) {
                  statusRef.current.innerHTML = "Generating 8k image... (page may freeze)";
                  setTimeout(() => {
                    generatePrint();
                  }, 10);
                }
              }}
            >
              Generate high resolution image
            </button>
          </p>
        </>
      )}
      <h3 ref={statusRef}></h3>
      <div id={uniqueIDRef.current + "-hidden"} style={{ display: "none" }} ref={printCanvasContainerRef}></div>
    </>
  );
}

export { ProjectWrapper };
