import React from "react";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        flex: "1 1 auto",
        gap: 3,
      }}
    >
      <Typography variant="h4" textAlign={"center"}>
        Page not found 😿
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Button variant="outlined" onClick={() => navigate("/")}>
          Go back to home
        </Button>
      </Box>
    </Box>
  );
};

export default NotFound;
