import React from "react";

import { Link } from "react-router-dom";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";

import Logo from "../assets/logo-dark.png";

export default function NavbarComponent() {
  return (
    <AppBar position="fixed">
      <Toolbar>
        <Link to="/">
          <Box
            component="img"
            src={Logo}
            alt="REmatch"
            sx={{
              display: "block",
              height: 36,
              "&:hover": {
                filter: "drop-shadow(0 0 4px #03DAC6)",
              },
            }}
          />
        </Link>
      </Toolbar>
    </AppBar>
  );
}
