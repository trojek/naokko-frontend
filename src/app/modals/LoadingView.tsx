import {
    Backdrop,
    Box,
    LinearProgress,
    Stack,
    Typography,
    useTheme,
} from "@mui/material";
import { FunctionComponent, useContext, useEffect, useState } from "react";
import { MeasurementContext } from "../MeasurementContext";
import { Bounds, Float } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { ThreeDimLogo } from "../3d/ThreeDimLogo";

interface LoadingViewProps {
    open: boolean;
}

export const LoadingView: FunctionComponent<LoadingViewProps> = ({ open }) => {
    const theme = useTheme();
    const [iteration, setIteration] = useState(0);
    const {
        measurement: { queryLeft },
    } = useContext(MeasurementContext);

    const homographicFn = (x: number): number => (-x - 5000) / (x + 50) + 100;

    useEffect(() => {
        if (open) {
            setIteration(0);
            const timer = setInterval(() => {
                setIteration((state) => state + 1);
            }, 300);

            return () => {
                setIteration(0);
                clearInterval(timer);
            };
        }
    }, [open]);

    return (
        <Backdrop
            sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={open}
        >
            <Stack
                component={"div"}
                alignItems="center"
                justifyContent="space-evenly"
                width="100vw"
                height="100vh"
                sx={{
                    background: theme.palette.background.paper,
                }}
            >
                <Box component="div" width="700px" height="700px">
                    <Canvas flat linear camera={{ near: 0.1, far: 2000 }}>
                        <Bounds clip margin={1.25}>
                            <Float scale={0.35}>
                                <ThreeDimLogo />
                            </Float>
                        </Bounds>
                    </Canvas>
                </Box>
                <Stack width={"650px"}>
                    <Typography variant="h6" alignSelf="center">
                        TRWA POMIAR
                        {queryLeft.isSuccess ? " 2/2" : " 1/2"}
                        ...
                    </Typography>
                    <LinearProgress
                        variant="determinate"
                        value={homographicFn(iteration)}
                    />
                </Stack>
            </Stack>
        </Backdrop>
    );
};
