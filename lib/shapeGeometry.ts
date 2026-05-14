// Vertex + edge data for each domain shape, generated at module load from
// closed-form formulas. Replaces three.js's geometry classes for the home
// page so we don't have to ship the 3D engine for what amounts to "draw
// these line segments at this rotation."

export type ShapeType =
  | 'torusKnot' | 'icosahedron' | 'octahedron' | 'dodecahedron'
  | 'torus' | 'cone' | 'sphere' | 'box'
  | 'tetrahedron' | 'cylinder' | 'capsule'
  | 'torusKnotPentagonal' | 'torusKnotComplex'
  | 'ring' | 'latheDiamond' | 'tubeHelix'
  | 'mobius' | 'antiprism' | 'lattice' | 'stellaOctangula' | 'doubleHelix' | 'ziggurat'
  | 'starPrism' | 'tesseract' | 'hyperbolicParaboloid'

export interface ShapeData {
  vertices: Float32Array // flat [x, y, z, x, y, z, ...]
  edges: Uint16Array // flat [i, j, i, j, ...]
}

const cache: Partial<Record<ShapeType, ShapeData>> = {}

export function getShape(type: ShapeType): ShapeData {
  if (!cache[type]) cache[type] = generate(type)
  return cache[type]!
}

function generate(type: ShapeType): ShapeData {
  switch (type) {
    case 'tetrahedron':
      return regularPolyhedron(
        [[1, 1, 1], [-1, -1, 1], [-1, 1, -1], [1, -1, -1]],
        1.1
      )
    case 'octahedron':
      return regularPolyhedron(
        [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]],
        1.1
      )
    case 'icosahedron': {
      const p = (1 + Math.sqrt(5)) / 2
      return regularPolyhedron([
        [0, 1, p], [0, 1, -p], [0, -1, p], [0, -1, -p],
        [1, p, 0], [1, -p, 0], [-1, p, 0], [-1, -p, 0],
        [p, 0, 1], [-p, 0, 1], [p, 0, -1], [-p, 0, -1],
      ], 1.1)
    }
    case 'dodecahedron': {
      const p = (1 + Math.sqrt(5)) / 2
      const ip = 1 / p
      return regularPolyhedron([
        [1, 1, 1], [1, 1, -1], [1, -1, 1], [1, -1, -1],
        [-1, 1, 1], [-1, 1, -1], [-1, -1, 1], [-1, -1, -1],
        [0, p, ip], [0, p, -ip], [0, -p, ip], [0, -p, -ip],
        [ip, 0, p], [ip, 0, -p], [-ip, 0, p], [-ip, 0, -p],
        [p, ip, 0], [p, -ip, 0], [-p, ip, 0], [-p, -ip, 0],
      ], 1.0)
    }
    case 'box':
      return box(1.4, 1.4, 1.4)
    case 'sphere':
      return sphere(1.1, 14, 10)
    case 'torus':
      return torus(0.8, 0.32, 20, 12)
    case 'cone':
      return cone(0.9, 1.5, 16)
    case 'cylinder':
      return cylinder(0.9, 1.5, 18)
    case 'capsule':
      return capsule(0.55, 1.0, 6, 14)
    case 'ring':
      return ring(0.5, 1.05, 28, 2)
    case 'latheDiamond':
      return lathe(
        [[0.001, -1.1], [0.4, -0.6], [0.75, 0], [0.4, 0.6], [0.001, 1.1]],
        16
      )
    case 'torusKnot':
      return torusKnot(0.6, 0.18, 80, 8, 2, 3)
    case 'torusKnotPentagonal':
      return torusKnot(0.6, 0.16, 100, 8, 2, 5)
    case 'torusKnotComplex':
      return torusKnot(0.6, 0.14, 140, 8, 3, 7)
    case 'tubeHelix':
      return tubeHelix(0.55, 1.7, 2.5, 0.15, 56, 8)
    case 'mobius':
      return mobius(0.85, 0.5, 48, 4)
    case 'antiprism':
      return antiprism(6, 1.0, 1.3)
    case 'lattice':
      return lattice(1.5, 3)
    case 'stellaOctangula':
      return stellaOctangula(1.2)
    case 'doubleHelix':
      return doubleHelix(0.45, 1.6, 2.5, 0.1, 48, 6)
    case 'ziggurat':
      return ziggurat(1.3, 1.5, 5)
    case 'starPrism':
      return starPrism(1.05, 0.45, 5, 0.55)
    case 'tesseract':
      return tesseract(1.4, 0.6)
    case 'hyperbolicParaboloid':
      return hyperbolicParaboloid(1.7, 7, 0.65)
  }
}

