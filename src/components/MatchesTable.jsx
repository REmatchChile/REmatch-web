import React, { useState, useEffect } from "react";

import Box from "@mui/material/Box";
import Pagination from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";
import {
  DataGrid,
  gridPageCountSelector,
  gridPageSelector,
  useGridApiContext,
  useGridSelector,
} from "@mui/x-data-grid";

const CustomPagination = () => {
  const apiRef = useGridApiContext();
  const page = useGridSelector(apiRef, gridPageSelector);
  const pageCount = useGridSelector(apiRef, gridPageCountSelector);
  return (
    <Pagination
      sx={{ margin: "auto" }}
      page={page + 1}
      count={pageCount}
      renderItem={(props2) => <PaginationItem {...props2} />}
      onChange={(event, value) => apiRef.current.setPage(value - 1)}
    />
  );
};

const MatchesTable = (props) => {
  const { matches, schema, textEditor, addMarks, clearMarks } = props;
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);

  const handleRowClick = (params) => {
    console.log(params.row.matchData);
    clearMarks();
    addMarks(params.row.matchData);
  };

  useEffect(() => {
    setColumns(
      schema.length
        ? [
            {
              field: "id",
              headerName: "Index",
              cellClassName: "MuiDataGrid-index-column"
            },
            ...schema.map((name, idx) => ({
              field: `var-${idx}`,
              headerName: `!${name}`,
              flex: 1,
            })),
          ]
        : []
    );
  }, [schema]);

  useEffect(() => {
    setRows(
      matches.map((match, idxMatch) => {
        const res = { id: idxMatch, matchData: match };
        match.forEach((span, idxSpan) => {
          res[`var-${idxSpan}`] = textEditor.getRange(
            textEditor.posFromIndex(span[0]),
            textEditor.posFromIndex(span[1])
          );
        });
        return res;
      })
    );
  }, [matches]);

  return (
    <Box sx={{ height: 400, width: "100%" }}>
      <DataGrid
        onRowClick={handleRowClick}
        sx={{
          columnSeparator: "none",
        }}
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 25,
            },
          },
        }}
        density="compact"
        pageSizeOptions={[50]}
        slots={{
          pagination: CustomPagination,
        }}
        hideFooterSelectedRowCount
      />
    </Box>
  );
};

export default MatchesTable;
