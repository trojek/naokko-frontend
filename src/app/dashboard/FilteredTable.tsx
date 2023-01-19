import {Box, Stack, Typography} from "@mui/material";
import {TabPanelUnstyled, TabsListUnstyled, TabsUnstyled, TabUnstyled, tabUnstyledClasses,} from "@mui/base";
import {CutsTable} from "./CutsTable";
import {DimensionsTable} from "./DimensionsTable";
import {HolesTable} from "./HolesTable";
import {styled} from "@mui/system";
import {useContext, useEffect, useState} from "react";
import {MeasurementContext} from "../MeasurementContext";
import {ElementType} from "../types";

const Tab = styled(TabUnstyled)`
    font-family: "Barlow Condensed", "Lato", "Barlow Semi Condensed", "monospace";
    font-size: 1rem;
    color: #ffffff;
    cursor: pointer;
    background-color: transparent;
    border: none;
    display: flex;
    justify-content: center;

    &.${tabUnstyledClasses.selected} {
        text-decoration: underline #b6171e;
    }
`;

const TabsList = styled(TabsListUnstyled)`
    display: flex;
    align-items: center;
`;

export const FilteredTable = () => {
    const {selectedElement, setSelectedElement} = useContext(MeasurementContext)

    const [tab, setTab] = useState(2);

    useEffect(() => {
        if(tab === 2) {
            setSelectedElement("size")
        }
    }, [tab, setSelectedElement])

    useEffect(() => {
        if(selectedElement !== "size" && selectedElement?.type === ElementType.Opening) {
            setTab(0)
        } else if(selectedElement !== "size" && selectedElement?.type === ElementType.Cut) {
            setTab(1)
        }
    }, [selectedElement])

    return (
        <Stack
            border="1px solid #b6171e"
            borderRadius="10px"
            boxSizing="border-box"
            bgcolor={"background.default"}
            flexBasis="100%"
            px={1}
            py={0.5}
            sx={{
                overflowX: "hidden",
            }}
        >
            <TabsUnstyled value={tab} onChange={(e, v) => setTab(v as number)}>
                <Stack
                    alignItems="line-height"
                    bgcolor={"background.default"}
                    direction="row"
                    flexWrap="wrap"
                    gap="8px"
                    position={"sticky"}
                    top={"0px"}
                    zIndex="100"
                >
                    <Typography variant="h6" fontSize="1rem" color="text.primary">
                        FILTRUJ:
                    </Typography>
                    <TabsList>
                        <Tab>OTWORY</Tab>
                        <Tab>WRĘGI</Tab>
                        <Tab>GABARYTY</Tab>
                    </TabsList>
                </Stack>

                <Box component="div">
                    <TabPanelUnstyled value={0}>
                        <HolesTable />
                    </TabPanelUnstyled>
                    <TabPanelUnstyled value={1}>
                        <CutsTable />
                    </TabPanelUnstyled>
                    <TabPanelUnstyled value={2}>
                        <DimensionsTable />
                    </TabPanelUnstyled>
                </Box>
            </TabsUnstyled>
        </Stack>
    );
};
