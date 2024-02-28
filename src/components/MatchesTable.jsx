import React, { useState, useEffect } from "react";

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
      sx={{ margin: "auto", userSelect: "none" }}
      page={page + 1}
      count={pageCount}
      renderItem={(props2) => <PaginationItem {...props2} />}
      onChange={(event, value) => apiRef.current.setPage(value - 1)}
    />
  );
};

const MatchesTable = (props) => {
  const { matches, variables, doc, addMarks } = props;
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);

  const handleRowClick = (params) => {
    addMarks(params.row.matchData);
  };

  useEffect(() => {
    setColumns(
      variables.length
        ? [
            {
              field: "id",
              headerName: "Index",
              cellClassName: "MuiDataGrid-index-column",
            },
            ...variables.map((name, idx) => ({
              field: `var-${idx}`,
              headerName: `!${name}`,
              flex: 1,
              minWidth: 100,
            })),
          ]
        : []
    );
  }, [variables]);

  useEffect(() => {
    setRows(
      matches.map((match, idxMatch) => {
        const res = { id: idxMatch, matchData: match };
        match.forEach((span, idxSpan) => {
          res[`var-${idxSpan}`] = doc
            .substring(span[0], span[1])
            .replace(/\n/g, "\\n");
        });
        return res;
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matches]);

  return (
    <DataGrid
      onRowClick={handleRowClick}
      rows={rows}
      columns={columns}
      initialState={{
        pagination: {
          paginationModel: {
            pageSize: 50,
          },
        },
      }}
      density="compact"
      slots={{
        pagination: CustomPagination,
      }}
      hideFooterSelectedRowCount
    />
  );
};

export default MatchesTable;
