import {Plane, Element} from "../../types";
import {FunctionComponent} from "react";

interface PlanePlotProps {
    view: Plane
    flipX: boolean
    flipY: boolean
    isSelectedElement: any
    measured?: boolean
}

const strokeWidth = `${2}px`

export const PlanePlot: FunctionComponent<PlanePlotProps> = ({view, isSelectedElement, flipX, flipY, measured}) => {
    const {image, openings, cuts, size: [x, y]} = view

    const getElementColor = (isSelected: boolean, e: Element): string =>
      isSelected ? (measured && !e.isOk) ? "red" : "green" : "black"

    return (
        <svg height="100%" width="100%" viewBox={`0 0 ${x.max} ${y.max}`}
             transform={`scale(${flipX ? '-' : ''}1, ${flipY ? '-' : ''}1)`}
             xmlns="http://www.w3.org/2000/svg"
             xmlnsXlink="http://www.w3.org/1999/xlink">
            {!!image && <image x={0} y={0} width={x.real} height={y.real}
                               xlinkHref={image}/>}

            <rect
                x={0}
                y={0}
                width={x.value}
                height={y.value}
                fill='#cbcbcb'
                stroke='black'
                strokeWidth={strokeWidth}/>

            {openings.map((o, i) => {
                return (
                    <circle
                        key={i}
                        cx={o.getCenterOnPlane()[0]}
                        cy={o.getCenterOnPlane()[1]}
                        r={(o.r.value)}
                        fill='transparent'
                        stroke={getElementColor(isSelectedElement(o), o)}
                        strokeWidth={strokeWidth}
                    />
                )
            })}

            {cuts.map((c, i) => {
                return (
                    <rect
                        key={i}
                        x={c.getPointsOnPlane()[0][0]}
                        y={c.getPointsOnPlane()[0][1]}
                        width={Math.abs(c.getPointsOnPlane()[1][0] - c.getPointsOnPlane()[0][0])}
                        height={Math.abs(c.getPointsOnPlane()[1][1] - c.getPointsOnPlane()[0][1])}
                        fill='transparent'
                        stroke={getElementColor(isSelectedElement(c), c)}
                        strokeWidth={strokeWidth}/>
                );
            })}
        </svg>
    )
}

