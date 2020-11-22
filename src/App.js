/*
TODO:
  - finish about
  - fix bug worker doesn't stop onpagechange
  - start/stop worker
*/
import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

import CodeMirror from 'codemirror';
import 'codemirror/addon/mode/simple';
import 'codemirror/theme/material-darker.css';

import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from "@material-ui/core/CssBaseline";

import Navbar from './components/Navbar';
import About from './components/About';
import Home from './components/Home';
import 'fontsource-roboto';

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
      regex: /(\(|\)|\||\[|\]|-)/,
      token: 'm3'
    },
    {
      regex: /(\+|\*|\.|\+)/,
      token: 'm1'
    },
    {
      regex: /<[0-9]+(,[0-9]+)?>/,
      token: 'm5'
    },
  ]
});

CodeMirror.defineSimpleMode('RegExQuery', {
  start: [
    {
      regex: /\(|\)/,
      token: 'm0'
    },
    {
      regex: /(\\d)|(\\w)|(\\s)|(\\t)|(\\r)|(\\n)|(\\\()|(\\\))|(\\\[)|(\\\])|(\\\{)|(\\\})|(\\\.)|(\\-)|(\\_)/i,
      token: 'm2'
    },
    {
      regex: /\[|\]|-/,
      token: 'm3'
    },
    {
      regex: /(\+|\*|\.|\+)/,
      token: 'm1'
    },
  ]
});

/* MATERIAL UI DARK THEME */
const darkTheme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      main: '#03DAC6',
    },
    secondary: {
      main: '#FCE938',
    },
    background: {
      paper: '#212121',
      default: '#424242',
    }
  },
});

const App = () => {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Router>
        <Navbar/>
        <Switch>
          <Route path="/about">
            <About />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </Router>
    </ThemeProvider>
  )
}

export default App;