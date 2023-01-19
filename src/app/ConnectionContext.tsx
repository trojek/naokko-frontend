import {createContext, FC, PropsWithChildren, useContext, useState} from "react";
import {MeasurementContext} from "./MeasurementContext";

export interface ConnectionContextInterface {
    startPosition: {x: number, y: number}
    setStartPosition: (pos: {x: number, y: number}) => any

    endPosition: {x: number, y: number}
    setEndPosition: (pos: {x: number, y: number}) => any
}

const emptyConnectionContext: ConnectionContextInterface = {
    startPosition: {x: 0, y: 0},
    setStartPosition: () => {},

    endPosition: {x: 0, y: 0},
    setEndPosition: () => {},
}

export const ConnectionContext = createContext(emptyConnectionContext)

export const ConnectionContextProvider: FC<PropsWithChildren<any>> = ({children}) => {
    const { selectedElement } = useContext(MeasurementContext)
    const [startPosition, setStartPosition] = useState({x: 0, y: 0})
    const [endPosition, setEndPosition] = useState({x: 0, y: 0})

    console.log(startPosition, endPosition)

    return (
        <ConnectionContext.Provider value={{
            startPosition, setStartPosition,
            endPosition, setEndPosition,
        }}>
            {selectedElement && (
                <svg style={{
                    position: 'fixed',
                    zIndex: 10000,
                    width: '100vw',
                    height: '100vh',
                    pointerEvents: "none"
                }}>
                    <line
                        x1={startPosition.x}
                        x2={endPosition.x}
                        y1={startPosition.y}
                        y2={endPosition.y}
                        stroke={'red'}
                        width={'10'}
                    />
                </svg>
            )}
            {children}
        </ConnectionContext.Provider>
    )
}
