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
import { Typography } from "@mui/material";

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

const ExamplesList = ({ examples, onExampleClick, setHoveredPattern }) => {
  return (
    <Box sx={{ height: 600, width: "100%" }}>
      <List>
        {examples.map((example, index) => (
          <React.Fragment key={index}>
            <ListItem
              disablePadding
              onMouseEnter={() => setHoveredPattern(example.pattern)}
              onMouseLeave={() => setHoveredPattern("")}
            >
              <ListItemButton onClick={() => onExampleClick(example)}>
                <ListItemText
                  primary={example.title}
                  secondary={example.description}
                />
              </ListItemButton>
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
  const [hoveredPattern, setHoveredPattern] = React.useState("");

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
    <Dialog
      open={open}
      onClose={() => {
        setOpen(false);
        setHoveredPattern("");
      }}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>REQL Examples</DialogTitle>
      <Typography
        component="span"
        color="text.secondary"
        variant="caption"
        sx={{ userSelect: "none", ml: 2 }}
      >
        REQL query preview
      </Typography>
      <Box
        sx={{
          textAlign: "center",
          py: 2,
          mx: 2,
          my: 1,
          borderRadius: "4px",
          fontSize: "1rem",
          background: "rgba(18, 18, 18, 0.64)",
          fontFamily: "'Roboto Mono', monospace",
        }}
      >
        {hoveredPattern || "..."}
      </Box>
      <Box sx={{ p: 2 }}>
        <FilterTextField onFilterChange={onFilterChange} />
        <ExamplesList
          examples={examples}
          onExampleClick={onExampleClick}
          setHoveredPattern={setHoveredPattern}
        />
      </Box>
    </Dialog>
  );
};

export default ExamplesDialog;
