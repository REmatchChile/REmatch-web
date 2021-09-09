import AppBar from '@material-ui/core/AppBar';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';

import { withStyles } from '@material-ui/core/styles';
import { Menu, MenuItem, ListItemIcon, Badge } from "@material-ui/core";
import NestedMenuItem from "material-ui-nested-menu-item";

import GetApp from '@material-ui/icons/GetApp';
import InfoIcon from '@material-ui/icons/Info';
import Publish from '@material-ui/icons/Publish';
import FilterVintageIcon from '@material-ui/icons/FilterVintage';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import ComputerIcon from '@material-ui/icons/Computer';

import English from '../text/english';

import React, { useState } from 'react';

// TODO: Add literature examples
// TODO: Fix(english array): Key name's array

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

export default function CustomToolbar(props) {
  const { onImportFile, onSetExample, onExportMatches, canExport } = props;
  const [openDialog, setOpenDialog] = useState(false);
  const [exampleExplanation, setexampleExplanation] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [invisibleBadge, setInvisibleBadge] = useState(true);

  const handleClickOpenDialog = () => {
    setInvisibleBadge(true);
    setOpenDialog(true);
  }

  const handleClickCloseDialog = () => {
    setOpenDialog(false);
  }

  const handleShowExamples = (event) => {
    console.log("BEFORE: ", anchorEl);
    setAnchorEl(event.currentTarget);
    console.log("AFTER: ", anchorEl);
  }

  const setExample = (event) => {
    const exampleName = event.target.textContent;
    const example = English.examples.explanations[exampleName];
    setexampleExplanation(example);
    onSetExample(event); // We call parent function to set query and text
    setInvisibleBadge(false);
    setAnchorEl(null);
    console.log("ANCHOOOR: ", anchorEl);
  }
  
  return (
    <div>
      <AppBar position="static" className="appBar">
        <Toolbar className="toolbar">

          <div className="tools">
            <input accept="*" id="fileInput" type="file" className="invisible" onChange={onImportFile} />
            <Tooltip title="Import File" arrow>
              <label htmlFor="fileInput">
                <IconButton color="primary" className="toolbar-button" component="span">
                  <Publish fontSize="small" />
                </IconButton>
              </label>
            </Tooltip>
            <Tooltip title="Export Matches" arrow>
              <IconButton color="primary" className="toolbar-button" onClick={onExportMatches} disabled={canExport}>
                <GetApp fontSize="small" />
              </IconButton>
            </Tooltip>
          </div>

          <div className="examples">
            <Tooltip title="About the example" arrow>
              <IconButton color="primary" className="toolbar-button" onClick={handleClickOpenDialog} disabled={exampleExplanation === ''}>
                <Badge color="secondary" variant="dot" invisible={invisibleBadge}>
                  <InfoIcon fontSize="small" />
                </Badge>
              </IconButton>
            </Tooltip>
            <IconButton color="primary" className="toolbar-button" onClick={handleShowExamples}>
              Examples
            </IconButton>
          </div>

        </Toolbar>
      </AppBar>

      {/* DROPDOWN EXAMPLES*/}
      <StyledMenu
        id="customized-menu"
        anchorEl={anchorEl}
        open={!!anchorEl}
        onClose={ () => setAnchorEl(null) }
      >
        <StyledNestedMenuItem
        label={<div class="MuiListItemIcon-root"><div class="MuiListItemIcon-root"><FilterVintageIcon fontSize="small"/></div><div class="MuiListItemIcon-root">Biology</div></div>}
        parentMenuOpen={!!anchorEl}
        >
          <StyledMenuItem onClick={setExample}>BioExample1</StyledMenuItem>
          <StyledMenuItem onClick={setExample}>BioExample2</StyledMenuItem>
          <StyledMenuItem onClick={setExample}>BioExample3</StyledMenuItem>
        </StyledNestedMenuItem>
        <StyledNestedMenuItem
        label={<div class="MuiListItemIcon-root"><div class="MuiListItemIcon-root"><MenuBookIcon fontSize="small"/></div><div class="MuiListItemIcon-root">Literature</div></div>}
        parentMenuOpen={!!anchorEl}
        >
          <StyledMenuItem onClick={setExample}>Context Analysis</StyledMenuItem>
          <StyledMenuItem onClick={setExample}>Literature Example 2</StyledMenuItem>
          <StyledMenuItem onClick={setExample}>Literature Example 3</StyledMenuItem>
        </StyledNestedMenuItem>
        <StyledNestedMenuItem
        label={<div class="MuiListItemIcon-root"><div class="MuiListItemIcon-root"><ComputerIcon fontSize="small"/></div><div class="MuiListItemIcon-root">Computer Science</div></div>}
        parentMenuOpen={!!anchorEl}
        >
          <StyledMenuItem onClick={setExample}>Nice Example 1</StyledMenuItem>
          <StyledMenuItem onClick={setExample}>Nicest Example 2</StyledMenuItem>
          <StyledMenuItem onClick={setExample}>Nice Nicest Example 3</StyledMenuItem>
        </StyledNestedMenuItem>
        <StyledMenuItem style={{display: "none"}}>
          <ListItemIcon></ListItemIcon>
        </StyledMenuItem>
      </StyledMenu>

      <Dialog
          open={openDialog}
          onClose={handleClickCloseDialog}
          aria-labelledby="responsive-dialog-title"
          fullWidth={true}
          maxWidth='md'
          className="dialog"
        >
          <DialogTitle id="responsive-dialog-title">{"Example explanation"}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              <Typography variant="body1" align="justify">
                <div dangerouslySetInnerHTML={{__html:exampleExplanation}} />
              </Typography>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClickCloseDialog} color="primary" autoFocus>
              I get it
            </Button>
          </DialogActions>
        </Dialog>
    </div>
  );
};
