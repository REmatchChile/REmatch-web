import React from "react";

import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";

const DragHandle = ({ name, isStatic }) => {
  return (
    <Box
      className={!isStatic && "drag-handle"}
      variant="caption"
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
  );
};

const ResizableGridWindow = React.forwardRef(
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
        elevation={2}
        style={{ ...style }}
        className={className}
        ref={ref}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onTouchEnd={onTouchEnd}
        sx={{ display: "flex", flexDirection: "column" }}
        {...props}
      >
        <DragHandle
          name={props.name}
          isStatic={className.includes("static")}
        />
        <Divider />
        <Box
          sx={{
            flexGrow: 1,
            overflow: "scroll",
            borderBottomLeftRadius: "inherit",
            borderBottomRightRadius: "inherit",
          }}
        >
          {children}
        </Box>
      </Paper>
    );
  }
);

export default ResizableGridWindow;