// --- Generators ---

// For any regular polyhedron: normalize vertices to a given radius, then
// compute edges by connecting all pairs at the minimum distance (which is
// the polyhedron's natural edge length for a regular figure).
function regularPolyhedron(rawVerts: number[][], radius: number): ShapeData {
  const n = rawVerts.length
  const verts = new Float32Array(n * 3)
  for (let i = 0; i < n; i++) {
    const [x, y, z] = rawVerts[i]
    const len = Math.hypot(x, y, z) || 1
    const s = radius / len
    verts[i * 3] = x * s
    verts[i * 3 + 1] = y * s
    verts[i * 3 + 2] = z * s
  }
  return { vertices: verts, edges: nearestPairEdges(verts) }
}

function nearestPairEdges(verts: Float32Array): Uint16Array {
  const n = verts.length / 3
  let minD2 = Infinity
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const dx = verts[i * 3] - verts[j * 3]
      const dy = verts[i * 3 + 1] - verts[j * 3 + 1]
      const dz = verts[i * 3 + 2] - verts[j * 3 + 2]
      const d2 = dx * dx + dy * dy + dz * dz
      if (d2 > 0 && d2 < minD2) minD2 = d2
    }
  }
  const eps = minD2 * 0.05
  const out: number[] = []
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const dx = verts[i * 3] - verts[j * 3]
      const dy = verts[i * 3 + 1] - verts[j * 3 + 1]
      const dz = verts[i * 3 + 2] - verts[j * 3 + 2]
      const d2 = dx * dx + dy * dy + dz * dz
      if (Math.abs(d2 - minD2) < eps) out.push(i, j)
    }
  }
  return new Uint16Array(out)
}

function box(w: number, h: number, d: number): ShapeData {
  const hx = w / 2, hy = h / 2, hz = d / 2
  return {
    vertices: new Float32Array([
      -hx, -hy, -hz,  hx, -hy, -hz,  hx,  hy, -hz, -hx,  hy, -hz,
      -hx, -hy,  hz,  hx, -hy,  hz,  hx,  hy,  hz, -hx,  hy,  hz,
    ]),
    edges: new Uint16Array([
      0, 1, 1, 2, 2, 3, 3, 0,
      4, 5, 5, 6, 6, 7, 7, 4,
      0, 4, 1, 5, 2, 6, 3, 7,
    ]),
  }
}

// Spherical grid. latSeg includes both poles as their own vertex (one each),
// so latitude rings between them = latSeg - 1.
function sphere(r: number, longSeg: number, latSeg: number): ShapeData {
  const verts: number[] = []
  const edges: number[] = []
  for (let i = 0; i <= latSeg; i++) {
    const phi = (i / latSeg) * Math.PI
    const sp = Math.sin(phi), cp = Math.cos(phi)
    for (let j = 0; j < longSeg; j++) {
      const theta = (j / longSeg) * Math.PI * 2
      verts.push(r * sp * Math.cos(theta), r * cp, r * sp * Math.sin(theta))
    }
  }
  // Latitude lines (skip the two poles, which collapse to a single point).
  for (let i = 1; i < latSeg; i++) {
    for (let j = 0; j < longSeg; j++) {
      edges.push(i * longSeg + j, i * longSeg + ((j + 1) % longSeg))
    }
  }
  // Longitude lines.
  for (let i = 0; i < latSeg; i++) {
    for (let j = 0; j < longSeg; j++) {
      edges.push(i * longSeg + j, (i + 1) * longSeg + j)
    }
  }
  return { vertices: new Float32Array(verts), edges: new Uint16Array(edges) }
}

