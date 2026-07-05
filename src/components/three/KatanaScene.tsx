import { useRef } from 'react';
import type { RefObject } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Katana } from './Katana';
import { Sparks } from './Sparks';
import type { SparksHandle } from './Sparks';

interface KatanaSceneProps {
  /** Section scroll progress, 0→1, updated imperatively (no re-render). */
  progressRef: RefObject<number>;
  /** Called once when the cut lands (drives the 2D flash overlay). */
  onApex: () => void;
  reduced: boolean;
  /** Incrementing counter that forces a cut (Replay button). */
  cutTrigger: number;
}

function easeInOut(t: number): number {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

function Rig({ progressRef, onApex, reduced, cutTrigger }: KatanaSceneProps) {
  const group = useRef<THREE.Group>(null);
  const sparks = useRef<SparksHandle>(null);
  const hasCut = useRef(false);
  const lastTrigger = useRef(cutTrigger);

  useFrame((state) => {
    const g = group.current;
    if (!g) return;
    const p = reduced ? 1 : Math.min(1, Math.max(0, progressRef.current));
    const e = easeInOut(p);

    // draw the blade across as the section scrolls through
    g.rotation.z = THREE.MathUtils.lerp(-0.95, -0.12, e);
    g.rotation.y = reduced ? 0.2 : Math.sin(state.clock.elapsedTime * 0.6) * 0.22 + e * 0.35;

    if (reduced) return;

    const doCut = () => {
      sparks.current?.burst();
      onApex();
    };

    // Replay button forces a cut regardless of scroll position.
    if (cutTrigger !== lastTrigger.current) {
      lastTrigger.current = cutTrigger;
      doCut();
      return;
    }
    // Otherwise fire once as the blade passes its apex.
    if (!hasCut.current && p > 0.5) {
      hasCut.current = true;
      doCut();
    }
    if (p < 0.35) hasCut.current = false;
  });

  return (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight position={[3, 5, 4]} intensity={1.3} color="#cbb8ff" />
      <pointLight position={[-2.4, -1, 3]} intensity={45} color="#7c3aed" distance={14} />
      <pointLight position={[2, 3, 2]} intensity={22} color="#e9dcff" distance={12} />
      <group ref={group} scale={1.05}>
        <Katana />
        <Sparks ref={sparks} />
      </group>
    </>
  );
}

export default function KatanaScene(props: KatanaSceneProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 35 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      frameloop={props.reduced ? 'demand' : 'always'}
    >
      <Rig {...props} />
    </Canvas>
  );
}
