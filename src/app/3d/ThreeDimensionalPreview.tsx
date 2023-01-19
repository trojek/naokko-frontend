import * as THREE from 'three'
import React, {useContext, useEffect, useRef, useState} from 'react'
import {Canvas, extend, ReactThreeFiber} from '@react-three/fiber'
import {Bounds, OrbitControls} from "@react-three/drei";
import {MeasurementContext} from "../MeasurementContext";
import {OrbitControls as orbit} from 'three-stdlib'
import {Canvg, presets} from "canvg";
import {renderToString} from "react-dom/server";
import {TexturedBox3D} from "./TexturedBox3D";
import {PlanePlot} from "./PlanePlot";

extend({Line_: THREE.Line})

declare global {
    namespace JSX {
        interface IntrinsicElements {
            line_: ReactThreeFiber.Object3DNode<THREE.Line, typeof THREE.Line>
        }
    }
}

export const ThreeDimensionalPreview = () => {
    const {index, measurement, selectedElement, setSelectedElement} = useContext(MeasurementContext)
    const controlsRef = useRef<orbit>(null);

    const onClick = (x: number, y: number, z: number) => {
        [...measurement.model.getCuts(), ...measurement.model.getOpenings()].some(el => {
            if (el.isIn(x, y, z)) {
                setSelectedElement(el)
                return true
            }
            return false
        })
    }

    const [x, y, z] = measurement.model.size.toExpectedTuple()

    const handleCamera = (cx: number, cy: number, cz: number) => {
        if (Math.abs(cx) < 0.1) {
            controlsRef.current?.setPolarAngle(Math.PI / 2);
            controlsRef.current?.setAzimuthalAngle(Math.PI / -2);
        } else if (Math.abs(cy) < 0.1) {
            controlsRef.current?.setPolarAngle(Math.PI);
            controlsRef.current?.setAzimuthalAngle(0);
        } else if (Math.abs(cz) < 0.1) {
            controlsRef.current?.setPolarAngle(Math.PI / 2);
            controlsRef.current?.setAzimuthalAngle(-Math.PI);
        } else if (Math.abs(cx - x) < 0.1) {
            controlsRef.current?.setPolarAngle(Math.PI / 2);
            controlsRef.current?.setAzimuthalAngle(Math.PI / 2);
        } else if (Math.abs(cy - y) < 0.1) {
            controlsRef.current?.setPolarAngle(0);
            controlsRef.current?.setAzimuthalAngle(0);
        } else if (Math.abs(cz - z) < 0.1) {
            controlsRef.current?.setPolarAngle(Math.PI / 2);
            controlsRef.current?.setAzimuthalAngle(0);
        }
    }

    const centerCamera = () => {
        controlsRef.current?.setPolarAngle(0.956115572189312);
        controlsRef.current?.setAzimuthalAngle(0.78375862107508732);
    }

    async function toPng(width: number, height: number, svg: string) {
        const preset = presets.offscreen()
        const canvas = new OffscreenCanvas(parseInt(String(width)), parseInt(String(height)))
        const ctx = canvas.getContext('2d')
        const v = await Canvg.from(ctx!, svg, preset)

        await v.render()

        const blob = await canvas.convertToBlob()
        return URL.createObjectURL(blob)
    }

    const [textures, setTextures] = useState<string[]>([]);
    const [loading, setLoading] =  useState(false);

    useEffect(() => {
        async function f() {
            setTextures(await Promise.all(
                    [
                        {plane: measurement.model.right, flipX: false, flipY: true},
                        {plane: measurement.model.left, flipX: false, flipY: true},
                        {plane: measurement.model.rear, flipX: false, flipY: false},
                        {plane: measurement.model.front, flipX: false, flipY: true},
                        {plane: measurement.model.top, flipX: false, flipY: true},
                        {plane: measurement.model.bottom, flipX: true, flipY: true},
                    ].map(({plane, flipX, flipY}) => toPng(
                            plane.size[0].max * 5,
                            plane.size[1].max * 5,
                            renderToString(<PlanePlot view={plane}
                                                      selectedElement={selectedElement}
                                                      flipX={flipX}
                                                      flipY={flipY}
                                                      measured={measurement.measured}
                                                      />)
                        )
                    )
                )
            );
            setLoading(false);
        }

        f();
    }, [
        measurement.model.bottom,
        measurement.model.front,
        measurement.model.left,
        measurement.model.rear,
        measurement.model.right,
        measurement.model.top,
        selectedElement,
        measurement.measured
    ]);

    useEffect(() => setLoading(true), [index]);

    return (
        <Canvas camera={{position: [10000, 10000, 10000], far: 10000}} orthographic={true}>
            <ambientLight/>
            <Bounds fit margin={1.25}>
                {!loading && <TexturedBox3D
                    selectedElement={selectedElement}
                    size={[x, y, z]}
                    textures={textures}
                    onClick={onClick}
                    onDoubleClick={handleCamera}
                    center={centerCamera}
                />}
            </Bounds>
            <OrbitControls
                dampingFactor={0.33}
                ref={controlsRef}
                target={[x / 2, y / 2, z / 2]}
                maxPolarAngle={Infinity}
                minPolarAngle={-Infinity}
                makeDefault={true}
            />
        </Canvas>
    )
}
