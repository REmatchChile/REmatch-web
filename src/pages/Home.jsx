import React, { useCallback, useEffect, useRef, useState } from "react";

/* MaterialUI */
import { Box, Typography, Chip, Tooltip } from "@mui/material";
import { basicDark, basicLight } from "@uiw/codemirror-theme-basic";
import CodeMirror, {
  EditorView,
  highlightWhitespace,
} from "@uiw/react-codemirror";
import {
  MarkExtension,
  addMarks,
  clearMarks
} from "../codemirror-extensions/MarkExtension";
import { REQLExtension } from "../codemirror-extensions/REQLExtension";
import MatchesTable from "../components/MatchesTable";
import Window from "../components/Window";
import { useTheme } from "@emotion/react";

const WORKPATH = `${process.env.PUBLIC_URL}/work.js`;
const ONCHANGE_EXECUTION_DELAY_MS = 500;

const ExecutionStatus = ({ errorMessage, numMatches, processing }) => {
  const chipColor = errorMessage.length ? "error" : "default";
  const chipLabel = errorMessage.length
    ? "Error"
    : processing
    ? "Processing..."
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
  const [query, setQuery] = useState("");
  const [doc, setDoc] = useState("");
  const [workerIsAlive, setWorkerIsAlive] = useState(false);
  const [worker, setWorker] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [processing, setProcessing] = useState(false);
  const docEditorRef = useRef();
  const theme = useTheme();
  const queryId = useRef(0);

  const onQueryChange = useCallback((val, viewUpdate) => {
    if (docEditorRef.current)
      clearMarks(docEditorRef.current.view);
    setQuery(val);
  }, [docEditorRef]);

  const onDocChange = useCallback((val, viewUpdate) => {
    if (docEditorRef.current)
      clearMarks(docEditorRef.current.view);
    setDoc(val);
  }, [docEditorRef]);

  useEffect(() => {
    queryId.current = Date.now();
    setErrorMessage("");
    setMatches([]);
    setVariables([]);
    // Execute query after delay
    if (workerIsAlive && query.length) {
      setProcessing(true);
      const timeoutId = setTimeout(() => {
        worker.postMessage({
          type: "QUERY_INIT",
          query: query,
          doc: doc,
          queryId: queryId.current,
          isMultiMatch: true,
        });
      }, ONCHANGE_EXECUTION_DELAY_MS);
      return () => clearTimeout(timeoutId);
    }
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
            // Prevent processing of previous queries to avoid overlapping matches
            if (event.data.queryId !== queryId.current) return;
            // Handle chunk of matches
            setMatches((prevMatches) => [
              ...prevMatches,
              ...event.data.matches,
            ]);
            if (event.data.hasNext) worker.postMessage({ type: "QUERY_NEXT" });
            else setProcessing(false);
            break;
          }
          case "ERROR": {
            // An error occurred in the worker
            console.error(event.data.error);
            setErrorMessage(event.data.error);
            setProcessing(false);
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
        overflow: "hidden",
        p: 0.5,
      }}
    >
      <Box
        sx={{
          flex: "1 1 auto",
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
                  processing={processing}
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
                  }}
                >
                  <CodeMirror
                    className="cm-reql-query-editor"
                    style={{ flex: 1, height: "100%", overflow: "auto" }}
                    height="100%"
                    value={query}
                    onChange={onQueryChange}
                    theme={
                      theme.palette.mode === "light" ? basicLight : basicDark
                    }
                    placeholder="Insert your REQL Query here"
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
              theme={theme.palette.mode === "light" ? basicLight : basicDark}
              lang="text/html"
              placeholder="Insert your document here"
              basicSetup={{
                highlightActiveLine: false,
                bracketMatching: false,
                closeBrackets: false,
                searchKeymap: false,
                highlightSelectionMatches: false,
              }}
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
