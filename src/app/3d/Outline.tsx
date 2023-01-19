import React, {FC} from "react";
import {Point} from "../types";
import {Line} from "@react-three/drei";

interface OutlineProps {
    size: Point
}

export const Outline: FC<OutlineProps> = ({size}) => {
    const [x, y, z] = [size.x.value, size.y.value, size.z.value]

    const lines: [number, number, number][][] = [
        [[0, 0, 0], [x, 0, 0]],
        [[0, 0, 0], [0, y, 0]],
        [[x, 0, 0], [x, y, 0]],
        [[0, y, 0], [x, y, 0]],

        [[0, 0, z], [x, 0, z]],
        [[0, 0, z], [0, y, z]],
        [[x, 0, z], [x, y, z]],
        [[0, y, z], [x, y, z]],

        [[0, 0, 0], [0, 0, z]],
        [[x, 0, 0], [x, 0, z]],
        [[0, y, 0], [0, y, z]],
        [[x, y, 0], [x, y, z]],
    ]

    return (
        <>
            {lines.map((l, i) => <Line key={i} points={l} lineWidth={1}/>)}
        </>
    )
}
