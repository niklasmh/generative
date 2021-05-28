export class Projection {
  matrix = [
    [1, 0, 0, 0],
    [0, 1, 0, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 1],
  ];
  fov = 45;
  aspectRatio = 1;
  far = 1;
  near = -1;
  zoom = 10;
  lens = null;
  map = null;
  setZToSize = true; // Make Z-axis act as point size on screen
  projection = this.getProjection();

  constructor() {
    this.matrix = [
      [1, 0, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 1, 0],
      [0, 0, 0, 1],
    ];
    this.fov = 45;
    this.aspectRatio = 1;
    this.far = 1;
    this.near = -1;
    this.zoom = 10;
    this.lens = null;
    this.map = null;
    this.setZToSize = true; // Make Z-axis act as point size on screen
    this.projection = this.getProjection();
  }

  translate(x = 0, y = 0, z = 0) {
    this.multiply([
      [1, 0, 0, x],
      [0, 1, 0, y],
      [0, 0, 1, z],
      [0, 0, 0, 1],
    ]);
  }

  scale(x = 1, y = 1, z = 1) {
    this.multiply([
      [x, 0, 0, 0],
      [0, y, 0, 0],
      [0, 0, z, 0],
      [0, 0, 0, 1],
    ]);
  }

  d2r(deg) {
    return (deg * Math.PI) / 180;
  }

  rotateX(deg) {
    const a = this.d2r(deg);
    const c = Math.cos(a);
    const s = Math.sin(a);
    this.multiply([
      [1, 0, 0, 0],
      [0, c, -s, 0],
      [0, s, c, 0],
      [0, 0, 0, 1],
    ]);
  }

  rotateY(deg) {
    const a = this.d2r(deg);
    const c = Math.cos(a);
    const s = Math.sin(a);
    this.multiply([
      [c, 0, s, 0],
      [0, 1, 0, 0],
      [-s, 0, c, 0],
      [0, 0, 0, 1],
    ]);
  }

  rotateZ(deg) {
    const a = this.d2r(deg);
    const c = Math.cos(a);
    const s = Math.sin(a);
    this.multiply([
      [c, -s, 0, 0],
      [s, c, 0, 0],
      [0, 0, 1, 0],
      [0, 0, 0, 1],
    ]);
  }

  multiply(
    matrix,
    setOriginal = true,
    oldMatrix = this.matrix,
    isPoint = false
  ) {
    const newMatrix = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    const rows = 4;
    let cols = 4;
    if (isPoint) {
      cols = 1;
      oldMatrix = oldMatrix.map((element) => [element]);
    }
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        for (let z = 0; z < 4; z++) {
          newMatrix[y][x] += matrix[y][z] * oldMatrix[z][x];
        }
      }
    }
    if (newMatrix[3][cols - 1] !== 1 && newMatrix[3][cols - 1] !== 0) {
      const w = newMatrix[3][cols - 1];
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          newMatrix[y][x] /= w;
        }
      }
    }
    if (setOriginal) {
      this.matrix = newMatrix;
      this.projection = this.getProjection();
    }
    if (isPoint) {
      return newMatrix.map((row) => row[0]);
    }
    return newMatrix;
  }

  getProjection() {
    const e = 1 / Math.tan(this.d2r(0.5 * this.fov));
    const perspective = [
      [e / this.aspectRatio, 0, 0, 0],
      [0, e, 0, 0],
      [
        0,
        0,
        -(this.far + this.near) / (this.far - this.near),
        (-2 * this.near * this.far) / (this.far - this.near),
      ],
      [0, 0, -1, 0],
    ];
    return this.multiply(perspective, false);
  }

  fisheyeLens([x, y, z], value) {
    const distance2d = Math.sqrt(x * x + y * y);
    const newDistRatio =
      value >= 0
        ? Math.atan2(value, distance2d)
        : Math.atan2(-value, -value - distance2d);
    return [x * newDistRatio, y * newDistRatio, z];
  }

  point(x, y, z) {
    const point = this.multiply(this.projection, false, [x, y, z, 1], true);
    if (this.map) {
      const [newX, newY, newZ] = this.map(point);
      point[0] = newX;
      point[1] = newY;
      point[2] = newZ;
    }
    if (this.setZToSize) {
      point[2] = this.pointToSize(...point);
    }
    if (this.lens) {
      return this.lens([
        -point[0] * this.zoom,
        point[1] * this.zoom,
        point[2] * this.zoom,
      ]);
    }
    return [-point[0] * this.zoom, point[1] * this.zoom, point[2] * this.zoom];
  }

  // Get the perceived size by distance
  pointToSize(x, y, z) {
    const invZ = 1 / z;
    const distance = Math.sqrt(x * x + y * y + invZ * invZ);
    // console.log(distance, x, y, 1 / z);
    // console.table(this.matrix);
    // console.table(this.projection);
    return Math.atan2(1, distance) / this.fov;
  }
}
