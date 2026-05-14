import React, { useEffect, useMemo, useRef, useState } from 'react'
import { getShape, type ShapeType } from '../lib/shapeGeometry'

export type { ShapeType }

export interface ShapeProps {
  shape: ShapeType
  color: string
  // Optional controlled hover. When provided, overrides internal pointer
  // detection — used by idea cards so the whole card surface triggers the
  // animation, not just the canvas region.
  hovered?: boolean
  // Optional seed (typically idea.id) used to deterministically vary the
  // initial rotation so two cards with the same shape don't look identical.
  seed?: string
  // When true, the shape rotates continuously regardless of hover state.
  // Hover then only affects scale (used for the idea detail page hero).
  autoRotate?: boolean
}

// Camera + projection constants, matched roughly to the prior Three.js setup
// (camera at z=4, ~45° fov). FOCAL_LENGTH is 1 / tan(fov/2).
const CAMERA_Z = 4
const FOCAL = 1 / Math.tan((45 * Math.PI / 180) / 2)

// Deterministic seed → rotation tuple, biased to a flattering 3/4 view.
function seedToRotation(seed?: string): [number, number, number] {
  if (!seed) return [Math.PI / 8, Math.PI / 6, 0]
  let h = 0
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0
  const a0 = ((h >>> 0) & 0xff) / 256
  const a1 = ((h >>> 8) & 0xff) / 256
  const a2 = ((h >>> 16) & 0xff) / 256
  return [
    Math.PI / 12 + a0 * (Math.PI / 4),   // 15° to 60° forward tilt
    a1 * Math.PI * 2,                     // free spin around vertical axis
    a2 * (Math.PI / 6) - Math.PI / 12,    // -15° to +15° roll
  ]
}

