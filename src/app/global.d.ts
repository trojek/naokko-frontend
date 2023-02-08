interface ModelWrapper {
  id: string
  json: Model
}

interface ModelJson {
  overall_size: OverallSize
  front: Plane
  left: Plane
  rear: Plane
  right: Plane
  top: Plane
  index: string
  bottom: Plane
}

interface OverallSize {
  x: (number)[]
  y: (number)[]
  z: (number)[]
}
interface Plane {
  cuts: (Cuts)[]
  openings: (Openings)[]
}
interface Cuts {
  depth: number
  x1: (number)[]
  x2: (number)[]
  z1: (number)[]
  z2: (number)[]
  id: number
}
interface Openings {
  depth: (number)[]
  r: (number)[]
  x: (number)[]
  y: (number)[]
  z: (number)[]
  id: number
}