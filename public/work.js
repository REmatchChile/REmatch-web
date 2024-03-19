import REmatch from "./emscripten_binding.js";

// Number of iterations before posting a matches message
const MIN_MATCHES_PER_POST = 8192;

// Initialize WASM
let REmatchModuleInstance = null;
(async () => {
  REmatchModuleInstance = await REmatch();
  REmatchModuleInstance.onAbort = () => {
    // Abort event is triggered on critical errors, for example when the worker runs out of memory
    self.postMessage({ type: "ABORT" });
  };
  self.postMessage({ type: "ALIVE" });
})();

const getErrorText = (error) => {
  if (error instanceof WebAssembly.Exception) {
    const [type, message] = REmatchModuleInstance.getExceptionMessage(error);
    return `${type}: ${message}`;
  }
  return error.toString();
};

let queryId;
let isMultiMatch;
let variables;
let regex;
let match_iterator;

self.onmessage = (event) => {
  try {
    switch (event.data.type) {
      case "QUERY_INIT": {
        queryId = event.data.queryId;
        isMultiMatch = event.data.isMultiMatch;
        // Initialize query
        variables = [];
        if (regex) {
          regex.delete();
          regex = null;
        }
        if (match_iterator) {
          match_iterator.delete();
          match_iterator = null;
        }

        if (isMultiMatch) {
          regex = new REmatchModuleInstance.MultiRegex(event.data.query);
        } else {
          regex = new REmatchModuleInstance.Regex(event.data.query);
        }
        match_iterator = regex.finditer(event.data.doc);
        // Get variables
        const variablesVector = match_iterator.variables();
        for (let i = 0; i < variablesVector.size(); ++i)
          variables.push(variablesVector.get(i));
        variablesVector.delete();
        self.postMessage({ type: "QUERY_VARIABLES", variables, queryId });
        break;
      }
      case "QUERY_NEXT": {
        // Send a chunk of matches, notifying the main thread if there are more matches to send
        let match = match_iterator.next();
        const matches = [];
        while (match != null) {
          const matchData = variables.map((variable) => {
            if (isMultiMatch) {
              const spansVector = match.spans(variable);
              const spans = [];
              for (let i = 0; i < spansVector.size(); ++i) {
                const [from, to] = spansVector.get(i);
                // Need to convert from BigInt to Number in order to work with the application}
                spans.push([Number(from), Number(to)]);
              }
              return spans;
            } else {
              const [from, to] = match.span(variable);
              return [[Number(from), Number(to)]];
            }
          });
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
          match = match_iterator.next();
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
