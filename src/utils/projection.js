export class Projection {
  matrix = [
    [1, 0, 0, 0],
    [0, 1, 0, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 1],
  ];
  fov = 45;
  aspectRatio = 1;
  near = 100;
  far = 200;
  scale = 10;
  fisheye = false;

  translate(x = 0, y = 0, z = 0) {
    this.multiply([
      [1, 0, 0, x],
      [0, 1, 0, y],
      [0, 0, 1, z],
      [0, 0, 0, 1],
    ]);
  }

  scale(x = 0, y = 0, z = 0) {
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

  init() {
    this.matrix = [
      [1, 0, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 1, 0],
      [0, 0, 0, 1],
    ];
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
    if (newMatrix[3][cols - 1] !== 1) {
      const w = newMatrix[3][cols - 1];
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          newMatrix[y][x] /= w;
        }
      }
    }
    if (setOriginal) this.matrix = newMatrix;
    if (isPoint) {
      return newMatrix.map((row) => row[0]);
    }
    return newMatrix;
  }

  getProjection() {
    const e = 1 / Math.tan(this.d2r(0.5 * this.fov));
    return this.multiply(
      [
        [e / this.aspectRatio, 0, 0, 0],
        [0, e, 0, 0],
        [
          0,
          0,
          -(this.far + this.near) / (this.far - this.near),
          (-2 * this.near * this.far) / (this.far - this.near),
        ],
        [0, 0, -1, 0],
      ],
      false
    );
  }

  point3d(x, y, z) {
    const projection = this.getProjection();
    const point = this.multiply(projection, false, [x, y, z, 1], true);
    if (this.fisheye) {
      const newDistRatio =
        this.fisheye >= 0
          ? Math.atan2(
              this.fisheye,
              Math.sqrt(point[0] * point[0] + point[1] * point[1])
            )
          : Math.atan2(
              -this.fisheye,
              -this.fisheye -
                Math.sqrt(point[0] * point[0] + point[1] * point[1])
            );
      return [
        point[0] * this.scale * newDistRatio,
        point[1] * this.scale * newDistRatio,
        point[2] * this.scale,
      ];
    }
    return [
      point[0] * this.scale,
      point[1] * this.scale,
      point[2] * this.scale,
    ];
  }

  point(...position) {
    const [x, y] = this.point3d(...position);
    return [x, y];
  }
}
