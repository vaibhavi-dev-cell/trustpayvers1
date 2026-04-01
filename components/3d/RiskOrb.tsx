'use client'
import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { MeshWobbleMaterial, Stars } from '@react-three/drei'
import * as THREE from 'three'

function Orb({ score }: { score: number }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const color = score > 80 ? '#6366f1' : score > 50 ? '#f59e0b' : '#ef4444'
  const speed = score > 80 ? 0.3 : score > 50 ? 0.8 : 1.5
  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * speed * 0.5
      meshRef.current.rotation.x += delta * speed * 0.2
    }
  })
  return (
    <>
      <mesh ref={meshRef}>
        <sphereGeometry args={[1.2, 32, 32]} />
        <MeshWobbleMaterial color={color} factor={0.3} speed={speed} roughness={0.1} metalness={0.8} />
      </mesh>
      <pointLight position={[3, 3, 3]} intensity={1} color={color} />
      <ambientLight intensity={0.3} />
    </>
  )
}

export default function RiskOrb({ score = 67 }: { score?: number }) {
  return (
    <div style={{ width: '100%', height: 200 }}>
      <Canvas camera={{ position: [0, 0, 4], fov: 45 }}>
        <Stars radius={50} depth={20} count={500} factor={2} />
        <Orb score={score} />
      </Canvas>
    </div>
  )
}