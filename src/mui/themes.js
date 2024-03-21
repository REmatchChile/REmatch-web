import { createTheme, responsiveFontSizes } from "@mui/material/styles";

const baseTheme = {
  palette: {
    primary: {
      main: "#03DAC6",
    },
    secondary: {
      main: "#ffa500",
    },
  },
  components: {
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          userSelect: "none",
        },
      },
    },
  },
};

export const darkTheme = responsiveFontSizes(
  createTheme({
    ...baseTheme,
    palette: { ...baseTheme.palette, mode: "dark" },
  })
);

export const lightTheme = responsiveFontSizes(
  createTheme({
    ...baseTheme,
    palette: {
      ...baseTheme.palette,
      mode: "light",
      background: { default: "#FAFAFA" },
    },
  })
);
