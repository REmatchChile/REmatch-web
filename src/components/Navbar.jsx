import React from 'react';

import { Link } from 'react-router-dom';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';

import Logo from '../assets/logo-dark.png';

const Navbar = () => (
  <AppBar position="fixed" className="appBar">
    <Toolbar>
      <Link to="/">
        <img className="logo" src={Logo} alt="REmatch" />
      </Link>
      <Link to="/about" className="button">
        <Button color="primary" size="large">
          About
        </Button>
      </Link>
    </Toolbar>
  </AppBar>
)

export default Navbar;