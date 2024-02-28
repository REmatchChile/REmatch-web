import React, { useCallback } from "react";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DataObjectIcon from "@mui/icons-material/DataObject";
import DescriptionIcon from "@mui/icons-material/Description";
import DeveloperBoardIcon from "@mui/icons-material/DeveloperBoard";
import GitHubIcon from "@mui/icons-material/GitHub";
import InfoIcon from "@mui/icons-material/Info";
import MenuIcon from "@mui/icons-material/Menu";
import SchoolIcon from "@mui/icons-material/School";
import { Divider, ListItemIcon, useMediaQuery, useTheme } from "@mui/material";
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
import { useLocation, useNavigate } from "react-router-dom";
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

const DrawerMenuListItem = ({ open, handleDrawerOpen, handleDrawerClose }) => {
  return (
    <ListItem disablePadding sx={{ display: "block" }}>
      <ListItemButton
        onClick={() => (open ? handleDrawerClose() : handleDrawerOpen())}
        sx={{
          justifyContent: open ? "initial" : "center",
          height: 48,
        }}
      >
        <ListItemIcon
          sx={{ minWidth: 0, mr: open ? 3 : 0, justifyContent: "center" }}
        >
          {open ? (
            <ArrowBackIcon color="inherit" />
          ) : (
            <MenuIcon color="inherit" />
          )}
        </ListItemIcon>
        <ListItemText
          primary="Close"
          sx={{ opacity: open ? 1 : 0, whiteSpace: "nowrap" }}
        />
      </ListItemButton>
    </ListItem>
  );
};

const DrawerNavigationListItem = ({
  open,
  IconComponent,
  primary,
  location,
  path,
  handleNavigate,
}) => {
  const active = location.pathname === path;
  return (
    <ListItem disablePadding sx={{ display: "block" }}>
      <ListItemButton
        onClick={() => handleNavigate(path)}
        sx={{
          justifyContent: open ? "initial" : "center",
          height: 48,
        }}
      >
        <ListItemIcon
          sx={{ minWidth: 0, mr: open ? 3 : 0, justifyContent: "center" }}
        >
          <IconComponent
            sx={{
              color: active
                ? "primary.main"
                : open
                ? "text.primary"
                : "text.disabled",
            }}
          />
        </ListItemIcon>
        <ListItemText
          primaryTypographyProps={{
            color: active ? "primary" : "text.primary",
          }}
          primary={primary}
          sx={{ opacity: open ? 1 : 0, whiteSpace: "nowrap" }}
        />
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
  const location = useLocation();

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
        <List disablePadding sx={{ overflowX: "hidden" }}>
          <DrawerMenuListItem
            open={openDrawer}
            handleDrawerClose={handleDrawerClose}
            handleDrawerOpen={handleDrawerOpen}
          />
          <Divider />
          <DrawerNavigationListItem
            open={openDrawer}
            handleDrawerClose={handleDrawerClose}
            IconComponent={DataObjectIcon}
            primary="REQL Editor"
            path="/"
            handleNavigate={handleNavigate}
            location={location}
          />
          <DrawerNavigationListItem
            open={openDrawer}
            handleDrawerClose={handleDrawerClose}
            IconComponent={DeveloperBoardIcon}
            primary="Examples"
            path="/examples"
            handleNavigate={handleNavigate}
            location={location}
          />
          <DrawerNavigationListItem
            open={openDrawer}
            handleDrawerClose={handleDrawerClose}
            IconComponent={SchoolIcon}
            primary="Tutorial"
            path="/tutorial"
            handleNavigate={handleNavigate}
            location={location}
          />
          <DrawerNavigationListItem
            open={openDrawer}
            handleDrawerClose={handleDrawerClose}
            IconComponent={DescriptionIcon}
            primary="Documentation"
            path="/documentation"
            handleNavigate={handleNavigate}
            location={location}
          />
          <DrawerNavigationListItem
            open={openDrawer}
            handleDrawerClose={handleDrawerClose}
            IconComponent={InfoIcon}
            primary="About us"
            path="/about-us"
            handleNavigate={handleNavigate}
            location={location}
          />
        </List>
      </Drawer>
    </>
  );
}
