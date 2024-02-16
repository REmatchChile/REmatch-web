import React, { Component } from "react";

/* MaterialUI */
import PlayArrow from "@mui/icons-material/PlayArrow";
import Publish from "@mui/icons-material/Publish";
import Stop from "@mui/icons-material/Stop";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import { enqueueSnackbar } from "notistack";
import ExamplesDialog from "./ExamplesDialog";

/* Project Components */
import MatchesTable from "./MatchesTable";

/* CodeMirror */
import { Typography } from "@mui/material";
import CodeMirror from "codemirror";
import "codemirror/addon/display/placeholder";
import "codemirror/theme/material-darker.css";

/* Worker */
const WORKPATH = `${process.env.PUBLIC_URL}/work.js`;
const FILE_CHUNK_SIZE = 100 * 1024 * 1024; // 100MB
let worker = new Worker(WORKPATH, { type: "module" });

/* MAIN INTERFACE */
class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      variables: [],
      matches: [],
      uploadingFile: false,
      running: false,
      fileProgress: 0,
    };
  }

  componentDidMount() {
    let patternEditor = CodeMirror(document.getElementById("patternEditor"), {
      value: "(^|\\n)!firstName{[A-Z][a-z]+} !lastName{([A-Z][a-z ]+)+}($|\\n)",
      mode: "REQL",
      placeholder: "Type your pattern",
      theme: "material-darker",
      lineNumbers: false,
      scrollbarStyle: null,
      smartIndent: false,
      indentWithTabs: true,
      undoDepth: 100,
      viewportMargin: 10,
      extraKeys: {
        Enter: this.runWorker,
      },
    });

    patternEditor.on("beforeChange", (_, change) => {
      if (!["undo", "redo"].includes(change.origin)) {
        let line = change.text.join("").replace(/\n/g, "");
        change.update(change.from, change.to, [line]);
      }
      return true;
    });

    let documentEditor = CodeMirror(document.getElementById("documentEditor"), {
      value: `Nicolas Van Sint Jan
Vicente Calisto
Marjorie Bascunan
Oscar Carcamo
Cristian Riveros
Domagoj Vrgoc
Ignacio Pereira
Kyle Bossonney
Gustavo Toro
`,
      mode: { name: "text/html" },
      placeholder: "Type your document",
      theme: "material-darker",
      lineNumbers: true,
      scrollbarStyle: "native",
      smartIndent: false,
      indentWithTabs: true,
      showInvisibles: true,
      undoDepth: 100,
      viewportMargin: 15,
      lineWrapping: true,
    });

    documentEditor.on("change", () => this.clearMarks());

    this.setState({
      patternEditor,
      documentEditor,
    });
  }

  addMarks = (spans) => {
    let start, end;
    spans.sort((a, b) => a[0] - b[0]);
    spans.forEach((span, idx) => {
      start = this.state.documentEditor.posFromIndex(span[0]);
      end = this.state.documentEditor.posFromIndex(span[1]);

      this.state.documentEditor.markText(start, end, {
        className: `m${idx}`,
      });
    });
    this.state.documentEditor.scrollIntoView(
      {
        from: start,
        to: end,
      },
      0
    );
  };

  clearMarks = () => {
    this.state.documentEditor.getAllMarks().forEach((mark) => {
      mark.clear();
    });
  };

  handleImportFile = async (event) => {
    let file = event.target.files[0];
    if (!file) return;
    this.state.documentEditor.setValue("");
    this.clearMarks();
    this.setState({
      matches: [],
      variables: [],
      uploadingFile: true,
      fileProgress: 0,
    });
    let start = 0;
    let end = FILE_CHUNK_SIZE;
    while (start < file.size) {
      await file
        .slice(start, end)
        .text()
        // eslint-disable-next-line no-loop-func
        .then((textChunk) => {
          this.setState({
            fileProgress: Math.round((100 * 100 * start) / file.size) / 100,
          });
          this.state.documentEditor.replaceRange(textChunk, { line: Infinity });
          start = end;
          end += FILE_CHUNK_SIZE;
        });
    }
    this.setState({ uploadingFile: false });
  };

  restartWorker = () => {
    worker.terminate();
    worker = new Worker(WORKPATH, { type: "module" });
    this.setState({ running: false });
  };

  runWorker = () => {
    this.setState({ running: true, matches: [], variables: [] });
    this.clearMarks();
    worker.postMessage({
      pattern: this.state.patternEditor.getValue(),
      document: this.state.documentEditor.getValue(),
    });
    worker.onmessage = (m) => {
      switch (m.data.type) {
        case "VARIABLES":
          this.setState({ variables: m.data.payload });
          break;
        case "MATCHES":
          this.setState((prevState) => ({
            matches: [...prevState.matches, ...m.data.payload],
          }));
          break;
        case "FINISHED":
          this.setState({ running: false });
          break;
        case "ERROR":
          this.setState({ running: false });
          console.error(m.data.payload);
          enqueueSnackbar(m.data.payload, { variant: "error" });
          this.restartWorker();
          break;
        default:
          console.error("UNHANDLED WORKER MESSAGE:", m);
          break;
      }
    };
  };

  onExampleClick = (example) => {
    this.clearMarks();
    this.state.matches = [];

    this.state.patternEditor.setValue(example.pattern);
    this.state.documentEditor.setValue(example.document);

    this.props.setOpenExamplesDialog(false);
  };

  render() {
    return (
      <>
        <ExamplesDialog
          open={this.props.openExamplesDialog}
          setOpen={this.props.setOpenExamplesDialog}
          onExampleClick={this.onExampleClick}
        />
        <Backdrop
          sx={{
            zIndex: 6000,
            display: "flex",
            flexDirection: "column",
            gap: "2rem",
          }}
          open={this.state.uploadingFile}
        >
          <CircularProgress color="primary" size="3rem" />
          <Typography component="div" variant="h5">
            Loading ({this.state.fileProgress}%)
          </Typography>
        </Backdrop>
        <Container maxWidth="lg" sx={{ paddingTop: "96px" }}>
          <Paper elevation={2} className="mainPaper">
            {/* PATTERN */}
            <Box sx={{ pl: 2, pt: 1 }}>
              <Typography
                component="span"
                color="text.secondary"
                variant="caption"
              >
                Pattern
              </Typography>
            </Box>
            <Box sx={{ display: "flex" }}>
              <div id="patternEditor"></div>
              <Button
                sx={{
                  borderRadius: 0,
                  padding: ".5rem 2rem",
                }}
                color="primary"
                startIcon={this.state.running ? <Stop /> : <PlayArrow />}
                onClick={
                  this.state.running ? this.restartWorker : this.runWorker
                }
              >
                {this.state.running ? "Stop" : "Run"}
              </Button>
            </Box>
            <Divider />
            {/* EDITOR */}
            <Box sx={{ pl: 2, pt: 1 }}>
              <Typography
                component="span"
                color="text.secondary"
                variant="caption"
              >
                Document
              </Typography>
            </Box>
            <div id="documentEditor"></div>
            <Button
              component="label"
              color="primary"
              variant="text"
              size="small"
              startIcon={<Publish />}
              sx={{
                width: "100%",
                padding: "1rem",
                borderRadius: 0,
              }}
            >
              Import file
              <input type="file" hidden onChange={this.handleImportFile} />
            </Button>
            <Divider />
            {/* MATCHES */}
            <Box sx={{ pl: 2, pt: 1 }}>
              <Typography
                component="span"
                color="text.secondary"
                variant="caption"
              >
                Matches
              </Typography>
            </Box>
            <MatchesTable
              matches={this.state.matches}
              variables={this.state.variables}
              documentEditor={this.state.documentEditor}
              addMarks={this.addMarks}
              clearMarks={this.clearMarks}
            />
          </Paper>
        </Container>
      </>
    );
  }
}

export default Home;