function torus(R: number, r: number, ringSeg: number, tubeSeg: number): ShapeData {
  const verts: number[] = []
  const edges: number[] = []
  for (let i = 0; i < ringSeg; i++) {
    const u = (i / ringSeg) * Math.PI * 2
    const cu = Math.cos(u), su = Math.sin(u)
    for (let j = 0; j < tubeSeg; j++) {
      const v = (j / tubeSeg) * Math.PI * 2
      const cv = Math.cos(v), sv = Math.sin(v)
      verts.push((R + r * cv) * cu, r * sv, (R + r * cv) * su)
    }
  }
  for (let i = 0; i < ringSeg; i++) {
    for (let j = 0; j < tubeSeg; j++) {
      edges.push(i * tubeSeg + j, i * tubeSeg + ((j + 1) % tubeSeg))
      edges.push(i * tubeSeg + j, ((i + 1) % ringSeg) * tubeSeg + j)
    }
  }
  return { vertices: new Float32Array(verts), edges: new Uint16Array(edges) }
}

function cone(r: number, h: number, segs: number): ShapeData {
  const verts: number[] = [0, h / 2, 0] // apex at index 0
  for (let i = 0; i < segs; i++) {
    const theta = (i / segs) * Math.PI * 2
    verts.push(r * Math.cos(theta), -h / 2, r * Math.sin(theta))
  }
  const edges: number[] = []
  for (let i = 0; i < segs; i++) edges.push(0, 1 + i)
  for (let i = 0; i < segs; i++) edges.push(1 + i, 1 + ((i + 1) % segs))
  return { vertices: new Float32Array(verts), edges: new Uint16Array(edges) }
}

function cylinder(r: number, h: number, segs: number): ShapeData {
  const verts: number[] = []
  for (let i = 0; i < segs; i++) {
    const theta = (i / segs) * Math.PI * 2
    verts.push(r * Math.cos(theta), h / 2, r * Math.sin(theta))
  }
  for (let i = 0; i < segs; i++) {
    const theta = (i / segs) * Math.PI * 2
    verts.push(r * Math.cos(theta), -h / 2, r * Math.sin(theta))
  }
  const edges: number[] = []
  for (let i = 0; i < segs; i++) edges.push(i, (i + 1) % segs) // top ring
  for (let i = 0; i < segs; i++) edges.push(segs + i, segs + ((i + 1) % segs)) // bottom ring
  for (let i = 0; i < segs; i++) edges.push(i, segs + i) // vertical
  return { vertices: new Float32Array(verts), edges: new Uint16Array(edges) }
}

function capsule(r: number, length: number, capSegs: number, radialSegs: number): ShapeData {
  // Geometry: top hemisphere → cylindrical body → bottom hemisphere.
  // The hemisphere equators and cylinder ends share rings of vertices.
  const verts: number[] = []
  const edges: number[] = []
  const halfL = length / 2

  // Top pole.
  verts.push(0, halfL + r, 0)
  const topPole = 0

  // Top hemisphere rings (k=1..capSegs). k=capSegs is the equator (y=halfL).
  for (let k = 1; k <= capSegs; k++) {
    const phi = (k / capSegs) * (Math.PI / 2)
    const y = halfL + r * Math.cos(phi)
    const ringR = r * Math.sin(phi)
    for (let j = 0; j < radialSegs; j++) {
      const theta = (j / radialSegs) * Math.PI * 2
      verts.push(ringR * Math.cos(theta), y, ringR * Math.sin(theta))
    }
  }
  // Bottom hemisphere rings (m=0..capSegs-1). m=0 is the bottom equator (y=-halfL).
  for (let m = 0; m < capSegs; m++) {
    const phi = (m / capSegs) * (Math.PI / 2)
    const y = -halfL - r * Math.sin(phi)
    const ringR = r * Math.cos(phi)
    for (let j = 0; j < radialSegs; j++) {
      const theta = (j / radialSegs) * Math.PI * 2
      verts.push(ringR * Math.cos(theta), y, ringR * Math.sin(theta))
    }
  }
  // Bottom pole.
  verts.push(0, -halfL - r, 0)
  const bottomPole = verts.length / 3 - 1

  const topRing = (k: number) => 1 + (k - 1) * radialSegs // k in 1..capSegs
  const bottomRing = (m: number) => 1 + capSegs * radialSegs + m * radialSegs // m in 0..capSegs-1

  // Top pole → first top ring.
  for (let j = 0; j < radialSegs; j++) edges.push(topPole, topRing(1) + j)
  // Top hemisphere rings + verticals.
  for (let k = 1; k <= capSegs; k++) {
    const s = topRing(k)
    for (let j = 0; j < radialSegs; j++) {
      edges.push(s + j, s + ((j + 1) % radialSegs))
      if (k < capSegs) edges.push(s + j, s + radialSegs + j)
    }
  }
  // Cylinder side lines (top equator to bottom equator).
  for (let j = 0; j < radialSegs; j++) edges.push(topRing(capSegs) + j, bottomRing(0) + j)
  // Bottom hemisphere rings + verticals.
  for (let m = 0; m < capSegs; m++) {
    const s = bottomRing(m)
    for (let j = 0; j < radialSegs; j++) {
      edges.push(s + j, s + ((j + 1) % radialSegs))
      if (m < capSegs - 1) edges.push(s + j, s + radialSegs + j)
    }
  }
  // Last bottom ring → bottom pole.
  for (let j = 0; j < radialSegs; j++) edges.push(bottomRing(capSegs - 1) + j, bottomPole)

  return { vertices: new Float32Array(verts), edges: new Uint16Array(edges) }
}

