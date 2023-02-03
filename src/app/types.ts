import {v4 as uuid} from 'uuid'

export interface ModelDescription {
  index: string
}

export interface PointDto {
  x: number[]
  y: number[]
  z: number[]
}

export interface OpeningDto {
  id: string
  x: number[]
  y: number[]
  z: number[]
  r: number[]
  depth: number[]
}

export interface CutDto {
  id: string
  x1?: number[]
  x2?: number[]
  y1?: number[]
  y2?: number[]
  z1?: number[]
  z2?: number[]
  depth: number | number[]
  draw_only?: number
}

export interface PlaneDto {
  openings?: OpeningDto[]
  cuts?: CutDto[]
  image?: string
}

export interface ModelDto {
  index: string
  overall_size: PointDto
  top: PlaneDto
  back?: PlaneDto
  bottom?: PlaneDto
  left: PlaneDto
  right: PlaneDto
  front: PlaneDto
  rear: PlaneDto
}

export class Measurement {
  constructor(
    public readonly norm?: number,
    public readonly real?: number,
    public readonly error?: number,
    public readonly tolerancePositive?: number,
    public readonly toleranceNegative?: number,
    public readonly isOK?: boolean) {
  }

  static fromDto(data?: number[]) {
    if (!!data) {
      return new Measurement(
        data[0],
        data[1],
        data[2],
        data[3],
        data[4],
        data[5] !== 0,
      )
    }
  }

  public get value() {
    return this.norm ?? this.real ?? 0
  }

  public get max() {
    return Math.max(this.norm ?? 0, this.real ?? 0)
  }

  public withValueModifier(f: (v: number) => number): Measurement {
    return new Measurement(
      this.norm && f(this.norm),
      this.real && f(this.real),
      this.error,
      this.tolerancePositive,
      this.toleranceNegative,
      this.isOK,
    );
  }
}

export class Point {
  constructor(
    public readonly x: Measurement = new Measurement(),
    public readonly y: Measurement = new Measurement(),
    public readonly z: Measurement = new Measurement(),
  ) {
  }

  static fromDto(point: PointDto): Point {
    return new Point(
      Measurement.fromDto(point.x),
      Measurement.fromDto(point.y),
      Measurement.fromDto(point.z),
    )
  }

  get isOk() {
    return !!(this.x.isOK && this.y.isOK && this.z.isOK)
  }

  toExpectedTuple(): [number, number, number] {
    return [this.x.norm!, this.y.norm!, this.z.norm!]
  }

  toMeasuredTuple(): [number, number, number] | undefined {
    if (!!this.x.real && !!this.y.real && !!this.z.real) {
      return [this.x.real, this.y.real, this.z.real]
    } else {
      return undefined
    }
  }
}

export enum ElementType {
  Cut, Opening
}

export interface Element {
  type: ElementType
  id: string
  center: [number, number, number]

  getBoundingBox(): [[number, number], [number, number], [number, number]]

  isIn(x: number, y: number, z: number): boolean

  isOk: boolean
}

export class Opening implements Element {
  type = ElementType.Opening

  constructor(
    public readonly id: string,
    public readonly x: Measurement,
    public readonly y: Measurement,
    public readonly z: Measurement,
    public readonly r: Measurement,
    public readonly depth: Measurement,
    public readonly direction: Direction,
  ) {
  }

  get isOk() {
    return !!(this.x.isOK && this.y.isOK && this.z.isOK && this.r.isOK && this.depth.isOK)
  }

  getBoundingBox(): [[number, number], [number, number], [number, number]] {
    if (this.direction === 'top' || this.direction === 'bottom') {
      return [
        [this.x.value + this.r.value, this.x.value - this.r.value],
        [this.y.value + this.r.value, this.y.value - this.r.value],
        [this.z.value, this.z.value],
      ]
    } else if (this.direction === 'left' || this.direction === 'right') {
      return [
        [this.x.value, this.x.value],
        [this.y.value + this.r.value, this.y.value - this.r.value],
        [this.z.value + this.r.value, this.z.value - this.r.value],
      ]
    } else {
      return [
        [this.x.value + this.r.value, this.x.value + this.r.value],
        [this.y.value, this.y.value],
        [this.z.value + this.r.value, this.z.value - this.r.value],
      ]
    }
  }

