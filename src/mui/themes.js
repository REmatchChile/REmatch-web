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
  typography: {
    h1: {
      fontWeight: 500,
      fontSize: "2.5rem",
    },
    h2: {
      fontWeight: 500,
      fontSize: "2rem",
    },
    h3: {
      fontWeight: 500,
      fontSize: "1.5rem",
    },
    h4: {
      fontWeight: 500,
      fontSize: "1.17rem",
    },
    h5: {
      fontWeight: 500,
      fontSize: "1rem",
    },
    h6: {
      fontWeight: 500,
      fontSize: ".83rem",
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
    palette: { ...baseTheme.palette, mode: "light" },
  })
);
