import React, { useRef, useState, useEffect } from "react";

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
const Home = ({ openExamplesDialog, setOpenExamplesDialog }) => {
  const [variables, setVariables] = useState([]);
  const [matches, setMatches] = useState([]);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [running, setRunning] = useState(false);
  const [fileProgress, setFileProgress] = useState(0);
  const patternEditor = useRef(null);
  const documentEditor = useRef(null);

  const addMarks = (spans) => {
    let start, end;
    spans.sort((a, b) => a[0] - b[0]);
    spans.forEach((span, idx) => {
      start = documentEditor.current.posFromIndex(span[0]);
      end = documentEditor.current.posFromIndex(span[1]);

      documentEditor.current.markText(start, end, {
        className: `m${idx}`,
      });
    });
    documentEditor.current.scrollIntoView(
      {
        from: start,
        to: end,
      },
      0
    );
  };

  const clearMarks = () => {
    documentEditor.current.getAllMarks().forEach((mark) => {
      mark.clear();
    });
  };

  const handleImportFile = async (event) => {
    let file = event.target.files[0];
    if (!file) return;
    documentEditor.current.setValue("");
    setUploadingFile(true);
    setFileProgress(0);
    clearMarks();
    setMatches([]);
    setVariables([]);
    let start = 0;
    let end = FILE_CHUNK_SIZE;
    while (start < file.size) {
      await file
        .slice(start, end)
        .text()
        // eslint-disable-next-line no-loop-func
        .then((textChunk) => {
          setFileProgress(Math.round((100 * 100 * start) / file.size) / 100);
          documentEditor.current.replaceRange(textChunk, { line: Infinity });
          start = end;
          end += FILE_CHUNK_SIZE;
        });
    }
    setUploadingFile(false);
  };

  const restartWorker = () => {
    worker.terminate();
    worker = new Worker(WORKPATH, { type: "module" });
    setRunning(false);
  };

  const runWorker = () => {
    setRunning(true);
    clearMarks();
    setMatches([]);
    setVariables([]);
    worker.postMessage({
      pattern: patternEditor.current.getValue(),
      document: documentEditor.current.getValue(),
    });
    worker.onmessage = (m) => {
      switch (m.data.type) {
        case "VARIABLES":
          setVariables(m.data.payload);
          break;
        case "MATCHES":
          setMatches((prevMatches) => [...prevMatches, ...m.data.payload]);
          break;
        case "FINISHED":
          setRunning(false);
          break;
        case "ERROR":
          setRunning(false);
          console.error(m.data.payload);
          enqueueSnackbar(m.data.payload, { variant: "error" });
          restartWorker();
          break;
        default:
          console.error("UNHANDLED WORKER MESSAGE:", m);
          break;
      }
    };
  };

  const onExampleClick = (example) => {
    clearMarks();
    setMatches([]);
    setVariables([]);

    patternEditor.current.setValue(example.pattern);
    documentEditor.current.setValue(example.document);

    setOpenExamplesDialog(false);
  };

  useEffect(() => {
    patternEditor.current = CodeMirror(
      document.getElementById("patternEditor"),
      {
        value:
          "(^|\\n)!firstName{[A-Z][a-z]+} !lastName{([A-Z][a-z ]+)+}($|\\n)",
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
          Enter: runWorker,
        },
      }
    );

    patternEditor.current.on("beforeChange", (_, change) => {
      if (!["undo", "redo"].includes(change.origin)) {
        let line = change.text.join("").replace(/\n/g, "");
        change.update(change.from, change.to, [line]);
      }
      return true;
    });

    documentEditor.current = CodeMirror(
      document.getElementById("documentEditor"),
      {
        value:
          "Nicolas Van Sint Jan\nVicente Calisto\nMarjorie Bascunan\nOscar Carcamo\nCristian Riveros\nDomagoj Vrgoc\nIgnacio Pereira\nKyle Bossonney\nGustavo Toro\n",
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
      }
    );
    documentEditor.current.on("change", () => clearMarks());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <ExamplesDialog
        open={openExamplesDialog}
        setOpen={setOpenExamplesDialog}
        onExampleClick={onExampleClick}
      />
      <Backdrop
        sx={{
          zIndex: 6000,
          display: "flex",
          flexDirection: "column",
          gap: "2rem",
        }}
        open={uploadingFile}
      >
        <CircularProgress color="primary" size="3rem" />
        <Typography component="div" variant="h5">
          Loading ({fileProgress}%)
        </Typography>
      </Backdrop>
      <Container maxWidth="lg" sx={{ paddingTop: "96px" }}>
        <Paper elevation={2} className="mainPaper">
          {/* PATTERN */}
          <Box sx={{ pl: 2, pt: 1 }}>
            <Typography
              sx={{ userSelect: "none" }}
              component="span"
              color="text.secondary"
              variant="caption"
            >
              REQL query
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
              startIcon={running ? <Stop /> : <PlayArrow />}
              onClick={running ? restartWorker : runWorker}
            >
              {running ? "Stop" : "Run"}
            </Button>
          </Box>
          <Divider />
          {/* EDITOR */}
          <Box sx={{ pl: 2, pt: 1 }}>
            <Typography
              component="span"
              color="text.secondary"
              variant="caption"
              sx={{ userSelect: "none" }}
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
            <input type="file" hidden onChange={handleImportFile} />
          </Button>
          <Divider />
          {/* MATCHES */}
          <Box sx={{ pl: 2, pt: 1 }}>
            <Typography
              component="span"
              color="text.secondary"
              variant="caption"
              sx={{ userSelect: "none" }}
            >
              Matches ({matches.length})
            </Typography>
          </Box>
          <MatchesTable
            matches={matches}
            variables={variables}
            documentEditor={documentEditor}
            addMarks={addMarks}
            clearMarks={clearMarks}
          />
        </Paper>
      </Container>
    </>
  );
};

export default Home;
