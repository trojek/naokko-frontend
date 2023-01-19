import {useMemo} from "react";
import {useLoader} from "@react-three/fiber";
import {SVGLoader} from "three/examples/jsm/loaders/SVGLoader";

export const ThreeDimLogo = () => {
    const data = useLoader(SVGLoader, "logo.svg");
    const shapes = useMemo(
        () =>
            data.paths.flatMap((g, index) => g
                .toShapes(true)
                .map((shape) => ({shape, color: g.color, index}))
            ),
        [data]
    );

    return (
        <>
            <ambientLight intensity={0.75}/>
            <spotLight intensity={0.75} position={[300, 300, 2000]}/>
            <group
                position={[-283.5, 254, -450]}
                rotation={[0, Math.PI, Math.PI]}
            >
                {shapes.map((s, i) => (
                    <mesh key={i}>
                        <meshPhongMaterial
                            color={s.color}
                            opacity={1}
                            transparent
                        />
                        <extrudeGeometry
                            args={[s.shape, {depth: 25}]}
                        />
                    </mesh>
                ))}
            </group>
        </>
    );
};