export default function Shape2D({
  shape,
  color,
  hovered: externalHovered,
  seed,
  autoRotate = false,
}: ShapeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [internalHovered, setInternalHovered] = useState(false)
  const hovered = externalHovered !== undefined ? externalHovered : internalHovered

  const shapeData = useMemo(() => getShape(shape), [shape])
  const initialRotation = useMemo(() => seedToRotation(seed), [seed])

  // All animation state lives in refs so the rAF loop can mutate without
  // forcing React re-renders.
  const stateRef = useRef({
    rotX: initialRotation[0],
    rotY: initialRotation[1],
    rotZ: initialRotation[2],
    scale: 1,
    lastTime: 0,
    rafId: 0,
    hovered: false,
    autoRotate: false,
    color: '#000',
  })

  // Reset rotation when the seed changes (e.g., different idea).
  useEffect(() => {
    stateRef.current.rotX = initialRotation[0]
    stateRef.current.rotY = initialRotation[1]
    stateRef.current.rotZ = initialRotation[2]
  }, [initialRotation])

  // Keep latest input values reachable from the rAF loop without restarting it.
  stateRef.current.hovered = hovered
  stateRef.current.autoRotate = autoRotate
  stateRef.current.color = color

  // Drawing function. Reads everything it needs from refs / shapeData / canvas.
  const draw = (canvas: HTMLCanvasElement, dpr: number) => {
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const w = canvas.width / dpr
    const h = canvas.height / dpr
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.save()
    ctx.scale(dpr, dpr)

    const cx = w / 2
    const cy = h / 2
    // Fills slightly more than the canvas at rest so shapes feel bigger;
    // hover scale (1.18) just brings them up to the edges.
    const fovScale = (Math.min(w, h) / 2) * 1.05

    const s = stateRef.current
    const cosX = Math.cos(s.rotX), sinX = Math.sin(s.rotX)
    const cosY = Math.cos(s.rotY), sinY = Math.sin(s.rotY)
    const cosZ = Math.cos(s.rotZ), sinZ = Math.sin(s.rotZ)

    const verts = shapeData.vertices
    const numVerts = verts.length / 3
    // Per-vertex projected screen coords (or NaN if behind camera).
    const projX = new Float32Array(numVerts)
    const projY = new Float32Array(numVerts)

    for (let i = 0; i < numVerts; i++) {
      const x0 = verts[i * 3]
      const y0 = verts[i * 3 + 1]
      const z0 = verts[i * 3 + 2]
      // X rotation
      const y1 = y0 * cosX - z0 * sinX
      const z1 = y0 * sinX + z0 * cosX
      // Y rotation
      const x2 = x0 * cosY + z1 * sinY
      const z2 = -x0 * sinY + z1 * cosY
      // Z rotation
      const x3 = x2 * cosZ - y1 * sinZ
      const y3 = x2 * sinZ + y1 * cosZ
      // Uniform scale (drives the hover grow-in / un-hover settle).
      const sx = x3 * s.scale
      const sy = y3 * s.scale
      const sz = z2 * s.scale
      // Perspective project (camera at +z looking at origin).
      const viewZ = CAMERA_Z - sz
      if (viewZ <= 0.1) {
        projX[i] = NaN
        projY[i] = NaN
      } else {
        projX[i] = (FOCAL * sx) / viewZ * fovScale + cx
        projY[i] = -(FOCAL * sy) / viewZ * fovScale + cy
      }
    }

    ctx.strokeStyle = s.color
    ctx.globalAlpha = s.hovered ? 0.92 : 0.7
    ctx.lineWidth = 1
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.beginPath()
    const edges = shapeData.edges
    for (let e = 0; e < edges.length; e += 2) {
      const a = edges[e], b = edges[e + 1]
      const ax = projX[a], ay = projY[a], bx = projX[b], by = projY[b]
      if (ax !== ax || ay !== ay || bx !== bx || by !== by) continue // NaN check
      ctx.moveTo(ax, ay)
      ctx.lineTo(bx, by)
    }
    ctx.stroke()
    ctx.restore()
  }

  // Set up canvas sizing + initial draw. Re-runs if the shape itself changes
  // (which essentially never happens — domain shapes are constant per card).
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const dpr = window.devicePixelRatio || 1
    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      const newW = Math.max(1, Math.round(rect.width * dpr))
      const newH = Math.max(1, Math.round(rect.height * dpr))
      if (canvas.width !== newW || canvas.height !== newH) {
        canvas.width = newW
        canvas.height = newH
      }
      draw(canvas, dpr)
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    return () => ro.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shapeData])

  // rAF loop. Restarted on hovered/autoRotate changes so we don't accumulate
  // duplicate frame callbacks. Runs while either is true OR while the scale
  // is still lerping back to rest after un-hover.
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const dpr = window.devicePixelRatio || 1

    if (!hovered && !autoRotate && Math.abs(stateRef.current.scale - 1) < 0.001) {
      draw(canvas, dpr)
      return
    }

    stateRef.current.lastTime = performance.now()
    const loop = (now: number) => {
      const s = stateRef.current
      const dt = Math.min(0.05, (now - s.lastTime) / 1000)
      s.lastTime = now

      // Scale lerp toward target — grow on hover, settle back on un-hover.
      const target = s.hovered ? 1.18 : 1
      const diff = target - s.scale
      if (Math.abs(diff) > 0.001) s.scale += diff * 0.18
      else s.scale = target

      // Rotation: continuous when autoRotate or hovered. Hover spins faster.
      if (s.hovered || s.autoRotate) {
        const speed = s.hovered ? 0.9 : 0.3
        s.rotX += dt * speed * 0.7
        s.rotY += dt * speed
      }

      draw(canvas, dpr)

      const scaleSettled = Math.abs(s.scale - target) < 0.001
      if (s.hovered || s.autoRotate || !scaleSettled) {
        s.rafId = requestAnimationFrame(loop)
      } else {
        s.rafId = 0
      }
    }
    stateRef.current.rafId = requestAnimationFrame(loop)
    return () => {
      if (stateRef.current.rafId) {
        cancelAnimationFrame(stateRef.current.rafId)
        stateRef.current.rafId = 0
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hovered, autoRotate])

  return (
    <canvas
      ref={canvasRef}
      onMouseEnter={() => setInternalHovered(true)}
      onMouseLeave={() => setInternalHovered(false)}
      style={{ width: '100%', height: '100%', display: 'block' }}
      aria-hidden="true"
    />
  )
}
