import React, {FC, useEffect, useMemo} from "react";
import {MeshBasicMaterial} from "three";
import {useBounds, useTexture} from "@react-three/drei";
import {Element} from "../types";

interface Box3DProps {
  textures: string[]
  selectedElement: Element | "size" | null
  size: [x: number, y: number, z: number]
  onClick?: (x: number, y: number, z: number) => void
  onDoubleClick?: (x: number, y: number, z: number) => void
  center?: () => void
}

export const TexturedBox3D: FC<Box3DProps> = (
  {
    size, onClick = () => {
  }, textures, onDoubleClick = () => {
  }, selectedElement, center = () => {
  }
  }) => {
  const [x, y, z] = size

  const txs = useTexture(textures)
  const material = useMemo(
    () => txs.map(t => new MeshBasicMaterial({map: t, opacity: 1})),
    [txs])

  const bounds = useBounds();

  useEffect(() => {
    setTimeout(() => bounds.refresh().fit(), 2000)
  }, []);

  useEffect(() => {
    if (!selectedElement || selectedElement === "size") {
      return;
    }

    onDoubleClick(...selectedElement.center);
    setTimeout(() => bounds.refresh().fit(), 2000);
  }, [selectedElement, onDoubleClick])

  useEffect(() => {
    if (selectedElement === "size") {
      center();
    }
  }, [center, selectedElement])

  return (
    <>
      <mesh>
        <sphereBufferGeometry args={[2, 32, 32]} attach="geometry"/>
        <meshBasicMaterial color={0xff0000} attach="material"/>
      </mesh>
      <mesh position={[x / 2, y / 2, z / 2]}
            onClick={(e) => onClick(e.point.x, e.point.y, e.point.z)}
            onDoubleClick={(e) => {
              onDoubleClick(e.point.x, e.point.y, e.point.z);
              setTimeout(() => bounds.refresh().fit(), 1000);
            }}
            material={material}>
        <boxGeometry args={[x, y, z]}/>
      </mesh>
    </>
  )
}
