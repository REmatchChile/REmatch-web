import React from "react";

import { Link } from "react-router-dom";

import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";

import Logo from "../assets/logo-dark.png";

export default function NavbarComponent() {
  return (
    <AppBar position='fixed' className='appBar'>
      <Toolbar>
        <Link to='/'>
          <img className='logo' src={Logo} alt='REmatch' />
        </Link>
      </Toolbar>
    </AppBar>
  );
}

