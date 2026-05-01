import React, { useRef, useState, useMemo, useEffect, useCallback } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Float, MeshDistortMaterial, Environment } from '@react-three/drei'
import * as THREE from 'three'

export type ShapeType =
  | 'torusKnot' | 'icosahedron' | 'octahedron' | 'dodecahedron'
  | 'torus' | 'cone' | 'sphere' | 'box'

interface ShapeProps {
  shape: ShapeType
  color: string
}

function ShapeGeometry({ type }: { type: ShapeType }) {
  switch (type) {
    case 'torusKnot':
      return <torusKnotGeometry args={[0.8, 0.25, 64, 16]} />
    case 'icosahedron':
      return <icosahedronGeometry args={[1.1, 0]} />
    case 'octahedron':
      return <octahedronGeometry args={[1.1, 0]} />
    case 'dodecahedron':
      return <dodecahedronGeometry args={[1, 0]} />
    case 'torus':
      return <torusGeometry args={[0.8, 0.35, 16, 32]} />
    case 'cone':
      return <coneGeometry args={[0.9, 1.5, 4]} />
    case 'sphere':
      return <sphereGeometry args={[1.1, 16, 16]} />
    case 'box':
      return <boxGeometry args={[1.4, 1.4, 1.4]} />
    default:
      return <icosahedronGeometry args={[1.1, 0]} />
  }
}

// Pauses the render loop when not in view
function FrameControl({ active }: { active: boolean }) {
  const { invalidate, gl } = useThree()
  const prev = useRef(active)

  useEffect(() => {
    if (active && !prev.current) {
      invalidate()
    }
    prev.current = active
  }, [active, invalidate])

  useFrame(() => {
    if (!active) return
    invalidate()
  })

  return null
}

function AnimatedShape({ shape, color, active }: ShapeProps & { active: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null!)
  const wireRef = useRef<THREE.Mesh>(null!)
  const [hovered, setHovered] = useState(false)
  const vec3 = useMemo(() => new THREE.Vector3(), [])
  const wireVec3 = useMemo(() => new THREE.Vector3(), [])

  useFrame((_, delta) => {
    if (!active && !hovered) return

    const targetScale = hovered ? 1.15 : 1
    const wireTargetScale = hovered ? 1.22 : 1.06

    vec3.set(targetScale, targetScale, targetScale)
    wireVec3.set(wireTargetScale, wireTargetScale, wireTargetScale)

    meshRef.current.scale.lerp(vec3, 0.08)
    wireRef.current.scale.lerp(wireVec3, 0.08)

    const rotSpeed = hovered ? 0.8 : 0.2
    meshRef.current.rotation.x += delta * rotSpeed * 0.7
    meshRef.current.rotation.y += delta * rotSpeed

    wireRef.current.rotation.copy(meshRef.current.rotation)
  })

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.6}>
      <group
        onPointerOver={(e) => {
          e.stopPropagation()
          setHovered(true)
          document.body.style.cursor = 'pointer'
        }}
        onPointerOut={() => {
          setHovered(false)
          document.body.style.cursor = 'auto'
        }}
      >
        <mesh ref={meshRef}>
          <ShapeGeometry type={shape} />
          <MeshDistortMaterial
            color={color}
            roughness={0.1}
            metalness={0.9}
            distort={hovered ? 0.4 : 0.15}
            speed={hovered ? 5 : 2}
          />
        </mesh>
        <mesh ref={wireRef}>
          <ShapeGeometry type={shape} />
          <meshBasicMaterial
            wireframe
            color={color}
            transparent
            opacity={hovered ? 0.5 : 0.12}
          />
        </mesh>
      </group>
    </Float>
  )
}

export default function Shape3D({ shape, color }: ShapeProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      // Tight margin keeps the simultaneous Canvas count below the browser's
      // WebGL context cap (~16 in Chrome, ~8 in Safari). Otherwise older
      // canvases get their context lost and render as the broken-image icon.
      { rootMargin: '150px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        // Soft placeholder color so cards still feel "alive" while the canvas
        // is unmounted (offscreen).
        background: inView ? 'transparent' : `${color}10`,
      }}
    >
      {inView && (
        <Canvas
          camera={{ position: [0, 0, 4], fov: 45 }}
          dpr={[1, 1.5]}
          gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
          style={{ background: 'transparent' }}
          frameloop="demand"
        >
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 5, 5]} intensity={1.2} />
          <pointLight position={[-4, -2, 3]} intensity={0.4} color="#6366f1" />
          <pointLight position={[4, 2, -3]} intensity={0.3} color="#f59e0b" />
          <FrameControl active={inView} />
          <AnimatedShape shape={shape} color={color} active={inView} />
          <Environment preset="city" />
        </Canvas>
      )}
    </div>
  )
}
