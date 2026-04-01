'use client'
import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Stars, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

function Globe() {
  const meshRef = useRef<THREE.Mesh>(null)
  const gridRef = useRef<THREE.Mesh>(null)
  useFrame((_, delta) => {
    if (meshRef.current) meshRef.current.rotation.y += delta * 0.1
    if (gridRef.current) gridRef.current.rotation.y += delta * 0.1
  })
  const hotspots = [
    { lat: 50, lon: 10, color: '#22c55e' },
    { lat: 38, lon: -97, color: '#f59e0b' },
    { lat: 20, lon: 78, color: '#3b82f6' },
    { lat: 54, lon: -2, color: '#22c55e' },
  ]
  function latLon(lat: number, lon: number, r: number): [number,number,number] {
    const phi = (90 - lat) * (Math.PI / 180)
    const theta = (lon + 180) * (Math.PI / 180)
    return [-(r*Math.sin(phi)*Math.cos(theta)), r*Math.cos(phi), r*Math.sin(phi)*Math.sin(theta)]
  }
  return (
    <>
      <Stars radius={80} depth={30} count={800} factor={3} />
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <pointLight position={[-5,-5,-5]} intensity={0.3} color='#6366f1' />
      <mesh ref={meshRef}>
        <sphereGeometry args={[2, 48, 48]} />
        <meshStandardMaterial color='#0d1525' roughness={0.8} metalness={0.2} />
      </mesh>
      <mesh ref={gridRef}>
        <sphereGeometry args={[2.01, 16, 16]} />
        <meshBasicMaterial color='#1e2d4a' wireframe transparent opacity={0.3} />
      </mesh>
      {hotspots.map((h,i) => {
        const pos = latLon(h.lat, h.lon, 2.1)
        return (
          <mesh key={i} position={pos}>
            <sphereGeometry args={[0.08, 8, 8]} />
            <meshStandardMaterial color={h.color} emissive={h.color} emissiveIntensity={0.8} />
          </mesh>
        )
      })}
      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
    </>
  )
}

export default function GlobeInner() {
  return (
    <div style={{ width: '100%', height: 300 }}>
      <Canvas camera={{ position: [0, 0, 5.5], fov: 45 }}>
        <Globe />
      </Canvas>
    </div>
  )
}