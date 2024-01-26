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
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import { enqueueSnackbar } from 'notistack';

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
let worker = new Worker(WORKPATH, { type : "module" });

/* MAIN INTERFACE */
class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      variables: [],
      matches: [],
      uploadingFile: false,
      running: false,
      howTo: localStorage.getItem("showHowTo") === null ? true : false,
      fileProgress: 0,
      exampleExplanation: "",
      preFile: null, //fileUploadingPrev
      content: null, //fileUploadingPrev
      open: false, //fileUploadingPrev
    };
  }

  componentDidMount() {
    let queryEditor = CodeMirror(document.getElementById("queryEditor"), {
      value: "(^|\\n)!x{[A-Z][a-z]+} !y{([A-Z][a-z ]+)+}($|\\n)",
      mode: "REmatchQuery",
      placeholder: "Enter your query...",
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

    queryEditor.on("beforeChange", (_, change) => {
      if (!["undo", "redo"].includes(change.origin)) {
        let line = change.text.join("").replace(/\n/g, "");
        change.update(change.from, change.to, [line]);
      }
      return true;
    });

    queryEditor.on("change", () => {
      this.clearMarks();
    });

    let textEditor = CodeMirror(document.getElementById("textEditor"), {
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
      placeholder: "Enter your text...",
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

    textEditor.on("change", () => this.clearMarks());

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
    this.state.textEditor.scrollIntoView(
      {
        from: start,
        to: end,
      },
      0
    );
  };

  clearMarks = () => {
    this.state.textEditor.getAllMarks().forEach((mark) => {
      mark.clear();
    });
  };

  handleImportFile = async (event) => {
    let file = event.target.files[0];
    if (!file) return;
    this.state.textEditor.setValue("");
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
          this.state.textEditor.replaceRange(textChunk, { line: Infinity });
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
      pattern: this.state.queryEditor.getValue(),
      document: this.state.textEditor.getValue(),
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

  handleCloseForever() {
    localStorage.setItem("showHowTo", false);
    this.setState({ howTo: false });
  }

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    return (
      <Container maxWidth="lg" sx={{ paddingTop: "96px" }}>
        <Dialog
          sx={{ textAlign: "justify" }}
          open={this.state.howTo}
          onClose={() => this.setState({ howTo: false })}
        >
          <DialogTitle>How to use this page?</DialogTitle>
          <DialogContent>
            <DialogContentText>
              This page serves as a visualisation tool for the{" "}
              <a href="https://github.com/REmatchChile">
                {" "}
                <span className="cm-m0">REmatch</span>
              </a>{" "}
              library, which allows users to run regular expressions over a text
              document, and extract certain pieces of information of their
              interest.
            </DialogContentText>
            <DialogContentText>
              The basic usage is simple: you enter your regular expression in
              the <span className="cm-m1">Query</span> field of the main page,
              and your text in the <span className="cm-m1">Text</span> field.
              Once you hit the <span className="cm-m1">Run</span> button, the
              field <span className="cm-m1">Matches</span> will fill up with the
              encountered results. To see where a result appears inside the
              text, you can click on it. You can also upload the text from a
              file by clicking the <span className="cm-m1">Import File</span>{" "}
              button and selecting a text file on your computer.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={this.handleCloseForever.bind(this)}
              color="primary"
            >
              Don't show this again
            </Button>
            <Button
              onClick={() => this.setState({ howTo: false })}
              color="primary"
            >
              OK
            </Button>
          </DialogActions>
        </Dialog>
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
        <Paper elevation={2} className="mainPaper">
          {/* QUERY */}
          <Box sx={{ pl: 2, pt: 1 }}>
            <Typography
              component="span"
              color="text.secondary"
              variant="caption"
            >
              Query
            </Typography>
          </Box>
          <Box sx={{ display: "flex" }}>
            <div id="queryEditor"></div>
            <Button
              sx={{
                borderRadius: 0,
                padding: ".5rem 2rem",
              }}
              color="primary"
              startIcon={this.state.running ? <Stop /> : <PlayArrow />}
              onClick={this.state.running ? this.restartWorker : this.runWorker}
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
              Text
            </Typography>
          </Box>
          <div id="textEditor"></div>
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
            textEditor={this.state.textEditor}
            addMarks={this.addMarks}
            clearMarks={this.clearMarks}
          />
        </Paper>
      </Container>
    );
  }
}

export default Home;
