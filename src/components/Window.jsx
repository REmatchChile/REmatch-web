import React from "react";

import { Paper, Box, Divider } from "@mui/material";

const Window = ({ name, children, headerText, headerStatus }) => {
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
            px: 1.5,
            py: .5,
            fontSize: ".75rem",
            fontFamily: "monospace",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            height: "2.5rem",
          }}
        >
          {headerText}
          {headerStatus}
        </Box>
        <Divider />
      </Box>
      <Box sx={{ flex: "1 1 auto", overflow: "auto" }}>{children}</Box>
    </Paper>
  );
};

export default Window;
