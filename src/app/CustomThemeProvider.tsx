import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { FC } from "react";

export const CustomThemeProvider: FC = ({ children }) => {
  const theme = createTheme({
    palette: {
      mode: "dark",
      primary: {
        main: "#b6171e",
        light: "#c5454b",
        dark: "#b31220",
      },
      success: {
        main: "#19b25e",
        light: "#47c17e",
        dark: "#148e4b",
      },
      warning: {
        main: "#f2b534",
        dark: "#daa32f",
        light: "#f3bc48",
      },
      background: {
        paper: "#131313",
        default: "#000000",
      },
      text: {
        primary: "#ffffff",
        secondary: "#ffffff",
      },
    },
    typography: {
      fontFamily: "'Barlow Condensed', Arial",
      fontSize: 18,
      h3: {
        color: "#ffffff",
        [`@media screen and (max-width: 1250px)`]: {
          fontSize: "2.2rem",
        },
        [`@media screen and (max-width: 990px)`]: {
          fontSize: "1.5rem",
        },
      },
      h6: {
        color: "#ffffff",
        fontFamily: "'Barlow Semi Condensed', Arial",
      },
    },
    components: {
      MuiTableCell: {
        styleOverrides: {
          root: {
            fontFamily: "'Lato', Arial",
          },
        },
      },
      MuiTableRow: {
        styleOverrides: {
          root: {
            // "tr:nth-child(even) td": { background: "#1f1f1f" }, TODO: czemu to nie działa?
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            background: "transparent",
            boxShadow: "none",
          },
        },
      },
      MuiGrid: {
        styleOverrides: {
          container: {
            background: "#1a1a1a",
          },
          item: {
            overflowY: "auto",
          },
        },
      },
      MuiBackdrop: {
        styleOverrides: {
          root: {
            color: "#131313",
          },
        },
      },
      MuiLinearProgress: {
        styleOverrides: {
          root: {
            margin: 3,
            backgroundColor: "#525252",
          },
        },
      },
      MuiDialogTitle: {
        styleOverrides: {
          root: {
            fontSize: "2.125rem",
            padding: "32px",
          },
        },
      },
      MuiDialogContentText: {
        styleOverrides: {
          root: {
            fontSize: "1.25rem",
            padding: "16px 8px",
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            background: "#1f1f1f",
          },
        },
      },
    },
  });
  const theme2 = createTheme({})

  return <ThemeProvider theme={theme}>
    <CssBaseline />
    {children}
  </ThemeProvider>;
};
