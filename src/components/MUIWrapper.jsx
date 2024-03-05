import { ThemeProvider } from "@emotion/react";
import { CssBaseline } from "@mui/material";
import React, { createContext, useMemo, useEffect, useState } from "react";
import { darkTheme, lightTheme } from "../mui/themes";

export const MUIWrapperContext = createContext({
  toggleColorMode: () => {},
});

const MUIWrapper = ({ children }) => {
  const [mode, setMode] = useState(
    window.localStorage.getItem("mode") || "dark"
  );
  const muiWrapperUtils = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
      },
      getMode: () => mode,
    }),
    [mode]
  );

  const theme = useMemo(
    () => (mode === "light" ? lightTheme : darkTheme),
    [mode]
  );

  useEffect(() => {
    window.localStorage.setItem("mode", mode);
  }, [mode]);

  return (
    <MUIWrapperContext.Provider value={muiWrapperUtils}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </MUIWrapperContext.Provider>
  );
};

export default MUIWrapper;
