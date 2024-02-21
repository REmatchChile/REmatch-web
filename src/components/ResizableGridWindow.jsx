import React from "react";

import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";

const CustomGridItemComponent = React.forwardRef(
  (
    {
      style,
      className,
      onMouseDown,
      onMouseUp,
      onTouchEnd,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <Paper
        key="a"
        elevation={2}
        style={{ ...style }}
        className={className}
        ref={ref}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onTouchEnd={onTouchEnd}
      >
        <Box className={!className.includes("static") && "drag-handle"} sx={{

        }}>
          Title
        </Box>
        {children}
      </Paper>
    );
  }
);

export default CustomGridItemComponent;
