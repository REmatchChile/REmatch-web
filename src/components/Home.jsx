import React, { Component } from 'react';

/* MaterialUI */
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Backdrop from '@material-ui/core/Backdrop';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import PlayArrow from '@material-ui/icons/PlayArrow';
import Stop from '@material-ui/icons/Stop';
import Publish from '@material-ui/icons/Publish';

/* Project Components */
import MatchesTable from './MatchesTable';
import English from '../text/english';
import CustomToolbar from './CustomToolbar';

/* CodeMirror */
import CodeMirror from 'codemirror';
import 'codemirror/addon/display/placeholder';
import 'codemirror/theme/material-darker.css';
import { Typography } from '@material-ui/core';

const WORKPATH = `${process.env.PUBLIC_URL}/work.js`;
const CHUNK_SIZE = 1 * 10 ** 8; // 100MB
let worker = new Worker(WORKPATH);

/* MAIN INTERFACE */
class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      schema: [],
      matches: [],
      uploadingFile: false,
      running: false,
      howTo: (localStorage.getItem('showHowTo') === null) ? true : false,
      fileProgress: 0,
      exampleExplanation: '',
    };
  }
  componentDidMount() {
    let queryEditor = CodeMirror(document.getElementById('queryEditor'), {
      value: '(^|\\n)!x{[A-Z][a-z]{4,}} !y{([A-Z][a-z ]+)+}($|\\n)',
      mode: 'REmatchQuery',
      placeholder: 'Enter your query...',
      theme: 'material-darker',
      lineNumbers: false,
      scrollbarStyle: null,
      smartIndent: false,
      indentWithTabs: true,
      undoDepth: 100,
      viewportMargin: 10,
      extraKeys: {
        'Enter': this.runWorker,
      }
    });

    queryEditor.on('beforeChange', (_, change) => {
      if (!['undo', 'redo'].includes(change.origin)) {
        let line = change.text.join("").replace(/\n/g, '');
        change.update(change.from, change.to, [line]);
      }
      return true;
    });

    queryEditor.on('change', () => { this.clearMarks() });

    let textEditor = CodeMirror(document.getElementById('textEditor'), {
      value: `Nicolas Van Sint Jan
Vicente Calisto
Marjorie Bascunan
Oscar Carcamo
Cristian Riveros
Domagoj Vrgoc`,
      mode: 'text/plain',
      placeholder: 'Enter your text...',
      theme: 'material-darker',
      lineNumbers: true,
      scrollbarStyle: 'native',
      smartIndent: false,
      indentWithTabs: true,
      showInvisibles: true,
      undoDepth: 100,
      viewportMargin: 15,
    });

    textEditor.on('change', () => this.clearMarks());

    this.setState({
      queryEditor,
      textEditor,
    });
  }

  setExample = (event) => {
    const exampleName = event.target.textContent;
    const query = English.examples.querys[exampleName];
    const text = English.examples.texts[exampleName];
    this.state.queryEditor.setValue(query);
    this.state.textEditor.setValue(text);
  };

  addMarks = (spans) => {
    let start, end;
    spans.forEach((span, idx) => {
      start = this.state.textEditor.posFromIndex(span[0]);
      end = this.state.textEditor.posFromIndex(span[1]);

      this.state.textEditor.markText(start, end, {
        className: `m${idx}`,
      });
    });
    this.state.textEditor.scrollIntoView({
      from: start,
      to: end
    }, 0);
  }

  clearMarks = () => {
    this.state.textEditor.getAllMarks().forEach((mark) => {
      mark.clear();
    });
  }

  handleFile = async (event) => {
    let file = event.target.files[0];
    if (!file) { return };
    this.state.textEditor.setValue('');
    this.clearMarks();
    this.setState({ matches: [], schema: [], uploadingFile: true, fileProgress: 0 });
    let start = 0;
    let end = CHUNK_SIZE;
    while (start < file.size) {
      await file.slice(start, end).text()
        // eslint-disable-next-line no-loop-func
        .then((textChunk) => {
          this.setState({ fileProgress: Math.round(100 * 100 * start / file.size) / 100 })
          this.state.textEditor.replaceRange(textChunk, { line: Infinity });
          start = end;
          end += CHUNK_SIZE;
        });
    }
    console.log('upload done');
    this.setState({ uploadingFile: false })
  }

  restartWorker = () => {
    worker.terminate();
    worker = new Worker(WORKPATH);
    this.setState({running: false});
  }

  runWorker = () => {
    console.log('STARTED');
    this.setState({running: true});
    this.clearMarks();
    this.setState({ matches: [], schema: [] });
    worker.postMessage({
      text: this.state.textEditor.getValue(),
      query: this.state.queryEditor.getValue(),
    });
    worker.onmessage = (m) => {
      switch (m.data.type) {
        case 'SCHEMA':
          this.setState({ schema: m.data.payload });
          break;
        case 'MATCHES':
          this.setState((prevState) => ({ matches: [...prevState.matches, ...m.data.payload] }));
          break;
        case 'FINISHED':
          this.setState({running: false});
          break;
        case 'ERROR':
          this.setState({running: false});
          console.log('ERROR:', m.data.payload);
          this.restartWorker();
          console.log('WORKER HAS BEEN RELOADED');
          break;
        default:
          break;
      }
    }
  }

  handleCloseForever() {
    localStorage.setItem('showHowTo', false);
    this.setState({howTo: false});
  }

  handleExport(event) {
    this.refs.childMatchesTable.handleExport();
  }
  
  render() {    
    return (
      <Container maxWidth="md" className="top-padding">
        <Dialog
          className="dialog"
          open={this.state.howTo}
          onClose={() => this.setState({howTo: false})}
        >
          <DialogTitle>
            How to use this page?
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              This page serves as a visualisation tool for the <span className="cm-m0">REmatch</span> library, which allows users to run regular expressions over a text document, and extract certain pieces of information of their interest.
            </DialogContentText>
            <DialogContentText>
              The basic usage is simple: you enter your regular expression in the <span className="cm-m1">Query</span> field of the main page, and your text in the <span className="cm-m1">Text</span> field. Once you hit the <span className="cm-m1">Run</span> button, the field <span className="cm-m1">Matches</span> will fill up with the encountered results. To see where a result appears inside the text, you can click on it. You can also upload the text from a file by clicking the <span className="cm-m1">Import File</span> button and selecting a text file on your computer.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleCloseForever.bind(this)} color="primary">
              Don't show this again
            </Button>
            <Button onClick={() => this.setState({howTo: false})} color="primary">
              OK
            </Button>
          </DialogActions>
        </Dialog>
        <Backdrop
          className="backdrop"
          open={this.state.uploadingFile}
        >
          <CircularProgress color="primary" size="3rem" />
          <Typography component="div" variant="h5" className="loading">
            Loading ({this.state.fileProgress}%)
          </Typography>
        </Backdrop>
        <CustomToolbar 
          onImportFile={(event) => this.handleFile(event)}
          onExportMatches={(event) => this.handleExport(event)}
          onSetExample={(event) => this.setExample(event)}
          canExport={this.state.matches.length === 0}
        />
        <Paper elevation={5} className="mainPaper">

          {/* QUERY */}
          <div className="sectionTitle">
            Query
          </div>
          <div className="queryContainer">
            <div id="queryEditor"></div>
            <Button
              className="queryButton"
              color="primary"
              startIcon={(this.state.running) ? <Stop/> : <PlayArrow />}
              onClick={(this.state.running) ? this.restartWorker : this.runWorker}
            >
              {(this.state.running) ? 'Stop' : 'Run'}
            </Button>
          </div>
          <Divider />          
          {/* EDITOR */}
          <div className="sectionTitle">
            Text
          </div>
          <div id="textEditor"></div>
          <Divider />
          {/* RESULTS */}
          <div className="sectionTitle">
            Matches
          </div>
          <MatchesTable
            matches={this.state.matches}
            schema={this.state.schema}
            textEditor={this.state.textEditor}
            addMarks={this.addMarks}
            clearMarks={this.clearMarks}
            handleExport={this.handleExport}
            ref="childMatchesTable"
          />
        </Paper>
      </Container>
    )
  }
}

export default Home;
