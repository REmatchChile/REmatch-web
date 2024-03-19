import React, { useCallback, useEffect, useRef, useState } from "react";

/* MaterialUI */
import { Box, Typography, Chip, Tooltip, ToggleButton } from "@mui/material";
import { basicDark, basicLight } from "@uiw/codemirror-theme-basic";
import CodeMirror, {
  EditorView,
  highlightWhitespace,
} from "@uiw/react-codemirror";
import {
  MarkExtension,
  addMarks,
  clearMarks,
} from "../codemirror-extensions/MarkExtension";
import { REQLExtension } from "../codemirror-extensions/REQLExtension";
import MatchesTable from "../components/MatchesTable";
import Window from "../components/Window";
import { useTheme } from "@emotion/react";
import { enqueueSnackbar } from "notistack";

const WORKPATH = `${process.env.PUBLIC_URL}/work.js`;
const ONCHANGE_EXECUTION_DELAY_MS = 500;

const ExecutionStatus = ({ errorMessage, numMatches, processing }) => {
  const formatter = new Intl.NumberFormat("en-US");
  const foundNumberStr = formatter.format(numMatches);
  const chipColor = errorMessage.length ? "error" : "default";
  const chipLabel = errorMessage.length
    ? "Error"
    : processing
    ? `Processing (Found ${foundNumberStr})`
    : `Finished (Found ${foundNumberStr})`;
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
  const [errorMessage, setErrorMessage] = useState("");
  const [processing, setProcessing] = useState(false);
  const [isMultiRegex, setIsMultiRegex] = useState(false);
  const worker = useRef(null);
  const workerIsAlive = useRef(false);
  const docEditorRef = useRef();
  const theme = useTheme();
  const queryId = useRef(0);

  const onQueryChange = useCallback((val, viewUpdate) => {
    setQuery(val);
  }, []);

  const onDocChange = useCallback((val, viewUpdate) => {
    setDoc(val);
  }, []);

  useEffect(() => {
    if (docEditorRef.current.view) clearMarks(docEditorRef.current.view);
  }, [docEditorRef, query, doc]);

  useEffect(() => {
    queryId.current = Date.now();
    setErrorMessage("");
    setMatches([]);
    setVariables([]);
    setProcessing(false);
    // Execute query after delay
    if (workerIsAlive.current && query.length > 0) {
      setProcessing(true);
      const timeoutId = setTimeout(() => {
        worker.current.postMessage({
          type: "QUERY_INIT",
          query: query,
          doc: doc,
          queryId: queryId.current,
          isMultiRegex: isMultiRegex,
        });
      }, ONCHANGE_EXECUTION_DELAY_MS);
      return () => clearTimeout(timeoutId);
    }
    // eslint-disable-next-line
  }, [query, doc, isMultiRegex]);

  const restartWorker = () => {
    worker.current = new Worker(WORKPATH, { type: "module" });
    worker.current.onmessage = (event) => {
      switch (event.data.type) {
        case "ALIVE": {
          // Worker is alive and ready for execution
          workerIsAlive.current = true;
          break;
        }
        case "QUERY_VARIABLES": {
          // The regex has been compiled, ask for the first chunk of matches
          if (event.data.queryId !== queryId.current) return;
          setVariables(event.data.variables);
          worker.current.postMessage({ type: "QUERY_NEXT" });
          break;
        }
        case "QUERY_NEXT": {
          // Prevent processing of previous queries to avoid overlapping matches
          if (event.data.queryId !== queryId.current) return;
          // Handle chunk of matches
          setMatches((prevMatches) => [...prevMatches, ...event.data.matches]);
          if (event.data.hasNext)
            worker.current.postMessage({ type: "QUERY_NEXT" });
          else setProcessing(false);
          break;
        }
        case "ERROR": {
          // An error occurred in the worker
          queryId.current = null;
          console.error(event.data.error);
          setErrorMessage(event.data.error);
          setProcessing(false);
          break;
        }
        case "ABORT": {
          // REmatch's module had a critical error
          queryId.current = null;
          workerIsAlive.current = false;
          worker.current.terminate();
          setProcessing(false);
          console.error("Emscripten called abort(). Restarting worker...");
          enqueueSnackbar(
            "Error: Abnormal termination. Possible memory limit reached in our Emscripten bindings. You can still explore the existing matches or try again later. Restarting web worker...",
            {
              variant: "error",
            }
          );
          restartWorker();
          break;
        }
        default: {
          console.error("UNHANDLED WORKER MESSAGE RECEIVED", event.data);
          break;
        }
      }
    };
  };

  useEffect(() => {
    restartWorker();
    return () => {
      // Terminate worker when component unmounts
      if (worker.current) {
        worker.current.terminate();
      }
    };
    // eslint-disable-next-line
  }, []);

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
                <Box width="4rem">
                  <Tooltip
                    title={
                      isMultiRegex ? "Disable MultiRegex" : "Enable MultiRegex"
                    }
                  >
                    <ToggleButton
                      value="check"
                      color="primary"
                      selected={isMultiRegex}
                      onChange={() =>
                        setIsMultiRegex((prevState) => !prevState)
                      }
                      sx={{
                        fontFamily: "monospace",
                        fontSize: "0.75rem",
                        fontWeight: "bolder",
                        height: "100%",
                        width: "100%",
                        textDecoration: isMultiRegex
                          ? "none"
                          : "line-through !important",
                      }}
                    >
                      {"Multi"}
                    </ToggleButton>
                  </Tooltip>
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
              extensions={[EditorView.lineWrapping, MarkExtension]}
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
