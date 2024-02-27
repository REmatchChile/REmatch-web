import React, { useCallback } from "react";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CodeIcon from "@mui/icons-material/Code";
import GitHubIcon from "@mui/icons-material/GitHub";
import MenuIcon from "@mui/icons-material/Menu";
import PeopleIcon from "@mui/icons-material/People";
import SchoolIcon from "@mui/icons-material/School";
import {
  Divider,
  ListItemIcon,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/logo-dark.png";

const AppLogo = ({ width, onClick }) => (
  <Box
    onClick={onClick}
    component="img"
    src={Logo}
    alt="REmatch"
    sx={{
      width,
      cursor: "pointer",
      "&:hover": {
        filter: "drop-shadow(#03DAC6 0 0 4px)",
      },
    }}
  />
);

const MenuButton = ({ onClick }) => {
  return (
    <Tooltip title="Menu" sx={{ display: { sm: "none", xs: "flex" } }}>
      <IconButton size="large" edge="start" onClick={onClick}>
        <MenuIcon />
      </IconButton>
    </Tooltip>
  );
};

const GithubButton = () => (
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
);

const DrawerListItem = ({
  open,
  handleDrawerClose,
  icon,
  primary,
  onClick,
}) => {
  return (
    <ListItem disablePadding sx={{ display: "block" }}>
      <ListItemButton
        onClick={() => onClick()}
        sx={{
          justifyContent: open ? "initial" : "center",
          height: 48,
        }}
      >
        <ListItemIcon
          sx={{ minWidth: 0, mr: open ? 3 : 0, justifyContent: "center" }}
        >
          {icon}
        </ListItemIcon>
        <ListItemText primary={primary} sx={{ opacity: open ? 1 : 0, whiteSpace: "nowrap" }} />
      </ListItemButton>
    </ListItem>
  );
};

export default function NavbarComponent({
  handleDrawerClose,
  openDrawer,
  drawerWidth,
  handleDrawerOpen,
}) {
  const theme = useTheme();
  const isBreakpointBelowSm = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();

  const handleNavigate = useCallback(
    (path) => {
      handleDrawerClose();
      navigate(path);
    },
    [handleDrawerClose, navigate]
  );

  return (
    <>
      <AppBar
        position="static"
        sx={{
          ml: { sm: `${drawerWidth}px`, xs: 0 },
          width: { sm: `calc(100% -  ${drawerWidth}px)`, xs: "100%" },
          transition: "all .2s ease-in-out",
        }}
      >
        <Toolbar
          variant="regular"
          sx={{
            display: "flex",
            alignItems: "center",
            width: "100%",
          }}
        >
          <MenuButton
            onClick={() =>
              openDrawer ? handleDrawerClose() : handleDrawerOpen()
            }
          />
          <Box
            sx={{
              flexGrow: 1,
              display: "flex",
              justifyContent: { sm: "flex-start", xs: "center" },
            }}
          >
            <AppLogo width="200px" onClick={() => navigate("/")} />
          </Box>
          <GithubButton />
        </Toolbar>
      </AppBar>
      <Drawer
        variant={isBreakpointBelowSm ? "temporary" : "permanent"}
        anchor="left"
        open={openDrawer}
        sx={{
          width: { sm: `${drawerWidth}px`, xs: "80%" },
          flexShrink: 0,
          boxSizing: "border-box",
          "& .MuiDrawer-paper": {
            width: { sm: `${drawerWidth}px`, xs: "80%" },
            transition: { sm: "all .2s ease-in-out", xs: "inherit" },
          },
        }}
      >
        <List disablePadding sx={{ overflow: "hidden" }}>
          <DrawerListItem
            open={openDrawer}
            handleDrawerClose={handleDrawerClose}
            icon={openDrawer ? <ArrowBackIcon /> : <MenuIcon />}
            primary={openDrawer ? "Close" : "Menu"}
            onClick={() =>
              openDrawer ? handleDrawerClose() : handleDrawerOpen()
            }
          />
          <Divider />
          <DrawerListItem
            open={openDrawer}
            handleDrawerClose={handleDrawerClose}
            icon={<SchoolIcon />}
            primary="Tutorial"
            onClick={() => handleNavigate("/tutorial")}
          />
          <DrawerListItem
            open={openDrawer}
            handleDrawerClose={handleDrawerClose}
            icon={<CodeIcon />}
            primary="Documentation"
            onClick={() => handleNavigate("/documentation")}
          />
          <DrawerListItem
            open={openDrawer}
            handleDrawerClose={handleDrawerClose}
            icon={<PeopleIcon/>}
            primary="About us"
            onClick={() => handleNavigate("/about-us")}
          />
        </List>
      </Drawer>
    </>
  );
}
