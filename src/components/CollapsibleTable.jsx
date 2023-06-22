import React from 'react';
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

function joinAndTruncateValues(values) {
  const joinedString = values.join(',');
  if (joinedString.length > 10) {
    return joinedString.substring(0, 10) + '...';
  }
  return joinedString;
}

function exportJSON(matches, schema, textEditor) {
    const result = [];
    
    matches.forEach((match) => {
      const obj = {};
      
      match.forEach((span, idx) => {
        const value = textEditor.getRange(
          textEditor.posFromIndex(span[0]),
          textEditor.posFromIndex(span[1])
        );
        
        obj[schema[idx]] = value;
      });
      
      result.push(obj);
    });
    
    return JSON.stringify(result);
  }
  

  function Row(props) {
    const { row, width } = props;
    const [open, setOpen] = React.useState(false);
  
    const entries = Object.entries(row);
    const truncatedKey = entries[0][1].length > 5 ? `${entries[0][1].substring(0, 5)}...` : entries[0][1];
    const truncatedValues = entries.slice(1).map(([key, value]) =>
      value.length > 5 ? `${value.substring(0, 5)}...` : value
    );
  
    return (
      <React.Fragment>
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
            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={entries.length}>
              <Box sx={{ margin: 1 }}>
                <Typography variant="h6" gutterBottom component="div">
                  Matches
                </Typography>
                <Table size="small" aria-label="matches">
                  <TableHead>
                    <TableRow>
                      <TableCell />
                      <TableCell>Dictionary Key</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {entries.slice(1).map(([key, value], index) => (
                      <TableRow key={index}>
                        <TableCell>{value}</TableCell>
                        <TableCell>{index === 0 ? entries[0][0] : ''}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </TableCell>
          </TableRow>
        )}
      </React.Fragment>
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

export default function CollapsibleTable(props) {
  if (props.matches.length === 0) {
    return null;
  }

  const ROW_WIDTH = 100 / props.matches.length;

  const data = JSON.parse(exportJSON(props.matches, props.schema, props.textEditor));
  const numValues = props.schema.length;
  const TRUNCATE_LIMIT = 5;
  const truncatedValues = Array.from({ length: numValues }, (_, index) => {
    const value = String.fromCharCode(65 + index);
    return value.length > TRUNCATE_LIMIT ? `${value.substring(0, TRUNCATE_LIMIT)}...` : value;
  });

  return (
    <Paper>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Dictionary Key</TableCell>
            {props.schema.map((variable, schIdx) => (
              <TableCell key={schIdx}>{variable}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, index) => (
            <Row key={index} row={row} preview={row.preview} width={ROW_WIDTH} />
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}
