import * as THREE from 'three'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, extend, ReactThreeFiber } from '@react-three/fiber'
import { Bounds, OrbitControls } from "@react-three/drei";
import { OrbitControls as orbit } from 'three-stdlib'
import { Canvg, presets } from "canvg";
import { renderToString } from "react-dom/server";
import { TexturedBox3D } from "./TexturedBox3D";
import { PlanePlot } from "./PlanePlot";
import { Button, ButtonGroup, CircularProgress } from '@mui/material';
import { Cut, Direction, Model, Opening } from '../../types';
import { theme } from '../../CustomThemeProvider'
import { views, viewNames } from '../../constans'

extend({ Line_: THREE.Line })

declare global {
  namespace JSX {
    interface IntrinsicElements {
      line_: ReactThreeFiber.Object3DNode<THREE.Line, typeof THREE.Line>
    }
  }
}

const toPng = async (width: number, height: number, svg: string) => {
  const preset = presets.offscreen()
  const canvas = new OffscreenCanvas(parseInt(String(width)), parseInt(String(height)))
  const ctx = canvas.getContext('2d')
  const v = await Canvg.from(ctx!, svg, preset)

  await v.render()

  const blob = await canvas.convertToBlob()
  return URL.createObjectURL(blob)
}

let textures = undefined as any
const renderTextures = async (model: Model, isSelectedElement: any, selectedView: string) => {
  const planes = [
    { plane: model.right, flipX: false, flipY: true },
    { plane: model.left, flipX: false, flipY: true },
    { plane: model.rear, flipX: false, flipY: false },
    { plane: model.front, flipX: false, flipY: true },
    { plane: model.top, flipX: false, flipY: true },
    { plane: model.bottom, flipX: true, flipY: true },
  ]
  if (!textures || selectedView === '3d') {
    // console.log('render all')
    textures = await Promise.all(planes.map(({ plane, flipX, flipY }) =>
      toPng(
        plane.size[0].max * 2,
        plane.size[1].max * 2,
        renderToString(<PlanePlot view={plane}
          isSelectedElement={isSelectedElement}
          flipX={flipX}
          flipY={flipY}
          measured={false}
        />)
      )))
  } else {
    // console.log('render one', selectedView)
    textures = await Promise.all(planes.map(({ plane, flipX, flipY }, idx) =>
    plane.direction === selectedView ? toPng(
      plane.size[0].max * 2,
      plane.size[1].max * 2,
      renderToString(<PlanePlot view={plane}
        isSelectedElement={isSelectedElement}
        flipX={flipX}
        flipY={flipY}
        measured={false}
      />)
    ): textures[idx]))
  }
  return textures
}

const defaultSelected = [] as string[]

let loadingTimeout: any | undefined = undefined

