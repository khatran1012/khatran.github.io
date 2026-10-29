uniform sampler2D uFrom;
uniform sampler2D uTo;
uniform float uProgress;
uniform float uTime;
uniform float uAspect;
uniform vec2 uOrigin;
varying vec2 vUv;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 s = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), s.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0)), s.x), s.y);
}
vec2 cover(vec2 uv) {
  vec2 ratio = vec2(min(uAspect / (4.0 / 3.0), 1.0), min((4.0 / 3.0) / uAspect, 1.0));
  return (uv - 0.5) * ratio + 0.5;
}
void main() {
  float p = uProgress;
  float energy = sin(p * 3.14159265);
  vec2 field = vUv * 5.0 + vec2(uTime * 0.16, -uTime * 0.12);
  float n = noise(field) * 0.65 + noise(field * 2.1) * 0.35;
  float distanceToOrigin = length((vUv - uOrigin) * vec2(uAspect, 1.0));
  float front = p * 2.2 - distanceToOrigin + (n - 0.5) * 0.42;
  float mask = smoothstep(0.0, 0.18, front);
  if (p < 0.001) mask = 0.0;
  if (p > 0.999) mask = 1.0;
  vec2 flow = vec2(n - 0.5, noise(field + 12.7) - 0.5) * energy * 0.15;
  vec3 before = texture2D(uFrom, clamp(cover(vUv + flow), 0.001, 0.999)).rgb;
  vec3 after = texture2D(uTo, clamp(cover(vUv - flow), 0.001, 0.999)).rgb;
  gl_FragColor = vec4(mix(before, after, mask), 1.0);
  #include <colorspace_fragment>
}
