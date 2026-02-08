import React, { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Torus, Cylinder, Sphere, Html } from '@react-three/drei';
import * as THREE from 'three';

interface VishnuFigureProps {
  onSelect?: () => void;
  isSelected?: boolean;
}

const VishnuFigure: React.FC<VishnuFigureProps> = ({ onSelect, isSelected = false }) => {
  const groupRef = useRef<THREE.Group>(null);
  const armsRef = useRef<THREE.Group>(null);
  const armRefs = useRef<(THREE.Group | null)[]>([]);
  const ringsRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  
  const [hovered, setHover] = useState(false);
  const [clicked, setClicked] = useState(false);
  
  // Animation state ref: 0 = inactive, 1 = fully transformed
  const animState = useRef(0);

  // Generate abstract arms configuration
  const armCount = 14;
  const armsData = useMemo(() => {
    return new Array(armCount).fill(0).map((_, i) => {
      // Expanded state: Wide fan (almost full circle)
      const maxAngle = THREE.MathUtils.degToRad(-150 + (300 / (armCount - 1)) * i);
      // Collapsed state: Narrow fan behind back
      const minAngle = THREE.MathUtils.degToRad(-60 + (120 / (armCount - 1)) * i);
      return { maxAngle, minAngle, id: i };
    });
  }, []);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    
    // Smoothly interpolate animation state
    const targetState = (isSelected || clicked) ? 1 : 0;
    // Speed of transition
    const lerpSpeed = delta * 3;
    animState.current = THREE.MathUtils.lerp(animState.current, targetState, lerpSpeed);
    
    const activeFactor = animState.current; // 0 to 1

    if (groupRef.current) {
        // Divine breathing (Levitation)
        groupRef.current.position.y = Math.sin(t * 0.5) * 0.2;
        
        // Dynamic Scaling
        // Base scale 1, Target scale 1.5
        const currentScale = 1 + (hovered ? 0.05 : 0) + (activeFactor * 0.5);
        groupRef.current.scale.setScalar(currentScale);
    }

    if (armsRef.current) {
        // Gentle sway
        armsRef.current.rotation.z = Math.sin(t * 0.3) * 0.05;
        // Move arms back/forward slightly
        armsRef.current.position.z = -0.6 - (activeFactor * 0.2);
    }

    // Animate individual arms fanning out
    armRefs.current.forEach((arm, i) => {
        if (arm) {
            const { minAngle, maxAngle } = armsData[i];
            const currentAngle = THREE.MathUtils.lerp(minAngle, maxAngle, activeFactor);
            arm.rotation.z = currentAngle;
            
            // Add individual wobbly motion when active
            if (activeFactor > 0.1) {
                 arm.rotation.z += Math.sin(t * 2 + i) * 0.02 * activeFactor;
            }
        }
    });
    
    // Animate Rings
    if (ringsRef.current) {
        // Rotation speed increases significantly
        const speed = 0.2 + (activeFactor * 2.5);
        ringsRef.current.rotation.y += delta * speed;
        ringsRef.current.rotation.x = Math.sin(t * 0.2) * (0.2 + activeFactor * 0.2);
        
        // Rings expand and pulse
        const pulse = Math.sin(t * 5) * 0.02 * activeFactor;
        const scale = 1 + (activeFactor * 0.4) + pulse;
        ringsRef.current.scale.setScalar(scale);
    }
    
    // Animate Core
    if (coreRef.current) {
        // Pulse faster when active
        const pulseSpeed = 2 + (activeFactor * 10);
        const scale = 1 + Math.sin(t * pulseSpeed) * (0.1 + activeFactor * 0.1);
        coreRef.current.scale.setScalar(scale);
        
        // Rotate core
        coreRef.current.rotation.y += delta * (1 + activeFactor * 5);
        coreRef.current.rotation.z += delta * activeFactor;
    }
  });

  const handleClick = (e: any) => {
    e.stopPropagation();
    setClicked(true);
    setTimeout(() => setClicked(false), 500); 
    if (onSelect) onSelect();
  };

  return (
    <group 
        ref={groupRef} 
        onClick={handleClick}
        onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = 'pointer'; setHover(true); }}
        onPointerOut={(e) => { document.body.style.cursor = 'default'; setHover(false); }}
    >
      
      {/* Tooltip on Hover */}
      {hovered && !isSelected && (
        <Html position={[0, 4, 0]} center distanceFactor={10} zIndexRange={[100, 0]}>
             <div className="bg-black/90 text-gold-500 border border-yellow-500/50 p-3 rounded-lg backdrop-blur-md pointer-events-none text-center min-w-[200px] shadow-[0_0_20px_rgba(255,215,0,0.4)] transition-opacity duration-300">
                <div className="text-2xl font-sanskrit text-yellow-400 mb-1 leading-none">विश्वरूप</div>
                <div className="text-sm font-cinzel text-cyan-200 tracking-widest uppercase font-bold">Vishwaroop</div>
                <div className="text-[10px] text-white/60 font-philosopher mt-1 uppercase tracking-wider">The Cosmic Form</div>
             </div>
        </Html>
      )}

      {/* --- Main Body Structure --- */}
      
      {/* Central Trunk */}
      <Cylinder args={[0.5, 0.35, 4.5, 32]} position={[0, 0, 0]}>
        <meshPhysicalMaterial 
            color="#1a237e" 
            emissive="#0d47a1"
            emissiveIntensity={hovered || isSelected ? 0.5 : 0.2}
            metalness={0.8}
            roughness={0.2}
            clearcoat={1}
        />
      </Cylinder>

      {/* Heart Core (Hiranyagarbha) */}
      <group position={[0, 0.5, 0.2]}>
          <mesh ref={coreRef}>
            <octahedronGeometry args={[0.6, 0]} />
            <meshStandardMaterial color="#FFD700" emissive="#FFD700" emissiveIntensity={1.5} wireframe />
          </mesh>
          <mesh>
            <octahedronGeometry args={[0.3, 0]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
      </group>

      {/* --- Multi-Head Abstract Representation --- */}
      <group position={[0, 2.4, 0]}>
        {/* Main Head */}
        <Sphere args={[0.55, 32, 32]} position={[0, 0, 0]}>
            <meshStandardMaterial color="#1a237e" metalness={0.6} roughness={0.2} />
        </Sphere>
        
        {/* Divine Crown */}
        <group position={[0, 0.5, 0]}>
             <Cylinder args={[0, 0.6, 1.2, 8]} position={[0, 0.6, 0]}>
                 <meshStandardMaterial color="#FFD700" metalness={1} roughness={0.1} />
             </Cylinder>
             <Torus args={[0.3, 0.05, 16, 32]} position={[0, 0.2, 0]} rotation={[Math.PI/2, 0, 0]}>
                  <meshStandardMaterial color="#00FFFF" emissive="#00FFFF" emissiveIntensity={1} />
             </Torus>
        </group>

        {/* Abstract Side Faces */}
        {[-1, 1].map((dir) => (
             <group key={`face-side-${dir}`} rotation={[0, 0, dir * 0.3]}>
                <Sphere args={[0.4, 16, 16]} position={[dir * 0.5, -0.1, -0.2]}>
                     <meshStandardMaterial color={dir === 1 ? "#b71c1c" : "#1b5e20"} metalness={0.5} roughness={0.3} /> 
                </Sphere>
             </group>
        ))}
        {[-1, 1].map((dir) => (
             <group key={`face-back-${dir}`} rotation={[0, 0, dir * 0.6]}>
                <Sphere args={[0.35, 16, 16]} position={[dir * 0.6, 0.1, -0.4]}>
                     <meshStandardMaterial color={dir === 1 ? "#f57f17" : "#4a148c"} metalness={0.5} roughness={0.3} />
                </Sphere>
             </group>
        ))}
      </group>

      {/* --- Thousand Arms (Vishwaroop Fan) --- */}
      <group ref={armsRef} position={[0, 0.5, -0.6]}>
        {armsData.map((_, i) => (
             <group 
                key={`arm-${i}`} 
                ref={(el) => { armRefs.current[i] = el; }}
                // Initial rotation will be set by useFrame, but providing a default avoids jump
                rotation={[0, 0, 0]} 
             >
                {/* Arm Segment */}
                <mesh position={[2, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                    <cylinderGeometry args={[0.06, 0.12, 3.5, 8]} />
                    <meshStandardMaterial 
                        color="#283593" 
                        transparent 
                        opacity={0.7} 
                    />
                </mesh>
                {/* Divine Weapon/Attribute placeholder (Gold Tip) */}
                <mesh position={[3.8, 0, 0]} rotation={[0, 0, Math.PI/4]}>
                    <boxGeometry args={[0.2, 0.2, 0.2]} />
                    <meshStandardMaterial color="#FFD700" emissive="#FFD700" emissiveIntensity={0.5} />
                </mesh>
             </group>
        ))}
      </group>

      {/* --- Animated Cosmic Rings --- */}
      <group ref={ringsRef}>
            <Torus args={[3.2, 0.04, 16, 100]} rotation={[Math.PI / 2.1, 0, 0]}>
                <meshBasicMaterial color="#00E5FF" transparent opacity={0.5} />
            </Torus>
            <Torus args={[4.0, 0.03, 16, 100]} rotation={[Math.PI / 1.9, 0, 0]}>
                <meshBasicMaterial color="#FFD700" transparent opacity={0.3} />
            </Torus>
             <Torus args={[4.8, 0.02, 16, 100]} rotation={[Math.PI / 2.3, 0, 0]}>
                <meshBasicMaterial color="#FF4081" transparent opacity={0.3} />
            </Torus>
             {/* Orbital Electrons / Planets */}
             <group rotation={[0, 0, Math.PI/4]}>
                <mesh position={[3.2, 0, 0]}>
                    <sphereGeometry args={[0.1, 8, 8]} />
                    <meshBasicMaterial color="#ffffff" />
                </mesh>
             </group>
        </group>

    </group>
  );
};

export default VishnuFigure;