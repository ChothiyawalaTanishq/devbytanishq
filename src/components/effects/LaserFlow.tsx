import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const LaserBeam = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const { mouse } = useThree();
  
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uColor1: { value: new THREE.Color("#8b5cf6") },
      uColor2: { value: new THREE.Color("#3b82f6") },
      uColor3: { value: new THREE.Color("#00ffd0") },
    }),
    []
  );

  useFrame((state) => {
    if (!meshRef.current) return;
    uniforms.uTime.value = state.clock.elapsedTime;
    uniforms.uMouse.value.x = mouse.x * 0.5;
    uniforms.uMouse.value.y = mouse.y * 0.5;
  });

  const vertexShader = `
    varying vec2 vUv;
    varying vec3 vPosition;
    
    void main() {
      vUv = uv;
      vPosition = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const fragmentShader = `
    uniform float uTime;
    uniform vec2 uMouse;
    uniform vec3 uColor1;
    uniform vec3 uColor2;
    uniform vec3 uColor3;
    
    varying vec2 vUv;
    varying vec3 vPosition;
    
    // Noise function
    float random(vec2 st) {
      return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
    }
    
    float noise(vec2 st) {
      vec2 i = floor(st);
      vec2 f = fract(st);
      float a = random(i);
      float b = random(i + vec2(1.0, 0.0));
      float c = random(i + vec2(0.0, 1.0));
      float d = random(i + vec2(1.0, 1.0));
      vec2 u = f * f * (3.0 - 2.0 * f);
      return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
    }
    
    void main() {
      vec2 center = vec2(0.5 + uMouse.x * 0.2, 0.5 + uMouse.y * 0.2);
      float dist = distance(vUv, center);
      
      // Create multiple laser beams
      float beam1 = smoothstep(0.3, 0.0, abs(vUv.y - 0.5 + sin(vUv.x * 3.0 + uTime) * 0.1));
      float beam2 = smoothstep(0.2, 0.0, abs(vUv.x - 0.5 + cos(vUv.y * 2.0 + uTime * 0.8) * 0.15));
      
      // Add wisps/fog effect
      float wisp = noise(vUv * 5.0 + uTime * 0.3) * 0.3;
      float wisp2 = noise(vUv * 8.0 - uTime * 0.2) * 0.2;
      
      // Combine effects
      float intensity = beam1 * 0.4 + beam2 * 0.3 + wisp + wisp2;
      
      // Color mixing
      vec3 color = mix(uColor1, uColor2, vUv.x + sin(uTime * 0.5) * 0.3);
      color = mix(color, uColor3, wisp2);
      
      // Radial fade
      float fade = 1.0 - smoothstep(0.0, 0.8, dist);
      
      gl_FragColor = vec4(color * intensity * fade, intensity * fade * 0.6);
    }
  `;

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[10, 10, 32, 32]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
};

export const LaserFlow = () => {
  return (
    <div className="absolute inset-0 pointer-events-none opacity-40">
      <Canvas
        camera={{ position: [0, 0, 3], fov: 75 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 1.5]}
      >
        <LaserBeam />
      </Canvas>
    </div>
  );
};
