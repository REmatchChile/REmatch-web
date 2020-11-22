import React, { Component } from 'react';

/* MaterialUI */
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Backdrop from '@material-ui/core/Backdrop';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';

import { PlayArrow, Publish } from '@material-ui/icons';

/* Project Components */
import MatchesTable from './MatchesTable';

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
      fileProgress: 0,
    };
  }
  componentDidMount() {
    let queryEditor = CodeMirror(document.getElementById('queryEditor'), {
      value: '.*!x{.+}!y{.+}.*',
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
      value: 'This is an example text!',
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

    textEditor.on('change', () => { this.clearMarks() });

    this.setState({
      queryEditor,
      textEditor,
    });
  }

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
    }, 200);
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
  }

  runWorker = () => {
    console.log('STARTED');
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
        case 'ERROR':
          console.log('ERROR:', m.data.payload);
          this.restartWorker();
          console.log('WORKER HAS BEEN RELOADED');
          break;
        default:
          break;
      }
    }
  }

  render() {
    return (
      <Container maxWidth="md" className="mainContainer">
        <Backdrop
          className="backdrop"
          open={this.state.uploadingFile}
        >
          <CircularProgress color="primary" size="3rem" />
          <Typography component="div" variant="h5" className="loading">
            Loading ({this.state.fileProgress}%)
          </Typography>
        </Backdrop>
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
              startIcon={<PlayArrow />}
              onClick={this.runWorker}
            >
              Run
            </Button>
          </div>
          <Divider />
          {/* EDITOR */}
          <div className="sectionTitle">
            Text
          </div>
          <div id="textEditor"></div>
          <input accept="*" id="fileInput" type="file" className="invisible" onChange={this.handleFile} />
          <label htmlFor="fileInput">
            <Button
              color="primary"
              variant="text"
              component="span"
              size="small"
              startIcon={<Publish />}
              className="fullButton">
              Import file
            </Button>
          </label>

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
          />



        </Paper>
      </Container>
    )
  }
}

export default Home;
