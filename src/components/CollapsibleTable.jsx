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
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  hovered: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
  },
}));


function Row({ row, width, addMarks, clearMarks, span, index }) {
  //console.log(width)

  //const MAX_CHARS = Math.floor(width * (3/4) );
  const MAX_CHARS =  Math.floor(width);
  //console.log(MAX_CHARS)
  const [open, setOpen] = useState(false);

  const [isHovered, setIsHovered] = useState(false);

  const { span: rowSpan, ...rowData } = row;

  const classes = useStyles();

  const entries = Object.entries(rowData).filter(([, value]) => value && value.value !== undefined);
  const truncatedKey = entries[0][1].value.length > MAX_CHARS ? `${entries[0][1].value.substring(0, MAX_CHARS)}...` : entries[0][1].value;
  const truncatedValues = entries.slice(1).map(([key, value]) =>
    value.value.length > MAX_CHARS ? `${value.value.substring(0, MAX_CHARS)}...` : value.value
  );

  const handleMouseEnter = () => {
    setIsHovered(true);
    // Perform any action or call any function when the cursor enters the desired part
    console.log("hola");
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    // Perform any action or call any function when the cursor leaves the desired part
    console.log("adios");
  };

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
          {index} {/* Add index as ID */}
  </TableCell>

  <TableCell component="th" scope="row" sx={{ flex: 1 }}>
    {truncatedKey}
  </TableCell>

  {truncatedValues.map((value, index) => (
    <TableCell key={index} sx={{ flex: 1 }}>
      {value.length > MAX_CHARS ? `${value.substring(0, MAX_CHARS)}...` : value}
    </TableCell>
  ))}
</TableRow>

{open && (
  <TableRow
  key={index}
  className={isHovered ? classes.hovered : ''}
  onMouseEnter={handleMouseEnter}
  onMouseLeave={handleMouseLeave}
  onClick={() => handleRowClick()}
>
    <TableCell colSpan={entries.length + 2}>
      <Box sx={{ margin: 1 }}>
        <Table size="small" aria-label="matches">
          <TableHead>
            <TableRow>
              <TableCell style={{ textAlign: 'left' }}>Variable</TableCell>
              <TableCell style={{ textAlign: 'left' }}>Value</TableCell>
              <TableCell style={{ textAlign: 'left' }}>Span</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
  {entries.map(([key, value], index) => (
    <TableRow key={index} >
      <TableCell
        onClick={() => handleRowClick()}
        className={`cm-m${index} matchesItem`}
        style={{ textAlign: 'left' }}
      >
          {key}
      </TableCell>
      <TableCell onClick={() => handleRowClick()} style={{ textAlign: 'left' }}>
        {value.value}
      </TableCell>
      <TableCell onClick={() => handleRowClick()} style={{ textAlign: 'left' }}>
        {span && span[index] && (
          <span>
            {`[${span[index][0]}, ${span[index][1]}${span[index].length > 2 ? ']' : '>'}`}
          </span>
        )}
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

  //console.log("schema", schema);
  //console.log("matches", matches.length);
  const ROW_WIDTH = 100 / schema.length;

  //console.log("ROW_WIDTH", ROW_WIDTH);

  const data = matches.map((match, idxs) => {
    const obj = {};
    //console.log(idxs) MATCH
    match.forEach((span, idx) => {
      const value = textEditor.getRange(
        textEditor.posFromIndex(span[0]),
        textEditor.posFromIndex(span[1])
      );
      //console.log(idx); VARIABLE
      obj[schema[idx]] = {
        value,
        span,
      };
    });

    return { ...obj, key: match.join('_'), span: match, index: idxs };
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
            <TableCell /> {/* Add empty cell for expand icon */}
            <TableCell>id</TableCell> {/* Add ID column header */}
            
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
              index={index}
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
