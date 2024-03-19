import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { Box } from "@mui/material";
import "fontsource-roboto";
import { SnackbarProvider } from "notistack";
import React, { useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.scss";
import MUIWrapper from "./components/MUIWrapper";
import Navbar from "./components/Navbar";
import AboutUs from "./pages/AboutUs";
import Examples from "./pages/Examples";
import Home from "./pages/Home";
import Tutorial from "./pages/Tutorial";
import WhatIsREmatch from "./pages/WhatIsREmatch";

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
    <MUIWrapper>
      <SnackbarProvider
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        style={{
          whiteSpace: "pre-wrap",
          fontFamily: "monospace",
        }}
        autoHideDuration={5000}
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
    </MUIWrapper>
  );
};

export default App;
