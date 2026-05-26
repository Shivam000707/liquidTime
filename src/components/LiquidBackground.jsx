import { useRef, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { MeshDistortMaterial, Environment } from '@react-three/drei'

function AnimatedSphere() {
  const meshRef = useRef(null)
  const materialRef = useRef(null)
  const mouse = useRef({ x: 0, y: 0 })
  const rotation = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1
      mouse.current.y = -((e.clientY / window.innerHeight) * 2 - 1)
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  useFrame(({ clock }) => {
    if (!meshRef.current || !materialRef.current) return

    materialRef.current.distort = 0.35 + 0.1 * Math.sin(clock.elapsedTime * 0.4)

    rotation.current.x += (mouse.current.y * 0.08 - rotation.current.x) * 0.05
    rotation.current.y += (mouse.current.x * 0.08 - rotation.current.y) * 0.05

    meshRef.current.rotation.x = rotation.current.x
    meshRef.current.rotation.y = rotation.current.y
  })

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <sphereGeometry args={[2.8, 128, 128]} />
      <MeshDistortMaterial
        ref={materialRef}
        color="#059669"
        envMapIntensity={1.5}
        roughness={0.15}
        metalness={0.6}
        distort={0.35}
        speed={1.2}
      />
    </mesh>
  )
}

export default function LiquidBackground() {
  return (
    <Canvas
      gl={{ alpha: true, antialias: true }}
      onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none',
        background: 'transparent',
      }}
    >
      <ambientLight intensity={0.3} />
      <pointLight position={[8, 8, 8]} intensity={4} color="#10b981" />
      <pointLight position={[-8, -6, 4]} intensity={2} color="#6ee7b7" />
      <pointLight position={[0, -10, 6]} intensity={1.5} color="#a3e635" />
      <AnimatedSphere />
      <Environment preset="city" />
    </Canvas>
  )
}