// Flat ring in XY plane.
function ring(innerR: number, outerR: number, thetaSeg: number, phiSeg: number): ShapeData {
  const verts: number[] = []
  const edges: number[] = []
  for (let i = 0; i <= phiSeg; i++) {
    const t = i / phiSeg
    const r = innerR + (outerR - innerR) * t
    for (let j = 0; j < thetaSeg; j++) {
      const theta = (j / thetaSeg) * Math.PI * 2
      verts.push(r * Math.cos(theta), 0, r * Math.sin(theta))
    }
  }
  for (let i = 0; i <= phiSeg; i++) {
    for (let j = 0; j < thetaSeg; j++) {
      edges.push(i * thetaSeg + j, i * thetaSeg + ((j + 1) % thetaSeg))
    }
  }
  for (let i = 0; i < phiSeg; i++) {
    for (let j = 0; j < thetaSeg; j++) {
      edges.push(i * thetaSeg + j, (i + 1) * thetaSeg + j)
    }
  }
  return { vertices: new Float32Array(verts), edges: new Uint16Array(edges) }
}

// Surface of revolution around the Y axis. profile = list of (x,y) points.
function lathe(profile: number[][], segs: number): ShapeData {
  const verts: number[] = []
  const edges: number[] = []
  const n = profile.length
  for (let i = 0; i < n; i++) {
    const [px, py] = profile[i]
    for (let j = 0; j < segs; j++) {
      const theta = (j / segs) * Math.PI * 2
      verts.push(px * Math.cos(theta), py, px * Math.sin(theta))
    }
  }
  // Rings at each profile point.
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < segs; j++) {
      edges.push(i * segs + j, i * segs + ((j + 1) % segs))
    }
  }
  // Lines along the profile (between adjacent rings).
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < segs; j++) {
      edges.push(i * segs + j, (i + 1) * segs + j)
    }
  }
  return { vertices: new Float32Array(verts), edges: new Uint16Array(edges) }
}

