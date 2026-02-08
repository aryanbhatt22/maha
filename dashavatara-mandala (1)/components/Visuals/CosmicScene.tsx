import React, { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { Stars, OrbitControls, Sparkles, Float } from '@react-three/drei';
import * as THREE from 'three';
import VishnuFigure from './VishnuFigure';
import Orb from './Orb';
import { avatars } from '../../data';
import { Avatar } from '../../types';

interface CosmicSceneProps {
  selectedAvatar: Avatar | null;
  onSelectAvatar: (avatar: Avatar) => void;
  onSelectVishnu?: () => void;
}

const CosmicScene: React.FC<CosmicSceneProps> = ({ selectedAvatar, onSelectAvatar, onSelectVishnu }) => {
  
  // Calculate radial positions for 10 avatars
  const orbPositions = useMemo(() => {
    const positions: { pos: [number, number, number]; angle: number }[] = [];
    const count = 10;
    const radius = 4; // Distance from center
    
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + Math.PI / 2; // Offset to start top
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      const z = 0; 
      
      positions.push({ pos: [x, y, z], angle });
    }
    return positions;
  }, []);

  // Check if Vishwaroop (id 0) is selected
  const isVishnuSelected = selectedAvatar?.id === 0;

  return (
    <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
      <color attach="background" args={['#050510']} />
      
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#FFD700" />
      <pointLight position={[-10, -10, -5]} intensity={0.5} color="#0047AB" />
      <spotLight position={[0, 10, 0]} angle={0.5} penumbra={1} intensity={2} color="#00FFFF" />

      {/* Environment */}
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      <Sparkles count={200} scale={12} size={2} speed={0.4} opacity={0.5} color="#FFD700" />
      
      {/* Central Group */}
      <group position={[0, -0.5, 0]}>
        <Float speed={2} rotationIntensity={0.1} floatIntensity={0.2}>
          <VishnuFigure 
            onSelect={onSelectVishnu} 
            isSelected={isVishnuSelected}
          />
        </Float>

        {/* The 10 Avatars */}
        {avatars.map((avatar, index) => (
          <Orb
            key={avatar.id}
            avatar={avatar}
            position={orbPositions[index].pos}
            angle={orbPositions[index].angle}
            isSelected={selectedAvatar?.id === avatar.id}
            onSelect={onSelectAvatar}
          />
        ))}

        {/* Connecting Lines (Arms) - Visual connection only */}
         {avatars.map((_, index) => {
            const endPos = new THREE.Vector3(...orbPositions[index].pos);
            const startPos = new THREE.Vector3(0, 0.5, 0); // Heart center
            
            // Shorten the line so it doesn't clip into sphere or body
            const direction = new THREE.Vector3().subVectors(endPos, startPos).normalize();
            const start = startPos.clone().add(direction.multiplyScalar(0.8)); // Increased offset to clear Vishwaroop arms
            const end = endPos.clone().sub(direction.multiplyScalar(0.6));
            
            // Calculate midpoint and length for cylinder
            const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
            const length = start.distanceTo(end);
            
            // Quaternion for rotation
            const quaternion = new THREE.Quaternion();
            const up = new THREE.Vector3(0, 1, 0);
            quaternion.setFromUnitVectors(up, direction);
            
            return (
                <mesh key={`arm-connector-${index}`} position={mid} quaternion={quaternion}>
                    <cylinderGeometry args={[0.01, 0.04, length, 8]} />
                    <meshBasicMaterial color="#00FFFF" transparent opacity={0.1} blending={THREE.AdditiveBlending} />
                </mesh>
            );
         })}
      </group>

      <OrbitControls 
        enablePan={false} 
        enableZoom={true} 
        minDistance={5} 
        maxDistance={20}
        maxPolarAngle={Math.PI / 1.5}
        minPolarAngle={Math.PI / 3}
        autoRotate={!selectedAvatar}
        autoRotateSpeed={0.5}
      />
    </Canvas>
  );
};

export default CosmicScene;