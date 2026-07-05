import { useMemo } from 'react';
import * as THREE from 'three';
import { createGlowTexture } from './textures';

/**
 * A stylized katana built from primitives: an extruded blade with a glowing
 * violet cutting edge, a tsuba (guard), and a wrapped handle. Centered on its
 * own origin so the parent group can rotate it about the blade's midpoint.
 */
export function Katana() {
  const bladeGeo = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0.05);
    shape.lineTo(0.09, 0.08);
    shape.lineTo(0.09, 2.5);
    shape.lineTo(0.045, 2.95); // taper to the tip
    shape.lineTo(0, 2.55); // cutting edge back down
    shape.closePath();
    return new THREE.ExtrudeGeometry(shape, {
      depth: 0.03,
      bevelEnabled: true,
      bevelThickness: 0.012,
      bevelSize: 0.008,
      bevelSegments: 1,
    });
  }, []);

  const glowTex = useMemo(() => createGlowTexture(), []);

  return (
    <group position={[-0.045, -1.2, 0]}>
      {/* blade */}
      <mesh geometry={bladeGeo}>
        <meshStandardMaterial
          color="#2a2540"
          metalness={0.95}
          roughness={0.28}
          emissive="#4c2f8f"
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* glowing cutting edge */}
      <mesh position={[0.006, 1.35, 0.015]}>
        <boxGeometry args={[0.03, 2.5, 0.05]} />
        <meshBasicMaterial color="#d8caff" toneMapped={false} />
      </mesh>

      {/* tsuba (guard) */}
      <mesh position={[0.045, 0.04, 0.015]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 0.045, 28]} />
        <meshStandardMaterial color="#17121f" metalness={0.7} roughness={0.45} />
      </mesh>

      {/* handle (tsuka) */}
      <mesh position={[0.045, -0.45, 0.015]}>
        <cylinderGeometry args={[0.062, 0.056, 0.9, 20]} />
        <meshStandardMaterial color="#0f0b17" metalness={0.15} roughness={0.85} />
      </mesh>

      {/* pommel */}
      <mesh position={[0.045, -0.92, 0.015]}>
        <cylinderGeometry args={[0.07, 0.07, 0.06, 20]} />
        <meshStandardMaterial color="#17121f" metalness={0.6} roughness={0.5} />
      </mesh>

      {/* soft halo behind the blade (fakes bloom) */}
      <sprite position={[0.045, 1.4, -0.08]} scale={[1.7, 4.4, 1]}>
        <spriteMaterial
          map={glowTex}
          color="#7c3aed"
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          opacity={0.5}
        />
      </sprite>
    </group>
  );
}
