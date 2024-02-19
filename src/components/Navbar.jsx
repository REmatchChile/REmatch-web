import React from "react";

import GitHubIcon from "@mui/icons-material/GitHub";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import { Link } from "react-router-dom";

import Logo from "../assets/logo-dark.png";

export default function NavbarComponent({ setOpenExamplesDialog }) {
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
              mr: 3,
              "&:hover": {
                filter: "drop-shadow(0 0 4px #03DAC6)",
              },
            }}
          />
        </Link>
        <Box sx={{ flexGrow: 1 }}>
          <Button
            variant="text"
            onClick={() => setOpenExamplesDialog(true)}
            sx={{ color: "white", display: "block" }}
          >
            Examples
          </Button>
        </Box>
        <Tooltip title="GitHub">
          <IconButton
            size="large"
            edge="end"
            href="https://github.com/REmatchChile"
            target="_blank"
            rel="noreferrer"
          >
            <GitHubIcon />
          </IconButton>
        </Tooltip>
      </Toolbar>
    </AppBar>
  );
}
