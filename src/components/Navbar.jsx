import React from "react";

import GitHubIcon from "@mui/icons-material/GitHub";
import MenuIcon from "@mui/icons-material/Menu";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import { Link } from "react-router-dom";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Logo from "../assets/logo-dark.png";

const AppLogo = ({ height }) => (
  <Link to="/">
    <Box
      component="img"
      src={Logo}
      alt="REmatch"
      sx={{
        height,
        "&:hover": {
          filter: "drop-shadow(0 0 4px #03DAC6)",
        },
      }}
    />
  </Link>
);

const GithubButton = () => (
  <Tooltip title="GitHub">
    <IconButton
      size="medium"
      edge="end"
      href="https://github.com/REmatchChile"
      target="_blank"
      rel="noreferrer"
    >
      <GitHubIcon />
    </IconButton>
  </Tooltip>
);

const MenuButton = ({ setOpenExamplesDialog }) => {
  const [anchorElMenu, setAnchorElMenu] = React.useState(null);

  const handleOpenMenu = (event) => {
    setAnchorElMenu(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorElMenu(null);
  };

  return (
    <>
      <IconButton size="medium" edge="start" onClick={handleOpenMenu}>
        <MenuIcon />
      </IconButton>
      <Menu
        anchorEl={anchorElMenu}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        open={Boolean(anchorElMenu)}
        onClose={handleCloseMenu}
        keepMounted
        sx={{
          display: { md: "none", xs: "block" },
        }}
      >
        <MenuItem
          onClick={() => {
            setOpenExamplesDialog(true);
            handleCloseMenu();
          }}
        >
          Examples
        </MenuItem>
      </Menu>
    </>
  );
};

export default function NavbarComponent({ setOpenExamplesDialog }) {
  return (
    <AppBar position="static">
      {/* Desktop */}
      <Toolbar
        variant="regular"
        sx={{
          display: { md: "flex", xs: "none" },
          alignItems: "center",
          width: "100%",
        }}
      >
        <AppLogo height={32} />
        <Box sx={{ flexGrow: 1, ml: 2 }}>
          <Button
            variant="text"
            onClick={() => setOpenExamplesDialog(true)}
            sx={{ color: "white", display: "block" }}
          >
            Examples
          </Button>
        </Box>
        <GithubButton />
      </Toolbar>

      {/* Mobile */}
      <Toolbar
        variant="dense"
        sx={{
          display: { md: "none", xs: "flex" },
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <MenuButton setOpenExamplesDialog={setOpenExamplesDialog} />
        <AppLogo height={24} />
        <GithubButton />
      </Toolbar>
    </AppBar>
  );
}
