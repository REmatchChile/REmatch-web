import React, { useCallback } from "react";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import DataObjectIcon from "@mui/icons-material/DataObject";
import GitHubIcon from "@mui/icons-material/GitHub";
import EmojiObjectsIcon from '@mui/icons-material/EmojiObjects';
import HelpIcon from "@mui/icons-material/Help";
import LightModeIcon from "@mui/icons-material/LightMode";
import MenuIcon from "@mui/icons-material/Menu";
import PeopleIcon from "@mui/icons-material/People";
import SchoolIcon from "@mui/icons-material/School";
import {
  AppBar,
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ThemeProvider,
  Toolbar,
  Tooltip,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import Logo from "../assets/logo-dark.png";
import { MUIWrapperContext } from "./MUIWrapper";
import { darkTheme } from "../mui/themes";

const AppLogo = ({ width, onClick }) => (
  <Box
    onClick={onClick}
    component="img"
    src={Logo}
    alt="REmatch"
    sx={{
      width: { sm: 200, xs: 160 },
      cursor: "pointer",
      "&:hover": {
        filter: "drop-shadow(#03DAC6 0 0 4px)",
      },
    }}
  />
);

const MenuButton = ({ onClick }) => {
  return (
    <Tooltip title="Menu">
      <IconButton
        size="medium"
        onClick={onClick}
        edge="start"
        sx={{ display: { sm: "none", xs: "flex" } }}
      >
        <MenuIcon />
      </IconButton>
    </Tooltip>
  );
};

const GithubButton = () => (
  <Tooltip title="GitHub">
    <IconButton
      size="medium"
      href="https://github.com/REmatchChile"
      target="_blank"
      rel="noreferrer"
    >
      <GitHubIcon />
    </IconButton>
  </Tooltip>
);

const ToggleColorModeButton = () => {
  const muiUtils = React.useContext(MUIWrapperContext);
  return (
    <Tooltip title={muiUtils.getMode() === "light" ? "Go Dark" : "Go Light"}>
      <IconButton size="medium" onClick={muiUtils.toggleColorMode} edge="end">
        {muiUtils.getMode() === "light" ? <DarkModeIcon /> : <LightModeIcon />}
      </IconButton>
    </Tooltip>
  );
};

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
              color: active ? "primary.main" : "text.primary",
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
    <ThemeProvider theme={darkTheme}>
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
              pl: { sm: 0, xs: 1 },
            }}
          >
            <AppLogo onClick={() => navigate("/")} />
          </Box>
          <GithubButton />
          <ToggleColorModeButton />
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
            IconComponent={HelpIcon}
            primary="What is REmatch?"
            path="/what-is-rematch"
            handleNavigate={handleNavigate}
            location={location}
          />
          <DrawerNavigationListItem
            open={openDrawer}
            handleDrawerClose={handleDrawerClose}
            IconComponent={EmojiObjectsIcon}
            primary="Examples"
            path="/examples"
            handleNavigate={handleNavigate}
            location={location}
          />
          <DrawerNavigationListItem
            open={openDrawer}
            handleDrawerClose={handleDrawerClose}
            IconComponent={SchoolIcon}
            primary="REQL Tutorial"
            path="/tutorial"
            handleNavigate={handleNavigate}
            location={location}
          />
          <DrawerNavigationListItem
            open={openDrawer}
            handleDrawerClose={handleDrawerClose}
            IconComponent={PeopleIcon}
            primary="About us"
            path="/about-us"
            handleNavigate={handleNavigate}
            location={location}
          />

        </List>
      </Drawer>
    </ThemeProvider>
  );
}
