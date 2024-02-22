import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import CodeMirror from "codemirror";
import "codemirror/addon/mode/simple";
import "codemirror/theme/material-darker.css";

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
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

// Keep app version in localStorage. Clear localStorage if app version changes
const APP_VERSION = process.env.REACT_APP_CURRENT_GIT_SHA;
if (
  typeof global.localStorage.APP_VERSION === "undefined" ||
  global.localStorage.APP_VERSION === null
) {
  global.localStorage.setItem("APP_VERSION", APP_VERSION);
}
if (global.localStorage.APP_VERSION !== APP_VERSION) {
  console.log(
    `localStorage cleared because app version changed to ${APP_VERSION}`
  );
  global.localStorage.clear();
  global.localStorage.setItem("APP_VERSION", APP_VERSION);
}

CodeMirror.defineSimpleMode("REQL", {
  start: [
    {
      regex: /(![A-Za-z0-9]+\{|\})/,
      token: "m0",
    },
    {
      regex:
        /(\\d)|(\\w)|(\\s)|(\\t)|(\\r)|(\\n)|(\\\()|(\\\))|(\\\[)|(\\\])|(\\\{)|(\\\})|(\\\.)|(\\-)|(\\_)/i,
      token: "m2",
    },
    {
      regex: /(\(|\)|\||\[(\^)?|\]|-)/,
      token: "m3",
    },
    {
      regex: /(\+|\*|\.|\+|\?)/,
      token: "m1",
    },
    {
      regex: /\{(\d+|\d+,\d+|\d+,|,\d+)\}/,
      token: "m5",
    },
    {
      regex: /(\$|\^)/,
      token: "m6",
    },
  ],
});

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
