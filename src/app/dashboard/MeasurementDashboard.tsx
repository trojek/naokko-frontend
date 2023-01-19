import {FunctionComponent, useContext} from "react";
import {Button, Stack, Typography} from "@mui/material";
import ArrowRightOutlinedIcon from '@mui/icons-material/ArrowRightOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import {MeasurementContext} from "../MeasurementContext";
import {AppContext} from "../AppContext";
import {LoadingView} from "../modals/LoadingView";
import {FilteredTable} from "./FilteredTable";
import {ChangeCornerView} from "../modals/ChangeCornerView";

export const MeasurementDashboard: FunctionComponent = () => {
    const {measurement} = useContext(MeasurementContext)
    const {selectedIndex} = useContext(AppContext)

    return (
        <>
            <LoadingView open={(measurement.queryLeft.isLoading || measurement.queryRight.isLoading)}/>
            <ChangeCornerView open={measurement.waitingForNext && !measurement.finalized}/>

            <Stack
                height="100%"
                gap="16px"
                pr="8px"
            >
                <Stack gap="8px">
                    <Typography variant='h5'>{selectedIndex?.split(".").splice(0, 1).join(".")}</Typography>
                    <Stack direction="row">
                        {measurement.measured
                            ? <img alt="warning" src="warning.svg" width={"30px"} style={{marginRight: "10px"}}/>
                            : <CheckCircleIcon color="success" fontSize="large" sx={{marginRight: "10px"}}/>
                        }

                        <Typography variant="h5">
                            {measurement.measured ? "ZNALEZIONO BŁĘDY:" : 'OBIEKT WCZYTANY POPRAWNIE'}
                        </Typography>

                    </Stack>
                </Stack>

                <FilteredTable/>

                {measurement.measured && (<Button
                    onClick={() => fetch(`${process.env.REACT_APP_MEASUREMENT_URL}measurement_error`, {method: "POST"})}
                    variant='outlined'
                    color="primary"
                    fullWidth
                    sx={{
                        alignSelf: "center",
                        borderRadius: "15px",
                        padding: "10px 20px",
                        borderWidth: '1px'
                    }}
                >
                    <Typography variant={"h3"}>Zgłoś błąd pomiaru</Typography>
                </Button>)}

                <Button onClick={() => measurement.trigger()}
                        disabled={measurement.inProgress}
                        variant='contained'
                        color='primary'
                        fullWidth
                        sx={{
                            alignSelf: "center",
                            borderRadius: "15px",
                            padding: "10px 20px",
                            marginBottom: "16px"
                        }}
                >
                    <Typography variant={"h3"}>
                        Rozpocznij pomiar
                    </Typography>
                    <ArrowRightOutlinedIcon sx={{fontSize: "65px", margin: "-20px"}}/>
                </Button>
            </Stack>
        </>
    )
}
