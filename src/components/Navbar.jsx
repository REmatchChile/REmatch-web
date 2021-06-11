import React from 'react';

import { Link } from 'react-router-dom';

import { withStyles } from '@material-ui/core/styles';
import NestedMenuItem from "material-ui-nested-menu-item";
import { Menu, MenuItem, Typography } from "@material-ui/core";
import { ListItemIcon, ListItemText } from "@material-ui/core";

import FilterVintageIcon from '@material-ui/icons/FilterVintage';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import ComputerIcon from '@material-ui/icons/Computer';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';

import Logo from '../assets/logo-dark.png';

const StyledMenu = withStyles({
  paper: {
    border: '1px solid #d3d4d5',
  },
})((props) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'center',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'center',
    }}
    {...props}
  />
));

const StyledMenuItem = withStyles((theme) => ({
  root: {
    '&:focus': {
      backgroundColor: theme.palette.primary.main,
      '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
        color: theme.palette.common.white
      },
    },
  },
}))(MenuItem);

const StyledNestedMenuItem = withStyles({
  paper: {
    border: '1px solid #d3d4d5',
  },
})((props) => (
  <NestedMenuItem
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'center',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'center',
    }}
    {...props}
  />
));

export default function NavbarComponent() {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const [menuPosition, setMenuPosition] = React.useState(null);

  const handleItemClick = (event) => {
    setMenuPosition(null);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const setExample = () => {
    const queryEditor = document.getElementById('queryEditor')
    queryEditor.value = 'nani'
  };

  return (
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
      <Button
        aria-controls="customized-menu"
        aria-haspopup="true"
        color="primary"
        size="large"
        onClick={handleClick}
      >
        Examples
      </Button>
      
      <StyledMenu
        id="customized-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <StyledNestedMenuItem
        label={<div class="MuiListItemIcon-root"><div class="MuiListItemIcon-root"><FilterVintageIcon fontSize="small"/></div><div class="MuiListItemIcon-root">Biology</div></div>}
        parentMenuOpen={!!anchorEl}
        onClick={handleItemClick}
        >
          <StyledMenuItem onClick={setExample}>BioExample 1</StyledMenuItem>
          <StyledMenuItem onClick={setExample}>BioExample 2</StyledMenuItem>
          <StyledMenuItem onClick={setExample}>BioExample 3</StyledMenuItem>
        </StyledNestedMenuItem>
        <StyledNestedMenuItem
        label={<div class="MuiListItemIcon-root"><div class="MuiListItemIcon-root"><MenuBookIcon fontSize="small"/></div><div class="MuiListItemIcon-root">Literature</div></div>}
        parentMenuOpen={!!anchorEl}
        onClick={handleItemClick}
        >
          <StyledMenuItem onClick={setExample}>Literature Example 1</StyledMenuItem>
          <StyledMenuItem onClick={setExample}>Literature Example 2</StyledMenuItem>
          <StyledMenuItem onClick={setExample}>Literature Example 3</StyledMenuItem>
        </StyledNestedMenuItem>
        <StyledNestedMenuItem
        label={<div class="MuiListItemIcon-root"><div class="MuiListItemIcon-root"><ComputerIcon fontSize="small"/></div><div class="MuiListItemIcon-root">Computer Science</div></div>}
        parentMenuOpen={!!anchorEl}
        onClick={handleItemClick}
        >
          <StyledMenuItem onClick={setExample}>Nice Example 1</StyledMenuItem>
          <StyledMenuItem onClick={setExample}>Nicest Example 2</StyledMenuItem>
          <StyledMenuItem onClick={setExample}>Nice Nicest Example 3</StyledMenuItem>
        </StyledNestedMenuItem>
        <StyledMenuItem style={{display: "none"}}>
          <ListItemIcon></ListItemIcon>
        </StyledMenuItem>
      </StyledMenu>
    </Toolbar>
  </AppBar>
  )
};