// Torus knot. Parametric curve P(t) lies on a torus; we extrude a tube of
// radius `tube` around it. Tube frame uses the "cross with reference vector"
// trick — not strict parallel transport, but stable enough for these smooth
// closed curves.
function torusKnot(
  R: number, tube: number, tubularSeg: number, radialSeg: number, p: number, q: number
): ShapeData {
  const verts: number[] = []
  const edges: number[] = []
  const ref: [number, number, number] = [0, 1, 0]

  const point = (t: number): [number, number, number] => {
    const u = t * Math.PI * 2
    const qu = (q / p) * u
    const c = (2 + Math.cos(qu)) * 0.5
    return [R * c * Math.cos(u), R * c * Math.sin(u), R * 0.5 * Math.sin(qu)]
  }
  const tangent = (t: number): [number, number, number] => {
    // Finite difference.
    const eps = 1e-4
    const a = point(t - eps), b = point(t + eps)
    const tx = b[0] - a[0], ty = b[1] - a[1], tz = b[2] - a[2]
    const len = Math.hypot(tx, ty, tz) || 1
    return [tx / len, ty / len, tz / len]
  }

  for (let i = 0; i < tubularSeg; i++) {
    const t = i / tubularSeg
    const P = point(t)
    const T = tangent(t)
    // N = normalize(T × ref); B = T × N
    let nx = T[1] * ref[2] - T[2] * ref[1]
    let ny = T[2] * ref[0] - T[0] * ref[2]
    let nz = T[0] * ref[1] - T[1] * ref[0]
    const nLen = Math.hypot(nx, ny, nz)
    if (nLen < 1e-4) { nx = 1; ny = 0; nz = 0 } else { nx /= nLen; ny /= nLen; nz /= nLen }
    const bx = T[1] * nz - T[2] * ny
    const by = T[2] * nx - T[0] * nz
    const bz = T[0] * ny - T[1] * nx
    for (let j = 0; j < radialSeg; j++) {
      const a = (j / radialSeg) * Math.PI * 2
      const ca = Math.cos(a), sa = Math.sin(a)
      verts.push(
        P[0] + tube * (nx * ca + bx * sa),
        P[1] + tube * (ny * ca + by * sa),
        P[2] + tube * (nz * ca + bz * sa),
      )
    }
  }
  // Closed loop: tube cross-sections + along-curve, wrapping at end.
  for (let i = 0; i < tubularSeg; i++) {
    const s = i * radialSeg
    const sNext = ((i + 1) % tubularSeg) * radialSeg
    for (let j = 0; j < radialSeg; j++) {
      edges.push(s + j, s + ((j + 1) % radialSeg))
      edges.push(s + j, sNext + j)
    }
  }
  return { vertices: new Float32Array(verts), edges: new Uint16Array(edges) }
}

// Möbius strip. Parametric surface with a half-twist — traversing all the way
// around in u flips the v direction, so the edge wraps to the *opposite* side
// at the closure.
function mobius(R: number, w: number, lengthSeg: number, widthSeg: number): ShapeData {
  const verts: number[] = []
  const edges: number[] = []
  const wp = widthSeg + 1
  for (let i = 0; i < lengthSeg; i++) {
    const u = (i / lengthSeg) * Math.PI * 2
    const cu = Math.cos(u), su = Math.sin(u)
    const chu = Math.cos(u / 2), shu = Math.sin(u / 2)
    for (let j = 0; j <= widthSeg; j++) {
      const v = -w / 2 + (j / widthSeg) * w
      verts.push(
        (R + v * chu) * cu,
        v * shu,
        (R + v * chu) * su,
      )
    }
  }
  // Width-direction edges (across the strip).
  for (let i = 0; i < lengthSeg; i++) {
    for (let j = 0; j < widthSeg; j++) {
      edges.push(i * wp + j, i * wp + j + 1)
    }
  }
  // Length-direction edges (along the strip). The closure flips v due to
  // the half-twist: i=lengthSeg-1 connects to i=0 with j reversed.
  for (let i = 0; i < lengthSeg; i++) {
    const next = (i + 1) % lengthSeg
    const isWrap = i === lengthSeg - 1
    for (let j = 0; j <= widthSeg; j++) {
      const jNext = isWrap ? widthSeg - j : j
      edges.push(i * wp + j, next * wp + jNext)
    }
  }
  return { vertices: new Float32Array(verts), edges: new Uint16Array(edges) }
}

// Hyperbolic paraboloid (saddle), y = x·z·curvature. Doubly-ruled surface:
// the (N+1)×(N+1) grid lines along x and along z are *straight* in 3D — a
// classic intro-to-differential-geometry shape that reads as a Pringle-chip
// woven from criss-crossed rulings.
function hyperbolicParaboloid(size: number, segs: number, curvature: number): ShapeData {
  const half = size / 2
  const N = segs + 1
  const verts: number[] = []
  for (let i = 0; i < N; i++) {
    const x = -half + (size * i) / segs
    for (let j = 0; j < N; j++) {
      const z = -half + (size * j) / segs
      verts.push(x, x * z * curvature, z)
    }
  }
  const edges: number[] = []
  // x-direction rulings (varying i at fixed j).
  for (let j = 0; j < N; j++) {
    for (let i = 0; i < segs; i++) edges.push(i * N + j, (i + 1) * N + j)
  }
  // z-direction rulings (varying j at fixed i).
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < segs; j++) edges.push(i * N + j, i * N + j + 1)
  }
  return { vertices: new Float32Array(verts), edges: new Uint16Array(edges) }
}

