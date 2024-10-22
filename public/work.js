import initREmatch from "https://cdn.jsdelivr.net/npm/rematch-javascript@1.2.1/lib/index.mjs";

// Number of iterations before posting a matches message
const MIN_MATCHES_PER_POST = 8192;

// Initialize WASM
let REmatch = null;
(async () => {
  REmatch = await initREmatch();
  REmatch.onAbort = () => {
    // Abort event is triggered on critical errors, for example when the worker runs out of memory
    self.postMessage({ type: "ABORT" });
  };
  self.postMessage({ type: "ALIVE" });
})();

// TODO:
const getErrorText = (error) => {
  if (error instanceof WebAssembly.Exception) {
    const [type, message] = REmatch.getExceptionMessage(error);
    return `${type}: ${message}`;
  }
  return error.toString();
};

let queryId;
let query;
let variables;
let regex;
let matchGenerator;
let multiMatch;

const MAX_MEMPOOL_DUPLICATIONS = 8;
const MAX_DETERMINISTIC_STATES = 1000;

self.onmessage = (event) => {
  try {
    switch (event.data.type) {
      case "QUERY_INIT": {
        queryId = event.data.queryId;
        multiMatch = event.data.isMultiMatch;
        // Initialize query
        if (regex) {
          regex.free();
          regex = null;
        }
        if (matchGenerator) {
          matchGenerator.free();
          matchGenerator = null;
        }

        if (multiMatch) {
          query = REmatch.multiReql(event.data.query);
        } else {
          query = REmatch.reql(
            event.data.query,
            REmatch.Flags.NONE,
            MAX_MEMPOOL_DUPLICATIONS,
            MAX_DETERMINISTIC_STATES
          );
        }
        matchGenerator = query.findIter(
          event.data.doc,
          REmatch.Flags.NONE,
          MAX_MEMPOOL_DUPLICATIONS,
          MAX_DETERMINISTIC_STATES
        );
        // Get variables
        variables = query.variables();
        self.postMessage({ type: "QUERY_VARIABLES", variables, queryId });
        break;
      }
      case "QUERY_NEXT": {
        // Send a chunk of matches, notifying the main thread if there are more matches to send
        const matches = [];
        for (const match of matchGenerator) {
          const matchData = variables.map((variable) => (multiMatch ? match.spans(variable) : [match.span(variable)]));
          matches.push(matchData);
          // Post matches chunk and stop execution until further requests
          if (matches.length >= MIN_MATCHES_PER_POST) {
            self.postMessage({
              type: "QUERY_NEXT",
              matches,
              hasNext: true,
              queryId,
            });
            return;
          }

          match.free();
        }

        // Last chunk of matches, it may be empty but it is necessary to notify the main thread
        self.postMessage({
          type: "QUERY_NEXT",
          matches,
          hasNext: false,
          queryId,
        });
        break;
      }
      default: {
        console.error("UNHANDLED WORKER MESSAGE SENT", event.data);
        break;
      }
    }
  } catch (err) {
    self.postMessage({
      type: "ERROR",
      error: getErrorText(err),
    });
  }
};
