// components/ThreeCanvas.tsx
"use client"
import { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const ParticleSystem = () => {
  const particlesRef = useRef<THREE.Points>(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  // Handle mouse movement
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMouse({
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    if (particlesRef.current) {
      particlesRef.current.rotation.y = time * 0.1;
      particlesRef.current.rotation.x = time * 0.1;

      // Safely update particles' positions based on mouse movement
      const geometry = particlesRef.current.geometry as THREE.BufferGeometry;
      const positionAttribute = geometry.attributes.position as THREE.BufferAttribute;

      if (positionAttribute && positionAttribute.array) {
        const positions = positionAttribute.array as Float32Array;

        for (let i = 0; i < positions.length; i += 3) {
          const dx = mouse.x * 500 - positions[i];
          const dy = mouse.y * 500 - positions[i + 1];
          const distance = Math.sqrt(dx * dx + dy * dy);
          const force = Math.min(1, 1 / distance);
          positions[i] += dx * force * 0.01;
          positions[i + 1] += dy * force * 0.01;
        }
        positionAttribute.needsUpdate = true;
      }
    }
  });

  // Create geometry and material once
  const geometry = useRef(new THREE.BufferGeometry()).current;
  const material = useRef(new THREE.PointsMaterial({ color: 0x00ff00, size: 1, sizeAttenuation: true })).current;

  useEffect(() => {
    const vertices = new Float32Array(3000);
    for (let i = 0; i < vertices.length; i++) {
      vertices[i] = (Math.random() - 0.5) * 1000;
    }
    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    
    // Clean up
    return () => {
      geometry.dispose();
      material.dispose();
    };
  }, [geometry, material]);

  return <points ref={particlesRef} geometry={geometry} material={material} />;
};

const ThreeCanvas = () => (
  <Canvas
    camera={{ position: [0, 0, 500], fov: 75 }}
    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
  >
    <ambientLight intensity={0.5} />
    <pointLight position={[10, 10, 10]} />
    <ParticleSystem />
  </Canvas>
);

export default ThreeCanvas;
