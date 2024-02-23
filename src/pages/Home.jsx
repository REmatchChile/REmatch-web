import React, { useEffect, useRef, useState, useCallback } from "react";

/* MaterialUI */
import PlayArrow from "@mui/icons-material/PlayArrow";
import Stop from "@mui/icons-material/Stop";
import TipsAndUpdatesIcon from "@mui/icons-material/TipsAndUpdates";
import { useMediaQuery, useTheme } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { enqueueSnackbar } from "notistack";
import ExamplesDialog from "../components/ExamplesDialog";
import MatchesTable from "../components/MatchesTable";
import Window from "../components/Window";
import CodeMirror, { EditorState, EditorView } from "@uiw/react-codemirror";
import { basicDark } from "@uiw/codemirror-theme-basic";
import { REQLLanguage } from "../utils/REQLCodemirrorLanguage";

/* Worker */
const WORKPATH = `${process.env.PUBLIC_URL}/work.js`;
let worker = new Worker(WORKPATH, { type: "module" });

const ResponsiveButtonPatternEditor = ({ name, onClick, startIcon, color }) => {
  const theme = useTheme();
  const isBreakpointBelowSm = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <Button
      disableElevation
      variant="contained"
      size="small"
      sx={{
        minWidth: "48px",
        flexShrink: 0,
        borderRadius: 0,
        px: 2,
        ".MuiButton-startIcon": {
          ml: isBreakpointBelowSm ? 0 : "-2px",
          mr: isBreakpointBelowSm ? 0 : "8px",
        },
      }}
      color={color}
      startIcon={startIcon}
      onClick={onClick}
    >
      {!isBreakpointBelowSm && name}
    </Button>
  );
};

