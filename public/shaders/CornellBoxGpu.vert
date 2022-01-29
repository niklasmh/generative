attribute vec3 aPosition;

void main() {
  gl_Position = vec4(aPosition * 2.0 - 1.0, 1.0);
}
