import React from "react";

import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";

const Window = ({ name, children }) => {
  return (
    <Paper
      elevation={4}
      sx={{
        flex: "1 1 auto",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <Box sx={{ flex: "0 0 0" }}>
        <Box
          sx={{
            userSelect: "none",
            pl: "12px",
            py: "4px",
            fontSize: ".75rem",
            fontFamily: "'Roboto Mono', monospace",
          }}
        >
          {name}
        </Box>
        <Divider />
      </Box>
      <Box sx={{ flex: "1 1 auto", overflow: "auto" }}>{children}</Box>
    </Paper>
  );
};

export default Window;
