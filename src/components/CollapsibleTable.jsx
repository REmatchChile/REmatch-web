import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import Pagination from '@material-ui/lab/Pagination';

function Row({ row, width, addMarks, clearMarks, span }) {
  const [open, setOpen] = useState(false);

  const { span: rowSpan, ...rowData } = row;

  const entries = Object.entries(rowData).filter(([, value]) => value && value.value !== undefined);
  const truncatedKey = entries[0][1].value.length > 5 ? `${entries[0][1].value.substring(0, 5)}...` : entries[0][1].value;
  const truncatedValues = entries.slice(1).map(([key, value]) =>
    value.value.length > 5 ? `${value.value.substring(0, 5)}...` : value.value
  );

  const handleRowClick = () => {
    clearMarks();
    if (span && Array.isArray(span)) {
      addMarks(span);
    }
  };

  return (
    <>
      <TableRow sx={{ '& > *': { borderBottom: 'unset', flex: 1 } }}>
  <TableCell>
    <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
      {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
    </IconButton>
  </TableCell>

  <TableCell component="th" scope="row" sx={{ flex: 1 }}>
    {truncatedKey}
  </TableCell>

  {truncatedValues.map((value, index) => (
    <TableCell key={index} sx={{ flex: 1 }}>
      {value.length > 5 ? `${value.substring(0, 5)}...` : value}
    </TableCell>
  ))}
</TableRow>

      {open && (
        <TableRow>
          <TableCell colSpan={entries.length + 2}>
            <Box sx={{ margin: 1 }}>
              <Table size="small" aria-label="matches">
                <TableHead>
                  <TableRow>
                    <TableCell />
                    <TableCell>Variable</TableCell>
                    <TableCell>Value</TableCell>
                    <TableCell>Span</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {entries.map(([key, value], index) => (
                    <TableRow key={index}>
                      <TableCell></TableCell>
                      <TableCell onClick={() => handleRowClick()} className={`cm-m${index} matchesItem`}>{key}</TableCell>
                      <TableCell onClick={() => handleRowClick()}>{value.value}</TableCell>
                      <TableCell onClick={() => handleRowClick()}>
                        {span && span[index] && span[index].map((s, idx) => (
                          <span key={idx}>{`${s} `}</span>
                        ))}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}

Row.propTypes = {
  row: PropTypes.shape({
    key: PropTypes.string.isRequired,
    values: PropTypes.arrayOf(PropTypes.string).isRequired,
    preview: PropTypes.string.isRequired,
    width: PropTypes.number.isRequired,
    span: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)), // Added propType for span
  }).isRequired,
  addMarks: PropTypes.func.isRequired,
  clearMarks: PropTypes.func.isRequired,
};

export default function CollapsibleTable({ matches, schema, textEditor, addMarks, clearMarks, handleMarkText }) {
  const [state, setState] = useState({
    page: 0,
    rowsPerPage: 7,
    open: false,
  });
  const { page, rowsPerPage } = state;

  if (matches.length === 0) {
    return null;
  }

  const ROW_WIDTH = 100 / matches.length;

  const data = matches.map((match) => {
    const obj = {};

    match.forEach((span, idx) => {
      const value = textEditor.getRange(
        textEditor.posFromIndex(span[0]),
        textEditor.posFromIndex(span[1])
      );
      obj[schema[idx]] = {
        value,
        span,
      };
    });

    return { ...obj, key: match.join('_'), span: match };
  });

  const handleChangePage = (_, newPage) => {
    setState((prevState) => ({ ...prevState, page: newPage - 1 }));
  };

  const startIndex = page * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedData = data.slice(startIndex, endIndex);

  return (
    <Paper>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />
            {schema.map((variable, schIdx) => (
              <TableCell key={variable} className={`cm-m${schIdx} matchesItem`}>
                {variable}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {paginatedData.map((row, index) => (
            <Row
              key={index}
              row={row}
              width={ROW_WIDTH}
              addMarks={addMarks}
              clearMarks={clearMarks}
              handleMarkText={handleMarkText}
              span={row.span}
            />
          ))}
        </TableBody>
      </Table>
      <div className="paginationContainer">
        <Pagination
          page={page + 1}
          style={{ display: 'block' }}
          count={Math.ceil(data.length / rowsPerPage)}
          onChange={handleChangePage}
        />
      </div>
    </Paper>
  );
}
