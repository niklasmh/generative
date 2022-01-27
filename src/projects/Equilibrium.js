import { ProjectWrapper } from ".";
import { hueToColor, darkenColor } from "../utils/colors";
import { range, linspace, rndr, rndi, bin, rnd } from "../utils/generator";
import { getCOM, getAABB, closedBezier } from "../utils/geometry";

function build(x, y, w, h, level = 0) {
  const node = {
    level,
    x: x + rndr(-w / 2, w / 2),
    y: y - 10,
    com: { x: x, y: y - 5 },
    connections: [],
  };

  if (level < 5) {
    const n = level === 0 ? rndi(1, 3) : rndi(rndi(0, 5 - level) === 0 ? 0 : 1, 2 - Math.floor(level / 2));
    node.connections = linspace(-w / 1.5, w / 1.5, n + 1, true).map((x) => {
      return build(node.x + x, node.y, w / 2, h / 2, level + 1);
    });
  }

  return node;
}

function scanBuild(x, yInit, w, h) {
  const node = {
    x: x + rndr(-w / 4, w / 4),
    y: yInit,
    com: { x: x, y: yInit - 5 },
    connections: [],
  };
  let y = node.y;
  const scanners = [
    {
      new: false,
      id: 0,
      x: node.x,
      kids: [],
      parent: 0,
      y,
      w: rndi(30, 50),
      d: bin() ? -1 : 1,
      h: y - rndi(20, 40),
      node,
      dead: false,
    },
  ];

  const dummyPoints = [];

  const collide = ([i, ...ii]) => {
    const self = scanners[i];
    return [...scanners, ...dummyPoints].some((scanner) => {
      if (self.id === scanner.id) return false;
      if (ii.includes(scanner.id)) return false;
      const dx = scanner.x - self.x;
      const dy = scanner.y - self.y;
      const d = Math.sqrt(dx * dx + dy * dy);
      return d <= 40;
    });
  };

  while (y > h) {
    console.log(y - h);
    for (let i = 0; i < scanners.length; i++) {
      const scanner = scanners[i];
      if (scanner.dead) continue;
      if (scanners.length > 4 && rndi(0, y - h) === 0) {
        scanner.dead = true;
        dummyPoints.push({
          x: scanner.x,
          y: scanner.y,
          id: scanner.id,
        });
        const newNode = {
          x: scanner.x,
          y: scanner.y,
          p: 76,
          com: { x: x, y: y },
          connections: [],
        };
        scanner.node.connections.push(newNode);
        scanner.node = newNode;
        continue;
      }
      scanner.y = y;
      //point(scanner.x, scanner.y);
      if (scanner.y <= scanner.h) {
        // Her splittes det (går mot vannrett)
        //strokeWeight(3);
        //stroke(200, 0, 0);
        //point(scanner.x, scanner.y);
        //stroke(100);
        //strokeWeight(2);
        const scaleW = Math.min(1, ((y - h) / 100) * 10); // Bredden skal minske
        if (!scanner.new) scanner.w = rndi(5, 20) * scaleW;
        if (!scanner.new) scanner.d = bin() ? -1 : 1;
        scanner.h = scanner.y - rndi(20, 30);
        console.log("split?", i);
        const ii = [];
        if ((scanners.length === 1 && rndi(0, 10) !== 0) || (!scanner.new && rndi(0, 4) !== 0)) {
          scanners.push({
            new: true,
            id: scanners.length,
            parent: scanner.id,
            kids: [],
            x: scanner.x,
            y: scanner.y,
            w: rndi(10, 20) * scaleW,
            d: -scanner.d, // Gå andre veien
            h: scanner.y - (bin() ? rndi(1, 4) : 0),
            node: scanner.node,
            dead: false,
          });
          scanner.kids.push(scanners.length - 1);
          ii.push(scanners.length - 1);
          console.log("splitted!");
        }
        scanner.new = false;
        dummyPoints.push({
          x: scanner.x,
          y: scanner.y,
          id: scanner.id,
        });
        const xInit = scanner.x;
        let died = false;
        while (Math.abs(xInit - scanner.x) < scanner.w) {
          if (collide([i, scanner.parent, ...scanner.kids, ...ii])) {
            scanner.dead = true;
            console.log("DEAD");
            //stroke(100);
            //strokeWeight(2);
            //point(scanner.x, scanner.y);
            died = true;
            dummyPoints.push({
              x: scanner.x,
              y: scanner.y,
              id: scanner.id,
            });
            const newNode = {
              x: scanner.x,
              y: scanner.y,
              p: 139,
              com: { x: x, y: y },
              connections: [],
            };
            scanner.node.connections.push(newNode);
            scanner.node = newNode;
            break;
          }
          scanner.x += scanner.d * 3;
          //point(scanner.x, scanner.y);
        }
        if (died) break;
        //strokeWeight(3);
        //stroke(255);
        //point(scanner.x, scanner.y);
        //stroke(100);
        //strokeWeight(2);
        dummyPoints.push({
          x: scanner.x,
          y: scanner.y,
          id: scanner.id,
        });
        const newNode = {
          x: scanner.x,
          y: scanner.y,
          p: 164,
          com: { x: x, y: y },
          connections: [],
        };
        scanner.node.connections.push(newNode);
        scanner.node = newNode;
        // Gå til siden steg for steg inntil dens bredde eller krasj
        // Lage ny node i treet
      }
    }
    y -= 3;
  }

  scanners
    .filter((scanner) => !scanner.dead)
    .forEach((scanner) => {
      const newNode = {
        x: scanner.x,
        y: scanner.y,
        com: { x: x, y: y },
        connections: [],
      };
      if (scanner.node.connections.length === 0) {
        scanner.node.connections.push(newNode);
        scanner.node = newNode;
      }
    });

  strokeWeight(4);
  stroke(0, 0, 255);
  //dummyPoints.forEach((p) => point(p.x, p.y));
  console.log(scanners);
  return node;
}

function draw() {
  background(0);
  noFill();

  stroke(100);
  strokeWeight(2);

  const tree = scanBuild(0, 50, 50, -50);
  //const tree = build(0, 50, 50, 100);
  console.log(tree);

  const drawNode = (node) => {
    //console.log("nice", node.x, node.y);
    //strokeWeight(2);
    //stroke(255, 0, 0);
    //point(node.x, node.y);
    stroke(255, 100);
    strokeWeight(0.5);
    if (node.connections.length > 1) {
      line(node.connections[0].x, node.connections[0].y, node.connections[1].x, node.connections[1].y);
      node.connections.forEach((n) => {
        //line(node.x, node.y, node.x, n.y);
        //line(node.x, n.y, n.x, n.y);
        line(node.x, node.y, n.x, n.y);
        drawNode(n);
      });
    } else if (node.connections.length === 1) {
      node.connections.forEach((n) => {
        line(node.x, node.y, n.x, n.y);
        drawNode(n);
      });
    } else {
      //strokeWeight(2);
      //stroke(255, 0, 0);
      //point(node.x, node.y);
      //stroke(255);
      //strokeWeight(0.5);
      //line(node.x, node.y, node.x, node.y - 10);
    }
  };

  drawNode(tree);
}

const name = "Equilibrium";

export function Project({ ...props }) {
  return <ProjectWrapper draw={draw} {...props} />;
}

Project.prototype.name = name;
Project.prototype.description = "Stone balancing";