// Tesseract — Schlegel projection of a 4D hypercube into 3D. Drawn as an
// outer cube + an inner cube, with each outer corner connected to the
// corresponding inner corner (the "fourth-dimension" edges).
function tesseract(outer: number, inner: number): ShapeData {
  const ho = outer / 2, hi = inner / 2
  return {
    vertices: new Float32Array([
      -ho, -ho, -ho,  ho, -ho, -ho,  ho,  ho, -ho, -ho,  ho, -ho,
      -ho, -ho,  ho,  ho, -ho,  ho,  ho,  ho,  ho, -ho,  ho,  ho,
      -hi, -hi, -hi,  hi, -hi, -hi,  hi,  hi, -hi, -hi,  hi, -hi,
      -hi, -hi,  hi,  hi, -hi,  hi,  hi,  hi,  hi, -hi,  hi,  hi,
    ]),
    edges: new Uint16Array([
      // Outer cube.
      0, 1, 1, 2, 2, 3, 3, 0,  4, 5, 5, 6, 6, 7, 7, 4,
      0, 4, 1, 5, 2, 6, 3, 7,
      // Inner cube.
      8, 9, 9, 10, 10, 11, 11, 8,  12, 13, 13, 14, 14, 15, 15, 12,
      8, 12, 9, 13, 10, 14, 11, 15,
      // 4D connector edges (corresponding corner pairs).
      0, 8,  1, 9,  2, 10,  3, 11,  4, 12,  5, 13,  6, 14,  7, 15,
    ]),
  }
}

// Star prism: an n-pointed star outline (alternating outer/inner radii)
// extruded into 3D. Top + bottom star rings connected by vertical struts.
function starPrism(outerR: number, innerR: number, points: number, height: number): ShapeData {
  const verts: number[] = []
  const ringCount = points * 2 // alternating outer/inner vertices per ring
  const hy = height / 2
  for (let level = 0; level < 2; level++) {
    const y = level === 0 ? hy : -hy
    for (let i = 0; i < ringCount; i++) {
      const r = i % 2 === 0 ? outerR : innerR
      const theta = (i / ringCount) * Math.PI * 2
      verts.push(r * Math.cos(theta), y, r * Math.sin(theta))
    }
  }
  const edges: number[] = []
  // Top star outline.
  for (let i = 0; i < ringCount; i++) edges.push(i, (i + 1) % ringCount)
  // Bottom star outline.
  for (let i = 0; i < ringCount; i++) edges.push(ringCount + i, ringCount + ((i + 1) % ringCount))
  // Vertical struts connecting top ↔ bottom at every vertex.
  for (let i = 0; i < ringCount; i++) edges.push(i, ringCount + i)
  return { vertices: new Float32Array(verts), edges: new Uint16Array(edges) }
}

// Stepped pyramid (ziggurat). `steps` square tiers stacked from base to a
// small top, each tier a fixed-y square ring with verticals to the next.
function ziggurat(baseSize: number, height: number, steps: number): ShapeData {
  const verts: number[] = []
  const edges: number[] = []
  for (let s = 0; s <= steps; s++) {
    const t = s / steps
    const size = baseSize * (1 - t * 0.85)
    const hs = size / 2
    const y = -height / 2 + t * height
    verts.push(-hs, y, -hs,  hs, y, -hs,  hs, y,  hs, -hs, y,  hs)
  }
  for (let s = 0; s <= steps; s++) {
    const b = s * 4
    // Ring around this tier.
    edges.push(b, b + 1, b + 1, b + 2, b + 2, b + 3, b + 3, b)
    // Verticals up to the next tier.
    if (s < steps) {
      const n = b + 4
      edges.push(b, n, b + 1, n + 1, b + 2, n + 2, b + 3, n + 3)
    }
  }
  return { vertices: new Float32Array(verts), edges: new Uint16Array(edges) }
}

