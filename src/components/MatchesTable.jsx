import React, { useState, useEffect, useMemo } from "react";

import {
  Box,
  List,
  ListItem,
  ListItemButton,
  TableCell,
  Divider,
  Pagination,
  TableRow,
  TableBody,
  Table,
  TableContainer,
  Typography,
} from "@mui/material";

const ROWS_PER_PAGE = 25;
const MAX_GROUP_CHARS = 96;

const renderGroupStr = (groupStr) => {
  const res = [];
  [...groupStr].map((ch, idx) => {
    if (ch === "\n") {
      res.push(
        <span key={idx} className="match-table-char match-table-newline">
          {" "}
        </span>
      );
    } else if (ch === " ") {
      res.push(
        <span key={idx} className="match-table-char match-table-space">
          {" "}
        </span>
      );
    } else {
      res.push(ch);
    }
  });
  return res;
};

const MatchesTable = ({ matches, variables, doc, addMarks }) => {
  const [page, setPage] = useState(1);

  const rows = useMemo(() => {
    const pageStart = (page - 1) * ROWS_PER_PAGE;
    const pageEnd = page * ROWS_PER_PAGE;
    return matches.slice(pageStart, pageEnd).map((match, idxMatch) => ({
      index: pageStart + idxMatch,
      spans: match,
      groups: match.map((span) => {
        const maxEnd = span[0] + MAX_GROUP_CHARS;
        let group;
        if (span[1] <= maxEnd) {
          group = doc.substring(span[0], span[1]);
        } else {
          group = doc.substring(span[0], maxEnd) + "…";
        }
        return group;
      }),
    }));
  }, [page, matches, variables]);

  const handleRowClick = (spans) => {
    addMarks(spans);
  };

  useEffect(() => {
    setPage(1);
  }, [variables]);

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <List sx={{ flex: "1 1 auto", overflow: "auto", p: 0 }}>
        {rows.length ? (
          rows.map((row, rowIdx) => (
            <React.Fragment key={rowIdx}>
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => handleRowClick(row.spans)}
                  sx={{ p: 1, gap: 1 }}
                >
                  <TableContainer sx={{ overflow: "hidden", px: 1 }}>
                    <Table
                      size="small"
                      sx={{
                        "& .MuiTableRow-root:nth-of-type(even)": {
                          background: "rgba(0,0,0,.3)",
                        },
                        "& .MuiTableCell-root ": {
                          borderBottom: "none",
                          fontFamily: "'Roboto Mono', monospace",
                        },
                      }}
                    >
                      <TableBody className="match-table">
                        <TableRow>
                          <TableCell
                            colSpan={3}
                            sx={{ color: "text.secondary", p: 0.5 }}
                          >{`Match ${row.index}`}</TableCell>
                        </TableRow>
                        {variables.map((variable, varIdx) => (
                          <TableRow key={varIdx}>
                            <TableCell
                              width={1}
                              align="left"
                              className={`match-table-cell-variable match-table-cell-variable-${varIdx}`}
                            >
                              {variable}
                            </TableCell>
                            <TableCell
                              width={1}
                              align="left"
                              className="match-table-cell-span"
                            >{`${row.spans[varIdx][0]}-${row.spans[varIdx][1]}`}</TableCell>
                            <TableCell
                              align="left"
                              className="match-table-cell-group"
                            >
                              {renderGroupStr(row.groups[varIdx])}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </ListItemButton>
              </ListItem>
              <Divider variant="middle" />
            </React.Fragment>
          ))
        ) : (
          <Box
            sx={{
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography variant="body1" component="p" color="text.secondary">
              No matches found
            </Typography>
          </Box>
        )}
      </List>
      <Divider />
      <Box
        sx={{
          flex: "0 0 0",
          userSelect: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          py: 1.5,
        }}
      >
        <Pagination
          page={page}
          onChange={(event, value) => setPage(value)}
          count={Math.ceil(matches.length / ROWS_PER_PAGE)}
        />
      </Box>
    </Box>
  );
};

export default MatchesTable;
