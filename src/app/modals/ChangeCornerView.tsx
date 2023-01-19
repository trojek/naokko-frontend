import {
  Backdrop, Box,
  Button,
  Grid,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import ArrowRightOutlinedIcon from "@mui/icons-material/ArrowRightOutlined";
import {FC, useContext} from "react";
import {MeasurementContext} from "../MeasurementContext";

interface ChangeCornerViewProps {
  open: boolean;
}

export const ChangeCornerView: FC<ChangeCornerViewProps> = ({open}) => {
  const theme = useTheme();
  const {
    measurement: {triggerNext, finalize},
  } = useContext(MeasurementContext);

  return (
    <Backdrop
      sx={{zIndex: (theme) => theme.zIndex.drawer + 1}}
      open={open}
    >
      <Stack
        width={"100vw"}
        height={"100vh"}
        justifyContent={"space-between"}
        sx={{
          background: theme.palette.background.paper,
        }}
      >
        <Box component={"div"} pt={"12px"} pl={"28px"}>
          <img src="logo_small_exp.svg" alt="logo" height={"48px"} onClick={() => document.location.reload()}/>
        </Box>

        <Stack gap="64px">
          <Stack direction={"row"} justifyContent={"center"} gap={"64px"}>
            <img
              alt="left corner"
              src="left_corner.svg"
              height={"270px"}
              width={"270px"}
            />
            <img alt="rotate" src="rotate.svg" height={"270px"} width={"270px"}/>
            <img
              alt="right corner"
              src="right_corner.svg"
              height={"270px"}
              width={"270px"}
            />
          </Stack>

          <Typography textAlign={'center'} variant="h3">
            OBRÓĆ ELEMENT I PRZENIEŚ DO
            <br/>
            PRAWEGO NAROŻNIKA OBSZARU POMIARU
          </Typography>
        </Stack>

        <Grid
          container
          sx={{background: theme.palette.background.paper}}
        >
          <Grid item sm={6}/>
          <Grid item sm={6}>
            <Stack direction={"row"} justifyContent={"center"} gap={"16px"}>
              <Button
                onClick={triggerNext}
                variant="contained"
                color="primary"
                sx={{
                  alignSelf: "center",
                  borderRadius: "15px",
                  padding: "10px 20px",
                  marginBottom: "16px",
                }}
              >
                <Typography variant="h3">
                  KONTYNUUJ POMIAR
                </Typography>
                <ArrowRightOutlinedIcon
                  sx={{fontSize: "65px", margin: "-20px"}}
                />
              </Button>
              <Button
                onClick={async () => {
                  try {
                    const rsp = await fetch(`${process.env.REACT_APP_MEASUREMENT_URL}get_report`, {method: "POST"});
                    finalize(await rsp.json());
                  } catch {
                    console.log("failed to get report")
                  }
                }}
                variant="contained"
                color="primary"
                sx={{
                  alignSelf: "center",
                  borderRadius: "15px",
                  padding: "10px 20px",
                  marginBottom: "16px",
                }}
              >
                <Typography variant="h3">
                  ZAKOŃCZ POMIAR
                </Typography>
                <ArrowRightOutlinedIcon
                  sx={{fontSize: "65px", margin: "-20px"}}
                />
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Stack>
    </Backdrop>
  );
};
