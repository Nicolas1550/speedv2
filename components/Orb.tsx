'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';

function Hologram({ mouse }: { mouse: React.MutableRefObject<{ x: number; y: number; active: boolean }> }) {
  const group = useRef<THREE.Group>(null);
  const cloud = useRef<THREE.Points>(null);
  const rings = useRef<THREE.Group>(null);
  const core = useRef<THREE.Mesh>(null);
  const { positions, original, colors, phases } = useMemo(() => {
    const count = 3600;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const phases = new Float32Array(count);
    const cyan = new THREE.Color('#3fe9ff');
    const purple = new THREE.Color('#a475ff');
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const v = Math.random() * 2 - 1;
      const r = 1.78 + (Math.random() - 0.5) * 0.26;
      const s = Math.sqrt(1 - v * v);
      positions[3 * i] = r * s * Math.cos(theta);
      positions[3 * i + 1] = r * v;
      positions[3 * i + 2] = r * s * Math.sin(theta);
      phases[i] = Math.random() * Math.PI * 2;
      const c = cyan.clone().lerp(purple, Math.random() * 0.75);
      colors[3 * i] = c.r;
      colors[3 * i + 1] = c.g;
      colors[3 * i + 2] = c.b;
    }
    return { positions, original: positions.slice(), colors, phases };
  }, []);

  useFrame((state, delta) => {
    if (!group.current || !cloud.current) return;
    const t = state.clock.elapsedTime;
    const { x, y, active } = mouse.current;
    group.current.rotation.y += delta * 0.11;
    group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, -y * 0.28, 3, delta);
    group.current.rotation.z = THREE.MathUtils.damp(group.current.rotation.z, -x * 0.22, 3, delta);
    group.current.position.y = Math.sin(t * 0.65) * 0.1;
    if (rings.current) {
      rings.current.rotation.y += delta * 0.12;
      rings.current.rotation.z += delta * 0.05;
    }
    if (core.current) {
      const scale = 1 + Math.sin(t * 2.8) * 0.13;
      core.current.scale.setScalar(scale);
    }

    // Project the mouse onto the hologram's local XY plane. Each particle
    // moves away from the cursor, then springs back to its original position.
    const geometry = cloud.current.geometry;
    const attribute = geometry.getAttribute('position') as THREE.BufferAttribute;
    const array = attribute.array as Float32Array;
    const pointerX = x * 2.6;
    const pointerY = y * 2.6;
    const strength = active ? 0.95 : 0;
    const recovery = 1 - Math.exp(-delta * 7);
    for (let i = 0; i < phases.length; i++) {
      const j = i * 3;
      const ox = original[j];
      const oy = original[j + 1];
      const oz = original[j + 2];
      const dx = ox - pointerX;
      const dy = oy - pointerY;
      const d2 = dx * dx + dy * dy + oz * oz * 0.12;
      const influence = strength * Math.exp(-d2 / 0.72);
      const invLength = 1 / Math.max(Math.sqrt(dx * dx + dy * dy), 0.12);
      const shimmer = Math.sin(t * 1.8 + phases[i]) * 0.015;
      const targetX = ox + dx * invLength * influence + ox * shimmer;
      const targetY = oy + dy * invLength * influence + oy * shimmer;
      const targetZ = oz + influence * 0.32;
      array[j] += (targetX - array[j]) * recovery;
      array[j + 1] += (targetY - array[j + 1]) * recovery;
      array[j + 2] += (targetZ - array[j + 2]) * recovery;
    }
    attribute.needsUpdate = true;
    cloud.current.rotation.y += delta * 0.025;
  });

  return (
    <group ref={group}>
      <points ref={cloud}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.029} vertexColors transparent opacity={0.97} sizeAttenuation depthWrite={false} blending={THREE.AdditiveBlending} />
      </points>
      <mesh>
        <icosahedronGeometry args={[1.55, 2]} />
        <meshBasicMaterial color="#4d42ce" wireframe transparent opacity={0.14} depthWrite={false} />
      </mesh>
      <group ref={rings}>
        <mesh rotation={[0.38, 0.15, 0.45]}>
          <torusGeometry args={[2.34, 0.012, 8, 160]} />
          <meshBasicMaterial color="#51edff" transparent opacity={0.85} />
        </mesh>
        <mesh rotation={[-0.65, 0.4, -0.3]}>
          <torusGeometry args={[2.52, 0.01, 8, 160]} />
          <meshBasicMaterial color="#b68aff" transparent opacity={0.72} />
        </mesh>
        <mesh rotation={[1.1, 0.2, 0]}>
          <torusGeometry args={[2.12, 0.007, 8, 160]} />
          <meshBasicMaterial color="#7feeff" transparent opacity={0.38} />
        </mesh>
      </group>
      <mesh ref={core}>
        <icosahedronGeometry args={[0.24, 3]} />
        <meshBasicMaterial color="#d5c4ff" transparent opacity={0.9} />
      </mesh>
      <pointLight position={[0, 0, 0]} intensity={8} distance={5} color="#8b5cff" />
    </group>
  );
}

export default function Orb() {
  const mouse = useRef({ x: 0, y: 0, active: false });
  useEffect(() => {
    const move = (event: PointerEvent) => {
      const rect = document.querySelector('.orb')?.getBoundingClientRect();
      if (!rect) return;
      mouse.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.current.y = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
      mouse.current.active = event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom;
    };
    const leave = () => { mouse.current.active = false; };
    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('blur', leave);
    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('blur', leave);
    };
  }, []);
  return (
    <Canvas camera={{ position: [0, 0, 7.7], fov: 45 }} dpr={[1, 1.6]} gl={{ alpha: true, antialias: true }}>
      <Stars radius={60} depth={25} count={500} factor={2} fade speed={0.4} />
      <Hologram mouse={mouse} />
    </Canvas>
  );
}
