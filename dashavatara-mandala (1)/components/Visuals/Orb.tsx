import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Html, Ring } from '@react-three/drei';
import * as THREE from 'three';
import { Avatar, AvatarOrbProps } from '../../types';

const Orb: React.FC<AvatarOrbProps> = ({ avatar, position, angle, isSelected, onSelect }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHover] = useState(false);
  
  // Calculate a gentle floating motion based on position index
  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.getElapsedTime();
      // Rotation
      meshRef.current.rotation.y += 0.01 + (hovered ? 0.02 : 0);
      meshRef.current.rotation.x = Math.sin(time * 0.5) * 0.1;
      
      // Float
      const floatY = Math.sin(time * 2 + avatar.id) * 0.1;
      meshRef.current.position.y = position[1] + floatY;
    }
  });

  const scale = hovered ? 1.4 : 1;
  const opacity = isSelected ? 0 : (hovered ? 0.9 : 0.6);

  if (isSelected) return null; // Hide orb when modal is active/orb is selected to "explode" it

  return (
    <group position={new THREE.Vector3(...position)}>
      <mesh
        ref={meshRef}
        scale={scale}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(avatar);
        }}
        onPointerOver={() => {
          document.body.style.cursor = 'pointer';
          setHover(true);
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'default';
          setHover(false);
        }}
      >
        <sphereGeometry args={[0.5, 32, 32]} />
        <MeshDistortMaterial
          color={avatar.color}
          emissive={avatar.color}
          emissiveIntensity={hovered ? 0.8 : 0.4}
          roughness={0.2}
          metalness={0.8}
          distort={0.4}
          speed={2}
          transparent
          opacity={opacity}
        />
        
        {/* Inner Core */}
        <Sphere args={[0.2, 16, 16]}>
            <meshBasicMaterial color="#ffffff" transparent opacity={0.8} />
        </Sphere>
      </mesh>

      {/* Hover Tooltip - 3D Text Overlay */}
      {hovered && (
        <Html position={[0, 0.8, 0]} center distanceFactor={10} zIndexRange={[100, 0]}>
          <div className="bg-black/80 text-gold-500 border border-yellow-500/30 p-2 rounded backdrop-blur-sm pointer-events-none text-center min-w-[120px]">
            <div className="text-xl font-sanskrit text-yellow-400">{avatar.sanskritName}</div>
            <div className="text-xs font-cinzel text-cyan-200 tracking-widest uppercase">{avatar.name}</div>
          </div>
        </Html>
      )}
      
      {/* Decorative Ring */}
      <Ring args={[0.6, 0.65, 32]} rotation={[Math.PI / 2, 0, 0]}>
         <meshBasicMaterial color={avatar.color} side={THREE.DoubleSide} transparent opacity={0.3} />
      </Ring>
    </group>
  );
};

export default Orb;