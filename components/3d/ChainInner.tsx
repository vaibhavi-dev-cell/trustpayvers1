'use client'
import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, RoundedBox } from '@react-three/drei'
import * as THREE from 'three'

function Block({ pos, color, pulse }: { pos:[number,number,number]; color:string; pulse?:boolean }) {
  const ref = useRef<THREE.Mesh>(null)
  useFrame(({ clock }) => {
    if (ref.current && pulse) {
      const mat = ref.current.material
      if (mat instanceof THREE.MeshStandardMaterial) {
        mat.emissiveIntensity = 0.3 + Math.sin(clock.elapsedTime * 3) * 0.3
      }
    }
  })
  return (
    <RoundedBox ref={ref} args={[0.6,0.6,0.6]} radius={0.05} smoothness={4} position={pos}>
      <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} emissive={color} emissiveIntensity={pulse ? 0.4 : 0.1} />
    </RoundedBox>
  )
}

const blocks: Array<{pos:[number,number,number];color:string;pulse?:boolean}> = [
  { pos:[-3,0,0], color:'#22c55e' }, { pos:[-2,0,0], color:'#22c55e' },
  { pos:[-1,0,0], color:'#22c55e' }, { pos:[0,0,0], color:'#6366f1' },
  { pos:[1,0,0], color:'#6366f1' }, { pos:[2,0,0], color:'#8b5cf6', pulse:true },
]

export default function ChainInner() {
  return (
    <div style={{ width:'100%', height:180 }}>
      <Canvas camera={{ position:[0,1,5], fov:50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[0,3,3]} intensity={1.5} color='#6366f1' />
        {blocks.map((b,i) => <Block key={i} pos={b.pos} color={b.color} pulse={b.pulse} />)}
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={1} />
      </Canvas>
    </div>
  )
}