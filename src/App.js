import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { SnackbarProvider } from "notistack";
import Box from "@mui/material/Box";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import "fontsource-roboto";
import "./App.scss";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

const darkTheme = createTheme({
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
});
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
        autoHideDuration={4000}
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
            p: 1,
            gap: 1,
            flex: "1 1 auto",
            display: "flex",
            overflow: "hidden",
            flexDirection: "column",
            ml: { sm: `${drawerWidth}px`, xs: 0 },
            transition: "margin .2s ease-in-out",
          }}
        >
          <Routes>
            <Route path="*" element={<NotFound />} />
            <Route path="/" element={<Home />} />
          </Routes>
        </Box>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
