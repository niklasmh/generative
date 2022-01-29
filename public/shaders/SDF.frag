precision highp float;

uniform vec2 screen;
uniform float time;

float sphere(vec3 p, float r, vec3 translation) {
  return length(p - translation) - r;
}

float box(vec3 p, vec3 size) {
  vec3 d = abs(p) - size;
  return min(max(d.x, max(d.y, d.z)), 0.0) + length(max(d, 0.0));
}

float add(float a, float b) {
  return min(a, b);
}

float subtract(float a, float b) {
  return max(-a, b);
}

float intersect(float a, float b) {
  return max(a, b);
}

vec2 sminN( float a, float b, float k, float n )
{
    float h = max(k - abs(a - b), 0.0) / k;
    float m = pow(h, n) * 0.5;
    float s = m * k / n;
    return (a < b) ? vec2(a - s, m) : vec2(b - s, m - 1.0);
}

mat3 rotate_x(float a) {
  float sa = sin(a);
  float ca = cos(a);
  return mat3(
    vec3(1.0, 0.0, 0.0),
    vec3(0.0, ca, sa),
    vec3(0.0, -sa, ca)
  );
}

mat3 rotate_y(float a) {
  float sa = sin(a);
  float ca = cos(a);
  return mat3(
    vec3(ca, 0.0, sa),
    vec3(0.0, 1.0, 0.0),
    vec3(-sa, 0.0, ca)
  );
}

mat3 rotate_z(float a) {
  float sa = sin(a);
  float ca = cos(a);
  return mat3(
    vec3(ca, sa, 0.0),
    vec3(-sa, ca, 0.0),
    vec3(0.0, 0.0, 1.0)
  );
}

vec2 sdf(vec3 p) {
  float b = box(p * rotate_x(-0.1) * rotate_y(1.0), vec3(0.3));
  float s = sphere(p, 0.5, vec3(0.0));
  float sb = subtract(s, b) - 0.02;

  float s_mini = sphere(p, 0.2, vec3(0.0));

  vec2 res;
  res.x = add(s_mini, sb);

  if (s_mini < sb) {
    res.y = 2.0;
  } else {
    res.y = 1.0;
  }

  return res;
}

const highp float NOISE_GRANULARITY = 2.0 / 255.0;

highp float random(vec2 coords) {
    return fract(sin(dot(coords.xy, vec2(12.9898,78.233))) * 43758.5453);
}

void main() {
  highp float scale = 1.0 / screen.y;
  highp vec2 coord = gl_FragCoord.xy * scale / 2.0;
  highp vec2 center = vec2(screen.x * scale, 1.0) / 2.0;
  highp vec3 pos = vec3(coord.x - center.x, coord.y - center.y, 0.0 - center.y);
  vec3 direction = pos - vec3(0.0, 0.0, -1.0);

  float d = 10.0;
  for (int i = 0; i < 256; i++) {
    d = sdf(pos).x;
    pos += direction * d;

    if(d < 0.000001 || pos.z >= 100.0) {
      break;
    }
  }

  highp float step = 0.000001;
  vec2 res = sdf(pos);
  vec3 gradient = res.x - vec3(
    sdf(pos + vec3(step, .000, .000)).x,
    sdf(pos + vec3(.000, step, .000)).x,
    sdf(pos + vec3(.000, .000, step)).x
  );
  float material = res.y;
  highp vec3 normal = normalize(gradient);

  highp vec4 color = vec4(0.0, 0.0, 0.0, 1.0);

  float direction_light = max(
    0.1,
    min(
      1.0,
      0.5 + 0.5 * dot(normal, normalize(vec3(0.5, -0.5, 0.5)))
    )
  ) * 0.15;

  highp float point_light = max(
    0.1,
    min(
      1.0,
      dot(normal, normalize(pos - vec3(0.0, 0.0, 0.0)))
    )
  );

  highp float glow_start_radius = 0.2;
  highp float glow_radius = 0.4;
  highp float dist_from_center = length(coord - center) / glow_radius;
  highp float dist_from_edge = dist_from_center - glow_start_radius;
  highp float glow_from_edge = pow(clamp(1.0 - dist_from_edge, 0.0, 1.0), 2.0);
  highp float glow = glow_from_edge / 10.0;
  
  if (d < 10.0) {
    if (material < 1.5) {
      color.r = direction_light + point_light * glow * 8.0;
      color.g = direction_light;
      color.b = direction_light + point_light * glow * 8.0;
    } else if (material < 2.5) {
      color.r = 1.0;
      color.g = 0.0;
      color.b = 1.0;
    }
  } else {
    // Add noise to glow to avoid banding
    glow += mix(-NOISE_GRANULARITY, NOISE_GRANULARITY, random(coord));
    color += vec4(0, glow, glow, 1.0);
  }

  gl_FragColor = color;
}
