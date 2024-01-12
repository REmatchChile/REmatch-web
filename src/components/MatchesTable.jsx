import React, { useState, useEffect, forwardRef } from "react";

import Pagination from "@mui/material/Pagination";
import Button from "@mui/material/Button";
import Backdrop from "@mui/material/Backdrop";

function MatchesTable(props) {
  const { matches, schema, textEditor, addMarks, clearMarks } = props;

  const [state, setState] = useState({
    page: 0,
    rowsPerPage: 12,
  });

  const handleChangePage = (_, newPage) => {
    setState((prevState) => ({ ...prevState, page: newPage - 1 }));
  };

  const handleMarkText = (row) => {
    clearMarks();
    addMarks(row);
  };

  useEffect(() => {
    if (matches.length === 0) {
      setState((prevState) => ({ ...prevState, page: 0 }));
    }
  }, [matches]);

  useEffect(() => {
    if (matches.length === 0) {
      setState((prevState) => ({ ...prevState, page: 0 }));
    }
  }, [matches]);

  return (
    <>
      <div className="headContainer">
        <div className="matchesRow">
          {matches.length > 0 ? <div className="matchesIdx">id</div> : null}
          {matches.length > 0 ? (
            schema.map((variable, schIdx) => (
              <div key={schIdx} className={`cm-m${schIdx} matchesItem`}>
                {variable}
              </div>
            ))
          ) : (
            <div className="matchesRow">
              <div className="matchesItem">No matches.</div>
            </div>
          )}
        </div>
      </div>
      <div className="matchesContainer">
        {(state.rowsPerPage > 0
          ? matches.slice(
              state.page * state.rowsPerPage,
              state.page * state.rowsPerPage + state.rowsPerPage
            )
          : matches
        ).map((row, idxRow) => (
          <div
            key={idxRow}
            className="matchesRow"
            onClick={() => handleMarkText(row)}
          >
            <div className="matchesIdx">
              {state.page * state.rowsPerPage + idxRow}
            </div>
            {row.map((col, idxCol) => {
              return (
                <div key={idxCol} className="matchesItem">
                  {textEditor
                    .getRange(
                      textEditor.posFromIndex(col[0]),
                      textEditor.posFromIndex(col[1])
                    )
                    .replaceAll(/\r?\n/g, "¬")}
                </div>
              );
            })}
          </div>
        ))}
      </div>
      <div className="paginationContainer">
        <Pagination
          page={state.page + 1}
          style={{ display: "block" }}
          count={Math.ceil(matches.length / state.rowsPerPage)}
          onChange={handleChangePage}
        />
      </div>
    </>
  );
}

export default forwardRef(MatchesTable);
