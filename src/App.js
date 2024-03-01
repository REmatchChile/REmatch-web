import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { Box, CssBaseline } from "@mui/material";
import {
  ThemeProvider,
  createTheme,
  responsiveFontSizes,
} from "@mui/material/styles";
import "fontsource-roboto";
import { SnackbarProvider } from "notistack";
import React, { useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.scss";
import Navbar from "./components/Navbar";
import AboutUs from "./pages/AboutUs";
import Examples from "./pages/Examples";
import Home from "./pages/Home";
import Tutorial from "./pages/Tutorial";
import WhatIsREmatch from "./pages/WhatIsREmatch";

const darkTheme = responsiveFontSizes(
  createTheme({
    typography: {
      h1: {
        fontWeight: 500,
        fontSize: "2rem",
      },
      h2: {
        fontWeight: 500,
        fontSize: "1.5rem",
      },
      h3: {
        fontWeight: 500,
        fontSize: "1.17rem",
      },
      h4: {
        fontWeight: 500,
        fontSize: "1rem",
      },
      h5: {
        fontWeight: 500,
        fontSize: ".83rem",
      },
      h6: {
        fontWeight: 500,
        fontSize: ".67rem",
      },
    },
    palette: {
      mode: "dark",
      primary: {
        main: "#03DAC6",
      },
      secondary: {
        main: "#FCE938",
      },
      disabled: {
        main: "#d3d3d3",
      },
    },
  })
);

const DRAWER_WIDTH = {
  open: 256,
  closed: 56,
};

const App = () => {
  const [drawerWidth, setDrawerWidth] = useState(DRAWER_WIDTH.closed);
  const [openDrawer, setOpenDrawer] = useState(false);
  const handleDrawerOpen = () => {
    setOpenDrawer(true);
    setDrawerWidth(DRAWER_WIDTH.open);
  };
  const handleDrawerClose = () => {
    setOpenDrawer(false);
    setDrawerWidth(DRAWER_WIDTH.closed);
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <SnackbarProvider
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        style={{
          whiteSpace: "pre-wrap",
          fontFamily: "'Roboto Mono', monospace",
        }}
        autoHideDuration={3000}
        hideIconVariant
      />
      <BrowserRouter>
        <Navbar
          handleDrawerClose={handleDrawerClose}
          openDrawer={openDrawer}
          drawerWidth={drawerWidth}
          handleDrawerOpen={handleDrawerOpen}
        />
        <Box
          sx={{
            flex: "1 1 auto",
            display: "flex",
            overflow: "hidden",
            flexDirection: "column",
            ml: { sm: `${drawerWidth}px`, xs: 0 },
            transition: "margin .2s ease-in-out",
          }}
        >
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route path="/what-is-rematch" element={<WhatIsREmatch />} />
            <Route path="/tutorial" element={<Tutorial />} />
            <Route path="/examples" element={<Examples />} />
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Box>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
