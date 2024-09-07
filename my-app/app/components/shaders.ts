export const vertexShader = `
  uniform float time;
  uniform vec2 mouse;
  attribute vec3 position;
  void main() {
    vec3 pos = position;
    pos.y += sin(time + position.x * 0.1) * 10.0;
    pos.x += cos(time + position.y * 0.1) * 10.0;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

export const fragmentShader = `
  void main() {
    gl_FragColor = vec4(0.0, 1.0, 0.0, 1.0);
  }
`;