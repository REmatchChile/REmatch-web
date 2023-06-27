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

function Row({ row, width }) {
  const [open, setOpen] = useState(false);

  const entries = Object.entries(row);
  const truncatedKey = entries[0][1].length > 5 ? `${entries[0][1].substring(0, 5)}...` : entries[0][1];
  const truncatedValues = entries.slice(1).map(([key, value]) =>
    value.length > 5 ? `${value.substring(0, 5)}...` : value
  );

  return (
    <>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        
        <TableCell>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>

        <TableCell component="th" scope="row" style={{ width: `${width}%` }}>
          {truncatedKey}
        </TableCell>

        {truncatedValues.map((value, index) => (
          <TableCell key={index} style={{ width: `${width}%` }}>
            {value[0].length > 5 ? `${value[0].substring(0, 5)}...` : value}
          </TableCell>
        ))}

      </TableRow>
      {open && (
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={entries.length + 1}>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Matches
              </Typography>
              <Table size="small" aria-label="matches">
                <TableHead>
                  <TableRow>
                    <TableCell />
                    <TableCell>Variable</TableCell>
                    <TableCell>Value</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {entries.map(([key, value], index) => (
                    <TableRow key={key}>
                      <TableCell></TableCell>
                      <TableCell>{key}</TableCell>
                      <TableCell>{value}</TableCell>
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
  }).isRequired,
};

export default function CollapsibleTable({ matches, schema, textEditor }) {
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

      obj[schema[idx]] = value;
    });

    return obj;
  });

  return (
    <Paper>
      <Table aria-label="collapsible table">
        
        <TableHead>
          <TableRow>
            <TableCell />
            {schema.map((variable) => (
            <TableCell key={variable} style={{ width: `${ROW_WIDTH}%` }}>
                {variable}
            </TableCell>
            ))}
            </TableRow>
        </TableHead>

        <TableBody>
          {data.map((row, index) => (
            <Row key={index} row={row} width={ROW_WIDTH} />
          ))}
        </TableBody>
        
      </Table>
    </Paper>
  );
}
