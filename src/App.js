import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

// import CodeMirror from "codemirror";
// import "codemirror/addon/mode/simple";
// import "codemirror/theme/material-darker.css";

import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { SnackbarProvider } from "notistack";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Documentation from "./pages/Documentation";
import "fontsource-roboto";
import "./App.scss";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

/* MATERIAL UI DARK THEME */
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

const App = () => {
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
      <Router>
        <Navbar />
        <Switch>
          <Route path="/documentation">
            <Documentation />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </Router>
    </ThemeProvider>
  );
};

export default App;
