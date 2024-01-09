import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

import CodeMirror from 'codemirror';
import 'codemirror/addon/mode/simple';
import 'codemirror/theme/material-darker.css';

import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from "@material-ui/core/CssBaseline";

import Navbar from './components/Navbar';
import Home from './components/Home';
import 'fontsource-roboto';
import './App.scss';

CodeMirror.defineSimpleMode('REmatchQuery', {
  start: [
    {
      regex: /(![A-Za-z0-9]+\{|\})/,
      token: 'm0'
    },
    {
      regex: /(\\d)|(\\w)|(\\s)|(\\t)|(\\r)|(\\n)|(\\\()|(\\\))|(\\\[)|(\\\])|(\\\{)|(\\\})|(\\\.)|(\\-)|(\\_)/i,
      token: 'm2'
    },
    {
      regex: /(\(|\)|\||\[(\^)?|\]|-)/,
      token: 'm3'
    },
    {
      regex: /(\+|\*|\.|\+|\?)/,
      token: 'm1'
    },
    {
      regex: /\{[0-9]+(,([0-9]+)?)?\}/,
      token: 'm5'
    },
    {
      regex: /(\$|\^)/,
      token: 'm6'
    }
  ]
});

/* MATERIAL UI DARK THEME */
const darkTheme = createTheme({
  palette: {
    type: 'dark',
    primary: {
      main: '#03DAC6',
    },
    secondary: {
      main: '#FCE938',
    },
    disabled: {
      main: '#d3d3d3',
    },
    background: {
      paper: '#212121',
      default: '#424242',
    },
  },
});

const App = () => {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Router>
        <Navbar/>
        <Switch>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </Router>
    </ThemeProvider>
  )
}

export default App;