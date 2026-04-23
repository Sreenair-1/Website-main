'use client'

import { Canvas } from '@react-three/fiber'
import { Sphere, MeshDistortMaterial } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useRef, useMemo } from 'react'
import * as THREE from 'three'

function GlobeInner() {
  const sphereRef = useRef<THREE.Mesh>(null)

  useFrame(() => {
    if (sphereRef.current) {
      sphereRef.current.rotation.y += 0.0003
    }
  })

  return (
    <Sphere ref={sphereRef} args={[1, 64, 64]}>
      <MeshDistortMaterial
        color="#0f62fe"
        attach="material"
        distort={0.3}
        speed={2}
        roughness={0.4}
      />
    </Sphere>
  )
}

export function Globe3D() {
  return (
    <Canvas className="h-full" camera={{ position: [0, 0, 2.5] }}>
      <ambientLight intensity={0.8} />
      <pointLight position={[10, 10, 10]} intensity={1.2} />
      <pointLight position={[-10, -10, 10]} intensity={0.5} color="#6366f1" />
      <GlobeInner />
    </Canvas>
  )
}
