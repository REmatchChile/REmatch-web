import React, { Component } from 'react';

import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';

import PlayArrow from '@material-ui/icons/PlayArrow';

import CodeMirror from 'codemirror';

class Viewer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      idx: props.idx,
      text: props.text,
      // If regex is used
      regex: props.regex,
      regexMatches: [],
      // If rematch is used
      worker: props.worker,
      rematch: props.rematch,
      schema: [],
      rematchMatches: [],
    }
  }

  createEditor(type) {
    return CodeMirror(document.getElementById(`${type}Editor-${this.props.idx}`), {
      value: this.state[type],
      mode: (type === 'rematch') ? 'REmatchQuery' : (type === 'regex') ? 'RegExQuery' : null,
      theme: 'material-darker',
      scrollbarStyle: null,
      smartIndent: false,
      indentWithTabs: true,
      undoDepth: 100,
      viewportMargin: 10,
      lineNumbers: false,
      lineWrapping: (type === 'text'),
      readOnly: 'nocursor',
    })
  }

  componentDidMount() {
    let textEditor = this.createEditor('text');
    this.setState({ textEditor });
    if (this.props.rematch) {
      let rematchEditor = this.createEditor('rematch');
      this.setState({ rematchEditor });
    }
    if (this.props.regex) {
      let regexEditor = this.createEditor('regex');
      this.setState({ regexEditor });
    }
  }

  getText(span) {
    return this.state.textEditor.getRange(
      this.state.textEditor.posFromIndex(span[0]),
      this.state.textEditor.posFromIndex(span[1]))
      .replaceAll(' ', '␣')
      .replaceAll(/\r?\n/g, '¬')
  }

  clearMarks = () => {
    this.state.textEditor.getAllMarks().forEach((mark) => {
      mark.clear();
    });
  }

  REmatchMarks(match) {
    let start, end;
    this.clearMarks();
    this.state.schema.forEach((variable, idx) => {
      start = this.state.textEditor.posFromIndex(match[variable][0]);
      end = this.state.textEditor.posFromIndex(match[variable][1]);
      this.state.textEditor.markText(start, end, {
        className: `m${idx}`,
      })
    });
  }

  RegExMarks(span) {
    this.clearMarks();
    let start = this.state.textEditor.posFromIndex(span[0]);
    let end = this.state.textEditor.posFromIndex(span[1]);
    this.state.textEditor.markText(start, end, {
      className: 'm0',
    })
  }

  runRegEx() {
    let rgx = new RegExp(this.state.regex, 'g');
    let matches = [];
    let match;
    while ((match = rgx.exec(this.state.textEditor.getValue())) != null) {
      matches.push([match.index, match.index + match[0].length]);
    }
    this.setState({ regexMatches: matches });
  }

  runREmatch() {
    this.state.worker.postMessage({
      text: this.state.textEditor.getValue(),
      query: this.state.rematch,
    });
    this.state.worker.onmessage = (m) => {
      switch (m.data.type) {
        case 'SCHEMA':
          this.setState({ schema: m.data.payload });
          break;
        case 'MATCHES':
          this.setState({ rematchMatches: m.data.payload });
          break;
        default:
          break;
      }
    }
  }

  render() {
    return (
      <Paper className="viewerPaper" elevation={3}>
        <div className="textEditor" id={`textEditor-${this.props.idx}`}></div>
        <Divider />
        <div className="queryContainer">
          {(this.state.rematch) ?
            <div
              className={`queryEditor ${(this.state.rematch && this.state.regex) ? 'centered' : null}`}
              id={`rematchEditor-${this.props.idx}`}></div>
            : null}
          {(this.state.rematch && this.state.regex) ?
            <Divider orientation="vertical" flexItem />
            : null}
          {(this.state.regex) ?
            <div
              className={`queryEditor ${(this.state.rematch && this.state.regex) ? 'centered' : null}`}
              id={`regexEditor-${this.props.idx}`}></div>
            : null}
          {!(this.state.rematch && this.state.regex) ?
            <Button
              disabled={this.state.rematchMatches.length !== 0 || this.state.regexMatches.length !== 0}
              className="button"
              color={this.state.rematch ? 'primary' : 'secondary'}
              startIcon={<PlayArrow />}
              size="small"
              onClick={this.state.rematch ? this.runREmatch.bind(this) : this.runRegEx.bind(this)}>
              {(this.state.rematch) ? 'REmatch' : 'RegEx'}
            </Button>
            : null}
        </div>
        <Divider />
        {(this.state.rematch && this.state.regex) ?
          <>
            <div className="buttonContainer">
              <Button
                disabled={this.state.rematchMatches.length !== 0}
                className="button"
                color="primary"
                startIcon={<PlayArrow />}
                size="small"
                onClick={this.runREmatch.bind(this)}>
                REmatch
              </Button>
              <Divider orientation="vertical" flexItem />
              <Button
                disabled={this.state.regexMatches.length !== 0}
                className="button"
                color="secondary"
                startIcon={<PlayArrow />}
                size="small"
                onClick={this.runRegEx.bind(this)}>
                RegEx
              </Button>
            </div>
            <Divider />
          </>
          : null}
        <div className="matchesContainer">
          {(this.state.rematch) ?
            <div className="matches">
              {this.state.rematchMatches.map((match, idxMatch) => (
                <div key={idxMatch} className="matchesRow" onClick={() => this.REmatchMarks(match)}>
                  {Object.keys(match).map((variable, idxVariable) => (
                    <div key={idxVariable} className={`cm-m${idxVariable} matchesItem`}>
                      {variable}: {this.getText(match[variable])}
                    </div>
                  ))}
                </div>
              ))}
            </div>
            : null}
          {(this.state.rematch && this.state.regex) ?
            <Divider orientation="vertical" flexItem />
            : null}
          {(this.state.regex) ?
            <div className="matches">
              {this.state.regexMatches.map((span, idxSpan) => (
                <div key={idxSpan} className="matchesRow" onClick={() => this.RegExMarks(span)}>
                  <div className="matchesItem">
                    {this.getText(span)}
                  </div>
                </div>
              ))}
            </div>
            : null}
        </div>
      </Paper>
    )
  }
}

export default Viewer;