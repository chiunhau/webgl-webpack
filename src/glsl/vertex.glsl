attribute vec4 a_position;
attribute vec3 a_normal;

uniform mat4 u_worldViewProjection;
uniform mat4 u_world;

uniform float u_fudgeFactor;
uniform mat4 u_matrix;
varying vec3 v_normal;

void main() {
  vec4 position = u_matrix * a_position;
  float zToDivideBy = 1.0 + position.z * u_fudgeFactor;
  gl_Position = vec4(position.xy / zToDivideBy, position.zw);

  // gl_Position = u_worldViewProjection * a_position;

  v_normal = a_normal;
}
