import React, { useRef, useState, useMemo, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Float, MeshDistortMaterial } from '@react-three/drei'
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
            roughness={0.35}
            metalness={0.5}
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

// 2D silhouette for each shape — used as a placeholder so the card always shows
// something while the Canvas is unmounted or about to mount. Cheap CSS only.
function ShapeSilhouette({ shape, color }: ShapeProps) {
  const base: React.CSSProperties = {
    width: '54%',
    aspectRatio: '1 / 1',
    background: color,
    opacity: 0.9,
    boxShadow: `0 12px 32px ${color}40, inset -8px -10px 24px rgba(0,0,0,0.18), inset 8px 8px 18px rgba(255,255,255,0.18)`,
  }
  let style: React.CSSProperties = base
  switch (shape) {
    case 'sphere':
    case 'icosahedron':
    case 'dodecahedron':
      style = { ...base, borderRadius: '50%' }
      break
    case 'box':
      style = { ...base, borderRadius: '14%' }
      break
    case 'torus':
    case 'torusKnot':
      style = { ...base, borderRadius: '50%', boxShadow: `${base.boxShadow}, inset 0 0 0 14px rgba(255,255,255,0.18)` }
      break
    case 'cone':
      style = { ...base, clipPath: 'polygon(50% 0, 100% 100%, 0 100%)' }
      break
    case 'octahedron':
      style = { ...base, clipPath: 'polygon(50% 0, 100% 50%, 50% 100%, 0 50%)' }
      break
  }
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div style={style} />
    </div>
  )
}

export default function Shape3D({ shape, color }: ShapeProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  // mounted lags inView so quick scroll-throughs don't thrash WebGL contexts.
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: '150px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // Debounce: mount after a short dwell, unmount after a longer grace.
  // Browsers cap WebGL contexts (~16 Chrome / ~8 Safari) so we have to
  // unmount eventually, but not on every scroll twitch.
  useEffect(() => {
    if (inView) {
      const t = setTimeout(() => setMounted(true), 80)
      return () => clearTimeout(t)
    }
    const t = setTimeout(() => setMounted(false), 600)
    return () => clearTimeout(t)
  }, [inView])

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%', position: 'relative' }}>
      {/* Always-rendered silhouette underneath; canvas paints over once ready. */}
      <div style={{ position: 'absolute', inset: 0 }}>
        <ShapeSilhouette shape={shape} color={color} />
      </div>
      {mounted && (
        <Canvas
          camera={{ position: [0, 0, 4], fov: 45 }}
          dpr={[1, 1.5]}
          gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
          style={{ background: 'transparent', position: 'absolute', inset: 0 }}
          frameloop="demand"
        >
          <ambientLight intensity={0.7} />
          <directionalLight position={[5, 5, 5]} intensity={1.4} />
          <pointLight position={[-4, -2, 3]} intensity={0.5} color="#6366f1" />
          <pointLight position={[4, 2, -3]} intensity={0.4} color="#f59e0b" />
          <FrameControl active={inView} />
          <AnimatedShape shape={shape} color={color} active={inView} />
        </Canvas>
      )}
    </div>
  )
}