  static fromDto(opening: OpeningDto, direction: Direction): Opening {
    return new Opening(
      opening.id,
      Measurement.fromDto(opening.x)!,
      Measurement.fromDto(opening.y)!,
      Measurement.fromDto(opening.z)!,
      Measurement.fromDto(opening.r)!,
      Measurement.fromDto(opening.depth)!,
      direction
    )
  }

  private isInCircle(cx: number, cy: number, cz: number, rx: number, ry: number, rz: number): boolean {
    const epsilon = 80;
    return (cx - rx) ** 2 + (cy - ry) ** 2 <= this.r.value ** 2 + epsilon && Math.abs(cz - rz) < 1 + epsilon;
  }

  isIn(x: number, y: number, z: number): boolean {
    const [rx, ry, rz] = [this.x.value, this.y.value, this.z.value]

    if (this.direction === 'top' || this.direction === 'bottom') {
      return this.isInCircle(x, y, z, rx, ry, rz)
    } else if (this.direction === 'left' || this.direction === 'right') {
      return this.isInCircle(y, z, x, ry, rz, rx)
    } else {
      return this.isInCircle(x, z, y, rx, rz, ry)
    }
  }

  get center(): [number, number, number] {
    return [this.x.value, this.y.value, this.z.value]
  }

  get diameter(): Measurement {
    return new Measurement(
      (this.r.norm ?? 0) * 2,
      (this.r.real ?? 0) * 2,
      (this.r.error ?? 0) * 2,
      (this.r.tolerancePositive ?? 0) * 2,
      (this.r.toleranceNegative ?? 0) * 2,
      this.r.isOK,
    )
  }

  getCenterOnPlane(): [number, number] {
    if (this.direction === 'top' || this.direction === 'bottom') {
      return [this.x.value, this.y.value]
    } else if (this.direction === 'left' || this.direction === 'right') {
      return [this.z.value, this.y.value]
    } else {
      return [this.x.value, this.z.value]
    }
  }
}

export class Cut implements Element {
  type = ElementType.Cut

  constructor(
    public readonly id: string,
    public readonly depth: Measurement,
    public readonly direction: Direction,
    public readonly overallSize: Point,
    public readonly drawOnly: boolean,
    public readonly x1?: Measurement,
    public readonly x2?: Measurement,
    public readonly y1?: Measurement,
    public readonly y2?: Measurement,
    public readonly z1?: Measurement,
    public readonly z2?: Measurement,
  ) {
  }

  static fromDto(cut: CutDto, direction: Direction, size: Point): Cut {
    return new Cut(
      cut.id,
      typeof cut.depth == "number" ? new Measurement(cut.depth) : Measurement.fromDto(cut.depth)!,
      direction,
      size,
      cut.draw_only !== undefined && cut.draw_only !== 0,
      Measurement.fromDto(cut.x1),
      Measurement.fromDto(cut.x2),
      Measurement.fromDto(cut.y1),
      Measurement.fromDto(cut.y2),
      Measurement.fromDto(cut.z1),
      Measurement.fromDto(cut.z2),
    )
  }

  get isOk() {
    return !!(this.depth.isOK
      && this.x1?.isOK
      && this.x2?.isOK
      && this.y1?.isOK
      && this.y2?.isOK
      && this.z1?.isOK
      && this.z2?.isOK)
  }