/* MAIN INTERFACE */
const Home = () => {
  const [variables, setVariables] = useState([]);
  const [matches, setMatches] = useState([]);
  const [running, setRunning] = useState(false);
  const [openExamplesDialog, setOpenExamplesDialog] = useState(false);
  const [REQLQuery, setREQLQuery] = useState(
    "(^|\\n)!firstName{[A-Z][a-z]+} !lastName{([A-Z][a-z ]+)+}($|\\n)"
  );
  const [document, setDocument] = useState(
    "Nicolas Van Sint Jan\nVicente Calisto\nMarjorie Bascunan\nOscar Carcamo\nCristian Riveros\nDomagoj Vrgoc\nIgnacio Pereira\nKyle Bossonney\nGustavo Toro\n"
  );
  const patternEditor = useRef(null);
  const documentEditor = useRef(null);

  const onPatternChange = useCallback((val, viewUpdate) => {
    setREQLQuery(val);
  }, []);

  const onDocumentChange = useCallback((val, viewUpdate) => {
    setDocument(val);
  }, []);

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

  const restartWorker = () => {
    worker.terminate();
    worker = new Worker(WORKPATH, { type: "module" });
    setRunning(false);
  };

  const runWorker = () => {
    setRunning(true);
    // clearMarks();
    setMatches([]);
    setVariables([]);
    worker.postMessage({
      REQLQuery: REQLQuery,
      document: document,
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
    // clearMarks();
    setMatches([]);
    setVariables([]);
    setREQLQuery(example.pattern);
    setDocument(example.document);
    setOpenExamplesDialog(false);
  };

  useEffect(() => {
    // patternEditor.current = CodeMirror(
    //   document.getElementById("patternEditor"),
    //   {
    //     value:
    //       "(^|\\n)!firstName{[A-Z][a-z]+} !lastName{([A-Z][a-z ]+)+}($|\\n)",
    //     mode: "REQL",
    //     placeholder: "Type your pattern",
    //     theme: "material-darker",
    //     lineNumbers: false,
    //     scrollbarStyle: null,
    //     smartIndent: false,
    //     indentWithTabs: true,
    //     undoDepth: 100,
    //     viewportMargin: 10,
    //     extraKeys: {
    //       Enter: runWorker,
    //     },
    //   }
    // );
    // patternEditor.current.on("beforeChange", (_, change) => {
    //   if (!["undo", "redo"].includes(change.origin)) {
    //     let line = change.text.join("").replace(/\n/g, "");
    //     change.update(change.from, change.to, [line]);
    //   }
    //   return true;
    // });
    // documentEditor.current = CodeMirror(
    //   document.getElementById("documentEditor"),
    //   {
    //     value:
    //       "Nicolas Van Sint Jan\nVicente Calisto\nMarjorie Bascunan\nOscar Carcamo\nCristian Riveros\nDomagoj Vrgoc\nIgnacio Pereira\nKyle Bossonney\nGustavo Toro\n",
    //     mode: { name: "text/html" },
    //     placeholder: "Type your document",
    //     theme: "material-darker",
    //     lineNumbers: true,
    //     scrollbarStyle: "native",
    //     smartIndent: false,
    //     indentWithTabs: true,
    //     showInvisibles: true,
    //     undoDepth: 100,
    //     viewportMargin: 15,
    //     lineWrapping: true,
    //   }
    // );
    // documentEditor.current.on("change", () => {
    //   clearMarks();
    // });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <ExamplesDialog
        open={openExamplesDialog}
        setOpen={setOpenExamplesDialog}
        onExampleClick={onExampleClick}
      />
      <Box
        sx={{
          p: 1,
          gap: 1,
          flex: "1 1 auto",
          display: "flex",
          overflow: "hidden",
          flexDirection: "column",
        }}
      >
        {/* PATTERN EDITOR */}
        <Box sx={{ flex: "0 0 0" }}>
          <Window name="Document">
            <Box
              sx={{
                display: "flex",
                height: "auto",
              }}
            >
              <ResponsiveButtonPatternEditor
                name="Examples"
                onClick={setOpenExamplesDialog}
                startIcon={<TipsAndUpdatesIcon />}
                color="secondary"
              />
              <Box
                sx={{
                  flex: "1 1 auto",
                  overflowX: "scroll",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <CodeMirror
                  style={{ flex: 1, height: "100%" }}
                  height="100%"
                  value={REQLQuery}
                  onChange={onPatternChange}
                  theme={basicDark}
                  basicSetup={{
                    highlightActiveLine: false,
                    bracketMatching: false,
                    lineNumbers: false,
                    foldGutter: false,
                  }}
                  extensions={[
                    REQLLanguage,
                    EditorState.transactionFilter.of((tr) =>
                      tr.newDoc.lines > 1 ? [] : tr
                    ),
                  ]}
                />
              </Box>
              <ResponsiveButtonPatternEditor
                name={running ? "Stop" : "Run"}
                onClick={running ? restartWorker : runWorker}
                startIcon={running ? <Stop /> : <PlayArrow />}
                color="primary"
              />
            </Box>
          </Window>
        </Box>
        <Box
          sx={{
            flex: "1 1 auto",
            gap: 1,
            display: "flex",
            flexDirection: { md: "row", xs: "column" },
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              flex: "1 0 0",
              overflow: "auto",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* DOCUMENT EDITOR */}
            <Window name="Document">
              <CodeMirror
                style={{ height: "100%" }}
                height="100%"
                value={document}
                onChange={onDocumentChange}
                lang="text/html"
                basicSetup={{
                  bracketMatching: false,
                  closeBrackets: false,
                }}
                theme={basicDark}
                extensions={[EditorView.lineWrapping]}
              />
            </Window>
          </Box>
          <Box
            sx={{
              flex: "1 0 0",
              display: "flex",
              flexDirection: "column",
              overflow: "auto",
            }}
          >
            {/* MATCHES TABLE */}
            <Window name={`Matches (${matches.length})`}>
              <MatchesTable
                matches={matches}
                variables={variables}
                documentEditor={documentEditor}
                addMarks={addMarks}
                clearMarks={clearMarks}
              />
            </Window>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Home;
