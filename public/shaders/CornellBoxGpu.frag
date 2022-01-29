precision highp float;

uniform vec2 screen;
uniform float time;

float sphere_intersection(vec3 ray_o, vec3 ray_d, vec3 pos, float r) {
  vec3 oc = ray_o - pos;
  float a = dot(ray_d, ray_d);
  float b = 2.0 * dot(oc, ray_d);
  float c = dot(oc, oc) - r*r;
  float d = b*b - 4.0*a*c;
  return (d < 0.0) ? -1.0 : (-b - sqrt(d)) / (2.0*a);
}

float plane_intersection(vec3 ray_o, vec3 ray_d, vec3 pos, vec3 normal) {
  vec3 oc = ray_o - pos;
  float a = dot(oc, normal);
  float b = dot(ray_d, normal);
  return a / b;
}

// Möller–Trumbore intersection algorithm
float triangle_intersection(vec3 ray_o, vec3 ray_d, vec3 p1, vec3 p2, vec3 p3) {
  float eps = 0.0000001;
  vec3 e1 = p2 - p1;
  vec3 e2 = p3 - p1;
  vec3 h = cross(ray_d, e2);
  float a = dot(e1, h);

  if (a > -eps && a < eps) {
    return -1.0;
  }

  float f = 1.0 / a;
  vec3 s = ray_o - p1;
  float u = f * dot(s, h);

  if (u < 0.0 || u > 1.0) {
    return -1.0;
  }

  vec3 q = cross(s, e1);
  float v = f * dot(ray_d, q);

  if (v < 0.0 || u + v > 1.0) {
    return -1.0;
  }

  float t = f * dot(e2, q);
  if (t > eps) {
    return t;
  }

  return -1.0;
}

vec3 sphere_normal(vec3 ray_o, vec3 pos, float r) {
  return (pos - ray_o) / r;
}

vec3 reflection(vec3 ray_d, vec3 normal) {
  float d = 2.0 * dot(ray_d, normal);
  return ray_d - d * normal;
}

highp float random(vec2 coords) {
  return fract(sin(dot(coords.xy, vec2(12.9898,78.233))) * 43758.5453);
}

highp vec3 random_in_unit_circle(vec3 seed) {
  float direction = random(seed.xy) * 6.28;
  float radius = random(seed.yz);
  float z = random(seed.xz);
  return vec3(sin(direction)*radius, cos(direction)*radius, z);
}

