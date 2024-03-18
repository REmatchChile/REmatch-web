import React, { useState, useEffect, useMemo, useCallback } from "react";

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
} from "@mui/material";
import { utf8Substring } from "../utils/utf8Substring";

const ROWS_PER_PAGE = 25;
const MAX_GROUP_CHARS = 96;

const MatchesTable = ({ matches, variables, doc, addMarks }) => {
  const [page, setPage] = useState(1);
  const [selectedMatchIndex, setSelectedMatchIndex] = useState(0);

  const renderGroupStr = (from, to) => {
    let group = utf8Substring(doc, from, to);
    if (group.length > MAX_GROUP_CHARS) {
      // Array slice to prevent splitting 2-byte UTF-16 characters
      group = Array.from(group).slice(0, MAX_GROUP_CHARS).join("") + "…";
    }
    return group.split("\n").map((lineStr, lineIdx) => (
      <React.Fragment key={lineIdx}>
        {lineIdx > 0 && (
          <span className="match-table-char match-table-newline"> </span>
        )}
        {lineStr.split(" ").map((wordStr, wordIdx) => (
          <React.Fragment key={wordIdx}>
            {wordIdx > 0 && (
              <span className="match-table-char match-table-space"> </span>
            )}
            {wordStr}
          </React.Fragment>
        ))}
      </React.Fragment>
    ));
  };

  const rows = useMemo(() => {
    // TODO: Optimize re-rendering
    const pageStart = (page - 1) * ROWS_PER_PAGE;
    const pageEnd = page * ROWS_PER_PAGE;
    return matches.slice(pageStart, pageEnd).map((match, idxMatch) => ({
      index: pageStart + idxMatch,
      spans: match,
    }));
    // eslint-disable-next-line
  }, [page, matches]);

  const handleRowClick = useCallback(
    (row) => {
      setSelectedMatchIndex(row.index);
    },
    [addMarks]
  );

  useEffect(() => {
    // Variables change on new queries, reset the component state
    setPage(1);
    setSelectedMatchIndex(0);
  }, [variables]);

  useEffect(() => {
    // Trigger the addMarks effect when the selected match value changes
    const selectedMatch = matches[selectedMatchIndex];
    if (selectedMatch && selectedMatch.length) {
      if (variables.length) {
        // Prevent error when trying to highlight no variables
        addMarks(selectedMatch);
      }
    }
    // eslint-disable-next-line
  }, [matches[selectedMatchIndex]]);

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <List sx={{ flex: "1 1 auto", overflowY: "auto", p: 0 }}>
        {rows.length ? (
          rows.map((row, rowIdx) => (
            <React.Fragment key={rowIdx}>
              <ListItem
                disablePadding
                sx={{
                  backgroundColor:
                    row.index === selectedMatchIndex ? "action.selected" : null,
                }}
              >
                <ListItemButton
                  onClick={() => handleRowClick(row)}
                  sx={{
                    p: 1,
                    gap: 1,
                  }}
                >
                  <TableContainer
                    sx={{
                      overflow: "hidden",
                      px: 1,
                    }}
                  >
                    <Table
                      size="small"
                      sx={{
                        "& .MuiTableRow-root:nth-of-type(even)": {
                          backgroundColor: "action.hover",
                        },
                        "& .MuiTableCell-root ": {
                          borderBottom: "none",
                          fontFamily: "monospace",
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
                              align="left"
                              className="match-table-cell-group"
                            >
                              {row.spans[varIdx].map(([from, to], spanIdx) => {
                                return (
                                  <Box key={spanIdx}>
                                    <Box className="span">{`(${from}-${to})`}</Box>
                                    <Box className="group">
                                      {renderGroupStr(from, to)}
                                    </Box>
                                    {spanIdx !==
                                      row.spans[varIdx].length - 1 && (
                                      <Divider />
                                    )}
                                  </Box>
                                );
                              })}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </ListItemButton>
              </ListItem>
              <Divider />
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
          ></Box>
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
