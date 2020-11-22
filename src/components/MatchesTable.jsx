import React, { useState, useEffect } from 'react';

import Pagination from '@material-ui/lab/Pagination';
import Button from '@material-ui/core/Button';
import Backdrop from '@material-ui/core/Backdrop';

import GetApp from '@material-ui/icons/GetApp';

const MatchesTable = ({
  matches,
  schema,
  textEditor,
  addMarks,
  clearMarks
}) => {
  const [state, setState] = useState({
    page: 0,
    rowsPerPage: 12,
    open: false,
  });

  const handleChangePage = (_, newPage) => {
    setState(prevState => ({ ...prevState, page: newPage - 1 }));
  }

  const handleMarkText = (row) => {
    clearMarks();
    addMarks(row);
  }

  const download = (content, filename) => {
    let element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  const exportCSV = () => {
    let curr;
    let CSVString = schema.join(',') + '\n';
    let text;
    matches.forEach((match) => {
      curr = []
      match.forEach((span) => {
        text = textEditor.getRange(textEditor.posFromIndex(span[0]), textEditor.posFromIndex(span[1]))
        curr.push(text.replaceAll(/\r?\n/g, '\\n'));
      })
      CSVString += curr.join(',') + '\n';
    })

    download(CSVString, `REmatch-${Date.now()}.csv`);
  }

  useEffect(() => {
    if (matches.length === 0) {
      setState(prevState => ({ ...prevState, page: 0 }));
    }
  }, [matches]);

  const exportJSON = () => {
    let curr;
    let JSONString = '[\n';
    let text;
    matches.forEach((match) => {
      curr = []
      match.forEach((span, idx) => {
        text = `\t\t'${schema[idx]}': '${textEditor.getRange(textEditor.posFromIndex(span[0]), textEditor.posFromIndex(span[1]))}'`;
        curr.push(text.replaceAll(/\r?\n/g, '\\n'));
      });
      JSONString += '\t{\n'
      JSONString += curr.join(',\n')
      JSONString += '\n\t},\n'
    })
    JSONString += ']'
    download(JSONString, `REmatch-${Date.now()}.json`);
  }

  useEffect(() => {
    if (matches.length === 0) {
      setState(prevState => ({ ...prevState, page: 0 }));
    }
  }, [matches]);

  return (
    <>
      <Backdrop
        open={state.open}
        onClick={() => setState(prevState => ({ ...prevState, open: false }))}
        className="backdrop">
        <Button
          color="primary"

          startIcon={
            <svg className="svgIcon" viewBox="0 0 24 24">
              <path fill="currentColor" d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2M18 20H6V4H13V9H18V20M10 19L12 15H9V10H15V15L13 19H10" />
            </svg>
          }
          // src=https://materialdesignicons.com/
          size="large"
          variant="contained"
          onClick={exportCSV}>
          Export as CSV
        </Button>
        <Button
          color="secondary"
          startIcon={
            // src=https://materialdesignicons.com/
            <svg className="svgIcon" viewBox="0 0 24 24">
              <path fill="currentColor" d="M5,3H7V5H5V  10A2,2 0 0,1 3,12A2,2 0 0,1 5,14V19H7V21H5C3.93,20.73 3,20.1 3,19V15A2,2 0 0,0 1,13H0V11H1A2,2 0 0,0 3,9V5A2,2 0 0,1 5,3M19,3A2,2 0 0,1 21,5V9A2,2 0 0,0 23,11H24V13H23A2,2 0 0,0 21,15V19A2,2 0 0,1 19,21H17V19H19V14A2,2 0 0,1 21,12A2,2 0 0,1 19,10V5H17V3H19M12,15A1,1 0 0,1 13,16A1,1 0 0,1 12,17A1,1 0 0,1 11,16A1,1 0 0,1 12,15M8,15A1,1 0 0,1 9,16A1,1 0 0,1 8,17A1,1 0 0,1 7,16A1,1 0 0,1 8,15M16,15A1,1 0 0,1 17,16A1,1 0 0,1 16,17A1,1 0 0,1 15,16A1,1 0 0,1 16,15Z" />
            </svg>
          }
          size="large"
          variant="contained"
          onClick={exportJSON}>
          Export as JSON
        </Button>
      </Backdrop>
      <div className="headContainer">
        <div className="matchesRow">
          {(matches.length > 0) ? <div className="matchesIdx">id</div> : null}
          {(matches.length > 0) ? schema.map((variable, schIdx) => (
            <div key={schIdx} className={`cm-m${schIdx} matchesItem`}>{variable}</div>
          )) : <div className="matchesRow">
              <div className="matchesItem">
                No matches.
              </div>
            </div>}
        </div>
      </div>
      <div className="matchesContainer">
        {(state.rowsPerPage > 0
          ? matches.slice(
            state.page * state.rowsPerPage,
            state.page * state.rowsPerPage + state.rowsPerPage)
          : matches).map((row, idxRow) => (
            <div
              key={idxRow}
              className="matchesRow"
              onClick={() => handleMarkText(row)}>
              <div className="matchesIdx">{state.page*state.rowsPerPage + idxRow}</div>
              {row.map((col, idxCol) => {
                return (
                  <div key={idxCol} className="matchesItem">
                    {textEditor
                      .getRange(textEditor.posFromIndex(col[0]), textEditor.posFromIndex(col[1]))
                      .replaceAll(' ', '␣')
                      .replaceAll(/\r?\n/g, '¬')}
                  </div>)
              })}
            </div>))}

      </div>
      <div className="paginationContainer">
        <Pagination
          page={state.page + 1}
          style={{ display: 'block' }}
          count={Math.ceil(matches.length / state.rowsPerPage)}
          onChange={handleChangePage}
        />
      </div>

      <Button
        disabled={(matches.length === 0)}
        color="primary"
        variant="text"
        size="small"
        startIcon={<GetApp />}
        onClick={() => setState(prevState => ({ ...prevState, open: true }))}
        className="fullButton">
        Export matches
      </Button>
    </>
  )
}

export default MatchesTable;