  getBoundingBox(): [[number, number], [number, number], [number, number]] {
    const maxX = this.x1 !== undefined ? Math.max(this.x1!.value, this.x2!.value) : 0;
    const minX = this.x1 !== undefined ? Math.min(this.x1!.value, this.x2!.value) : 0;

    const maxY = this.y1 !== undefined ? Math.max(this.y1!.value, this.y2!.value) : 0;
    const minY = this.y1 !== undefined ? Math.min(this.y1!.value, this.y2!.value) : 0;

    const maxZ = this.z1 !== undefined ? Math.max(this.z1!.value, this.z2!.value) : 0;
    const minZ = this.z1 !== undefined ? Math.min(this.z1!.value, this.z2!.value) : 0;

    if (this.direction === 'top') {
      return [
        [maxX!, minX!],
        [maxY!, minY!],
        [this.overallSize.z.value, this.overallSize.z.value - this.depth.value]
      ]
    } else if (this.direction === 'bottom') {
      return [
        [maxX!, minX!],
        [maxY!, minY!],
        [this.depth.value, 0]
      ]
    } else if (this.direction === 'left') {
      return [
        [this.depth.value, 0],
        [maxY!, minY!],
        [maxZ!, minZ!]
      ]
    } else if (this.direction === 'right') {
      return [
        [this.overallSize.x.value, this.overallSize.x.value - this.depth.value],
        [maxY!, minY!],
        [maxZ!, minZ!]
      ]
    } else if (this.direction === 'front') {
      return [
        [maxX!, minX!],
        [this.depth.value, 0],
        [maxZ!, minZ!]
      ]
    } else {
      return [
        [maxX!, minX!],
        [this.overallSize.y.value, this.overallSize.y.value - this.depth.value],
        [maxZ!, minZ!]
      ]
    }
  }

  surfacePoints(): [number, number, number][] {
    const [
      [maxX, minX],
      [maxY, minY],
      [maxZ, minZ],
    ] = this.getBoundingBox()

    if (this.direction === 'top') {
      return [
        [minX, minY, maxZ],
        [maxX, minY, maxZ],
        [maxX, maxY, maxZ],
        [minX, maxY, maxZ],
      ]
    } else if (this.direction === 'bottom') {
      return [
        [minX, minY, minZ],
        [maxX, minY, minZ],
        [maxX, maxY, minZ],
        [minX, maxY, minZ],
      ]
    } else if (this.direction === 'left') {
      return [
        [minX, minY, minZ],
        [minX, maxY, minZ],
        [minX, maxY, maxZ],
        [minX, minY, maxZ],
      ]
    } else if (this.direction === 'right') {
      return [
        [maxX, minY, minZ],
        [maxX, maxY, minZ],
        [maxX, maxY, maxZ],
        [maxX, minY, maxZ],
      ]
    } else if (this.direction === 'front') {
      return [
        [minX, minY, minZ],
        [maxX, minY, minZ],
        [maxX, minY, maxZ],
        [minX, minY, maxZ],
      ]
    } else {
      return [
        [minX, maxY, minZ],
        [maxX, maxY, minZ],
        [maxX, maxY, maxZ],
        [minX, maxY, maxZ],
      ]
    }
  }

  getSurfaceBoundingBox() {
    const [
      [x1, y1, z1],
      [x2, y2, z2],
      [x3, y3, z3],
      [x4, y4, z4],
    ] = this.surfacePoints()

    const minX = Math.min(x1, x2, x3, x4)
    const maxX = Math.max(x1, x2, x3, x4)
    const minY = Math.min(y1, y2, y3, y4)
    const maxY = Math.max(y1, y2, y3, y4)
    const minZ = Math.min(z1, z2, z3, z4)
    const maxZ = Math.max(z1, z2, z3, z4)

    return [
      [maxX, minX],
      [maxY, minY],
      [maxZ, minZ],
    ]
  }

  get center(): [number, number, number] {
    const [
      [maxX, minX],
      [maxY, minY],
      [maxZ, minZ],
    ] = this.getSurfaceBoundingBox()

    return [
      (maxX + minX) / 2,
      (maxY + minY) / 2,
      (maxZ + minZ) / 2,
    ]
  }

  isIn(x: number, y: number, z: number): boolean {
    const e = 10;
    const [
      [maxX, minX],
      [maxY, minY],
      [maxZ, minZ],
    ] = this.getSurfaceBoundingBox()

    return maxX > x - e && minX < x + e &&
      maxY > y - e && minY < y + e &&
      maxZ > z - e && minZ < z + e
  }

  getPointsOnPlane(): [[number, number], [number, number]] {
    const [
      [maxX, minX],
      [maxY, minY],
      [maxZ, minZ],
    ] = this.getSurfaceBoundingBox();

    if (this.direction === 'bottom' || this.direction === 'top') {
      return [[minX, minY], [maxX, maxY]]
    } else if (this.direction === 'right' || this.direction === 'left') {
      return [[minZ, minY], [maxZ, maxY]]
    } else {
      return [[minX, minZ], [maxX, maxZ]]
    }
  }
}

