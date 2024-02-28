import React, { useCallback, useRef, useState } from "react";

/* MaterialUI */
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import StopIcon from "@mui/icons-material/Stop";
import { useMediaQuery, useTheme } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { basicDark } from "@uiw/codemirror-theme-basic";
import CodeMirror, {
  EditorState,
  EditorView,
  highlightWhitespace,
  keymap,
  Prec,
} from "@uiw/react-codemirror";
import { enqueueSnackbar } from "notistack";
import {
  MarkExtension,
  addMarks,
  removeMarks,
} from "../codemirror-extensions/MarkExtension";
import { REQLExtension } from "../codemirror-extensions/REQLExtension";
import MatchesTable from "../components/MatchesTable";
import Window from "../components/Window";

/* Worker */
const WORKPATH = `${process.env.PUBLIC_URL}/work.js`;
let worker = new Worker(WORKPATH, { type: "module" });

/* MAIN INTERFACE */
const Home = () => {
  const [variables, setVariables] = useState([]);
  const [matches, setMatches] = useState([]);
  const [running, setRunning] = useState(false);
  const [query, setQuery] = useState(
    "(^|\\n)!firstName{[A-Z][a-z]+} !lastName{([A-Z][a-z ]+)+}($|\\n)"
  );
  const [doc, setDoc] = useState(
    "Nicolas Van Sint Jan\nVicente Calisto\nMarjorie Bascunan\nOscar Carcamo\nCristian Riveros\nDomagoj Vrgoc\nIgnacio Pereira\nKyle Bossonney\nGustavo Toro\n"
  );
  const docEditorRef = useRef();
  const theme = useTheme();
  const isBreakpointBelowSm = useMediaQuery(theme.breakpoints.down("sm"));

  const onPatternChange = useCallback((val, viewUpdate) => {
    setQuery(val);
  }, []);

  const onDocChange = useCallback((val, viewUpdate) => {
    setDoc(val);
  }, []);

  const restartWorker = () => {
    worker.terminate();
    worker = new Worker(WORKPATH, { type: "module" });
    setRunning(false);
  };

  const runWorker = () => {
    setRunning(true);
    removeMarks(docEditorRef.current.view);
    setMatches([]);
    setVariables([]);
    worker.postMessage({
      query: query,
      doc: doc,
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

  return (
    <Box
      component="main"
      sx={{
        flex: "1 1 auto",
        display: "flex",
        flexDirection: "column",
        gap: 1,
        p: 1,
        overflow: "hidden",
      }}
    >
      {/* PATTERN EDITOR */}
      <Box sx={{ flex: "0 0 0" }}>
        <Window name="REQL Query">
          <Box
            sx={{
              display: "flex",
              height: "auto",
            }}
          >
            <Box
              sx={{
                flex: "1 1 auto",
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
              }}
            >
              <CodeMirror
                style={{ flex: 1, height: "100%", overflow: "auto" }}
                height="100%"
                value={query}
                onChange={onPatternChange}
                theme={basicDark}
                basicSetup={{
                  highlightActiveLine: false,
                  bracketMatching: true,
                  lineNumbers: false,
                  foldGutter: false,
                  searchKeymap: false,
                  highlightSelectionMatches: false,
                }}
                extensions={[
                  REQLExtension,
                  EditorState.transactionFilter.of((tr) =>
                    tr.newDoc.lines > 1 ? [] : tr
                  ),
                  highlightWhitespace(),
                  // Override Enter for running the REQL query
                  Prec.highest(
                    keymap.of([
                      {
                        key: "Enter",
                        run: () => runWorker(),
                      },
                    ])
                  ),
                ]}
              />
            </Box>
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
              color="primary"
              startIcon={running ? <StopIcon /> : <PlayArrowIcon />}
              onClick={() => (running ? restartWorker() : runWorker())}
            >
              {!isBreakpointBelowSm && (running ? "Stop" : "Run")}
            </Button>
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
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* DOCUMENT EDITOR */}
          <Window name="Document">
            <CodeMirror
              ref={docEditorRef}
              style={{ height: "100%", overflow: "auto" }}
              height="100%"
              value={doc}
              onChange={onDocChange}
              lang="text/html"
              basicSetup={{
                bracketMatching: false,
                closeBrackets: false,
                searchKeymap: false,
                highlightSelectionMatches: false,
              }}
              theme={basicDark}
              extensions={[
                EditorView.lineWrapping,
                MarkExtension,
                highlightWhitespace(),
              ]}
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
              doc={doc}
              addMarks={(spans) => addMarks(docEditorRef.current.view, spans)}
            />
          </Window>
        </Box>
      </Box>
    </Box>
  );
};

export default Home;