export const ThreeDimensionalPreview = ({
  model,
  selected = defaultSelected,
  isSelected = () => false,
  toggleSelected = () => {}
}: {
  model: Model,
  selected?: string[],
  isSelected?: (id: string) => boolean,
  toggleSelected?: (element: Cut | Opening) => void
}) => {
  const [selectedView, setSelectedView] = useState('3d')
  const [textures, setTextures] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const controlsRef = useRef<orbit>(null)
  const viewDirection = useMemo(() => {
    return selectedView !== '3d' ? selectedView as Direction : undefined
  }, [selectedView])

  const onClick = (x: number, y: number, z: number) => {
    const elements = [...model.getCuts(viewDirection), ...model.getOpenings(viewDirection)]
    // TODO: this finds first in range, instead it should find all in range and get closest one
    elements.some(el => {
      if (el.isIn(x, y, z)) {
        toggleSelected(el)
        return true
      }
      return false
    })
  }

  const [x, y, z] = model.size.toExpectedTuple()

  const setCamera = (view: string) => {
    setLoading(true)
    setTimeout(() => {
      if (view === '3d') {
        controlsRef.current?.setPolarAngle(0.956115572189312);
        controlsRef.current?.setAzimuthalAngle(0.78375862107508732);
      } else if (view === 'left') {
        controlsRef.current?.setPolarAngle(Math.PI / 2);
        controlsRef.current?.setAzimuthalAngle(Math.PI / -2);
      } else if (view === 'front') {
        controlsRef.current?.setPolarAngle(Math.PI);
        controlsRef.current?.setAzimuthalAngle(0);
      } else if (view === 'bottom') {
        controlsRef.current?.setPolarAngle(Math.PI / 2);
        controlsRef.current?.setAzimuthalAngle(-Math.PI);
      } else if (view === 'right') {
        controlsRef.current?.setPolarAngle(Math.PI / 2);
        controlsRef.current?.setAzimuthalAngle(Math.PI / 2);
      } else if (view === 'rear') {
        controlsRef.current?.setPolarAngle(0);
        controlsRef.current?.setAzimuthalAngle(0);
      } else if (view === 'top') {
        controlsRef.current?.setPolarAngle(Math.PI / 2);
        controlsRef.current?.setAzimuthalAngle(0);
      }
      if (loadingTimeout) {
        clearTimeout(loadingTimeout)
      }
      loadingTimeout = setTimeout(() => {
        setLoading(false)
      }, 200)
    }, 300)
  }

  useEffect(() => {
    async function f() {
      console.time('render')
      const textures = await renderTextures(
        model,
        isSelected,
        selectedView
      )
      console.timeEnd('render')
      setTextures(textures)
      if (loading) {
        if (loadingTimeout) {
          clearTimeout(loadingTimeout)
        }
        loadingTimeout = setTimeout(() => {
          setLoading(false)
        }, 800)
      }
    }

    f()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected, selectedView])

  useEffect(() => setCamera(selectedView), [selectedView])

  return (
    <div style={{ position: 'relative', height: '100%', width: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'end' }}>
        <ButtonGroup variant="contained" disabled={model.index === "POMIAR BEZ MODELU"}>
          {views.map((_, idx) =>
            <Button key={_} color={selectedView === _ ? 'secondary' : 'primary'} onClick={() => setSelectedView(_)}>
              {viewNames[idx]}
            </Button>
          )}
        </ButtonGroup>
      </div>
      <div style={{height: "100%", overflow: 'hidden', position: 'relative', border: "1px solid", borderColor: theme.palette.primary.main}}>
        <Canvas camera={{ position: [10000, 10000, 10000], far: 10000 }} orthographic={true}>
          <ambientLight />
          <Bounds fit margin={1.25} damping={0}>
            <TexturedBox3D
              size={[x, y, z]}
              textures={textures}
              onClick={onClick}
              selectedView={selectedView}
            />
          </Bounds>
          <OrbitControls
            dampingFactor={1}
            ref={controlsRef}
            target={[x / 2, y / 2, z / 2]}
            maxPolarAngle={Infinity}
            minPolarAngle={-Infinity}
            makeDefault={true}
            enableRotate={selectedView === '3d'}
            mouseButtons={selectedView === '3d' ? {
              LEFT: THREE.MOUSE.ROTATE,
              MIDDLE: THREE.MOUSE.DOLLY,
              RIGHT: THREE.MOUSE.PAN
            } : {
              LEFT: THREE.MOUSE.PAN,
              MIDDLE: THREE.MOUSE.DOLLY,
              RIGHT: THREE.MOUSE.ROTATE
            }}
            touches={selectedView === '3d' ? {
              ONE: THREE.TOUCH.ROTATE,
              TWO: THREE.TOUCH.DOLLY_PAN
            } : {
              ONE: THREE.TOUCH.PAN,
              TWO: THREE.TOUCH.DOLLY_PAN
            }}
          />
        </Canvas>
        <div style={{
          opacity: loading ? 1 : 0,
          pointerEvents: loading ? 'all' : 'none',
          position: 'absolute',
          inset: 0,
          background: theme.palette.background.default,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          transition: 'opacity 100ms ease-in-out'
        }}>
          <CircularProgress />
        </div>
      </div>
    </div>
  )
}