// Two tube-helices offset 180° in phase — a DNA-like double strand without
// rungs. Reuses the same simplified frame approach as the single tubeHelix.
function doubleHelix(
  coilR: number, height: number, turns: number, tube: number,
  tubularSeg: number, radialSeg: number
): ShapeData {
  const verts: number[] = []
  const edges: number[] = []
  const ref: [number, number, number] = [0, 1, 0]

  for (let strand = 0; strand < 2; strand++) {
    const phase = strand * Math.PI
    const startIdx = verts.length / 3

    const point = (t: number): [number, number, number] => {
      const angle = t * Math.PI * 2 * turns + phase
      return [coilR * Math.cos(angle), (t - 0.5) * height, coilR * Math.sin(angle)]
    }
    const tangent = (t: number): [number, number, number] => {
      const eps = 1e-4
      const a = point(Math.max(0, t - eps))
      const b = point(Math.min(1, t + eps))
      const tx = b[0] - a[0], ty = b[1] - a[1], tz = b[2] - a[2]
      const len = Math.hypot(tx, ty, tz) || 1
      return [tx / len, ty / len, tz / len]
    }

    for (let i = 0; i < tubularSeg; i++) {
      const t = i / (tubularSeg - 1)
      const P = point(t)
      const T = tangent(t)
      let nx = T[1] * ref[2] - T[2] * ref[1]
      let ny = T[2] * ref[0] - T[0] * ref[2]
      let nz = T[0] * ref[1] - T[1] * ref[0]
      const nLen = Math.hypot(nx, ny, nz)
      if (nLen < 1e-4) { nx = 1; ny = 0; nz = 0 } else { nx /= nLen; ny /= nLen; nz /= nLen }
      const bx = T[1] * nz - T[2] * ny
      const by = T[2] * nx - T[0] * nz
      const bz = T[0] * ny - T[1] * nx
      for (let j = 0; j < radialSeg; j++) {
        const a = (j / radialSeg) * Math.PI * 2
        const ca = Math.cos(a), sa = Math.sin(a)
        verts.push(
          P[0] + tube * (nx * ca + bx * sa),
          P[1] + tube * (ny * ca + by * sa),
          P[2] + tube * (nz * ca + bz * sa),
        )
      }
    }

    for (let i = 0; i < tubularSeg; i++) {
      const s = startIdx + i * radialSeg
      for (let j = 0; j < radialSeg; j++) {
        edges.push(s + j, s + ((j + 1) % radialSeg))
        if (i < tubularSeg - 1) edges.push(s + j, s + radialSeg + j)
      }
    }
  }
  return { vertices: new Float32Array(verts), edges: new Uint16Array(edges) }
}

// Stella octangula: two interpenetrating tetrahedra whose 8 vertices land
// on the 8 corners of a cube. Wireframe reads as an 8-pointed "star" with
// six edges per tetrahedron (12 total).
function stellaOctangula(radius: number): ShapeData {
  const r = radius / Math.sqrt(3)
  return {
    vertices: new Float32Array([
      // Tetrahedron A — even-parity cube corners.
       r,  r,  r,
      -r, -r,  r,
      -r,  r, -r,
       r, -r, -r,
      // Tetrahedron B — odd-parity cube corners.
      -r, -r, -r,
       r,  r, -r,
       r, -r,  r,
      -r,  r,  r,
    ]),
    edges: new Uint16Array([
      0, 1,  0, 2,  0, 3,  1, 2,  1, 3,  2, 3,
      4, 5,  4, 6,  4, 7,  5, 6,  5, 7,  6, 7,
    ]),
  }
}

// 3D cubic lattice. N×N×N grid of vertices with all axis-aligned edges
// between adjacent grid points. Reads as a crystalline / scientific
// structure — distinct from the smooth or polyhedral shapes.
function lattice(size: number, N: number): ShapeData {
  const step = size / (N - 1)
  const half = size / 2
  const verts: number[] = []
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      for (let k = 0; k < N; k++) {
        verts.push(-half + i * step, -half + j * step, -half + k * step)
      }
    }
  }
  const idx = (i: number, j: number, k: number) => i * N * N + j * N + k
  const edges: number[] = []
  for (let i = 0; i < N - 1; i++) {
    for (let j = 0; j < N; j++) {
      for (let k = 0; k < N; k++) edges.push(idx(i, j, k), idx(i + 1, j, k))
    }
  }
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N - 1; j++) {
      for (let k = 0; k < N; k++) edges.push(idx(i, j, k), idx(i, j + 1, k))
    }
  }
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      for (let k = 0; k < N - 1; k++) edges.push(idx(i, j, k), idx(i, j, k + 1))
    }
  }
  return { vertices: new Float32Array(verts), edges: new Uint16Array(edges) }
}

