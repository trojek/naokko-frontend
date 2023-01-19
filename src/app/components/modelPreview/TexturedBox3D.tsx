import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { Euler, MeshBasicMaterial } from "three";
import { useBounds, useTexture } from "@react-three/drei";
import { debounce } from "@mui/material";

interface Box3DProps {
  textures: string[]
  selectedView: string
  size: [x: number, y: number, z: number]
  id: string
  onClick?: (x: number, y: number, z: number) => void
  onDoubleClick?: (x: number, y: number, z: number) => void
  center?: () => void,
}

export const TexturedBox3D: FC<Box3DProps> = ({
  size,
  onClick = () => { },
  textures,
  selectedView,
  id
}) => {
  const [x, y, z] = size

  const txs = useTexture(textures)
  const material = useMemo(
    () => txs.map(t => new MeshBasicMaterial({ map: t, opacity: 1 })),
    [txs])

  const bounds = useBounds();

  // const debouncedRefresh = useCallback(debounce(() => {
    
  // }, 10), [])

  useEffect(() => {
    bounds.refresh().clip().fit()
  }, [selectedView, id])
  
  const rotation = new Euler(
    180 * (Math.PI/180), 
    180 * (Math.PI/180), 
    270 * (Math.PI/180)
  )
  return (
    <>
      <mesh>      
        <mesh>
          <sphereBufferGeometry args={[2, 32, 32]} attach="geometry" />
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
