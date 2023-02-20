import { FC, useEffect, useMemo } from "react";
import { MeshBasicMaterial } from "three";
import { useBounds, useTexture } from "@react-three/drei";

interface Box3DProps {
  textures: string[]
  selectedView: string
  size: [x: number, y: number, z: number]
  onClick?: (x: number, y: number, z: number) => void
  onDoubleClick?: (x: number, y: number, z: number) => void
  center?: () => void,
  base: number[]
}

let timeout: any | undefined = undefined

export const TexturedBox3D: FC<Box3DProps> = ({
  size,
  onClick = () => { },
  textures,
  selectedView,
  base
}) => {
  const [x, y, z] = size
  const [xBase, yBase, zBase] = base
  // those will be either 0 or 1

  const txs = useTexture(textures)
  const material = useMemo(
    () => txs.map(t => new MeshBasicMaterial({ map: t, opacity: 1 })),
    [txs])

  const bounds = useBounds();

  useEffect(() => {
    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(() => {
      bounds.refresh().clip().fit()
    }, 301)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedView])
  
  return (
    <>
      <mesh>      
        <mesh position={[0, 0, 0]}>
          <sphereBufferGeometry args={[5, 32, 32]} attach="geometry" />
          <meshBasicMaterial color={0xff0000} attach="material" />
        </mesh>
        <mesh position={[x / 2, y / 2, z / 2]}
          onClick={(e) => onClick(e.point.x, e.point.y, e.point.z)}
          material={material}>
          <boxGeometry args={[x, y, z]} />
        </mesh>
      </mesh>
    </>
  )
}
