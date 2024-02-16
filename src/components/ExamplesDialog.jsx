import React from "react";

import FilterAltIcon from "@mui/icons-material/FilterAlt";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import Divider from "@mui/material/Divider";
import InputAdornment from "@mui/material/InputAdornment";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import TextField from "@mui/material/TextField";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";

const EXAMPLES = [
  {
    title: "First and last name, line separated",
    description:
      "Match the first name and last name of each contributor of REmatch",
    pattern: "(^|\\n)!firstName{[A-Z][a-z]+} !lastName{([A-Z][a-z ]+)+}($|\\n)",
    document:
      "Nicolas Van Sint Jan\nVicente Calisto\nMarjorie Bascunan\nOscar Carcamo\nCristian Riveros\nDomagoj Vrgoc\nIgnacio Pereira\nKyle Bossonney\nGustavo Toro\n",
  },
  {
    title: "Get all matches, overlapping",
    description: 'Match all the ocurrences of the word "that"',
    pattern: "!x{that}",
    document: "thathathat",
  },
];

const FilterTextField = ({ onFilterChange }) => {
  return (
    <TextField
      onChange={onFilterChange}
      label="Filter"
      variant="outlined"
      placeholder="Type to filter"
      fullWidth
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <FilterAltIcon />
          </InputAdornment>
        ),
      }}
    />
  );
};

const NoMaxWidthTooltip = styled(({ className, ...props }) => (
  <Tooltip
    {...props}
    classes={{ popper: className }}
    placement="top-end"
    slotProps={{
      popper: {
        modifiers: [
          {
            name: "offset",
            options: {
              offset: [16, -24],
            },
          },
        ],
      },
    }}
    enterDelay={1}
    leaveDelay={1}
  />
))(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.palette.common.black,
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.black,
    maxWidth: "none",
    fontSize: "12px",
    fontFamily: "'Roboto Mono', monospace",
    userSelect: "none",
  },
}));

const ExamplesList = ({ examples, onExampleClick }) => {
  return (
    <Box sx={{ height: 600, width: "100%" }}>
      <List dense>
        {examples.map((example, index) => (
          <React.Fragment key={index}>
            <ListItem disablePadding>
              <NoMaxWidthTooltip title={example.pattern}>
                <ListItemButton onClick={() => onExampleClick(example)}>
                  <ListItemText
                    primary={example.title}
                    secondary={example.description}
                  />
                </ListItemButton>
              </NoMaxWidthTooltip>
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>
    </Box>
  );
};

const ExamplesDialog = ({ open, setOpen, onExampleClick }) => {
  const [examples, setExamples] = React.useState(EXAMPLES);

  const filterExamples = (input) => {
    const inputLower = input.toLowerCase();
    setExamples(
      EXAMPLES.filter(
        (example) =>
          example.title.toLowerCase().includes(inputLower) ||
          example.description.toLowerCase().includes(inputLower)
      )
    );
  };

  const onFilterChange = (event) => {
    filterExamples(event.target.value);
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
      <DialogTitle sx={{ pb: 0 }}>REQL Examples</DialogTitle>
      <Box sx={{ p: 2 }}>
        <FilterTextField onFilterChange={onFilterChange} />
        <ExamplesList examples={examples} onExampleClick={onExampleClick} />
      </Box>
    </Dialog>
  );
};

export default ExamplesDialog;
