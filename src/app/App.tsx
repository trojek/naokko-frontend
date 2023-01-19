import {useContext, useState} from 'react';
import {AppContext, AppContextProvider} from "./AppContext";
import {QueryClient, QueryClientProvider} from "react-query";
import {useTheme} from "@mui/material/styles";
import {SelectionDialog} from "./SelectionDialog";
import {LoadingDialog} from "./LoadingDialog";
import {Alert, AppBar, Button, Grid, Snackbar, Stack} from "@mui/material";
import {MeasurementDashboard} from "./dashboard/MeasurementDashboard";
import {MeasurementContextProvider} from "./MeasurementContext";
import Box from "@mui/material/Box";
import SearchIcon from '@mui/icons-material/Search';
import {ThreeDimensionalPreview} from "./3d/ThreeDimensionalPreview";
import {CustomThemeProvider} from './providers/CustomThemeProvider';
import { StartView } from './modals/StartView';

function AppView() {
    const {selectedIndex, modelQuery, communicationError} = useContext(AppContext)
    const [selectionDialogTriggered, setSelectionDialogTriggered] = useState(false)
    const theme = useTheme()

    return (
        <>
            <AppBar>
                <Stack direction='row' alignItems='center' justifyContent='space-between' pl='16px' pr='16px'>
                    <Box component="div" sx={{height: '48px', p: '4px', m: '8px', borderRadius: '4px'}}>
                            <img src='/logo_small_exp.svg' alt='naokko logo' style={{height: '100%'}} onClick={() => document.location.reload()}/>
                    </Box>

                    <Button color='inherit'
                            size='large'
                            variant='outlined'
                            startIcon={<SearchIcon/>}
                            onClick={() => setSelectionDialogTriggered(true)}>
                        Wyszukaj indeks
                    </Button>
                </Stack>
            </AppBar>

            <SelectionDialog
                open={selectionDialogTriggered}
                onClose={() => setSelectionDialogTriggered(false)}/>

            <LoadingDialog open={modelQuery.isLoading}/>

            <Snackbar
                open={communicationError}
                anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}>
                <Alert severity="error" sx={{width: '100%'}}>
                    Wystąpił problem podczas komunikacji z serwerem
                </Alert>
            </Snackbar>

            {!!selectedIndex && !!modelQuery.data &&
                <MeasurementContextProvider
                    index={selectedIndex}
                    model={modelQuery.data}>
                    <Grid container height='100%' pt='72px'>
                        <Grid item sm={8} height='100%'>
                            <ThreeDimensionalPreview/>
                        </Grid>
                        <Grid item sm={4} height='100%' sx={{
                            borderRight: `solid ${theme.palette.divider} 1px`,
                        }}>
                            <MeasurementDashboard/>
                        </Grid>
                    </Grid>
                </MeasurementContextProvider>
            }

            {!selectedIndex && <StartView onSelection={() => setSelectionDialogTriggered(true)}/>}
        </>
    );
}

function App() {
    const queryClient = new QueryClient()

    return (
        <QueryClientProvider client={queryClient}>
            <AppContextProvider>
                <CustomThemeProvider>
                    <AppView/>
                </CustomThemeProvider>
            </AppContextProvider>
        </QueryClientProvider>
    );
}

export default App;
