"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Escena 3D del Hero: motas doradas en suspensión, como el sol filtrándose
 * entre las copas del olivar. Three.js + WebGLRenderer estándar (no
 * WebGPU/TSL): para una demo de venta priorizamos compatibilidad amplia
 * sobre la última API — el salto a WebGPURenderer con fallback WebGL2 es
 * la mejora natural si el proyecto se aprueba a escala de producción.
 * Solo se monta en escritorio con puntero fino y sin reduced-motion
 * (ver Hero.tsx) — nunca es parte de la lectura del contenido, solo lo
 * enmarca.
 */
// PRNG determinista (mulberry32) en vez de Math.random(): la nube de
// partículas debe ser una función pura del render (misma semilla, mismo
// resultado siempre), no un efecto secundario impuro.
function createSeededRandom(seed: number) {
  let t = seed;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), t | 1);
    r ^= r + Math.imul(r ^ (r >>> 7), r | 61);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function Motes() {
  const ref = useRef<THREE.Points>(null);
  const count = 260;

  const positions = useMemo(() => {
    const rand = createSeededRandom(1958);
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (rand() - 0.5) * 12;
      arr[i * 3 + 1] = (rand() - 0.5) * 7;
      arr[i * 3 + 2] = (rand() - 0.5) * 6;
    }
    return arr;
  }, []);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.getElapsedTime();
    ref.current.rotation.y = t * 0.02;
    ref.current.position.y = Math.sin(t * 0.15) * 0.15;
    ref.current.position.x = state.pointer.x * 0.3;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.045}
        color="#e8b840"
        transparent
        opacity={0.55}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

export default function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 1.5]}
    >
      <Motes />
    </Canvas>
  );
}
