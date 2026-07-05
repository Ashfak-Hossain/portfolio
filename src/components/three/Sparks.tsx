import { forwardRef, useImperativeHandle, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { createGlowTexture } from './textures';

export interface SparksHandle {
  burst: () => void;
}

const COUNT = 46;
const LIFETIME = 0.9;

/** A one-shot GPU spark burst emitted along the blade when the cut lands. */
export const Sparks = forwardRef<SparksHandle>(function Sparks(_props, ref) {
  const positions = useMemo(() => new Float32Array(COUNT * 3), []);
  const velocities = useMemo(() => new Float32Array(COUNT * 3), []);
  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return g;
  }, [positions]);
  const texture = useMemo(() => createGlowTexture(), []);
  const materialRef = useRef<THREE.PointsMaterial>(null);
  const life = useRef(LIFETIME); // start "dead"

  useImperativeHandle(ref, () => ({
    burst() {
      for (let i = 0; i < COUNT; i++) {
        // seed along the blade diagonal, bursting outward
        const t = Math.random();
        positions[i * 3 + 0] = -0.9 + t * 1.4 + (Math.random() - 0.5) * 0.2;
        positions[i * 3 + 1] = -0.7 + t * 2.6 + (Math.random() - 0.5) * 0.2;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 0.3;
        const ang = -Math.PI / 2 + (Math.random() * 1.4 - 0.7);
        const speed = 1.6 + Math.random() * 3.4;
        velocities[i * 3 + 0] = Math.cos(ang) * speed * (Math.random() < 0.5 ? -1 : 1);
        velocities[i * 3 + 1] = Math.sin(ang) * speed;
        velocities[i * 3 + 2] = (Math.random() - 0.5) * 2;
      }
      geometry.attributes.position.needsUpdate = true;
      life.current = 0;
      if (materialRef.current) materialRef.current.opacity = 1;
    },
  }));

  useFrame((_, dt) => {
    if (life.current >= LIFETIME) return;
    const clamped = Math.min(dt, 0.05);
    for (let i = 0; i < COUNT; i++) {
      positions[i * 3 + 0] += velocities[i * 3 + 0] * clamped;
      positions[i * 3 + 1] += velocities[i * 3 + 1] * clamped;
      positions[i * 3 + 2] += velocities[i * 3 + 2] * clamped;
      velocities[i * 3 + 1] -= 5.5 * clamped; // gravity
    }
    geometry.attributes.position.needsUpdate = true;
    life.current += clamped;
    if (materialRef.current) {
      materialRef.current.opacity = Math.max(0, 1 - life.current / LIFETIME);
    }
  });

  return (
    <points geometry={geometry}>
      <pointsMaterial
        ref={materialRef}
        size={0.11}
        map={texture}
        color="#d8caff"
        transparent
        opacity={0}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        toneMapped={false}
      />
    </points>
  );
});