// n-gonal antiprism: two parallel n-gons rotated by π/n relative to each
// other, joined by 2n triangle faces. Wireframe shows top + bottom rings
// plus a zigzag pattern between them.
function antiprism(n: number, r: number, h: number): ShapeData {
  const verts: number[] = []
  const hy = h / 2
  for (let i = 0; i < n; i++) {
    const theta = (i / n) * Math.PI * 2
    verts.push(r * Math.cos(theta), hy, r * Math.sin(theta))
  }
  for (let i = 0; i < n; i++) {
    const theta = (i / n) * Math.PI * 2 + Math.PI / n
    verts.push(r * Math.cos(theta), -hy, r * Math.sin(theta))
  }
  const edges: number[] = []
  for (let i = 0; i < n; i++) edges.push(i, (i + 1) % n)             // top ring
  for (let i = 0; i < n; i++) edges.push(n + i, n + ((i + 1) % n))   // bottom ring
  for (let i = 0; i < n; i++) {
    edges.push(i, n + i)                                              // zigzag /
    edges.push(i, n + ((i - 1 + n) % n))                              // zigzag \
  }
  return { vertices: new Float32Array(verts), edges: new Uint16Array(edges) }
}

// Tube along a vertical helix.
function tubeHelix(
  coilR: number, height: number, turns: number, tube: number,
  tubularSeg: number, radialSeg: number
): ShapeData {
  const verts: number[] = []
  const edges: number[] = []
  const ref: [number, number, number] = [0, 1, 0]

  const point = (t: number): [number, number, number] => {
    const angle = t * Math.PI * 2 * turns
    return [coilR * Math.cos(angle), (t - 0.5) * height, coilR * Math.sin(angle)]
  }
  const tangent = (t: number): [number, number, number] => {
    const eps = 1e-4
    const a = point(Math.max(0, t - eps))
    const b = point(Math.min(1, t + eps))
    const tx = b[0] - a[0], ty = b[1] - a[1], tz = b[2] - a[2]
    const len = Math.hypot(tx, ty, tz) || 1
    return [tx / len, ty / len, tz / len]
  }

  for (let i = 0; i < tubularSeg; i++) {
    const t = i / (tubularSeg - 1)
    const P = point(t)
    const T = tangent(t)
    let nx = T[1] * ref[2] - T[2] * ref[1]
    let ny = T[2] * ref[0] - T[0] * ref[2]
    let nz = T[0] * ref[1] - T[1] * ref[0]
    const nLen = Math.hypot(nx, ny, nz)
    if (nLen < 1e-4) { nx = 1; ny = 0; nz = 0 } else { nx /= nLen; ny /= nLen; nz /= nLen }
    const bx = T[1] * nz - T[2] * ny
    const by = T[2] * nx - T[0] * nz
    const bz = T[0] * ny - T[1] * nx
    for (let j = 0; j < radialSeg; j++) {
      const a = (j / radialSeg) * Math.PI * 2
      const ca = Math.cos(a), sa = Math.sin(a)
      verts.push(
        P[0] + tube * (nx * ca + bx * sa),
        P[1] + tube * (ny * ca + by * sa),
        P[2] + tube * (nz * ca + bz * sa),
      )
    }
  }
  // Open ends (no wrap at i+1).
  for (let i = 0; i < tubularSeg; i++) {
    const s = i * radialSeg
    for (let j = 0; j < radialSeg; j++) {
      edges.push(s + j, s + ((j + 1) % radialSeg))
      if (i < tubularSeg - 1) {
        edges.push(s + j, s + radialSeg + j)
      }
    }
  }
  return { vertices: new Float32Array(verts), edges: new Uint16Array(edges) }
}
