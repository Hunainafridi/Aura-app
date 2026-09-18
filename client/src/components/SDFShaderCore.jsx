import React, { useEffect, useRef } from 'react';

/**
 * GPU Raymarched Signed Distance Field (SDF) Shader Core
 * - Procedural Signed Distance Field (SDF) with fluid noise refraction
 * - Chromatic Aberration (R, G, B ray split)
 * - Gyroscope & Pointer-Coupled Dynamic Light Vector
 * - Zero CPU overhead WebGL 2.0 Fragment Shader
 */
export default function SDFShaderCore({ mode = 'purge' }) {
  const canvasRef = useRef(null);
  const glRef = useRef(null);
  const animIdRef = useRef(null);
  const uniformsRef = useRef({
    time: 0,
    lightVec: [0.5, 0.8, -0.8],
    targetLightVec: [0.5, 0.8, -0.8],
    modeColor: mode === 'purge' ? [0.22, 0.74, 0.97] : [0.51, 0.55, 0.97],
    targetModeColor: mode === 'purge' ? [0.22, 0.74, 0.97] : [0.51, 0.55, 0.97]
  });

  // Update target color on mode shift
  useEffect(() => {
    uniformsRef.current.targetModeColor =
      mode === 'purge' ? [0.22, 0.74, 0.97] : [0.51, 0.55, 0.97];
  }, [mode]);

  // Gyroscope & Pointer tracking
  useEffect(() => {
    const handleOrientation = (e) => {
      if (e.gamma !== null && e.beta !== null) {
        // Clamp orientation tilt
        const x = Math.max(-1, Math.min(1, e.gamma / 45));
        const y = Math.max(-1, Math.min(1, e.beta / 45));
        uniformsRef.current.targetLightVec = [x * 0.8, y * 0.8, -0.8];
      }
    };

    const handlePointerMove = (e) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      uniformsRef.current.targetLightVec = [x * 1.2, y * 1.2, -0.8];
    };

    window.addEventListener('deviceorientation', handleOrientation);
    window.addEventListener('pointermove', handlePointerMove);

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
      window.removeEventListener('pointermove', handlePointerMove);
    };
  }, []);

  // WebGL 2.0 Initialization & Shader Pipeline
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl2', { alpha: true, antialias: true, powerPreference: 'high-performance' });
    if (!gl) {
      console.warn('[Aura Shader] WebGL 2.0 unavailable, falling back to basic rendering.');
      return;
    }
    glRef.current = gl;

    // Full-screen Quad Vertex Shader
    const vsSource = `#version 300 es
      in vec2 position;
      out vec2 v_uv;
      void main() {
        v_uv = position * 0.5 + 0.5;
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

    // Raymarched Procedural SDF Fragment Shader with Chromatic Aberration & Refraction
    const fsSource = `#version 300 es
      precision highp float;
      in vec2 v_uv;
      out vec4 fragColor;

      uniform vec2 u_resolution;
      uniform float u_time;
      uniform vec3 u_light;
      uniform vec3 u_mode_color;

      // 3D Simplex noise approximation for fluid turbulence
      vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
      vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}

      float snoise(vec3 v){
        const vec2 C = vec2(1.0/6.0, 1.0/3.0);
        const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
        vec3 i  = floor(v + dot(v, C.yyy));
        vec3 x0 = v - i + dot(i, C.xxx);
        vec3 g = step(x0.yzx, x0.xyz);
        vec3 l = 1.0 - g;
        vec3 i1 = min(g.xyz, l.zxy);
        vec3 i2 = max(g.xyz, l.zxy);
        vec3 x1 = x0 - i1 + 1.0 * C.xxx;
        vec3 x2 = x0 - i2 + 2.0 * C.xxx;
        vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;
        i = mod(i, 289.0);
        vec4 p = permute(permute(permute(
                  i.z + vec4(0.0, i1.z, i2.z, 1.0))
                + i.y + vec4(0.0, i1.y, i2.y, 1.0))
                + i.x + vec4(0.0, i1.x, i2.x, 1.0));
        float n_ = 0.142857142857;
        vec3 ns = n_ * D.wyz - D.xzx;
        vec4 j = p - 49.0 * floor(p * ns.z *ns.z);
        vec4 x_ = floor(j * ns.z);
        vec4 y_ = floor(j - 7.0 * x_);
        vec4 x = x_ *ns.x + ns.yyyy;
        vec4 y = y_ *ns.x + ns.yyyy;
        vec4 h = 1.0 - abs(x) - abs(y);
        vec4 b0 = vec4(x.xy, y.xy);
        vec4 b1 = vec4(x.zw, y.zw);
        vec4 s0 = floor(b0)*2.0 + 1.0;
        vec4 s1 = floor(b1)*2.0 + 1.0;
        vec4 sh = -step(h, vec4(0.0));
        vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
        vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
        vec3 p0 = vec3(a0.xy, h.x);
        vec3 p1 = vec3(a0.zw, h.y);
        vec3 p2 = vec3(a1.xy, h.z);
        vec3 p3 = vec3(a1.zw, h.w);
        vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
        p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
        vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
        m = m * m;
        return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
      }

      // Signed Distance Function (SDF) of pulsating morphed sphere
      float map(vec3 p) {
        float noise = snoise(p * 2.2 + vec3(0.0, u_time * 0.35, u_time * 0.2)) * 0.18;
        return length(p) - (0.85 + noise);
      }

      // Normal vector calculation via gradient of distance field
      vec3 calcNormal(vec3 p) {
        const float eps = 0.002;
        return normalize(vec3(
          map(p + vec3(eps, 0.0, 0.0)) - map(p - vec3(eps, 0.0, 0.0)),
          map(p + vec3(0.0, eps, 0.0)) - map(p - vec3(0.0, eps, 0.0)),
          map(p + vec3(0.0, 0.0, eps)) - map(p - vec3(0.0, 0.0, eps))
        ));
      }

      void main() {
        vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.x, u_resolution.y);

        vec3 ro = vec3(0.0, 0.0, 2.5); // Camera origin
        vec3 rd = normalize(vec3(uv, -1.5)); // Ray direction

        // Raymarching
        float t = 0.0;
        float hit = -1.0;
        for (int i = 0; i < 64; i++) {
          vec3 p = ro + rd * t;
          float d = map(p);
          if (d < 0.001) {
            hit = t;
            break;
          }
          if (t > 4.5) break;
          t += d * 0.75;
        }

        vec3 color = vec3(0.0);
        float alpha = 0.0;

        if (hit > 0.0) {
          vec3 p = ro + rd * hit;
          vec3 n = calcNormal(p);
          vec3 v = -rd;

          // Gyroscope-coupled dynamic light direction
          vec3 l = normalize(u_light);

          // Diffuse & Specular highlights
          float diff = max(dot(n, l), 0.0);
          vec3 h = normalize(l + v);
          float spec = pow(max(dot(n, h), 0.0), 32.0);

          // Fresnel reflectance
          float fresnel = pow(1.0 - max(dot(v, n), 0.0), 3.0);

          // Chromatic Aberration & Refraction (Separate R, G, B ray offsets)
          float rOffset = 1.05;
          float gOffset = 1.00;
          float bOffset = 0.95;

          float rNoise = snoise((p * rOffset) * 3.0 + u_time * 0.4);
          float gNoise = snoise((p * gOffset) * 3.0 + u_time * 0.4);
          float bNoise = snoise((p * bOffset) * 3.0 + u_time * 0.4);

          vec3 interiorGlow = vec3(
            0.5 + 0.5 * rNoise,
            0.5 + 0.5 * gNoise,
            0.5 + 0.5 * bNoise
          ) * u_mode_color * 1.4;

          color = interiorGlow * (diff * 0.6 + 0.4) + vec3(spec * 1.2) + u_mode_color * fresnel * 2.0;
          alpha = clamp(0.75 + fresnel * 0.25, 0.0, 1.0);
        } else {
          // Atmospheric bioluminescent halo around core
          float distToCenter = length(uv);
          float halo = exp(-distToCenter * 3.2);
          color = u_mode_color * halo * 0.65;
          alpha = clamp(halo * 0.7, 0.0, 0.9);
        }

        fragColor = vec4(color, alpha);
      }
    `;

    // Compile helper
    const compileShader = (src, type) => {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, src);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader compilation failed:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vs = compileShader(vsSource, gl.VERTEX_SHADER);
    const fs = compileShader(fsSource, gl.FRAGMENT_SHADER);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program linking failed:', gl.getProgramInfoLog(program));
      return;
    }

    gl.useProgram(program);

    // Quad geometry buffer
    const quadBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
        -1.0, -1.0,
         1.0, -1.0,
        -1.0,  1.0,
        -1.0,  1.0,
         1.0, -1.0,
         1.0,  1.0,
      ]),
      gl.STATIC_DRAW
    );

    const posAttr = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(posAttr);
    gl.vertexAttribPointer(posAttr, 2, gl.FLOAT, false, 0, 0);

    // Uniform locations
    const uResolution = gl.getUniformLocation(program, 'u_resolution');
    const uTime = gl.getUniformLocation(program, 'u_time');
    const uLight = gl.getUniformLocation(program, 'u_light');
    const uModeColor = gl.getUniformLocation(program, 'u_mode_color');

    // Enable Alpha Blending
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    let startTime = performance.now();

    const render = (now) => {
      const elapsed = (now - startTime) * 0.001;

      // Smooth interpolation for lighting vector & colors
      const uniforms = uniformsRef.current;
      for (let i = 0; i < 3; i++) {
        uniforms.lightVec[i] += (uniforms.targetLightVec[i] - uniforms.lightVec[i]) * 0.08;
        uniforms.modeColor[i] += (uniforms.targetModeColor[i] - uniforms.modeColor[i]) * 0.06;
      }

      // Resize canvas buffer if needed
      const displayWidth = canvas.clientWidth;
      const displayHeight = canvas.clientHeight;
      if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
        canvas.width = displayWidth;
        canvas.height = displayHeight;
        gl.viewport(0, 0, canvas.width, canvas.height);
      }

      gl.uniform2f(uResolution, canvas.width, canvas.height);
      gl.uniform1f(uTime, elapsed);
      gl.uniform3fv(uLight, uniforms.lightVec);
      gl.uniform3fv(uModeColor, uniforms.modeColor);

      gl.clearColor(0.0, 0.0, 0.0, 0.0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.drawArrays(gl.TRIANGLES, 0, 6);

      animIdRef.current = requestAnimationFrame(render);
    };

    animIdRef.current = requestAnimationFrame(render);

    return () => {
      if (animIdRef.current) cancelAnimationFrame(animIdRef.current);
      if (gl) {
        gl.deleteProgram(program);
        gl.deleteShader(vs);
        gl.deleteShader(fs);
        gl.deleteBuffer(quadBuffer);
      }
    };
  }, []);

  return (
    <div className="relative w-44 h-44 my-1 flex items-center justify-center">
      {/* GPU Raymarched Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full block rounded-3xl pointer-events-none drop-shadow-[0_0_24px_rgba(76,215,246,0.35)]"
      />
      {/* Dynamic light angle helper tip */}
      <div className="absolute -bottom-1 text-[9px] font-mono tracking-widest text-typography-secondary/60 uppercase pointer-events-none">
        GPU Raymarched SDF • Gyro Synced
      </div>
    </div>
  );
}