export class Plane {
  constructor(
    public readonly openings: Opening[] = [],
    public readonly cuts: Cut[] = [],
    public readonly size: [Measurement, Measurement] = [new Measurement(), new Measurement()],
    public readonly direction: string = '',
    public readonly image?: string,
  ) {
  }

  static getSize(size: Point, direction: Direction): [Measurement, Measurement] {
    if (direction === 'top' || direction === 'bottom') {
      return [size.x, size.y]
    } else if (direction === 'left' || direction === 'right') {
      return [size.z, size.y]
    } else {
      return [size.x, size.z]
    }
  }

  static fromDto(plane: PlaneDto, direction: Direction, size: Point): Plane {
    return new Plane(
      plane.openings?.map(o => Opening.fromDto(o, direction)),
      plane.cuts?.map(c => Cut.fromDto(c, direction, size)),
      Plane.getSize(size, direction),
      direction
    )
  }

  static fromMeasuredDto(plane: PlaneDto, direction: Direction, size: Point): Plane {
    return new Plane(
      plane.openings?.map(o => Opening.fromDto(o, direction)),
      plane.cuts?.map(c => Cut.fromDto(c, direction, size)),
      Plane.getSize(size, direction),
      direction,
      plane.image
    )
  }
}

export class Model {
  constructor(
    public readonly index: string,
    public readonly size: Point = new Point(),
    public readonly top: Plane = new Plane(),
    public readonly bottom: Plane = new Plane(),
    public readonly left: Plane = new Plane(),
    public readonly right: Plane = new Plane(),
    public readonly front: Plane = new Plane(),
    public readonly rear: Plane = new Plane(),
    public readonly json: ModelDto
  ) {
  }

  static fromDto(model: ModelDto): Model {
    const size = Point.fromDto(model.overall_size)
    return new Model(
      model.index,
      size,
      Plane.fromDto(model.top, 'top', size),
      Plane.fromDto((model.back ?? model.bottom)!, 'bottom', size),
      Plane.fromDto(model.left, 'left', size),
      Plane.fromDto(model.right, 'right', size),
      Plane.fromDto(model.front, 'front', size),
      Plane.fromDto(model.rear, 'rear', size),
      model
    )
  }

  withMeasurement(measurement: ModelDto): Model {
    const size = Point.fromDto(measurement.overall_size)
    return new Model(
      measurement.index,
      size,
      !measurement.top ? this.top : Plane.fromMeasuredDto(measurement.top, 'top', size),
      !measurement.bottom ? this.bottom : Plane.fromMeasuredDto(measurement.back ?? measurement.bottom, 'bottom', size),
      !measurement.left ? this.left : Plane.fromMeasuredDto(measurement.left, 'left', size),
      !measurement.right ? this.right : Plane.fromMeasuredDto(measurement.right, 'right', size),
      !measurement.front ? this.front : Plane.fromMeasuredDto(measurement.front, 'front', size),
      !measurement.rear ? this.rear : Plane.fromMeasuredDto(measurement.rear, 'rear', size),
      measurement
    )
  }

  openingCount(): number {
    return this.top.openings.length +
      this.bottom.openings.length +
      this.left.openings.length +
      this.right.openings.length +
      this.front.openings.length +
      this.rear.openings.length;
  }

  cutsCount(): number {
    return this.top.cuts.length +
      this.bottom.cuts.length +
      this.left.cuts.length +
      this.right.cuts.length +
      this.front.cuts.length +
      this.rear.cuts.length;
  }

  getCuts(plane?: Direction): Cut[] {
    if (plane) {
      return this[plane].cuts
    }
    return [
      ...this.top.cuts,
      ...this.bottom.cuts,
      ...this.left.cuts,
      ...this.right.cuts,
      ...this.front.cuts,
      ...this.rear.cuts,
    ]
  }

  getOpenings(plane?: Direction): Opening[] {
    if (plane) {
      return this[plane].openings
    }
    return [
      ...this.top.openings,
      ...this.bottom.openings,
      ...this.left.openings,
      ...this.right.openings,
      ...this.front.openings,
      ...this.rear.openings,
    ]
  }
}

export type Direction = 'top' | 'bottom' | 'right' | 'left' | 'front' | 'rear'
