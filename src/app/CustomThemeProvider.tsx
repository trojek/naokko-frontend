import { createTheme, CssBaseline, ThemeProvider, Experimental_CssVarsProvider as CssVarsProvider } from "@mui/material";

export const theme = createTheme({
  shape: {
    borderRadius: 0,
  },
  palette: {
    mode: "dark",
    primary: {
      main: "#1e88e5",
      light: "#42a5f5",
      dark: "#1565c0",
    },
    secondary: {
      main: "#DDD",
      light: "#BBB",
      dark: "#FFF",
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
      paper: "#232323",
      default: "#111111",
    },
    text: {
      primary: "#ffffff",
      secondary: "#ffffff",
    },
  },
  typography: {
    fontFamily: "'Chivo Mono', monospace",
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
      color: "#ffffff"
    },
  },
  components: {
    MuiTableCell: {
      styleOverrides: {
        root: {
          // fontFamily: "'Lato', Arial",
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

export const CustomThemeProvider = ({ children } : { children: any }) => {

  return <ThemeProvider theme={theme}>
    <CssBaseline>
      {children}
    </CssBaseline>
  </ThemeProvider>;
};
