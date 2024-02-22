import React, { useEffect, useRef, useState } from "react";

/* MaterialUI */
import PlayArrow from "@mui/icons-material/PlayArrow";
import Stop from "@mui/icons-material/Stop";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { enqueueSnackbar } from "notistack";
import { Responsive, WidthProvider } from "react-grid-layout";
import ExamplesDialog from "./ExamplesDialog";
import MatchesTable from "./MatchesTable";
import ResizableGridWindow from "./ResizableGridWindow";
import { insertLS, getLS } from "../utils/localStorage";

import CodeMirror from "codemirror";
import "codemirror/addon/display/placeholder";
import "codemirror/theme/material-darker.css";

const ResponsiveGridLayout = WidthProvider(Responsive);

/* Worker */
const WORKPATH = `${process.env.PUBLIC_URL}/work.js`;
let worker = new Worker(WORKPATH, { type: "module" });

const DEFAULT_LAYOUT = {
  lg: [
    { i: "patternWindow", x: 0, y: 0, w: 12, h: 1, static: true },
    {
      i: "documentWindow",
      x: 0,
      y: 1,
      w: 6,
      h: 11,
      minW: 2,
      minH: 4,
    },
    { i: "matchesWindow", x: 6, y: 1, w: 6, h: 11, minW: 3, minH: 4 },
  ],
  sm: [
    { i: "patternWindow", x: 0, y: 0, w: 6, h: 1, static: true },
    {
      i: "documentWindow",
      x: 0,
      y: 1,
      w: 6,
      h: 5,
      minW: 3,
      minH: 4,
    },
    { i: "matchesWindow", x: 4, y: 1, w: 6, h: 6, minW: 3, minH: 4 },
  ],
};

/* MAIN INTERFACE */
const Home = ({ openExamplesDialog, setOpenExamplesDialog }) => {
  const [variables, setVariables] = useState([]);
  const [matches, setMatches] = useState([]);
  const [running, setRunning] = useState(false);
  const [layouts, setLayouts] = useState(getLS("layouts") || DEFAULT_LAYOUT);
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

  const onLayoutChange = (layout, layouts) => {
    insertLS("layouts", layouts);
    setLayouts(layouts);
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
      <ResponsiveGridLayout
        className="layout"
        rowHeight={64}
        breakpoints={{ lg: 996, sm: 0 }}
        cols={{ lg: 12, sm: 6 }}
        draggableHandle=".drag-handle"
        compactType="vertical"
        resizeHandles={["se", "ne", "nw", "sw"]}
        layouts={layouts}
        onLayoutChange={(layout, layouts) => onLayoutChange(layout, layouts)}
      >
        <ResizableGridWindow key="patternWindow" title="REQL query">
          <Box
            sx={{
              display: "flex",
              height: "100%",
              alignItems: "center",
            }}
          >
            <Box
              id="patternEditor"
              sx={{ height: "auto", flexGrow: 1, pl: 2 }}
            ></Box>
            <Button
              variant="contained"
              sx={{
                borderRadius: 0,
                px: 3,
              }}
              color="primary"
              startIcon={running ? <Stop /> : <PlayArrow />}
              onClick={running ? restartWorker : runWorker}
            >
              {running ? "Stop" : "Run"}
            </Button>
          </Box>
        </ResizableGridWindow>
        <ResizableGridWindow key="documentWindow" title="Document">
          <Box id="documentEditor" sx={{ height: "100%", pb: "16px" }}></Box>
        </ResizableGridWindow>
        <ResizableGridWindow key="matchesWindow" title="Matches">
          <Box sx={{ height: "100%" }}>
            <MatchesTable
              matches={matches}
              variables={variables}
              documentEditor={documentEditor}
              addMarks={addMarks}
              clearMarks={clearMarks}
            />
          </Box>
        </ResizableGridWindow>
      </ResponsiveGridLayout>
    </>
  );
};

export default Home;
