import {TableBody} from "@mui/material";
import {FunctionComponent, useContext, useEffect, useRef, useState} from "react";
import {Opening} from "../types";
import {MeasurementRow, MeasurementTableHeader} from "./MeasurementsTable";
import {MeasurementContext} from "../MeasurementContext";
import { CollapsibleHeader } from "./CollapsibleHeader";

interface HolesTableRowProps {
    index: number;
    opening: Opening;
    onClick: () => any;
    text: string;
}

const HolesTableRow: FunctionComponent<HolesTableRowProps> = ({index, opening, onClick, text}) => {
    const {selectedElement, setSelectedElement} = useContext(MeasurementContext)
    const isSelected = opening === selectedElement
    const ref = useRef<HTMLTableSectionElement>(null)

    useEffect(() => {
        if (isSelected) {
            ref.current?.scrollIntoView({behavior: "smooth", block: "center", inline: "center"})
        }
    }, [isSelected])

    const handleSelection = () => setSelectedElement(isSelected ? null : opening)

    return (
        <>
            <CollapsibleHeader
                title={`OTWÓR ${text.toUpperCase()} ${index + 1}`}
                forceOpen={isSelected}
                handleSelection={handleSelection}
                isOk={opening.isOk}
            >
                <MeasurementTableHeader/>
                <TableBody onClick={onClick} ref={ref}>
                    <MeasurementRow measurement={opening.x} label="X"/>
                    <MeasurementRow measurement={opening.y} label="Y"/>
                    <MeasurementRow measurement={opening.z} label="Z"/>
                    <MeasurementRow measurement={opening.r.withValueModifier((v) => v * 2)} label="Ø"/>
                    <MeasurementRow measurement={opening.depth} label="GŁ."/>
                </TableBody>
            </CollapsibleHeader>
        </>
    )
}

interface HolesEntryProps {
    holes: Opening[]
    text: string
}

const HolesEntry: FunctionComponent<HolesEntryProps> = ({holes, text}) => {
    const {setSelectedElement, selectedElement} = useContext(MeasurementContext)
    const [open, setOpen] = useState(true)

    useEffect(() => {
            if (selectedElement instanceof Opening && holes.includes(selectedElement)) {
                setOpen(true);
            }
        },
        [holes, selectedElement, setOpen])

    return (
        <>
            {!!holes.length && open && holes.map((h, i) =>
                <HolesTableRow text={text} key={i} index={i} opening={h} onClick={() => setSelectedElement(h)}/>
            )}
        </>
    )
}

export const HolesTable: FunctionComponent = () => {
    const {measurement} = useContext(MeasurementContext)

    return (
        <>
            <HolesEntry text={'Góra'} holes={measurement.model.top.openings}/>
            <HolesEntry text={'Spód'} holes={measurement.model.bottom.openings}/>
            <HolesEntry text={'Przód'} holes={measurement.model.front.openings}/>
            <HolesEntry text={'Tył'} holes={measurement.model.rear.openings}/>
            <HolesEntry text={'Lewa'} holes={measurement.model.left.openings}/>
            <HolesEntry text={'Prawa'} holes={measurement.model.right.openings}/>
        </>
    )
}
