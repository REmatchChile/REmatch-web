import React, { useCallback, useEffect, useRef, useState } from "react";

/* MaterialUI */
import { Box, Typography, Chip, Tooltip } from "@mui/material";
import { basicDark } from "@uiw/codemirror-theme-basic";
import CodeMirror, {
  EditorState,
  EditorView,
  highlightWhitespace,
} from "@uiw/react-codemirror";
import {
  MarkExtension,
  addMarks,
  removeMarks,
} from "../codemirror-extensions/MarkExtension";
import { REQLExtension } from "../codemirror-extensions/REQLExtension";
import MatchesTable from "../components/MatchesTable";
import Window from "../components/Window";

const WORKPATH = `${process.env.PUBLIC_URL}/work.js`;
const ONCHANGE_EXECUTION_DELAY_MS = 500;

const ExecutionStatus = ({ errorMessage, numMatches }) => {
  const chipColor = errorMessage.length ? "error" : "default";
  const chipLabel = errorMessage.length
    ? "Error"
    : `${numMatches} Matches found`;
  return (
    <Tooltip
      title={errorMessage}
      arrow
      placement="bottom"
      enterDelay={0}
      leaveDelay={0}
      componentsProps={{
        tooltip: {
          sx: {
            backgroundColor: "error.dark",
            color: "error.contrastText",
            whiteSpace: "pre-wrap",
            maxWidth: "none",
            fontSize: "1rem",
            fontFamily: "monospace",
            p: 1.5,
          },
        },
        arrow: {
          sx: {
            color: "error.dark",
          },
        },
      }}
    >
      <Chip
        variant="contained"
        color={chipColor}
        label={chipLabel}
        sx={{
          borderRadius: 1,
          typography: "body-xs",
          textTransform: "uppercase",
          fontWeight: "bold",
        }}
      />
    </Tooltip>
  );
};

/* MAIN INTERFACE */
const Home = () => {
  const [variables, setVariables] = useState([]);
  const [matches, setMatches] = useState([]);
  const [query, setQuery] = useState(
    "(^|\\n)!firstName{[A-Z][a-z]+} !lastName{([A-Z][a-z ]+)+}($|\\n)"
  );
  const [doc, setDoc] = useState(
    "Nicolas Van Sint Jan\nVicente Calisto\nMarjorie Bascunan\nOscar Carcamo\nCristian Riveros\nDomagoj Vrgoc\nIgnacio Pereira\nKyle Bossonney\nGustavo Toro\n"
  );
  const [workerIsAlive, setWorkerIsAlive] = useState(false);
  const [worker, setWorker] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const docEditorRef = useRef();

  const onQueryChange = useCallback((val, viewUpdate) => {
    setQuery(val);
  }, []);

  const onDocChange = useCallback((val, viewUpdate) => {
    setDoc(val);
  }, []);

  const executeQuery = () => {
    setErrorMessage("");
    setVariables([]);
    setMatches([]);
    removeMarks(docEditorRef.current.view);
    if (workerIsAlive) {
      worker.postMessage({ type: "QUERY_INIT", query: query, doc: doc });
    }
  };

  useEffect(() => {
    // Execute query after
    const timeoutId = setTimeout(() => {
      executeQuery();
    }, ONCHANGE_EXECUTION_DELAY_MS);
    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line
  }, [query, doc, workerIsAlive]);

  useEffect(() => {
    // Set up worker
    const newWorker = new Worker(WORKPATH, { type: "module" });
    setWorker(newWorker);
    return () => {
      // Terminate worker when component unmounts
      newWorker.terminate();
    };
  }, []);

  useEffect(() => {
    if (worker) {
      worker.onmessage = (event) => {
        switch (event.data.type) {
          case "ALIVE": {
            // Worker is alive and ready for execution
            setWorkerIsAlive(true);
            break;
          }
          case "QUERY_VARIABLES": {
            // The regex has been compiled, ask for the first chunk of matches
            setVariables(event.data.variables);
            worker.postMessage({ type: "QUERY_NEXT" });
            break;
          }
          case "QUERY_NEXT": {
            // Handle chunk of matches
            setMatches((prevMatches) => [
              ...prevMatches,
              ...event.data.matches,
            ]);
            if (event.data.hasNext) worker.postMessage({ type: "QUERY_NEXT" });
            break;
          }
          case "ERROR": {
            // An error occurred in the worker
            console.error(event.data.error);
            setErrorMessage(event.data.error);
            break;
          }
          default: {
            console.error("UNHANDLED WORKER MESSAGE RECEIVED", event.data);
            break;
          }
        }
      };
    }
  }, [worker]);

  return (
    <Box
      component="main"
      sx={{
        flex: "1 1 auto",
        display: "flex",
        flexDirection: "column",
        p: 1,
        overflow: "hidden",
      }}
    >
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
            gap: 1,
          }}
        >
          {/* PATTERN EDITOR */}
          <Box sx={{ flex: "0 0 0" }}>
            <Window
              headerText={
                <Typography variant="subtitle2" component="div">
                  REQL Query
                </Typography>
              }
              headerStatus={
                <ExecutionStatus
                  errorMessage={errorMessage}
                  numMatches={matches.length}
                />
              }
            >
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
                    maxHeight: "6rem",
                    p: .5,
                    background: "#2E3235",
                  }}
                >
                  <CodeMirror
                    style={{ flex: 1, height: "100%", overflow: "auto" }}
                    height="100%"
                    value={query}
                    onChange={onQueryChange}
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
                      highlightWhitespace(),
                      EditorView.lineWrapping,
                    ]}
                  />
                </Box>
              </Box>
            </Window>
          </Box>
          {/* DOCUMENT EDITOR */}
          <Window
            headerText={
              <Typography variant="subtitle2" component="div">
                Document
              </Typography>
            }
          >
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
          <Window
            headerText={
              <Typography variant="subtitle2" component="div">
                Matches
              </Typography>
            }
          >
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
