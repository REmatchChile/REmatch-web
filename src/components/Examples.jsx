import React, { useState } from 'react';

import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
// import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';

import Viewer from './Viewer';

import english from '../text/english';

const WORKPATH = `${process.env.PUBLIC_URL}/liteWork.js`;
let worker = new Worker(WORKPATH);

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    marginLeft: '2.5rem',
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

const texts = {
  biology: `Proteina 1
  Proteina 2
  Aminoacido 1
  Procarionte 3`,
  literature: `Libro 1
  Autor 2
  Obra 1
  Dramaturgo 3`
}

const explanaitions = {
  biology: 'The classical example here is DNA sequencing, where the DNA strand is represented as a string, and one would like to analyze different proteins involved in defining this DNA strand. The thing here is that proteins can be joined at certain points, meaning that if our strand has the letter sequence <span class="code">abcabbcdefbb</span>, both <span class="code">abcabb</span> (substring from positions 0 to 5), and <span class="code">abbcdefbb</span> (positions 3 to 11) might be two proteins participating in this DNA strand (for simplicity we assume <span class="code">ab</span> to be the start trigger, and <span class="code">bb</span> the end trigger, the situation in real world is much more involved).',
  literature: 'While this example might seem very academic, and one might argue that something like overlapping matches might not be very useful (e.g. in a sequence <span class="code">abcde</span> having both the substrings <span class="code">bc</span> and <span class="code">cde</span> might seem and overkill). We however argue that there are many use cases when precisely this type of behaviour is sought after.',
}


const Examples = () => {
  const [example, setExample] = useState('');
  const [regex, setRegex] = useState('');
  const [textViewer, setTextViewer] = useState('');
  const [explanation, setExplanation] = useState('');

  const classes = useStyles();
  const changeSelect = (event) => {
    setExample(event.target.value);
    console.log(texts[`${event.target.value}`])
    setTextViewer('holass');
    setRegex(event.target.value);
    setExplanation(explanaitions[`${event.target.value}`]);
  };

  

  return (
    <Container maxWidth="md" className="mainContainer">
      {english.examples.title}
      {english.examples.description}

      <FormControl className={classes.formControl}> 
        <InputLabel id="demo-simple-select-label">Example</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={example}
          onChange={changeSelect}
        >
          <MenuItem value={'biology'}>Biology</MenuItem>
          <MenuItem value={'literature'}>Literature</MenuItem>
          <MenuItem value={'computing'}>Computer Science</MenuItem>
        </Select>
      </FormControl>
      <Viewer 
        idx='regex1'
        worker={worker}
        regex={regex}
        text={textViewer}
      />

      <div className="sectionContainer">
        <Typography variant="h6" color="primary">
          About {example} example
        </Typography>
        <Typography variant="body1" align="justify">
          <div dangerouslySetInnerHTML={{__html:explanation}} />
        </Typography>
      </div>
    </Container>
  )
}

export default Examples;