void main() {
  highp float scale = 1.0 / screen.y;
  highp vec2 coord = gl_FragCoord.xy * scale / 2.0;

  const int count = 15;

  vec3 positions[count];
  positions[0] = vec3(-0.3, 0.4, 2.0);
  positions[1] = vec3(-0.3, -0.4, 2.0);
  positions[2] = vec3(0.5, 0.0, 2.0);
  positions[3] = vec3(0.0, 0.0, 0.0);
  positions[4] = vec3(0.0, 0.0, 0.0);
  positions[5] = vec3(0.0, 0.0, 0.0);
  positions[6] = vec3(0.0, 0.0, 0.0);
  positions[7] = vec3(0.0, 0.0, 0.0);
  positions[8] = vec3(0.0, 0.0, 0.0);
  positions[9] = vec3(0.0, 0.0, 0.0);
  positions[10] = vec3(0.0, 0.0, 0.0);
  positions[11] = vec3(0.0, 0.0, 0.0);
  positions[12] = vec3(0.0, 0.0, 0.0);
  positions[13] = vec3(0.0, 0.0, 0.0);
  positions[14] = vec3(0.0, 0.0, 0.0);

  // Types:
  // 0: Sphere
  // 1: Plane
  // 2: Triangle
  int types[count];
  types[0] = 0;
  types[1] = 0;
  types[2] = 0;
  types[3] = 2;
  types[4] = 2;
  types[5] = 2;
  types[6] = 2;
  types[7] = 2;
  types[8] = 2;
  types[9] = 2;
  types[10] = 2;
  types[11] = 2;
  types[12] = 2;
  types[13] = 2;
  types[14] = 2;

  vec4 args0[count];
  vec4 args1[count];
  vec4 args2[count];
  args0[0] = vec4(0.3);
  args0[1] = vec4(0.3);
  args0[2] = vec4(0.3);
  // Backwall
  vec3 p_0 = vec3(-3.0, -3.0, 10.0);
  vec3 p_1 = vec3(3.0, 3.0, -1.0);
  float z = 0.1;
  args0[3] = vec4(p_0.x, p_0.y, p_0.z - z, 0.0);
  args1[3] = vec4(p_0.x, p_1.y, p_0.z - z, 0.0);
  args2[3] = vec4(p_1.x, p_0.y, p_0.z - z, 0.0);
  args0[4] = vec4(p_1.x, p_0.y, p_0.z - z, 0.0);
  args1[4] = vec4(p_0.x, p_1.y, p_0.z - z, 0.0);
  args2[4] = vec4(p_1.x, p_1.y, p_0.z - z, 0.0);
  // Leftwall
  args0[5] = vec4(p_0.x + z, p_0.y, p_1.z, 0.0);
  args1[5] = vec4(p_0.x + z, p_1.y, p_1.z, 0.0);
  args2[5] = vec4(p_0.x + z, p_0.y, p_0.z, 0.0);
  args0[6] = vec4(p_0.x + z, p_0.y, p_0.z, 0.0);
  args1[6] = vec4(p_0.x + z, p_1.y, p_1.z, 0.0);
  args2[6] = vec4(p_0.x + z, p_1.y, p_0.z, 0.0);
  // Floor
  args0[7] = vec4(p_0.x, p_0.y + z, p_0.z, 0.0);
  args1[7] = vec4(p_1.x, p_0.y + z, p_0.z, 0.0);
  args2[7] = vec4(p_0.x, p_0.y + z, p_1.z, 0.0);
  args0[8] = vec4(p_0.x, p_0.y + z, p_1.z, 0.0);
  args1[8] = vec4(p_1.x, p_0.y + z, p_0.z, 0.0);
  args2[8] = vec4(p_1.x, p_0.y + z, p_1.z, 0.0);
  // Frontwall
  args0[9] = vec4(p_0.x, p_0.y, p_1.z + z, 0.0);
  args1[9] = vec4(p_0.x, p_1.y, p_1.z + z, 0.0);
  args2[9] = vec4(p_1.x, p_0.y, p_1.z + z, 0.0);
  args0[10] = vec4(p_1.x, p_0.y, p_1.z + z, 0.0);
  args1[10] = vec4(p_0.x, p_1.y, p_1.z + z, 0.0);
  args2[10] = vec4(p_1.x, p_1.y, p_1.z + z, 0.0);
  // Rightwall
  args0[11] = vec4(p_1.x - z, p_0.y, p_1.z, 0.0);
  args1[11] = vec4(p_1.x - z, p_1.y, p_1.z, 0.0);
  args2[11] = vec4(p_1.x - z, p_0.y, p_0.z, 0.0);
  args0[12] = vec4(p_1.x - z, p_0.y, p_0.z, 0.0);
  args1[12] = vec4(p_1.x - z, p_1.y, p_1.z, 0.0);
  args2[12] = vec4(p_1.x - z, p_1.y, p_0.z, 0.0);
  // Roof
  args0[13] = vec4(p_0.x, p_1.y - z, p_0.z, 0.0);
  args1[13] = vec4(p_1.x, p_1.y - z, p_0.z, 0.0);
  args2[13] = vec4(p_0.x, p_1.y - z, p_1.z, 0.0);
  args0[14] = vec4(p_0.x, p_1.y - z, p_1.z, 0.0);
  args1[14] = vec4(p_1.x, p_1.y - z, p_0.z, 0.0);
  args2[14] = vec4(p_1.x, p_1.y - z, p_1.z, 0.0);

  // Materials
  // Type: vec3(matte, reflect_ratio, glow)
  vec3 material[count];
  material[0] = vec3(0.0, 0.1, 0.0);
  material[1] = vec3(0.1, 0.5, 0.0);
  material[2] = vec3(0.0, 1.0, 0.0);
  material[3] = vec3(0.9, 0.1, 0.0);
  material[4] = vec3(0.9, 0.1, 0.0);
  material[5] = vec3(0.9, 0.1, 0.0);
  material[6] = vec3(0.9, 0.1, 0.0);
  material[7] = vec3(0.9, 0.1, 0.0);
  material[8] = vec3(0.9, 0.1, 0.0);
  material[9] = vec3(0.9, 0.1, 0.0);
  material[10] = vec3(0.9, 0.1, 0.0);
  material[11] = vec3(0.9, 0.1, 0.0);
  material[12] = vec3(0.9, 0.1, 0.0);
  material[13] = vec3(0.9, 0.0, 1.0);
  material[14] = vec3(0.9, 0.0, 1.0);

  // Emitted colors
  vec4 colors[count];
  vec4 backwall_color = vec4(1.0, 1.0, 0.0, 1.0);
  vec4 leftwall_color = vec4(0.7, 0.0, 0.0, 1.0);
  vec4 floor_color = vec4(0.0, 1.0, 1.0, 1.0);
  vec4 frontwall_color = vec4(1.0, 0.0, 0.0, 1.0);
  vec4 rightwall_color = vec4(0.0, 0.7, 0.0, 1.0);
  vec4 roof_color = vec4(1.0, 1.0, 1.0, 1.0);
  colors[0] = vec4(0.0, 0.0, 0.8, 1.0);
  colors[1] = vec4(0.0, 1.0, 0.0, 1.0);
  colors[2] = vec4(1.0, 0.0, 0.0, 1.0);
  colors[3] = backwall_color;
  colors[4] = backwall_color;
  colors[5] = leftwall_color;
  colors[6] = leftwall_color;
  colors[7] = floor_color;
  colors[8] = floor_color;
  colors[9] = frontwall_color;
  colors[10] = frontwall_color;
  colors[11] = rightwall_color;
  colors[12] = rightwall_color;
  colors[13] = roof_color;
  colors[14] = roof_color;

  bool has_hit = false;
  vec4 result_color = vec4(0.0, 0.0, 0.0, 1.0);

  const float rays = 10.0;
  for (float ray = 0.0; ray < rays; ray++) {

    vec4 ray_color = vec4(vec3(0.0), 1.0);
    float ray_reflected = 1.0;
    highp vec3 ray_o = vec3(0.0, 0.0, 0.0);
    highp vec3 ray_d = vec3(coord - 0.5, 1.0);
    float light_accumulated = 0.0;

    for (int depth = 0; depth < 20; depth++) {
      int hit_type = -1;
      float hit_point = 9999.0;
      vec3 hit_pos;
      vec4 hit_args;
      vec4 hit_args1;
      vec4 hit_args2;
      vec3 hit_material = vec3(0.0, 0.0, 0.0);
      vec4 hit_color = vec4(vec3(0.0), 1.0);

      for (int i = 0; i < count; i++) {
        vec3 i_pos = positions[i];
        float dist = 0.0;

        if (types[i] == 0) {
          float radius = args0[i].x;
          dist = sphere_intersection(ray_o, ray_d, i_pos, radius);
        }
        else if (types[i] == 1) {
          vec3 normal = args0[i].xyz;
          dist = plane_intersection(ray_o, ray_d, i_pos, normal);
        }
        else if (types[i] == 2) {
          vec3 p1 = args0[i].xyz + i_pos;
          vec3 p2 = args1[i].xyz + i_pos;
          vec3 p3 = args2[i].xyz + i_pos;
          dist = triangle_intersection(ray_o, ray_d, p1, p2, p3);
        }

        if (dist >= 0.0 && dist < hit_point) {
          hit_point = dist;
          hit_pos = i_pos;
          hit_type = types[i];
          has_hit = true;
          hit_args = args0[i];
          hit_args1 = args1[i];
          hit_args2 = args2[i];
          hit_material = material[i];
          hit_color = colors[i];
        }
      }

      float matte = hit_material.x;
      float reflect_ratio = hit_material.y;
      float glow = hit_material.z;

      ray_o += hit_point * ray_d;

      vec3 normal;
      if (hit_type == 0) {
        float radius = hit_args.x;
        normal = sphere_normal(ray_o, hit_pos, radius);
      }
      else if (hit_type == 1) {
        normal = hit_args.xyz / length(hit_args.xyz);
      }
      else if (hit_type == 2) {
        vec3 u = hit_args1.xyz - hit_args.xyz;
        vec3 v = hit_args2.xyz - hit_args.xyz;
        normal = cross(u, v);
        normal /= length(normal);
      }

      ray_d = reflection(ray_d, normal);
      ray_o += 0.01 * ray_d;

      if (matte > 0.0) {
        vec3 fuzz = random_in_unit_circle(ray_o * ray);
        ray_d = (ray_d * 0.5 + fuzz) * matte;
      }

      ray_d /= length(ray_d);

      // 1/2: Color from material
      float material_ratio = 1.0 - reflect_ratio;
      ray_color += hit_color * material_ratio * ray_reflected;
      light_accumulated += glow;//+0.1;

      // 2/2: Color used in the next rays
      ray_reflected *= reflect_ratio;

      // No need to send further rays
      if (ray_reflected <= 0.0) break;
      if (light_accumulated >= 1.0) break;
    }
    ray_color.rgb *= light_accumulated;
    result_color += ray_color;
  }

  result_color.rgb /= rays;


  if (!has_hit) {
    result_color = vec4(vec3(0.0), 1.0);
  }

  gl_FragColor = result_color;
}
