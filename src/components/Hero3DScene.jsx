import React, { useRef, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

// Generate random points in a sphere for cyberspace particles
function Starfield({ count = 800 }) {
  const ref = useRef();
  
  // Create deterministic points for stability and zero re-render jitter
  const positions = React.useMemo(() => {
    const coords = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r1 = ((i * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff;
      const r2 = (((i + 1) * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff;
      const r3 = (((i + 2) * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff;

      const radius = 4 + r1 * 8;
      const theta = r2 * Math.PI * 2;
      const phi = Math.acos(2 * r3 - 1);
      coords[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      coords[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      coords[i * 3 + 2] = radius * Math.cos(phi);
    }
    return coords;
  }, [count]);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta * 0.05;
      ref.current.rotation.y -= delta * 0.075;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#00f0ff"
          size={0.03}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.65}
        />
      </Points>
    </group>
  );
}

// Interactive Cyber Core
function CyberCore({ onCoreClick }) {
  const outerRef = useRef();
  const innerRef = useRef();
  const ringRef = useRef();
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();
    const speed = clicked ? 3.5 : hovered ? 1.5 : 1.0;

    if (outerRef.current) {
      outerRef.current.rotation.x += delta * 0.4 * speed;
      outerRef.current.rotation.y += delta * 0.5 * speed;
      // Slight mouse reaction
      outerRef.current.position.x = THREE.MathUtils.lerp(outerRef.current.position.x, state.pointer.x * 0.4, 0.05);
      outerRef.current.position.y = THREE.MathUtils.lerp(outerRef.current.position.y, state.pointer.y * 0.4, 0.05);
    }

    if (innerRef.current) {
      innerRef.current.rotation.x -= delta * 0.7 * speed;
      innerRef.current.rotation.z += delta * 0.6 * speed;
      const scale = 1 + Math.sin(time * 3) * 0.08;
      innerRef.current.scale.set(scale, scale, scale);
    }

    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 0.9 * speed;
      ringRef.current.rotation.x = Math.sin(time * 1.5) * 0.4;
    }
  });

  const handleClick = (e) => {
    e.stopPropagation();
    setClicked(true);
    if (onCoreClick) onCoreClick();
    setTimeout(() => setClicked(false), 800);
  };

  return (
    <Float speed={2.5} rotationIntensity={1} floatIntensity={1.5}>
      <group
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={handleClick}
        cursor={hovered ? 'pointer' : 'default'}
      >
        {/* Outer Wireframe Icosahedron */}
        <mesh ref={outerRef}>
          <icosahedronGeometry args={[1.5, 1]} />
          <meshStandardMaterial
            wireframe
            color={hovered ? '#00f0ff' : '#3b82f6'}
            emissive={hovered ? '#00f0ff' : '#1d4ed8'}
            emissiveIntensity={hovered ? 0.9 : 0.4}
            roughness={0.2}
            metalness={0.9}
          />
        </mesh>

        {/* Inner Solid Geometric Crystal */}
        <mesh ref={innerRef}>
          <octahedronGeometry args={[0.9, 0]} />
          <meshStandardMaterial
            color="#8b5cf6"
            emissive="#a855f7"
            emissiveIntensity={clicked ? 1.8 : 0.8}
            roughness={0.1}
            metalness={0.95}
            transparent
            opacity={0.88}
          />
        </mesh>

        {/* Holographic Gyroscopic Ring */}
        <mesh ref={ringRef} rotation={[Math.PI / 3, 0, 0]}>
          <torusGeometry args={[2.0, 0.02, 16, 64]} />
          <meshStandardMaterial
            color="#00f0ff"
            emissive="#00f0ff"
            emissiveIntensity={1}
            roughness={0.1}
          />
        </mesh>

        {/* Second Orbiting Ring */}
        <mesh rotation={[-Math.PI / 4, Math.PI / 4, 0]}>
          <torusGeometry args={[2.25, 0.015, 16, 64]} />
          <meshStandardMaterial
            color="#ec4899"
            emissive="#ec4899"
            emissiveIntensity={0.8}
            roughness={0.1}
          />
        </mesh>
      </group>
    </Float>
  );
}

// Fallback CSS Orb if WebGL fails
function FallbackOrb() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="relative w-64 h-64">
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-500 via-blue-600 to-purple-600 blur-2xl opacity-40 animate-pulse-glow" />
        <div className="relative w-full h-full rounded-full border-2 border-cyan-400/50 flex items-center justify-center shadow-[0_0_50px_rgba(0,240,255,0.3)]">
          <div className="w-40 h-40 rounded-full border border-purple-500/60 animate-spin" style={{ animationDuration: '12s' }} />
          <div className="absolute w-24 h-24 rounded-full bg-gradient-to-br from-cyan-400 to-purple-600 opacity-80 animate-pulse" />
        </div>
      </div>
    </div>
  );
}

export default function Hero3DScene({ onCoreClick }) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return <FallbackOrb />;
  }

  return (
    <div className="relative w-full h-[380px] sm:h-[450px] lg:h-[550px] select-none">
      <Suspense fallback={<FallbackOrb />}>
        <Canvas
          camera={{ position: [0, 0, 5.5], fov: 45 }}
          onError={() => setHasError(true)}
          gl={{ antialias: true, alpha: true }}
        >
          <ambientLight intensity={0.6} />
          <pointLight position={[10, 10, 10]} intensity={1.5} color="#00f0ff" />
          <pointLight position={[-10, -10, -10]} intensity={1.2} color="#a855f7" />
          <directionalLight position={[0, 5, 5]} intensity={0.8} color="#ffffff" />

          <CyberCore onCoreClick={onCoreClick} />
          <Starfield count={650} />
        </Canvas>
      </Suspense>

      {/* Interactive Hint Badge */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 border border-cyan-500/30 text-xs text-cyan-300 backdrop-blur-md pointer-events-none shadow-lg">
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
        <span>3D Hologram • Click core or hover to activate</span>
      </div>
    </div>
  );
}
