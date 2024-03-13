import REmatch from "./emscripten_binding.js";

// Number of iterations before posting a matches message
const MIN_MATCHES_PER_POST = 15000;

// Initialize WASM
let REmatchModuleInstance = null;
(async () => {
  REmatchModuleInstance = await REmatch();
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
let variables;
let regex;
let match_iterator;

self.onmessage = (event) => {
  switch (event.data.type) {
    case "QUERY_INIT": {
      queryId = event.data.queryId;
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
      try {
        regex = new REmatchModuleInstance.Regex(event.data.query);
        match_iterator = regex.finditer(event.data.doc);
        // Get variables
        const variables_vector = match_iterator.variables();
        for (let i = 0; i < variables_vector.size(); ++i)
          variables.push(variables_vector.get(i));
        self.postMessage({ type: "QUERY_VARIABLES", variables, queryId });
      } catch (err) {
        self.postMessage({
          type: "ERROR",
          error: getErrorText(err),
        });
      }
      break;
    }
    case "QUERY_NEXT": {
      // Send a chunk of matches, notifying the main thread if there are more matches to send
      try {
        let match = match_iterator.next();
        const matches = [];
        while (match != null) {
          matches.push(
            variables.map((variable) => [
              match.start(variable),
              match.end(variable),
            ])
          );
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
      } catch (err) {
        self.postMessage({
          type: "ERROR",
          error: getErrorText(err),
          queryId,
        });
      }
      break;
    }
    default: {
      console.error("UNHANDLED WORKER MESSAGE SENT", event.data);
      break;
    }
  }
};
