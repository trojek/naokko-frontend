import {TableBody} from "@mui/material";
import {FunctionComponent, useContext, useEffect, useRef, useState} from "react";
import {Cut} from "../types";
import {MeasurementContext} from "../MeasurementContext";
import {MeasurementRow, MeasurementTableHeader} from "./MeasurementsTable";
import { CollapsibleHeader } from "./CollapsibleHeader";

interface CutsTableRowProps {
    index: number;
    cut: Cut;
    text: string;
}

const CutsTableRow: FunctionComponent<CutsTableRowProps> = ({index, cut, text}) => {
    const {selectedElement, setSelectedElement} = useContext(MeasurementContext)
    const isSelected = cut === selectedElement
    const ref = useRef<HTMLTableSectionElement>(null)

    useEffect(() => {
        if (isSelected) {
            ref.current?.scrollIntoView({behavior: "smooth", block: "center"})
        }
    }, [isSelected])

    const handleSelection = () => setSelectedElement(isSelected ? null : cut)

    return (
        <>
            <CollapsibleHeader
                title={`WRĘG ${text.toUpperCase()} ${index + 1}`}
                forceOpen={isSelected}
                handleSelection={handleSelection}
                isOk={cut.isOk}
            >
                <MeasurementTableHeader/>
                <TableBody ref={ref} onClick={() => setSelectedElement(cut)} >
                    {!!cut.x1 && <MeasurementRow measurement={cut.x1} label="X1" />}
                    {!!cut.x2 && <MeasurementRow measurement={cut.x2} label="X2" />}
                    {!!cut.y1 && <MeasurementRow measurement={cut.y1} label="Y1" />}
                    {!!cut.y2 && <MeasurementRow measurement={cut.y2} label="Y2" />}
                    {!!cut.z1 && <MeasurementRow measurement={cut.z1} label="Z1" />}
                    {!!cut.z2 && <MeasurementRow measurement={cut.z2} label="Z2" />}
                    <MeasurementRow measurement={cut.depth} label="GŁ." />
                </TableBody>
            </CollapsibleHeader>
        </>
    )
}

interface CutsEntryProps {
    cuts: Cut[]
    text: string
}

const CutsEntry: FunctionComponent<CutsEntryProps> = ({cuts, text}) => {
    const [open, setOpen] = useState(true)
    const {selectedElement} = useContext(MeasurementContext)

    useEffect(() => {
            if (selectedElement instanceof Cut && cuts.includes(selectedElement)) {
                setOpen(true);
            }
        },
        [cuts, selectedElement, setOpen])

    return (
        <>
            {!!cuts.length && open && cuts.filter(c => !c.drawOnly).map((h, i) =>
                <CutsTableRow text={text} cut={h} index={i} key={i}/>
            )}
        </>
    )
}


export const CutsTable: FunctionComponent = () => {
    const {measurement} = useContext(MeasurementContext)

    return (
        <>
            <CutsEntry text={'Góra'} cuts={measurement.model.top.cuts}/>
            <CutsEntry text={'Spód'} cuts={measurement.model.bottom.cuts}/>
            <CutsEntry text={'Przód'} cuts={measurement.model.front.cuts}/>
            <CutsEntry text={'Tył'} cuts={measurement.model.rear.cuts}/>
            <CutsEntry text={'Lewa'} cuts={measurement.model.left.cuts}/>
            <CutsEntry text={'Prawa'} cuts={measurement.model.right.cuts}/>
        </>
    )
}
