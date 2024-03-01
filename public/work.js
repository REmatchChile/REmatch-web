import REmatch from "./emscripten_binding.js";

// Number of iterations before posting a matches message
const MIN_MATCHES_PER_POST = 15000;

// Initialize WASM
let REmatchModuleInstance = null;
(async () => {
  REmatchModuleInstance = await REmatch();
  self.postMessage({ type: "ALIVE" });
})();

// Convert UTF-8 index to javascript's UTF-16 string index
const utf8IndexToStringIndex = (str, utf8Index) => {
  let utf8Counter = 0;
  let stringIndex = 0;
  while (utf8Counter < utf8Index) {
    const code = str.codePointAt(stringIndex);
    if (code >= 0x10000) {
      utf8Counter += 4;
      ++stringIndex;
    } else if (code >= 0x0800) {
      utf8Counter += 3;
    } else if (code >= 0x0080) {
      utf8Counter += 2;
    } else {
      ++utf8Counter;
    }
    ++stringIndex;
  }
  return stringIndex;
};

const getErrorText = (error) => {
  if (error instanceof WebAssembly.Exception) {
    const [type, message] = REmatchModuleInstance.getExceptionMessage(error);
    return `${type}: ${message}`;
  }
  return error.toString();
};

let query;
let doc;
let variables;
let flags;
let regex;
let match_iterator;

const initVars = (newQuery, newDoc) => {
  // Free WASM objects memory manually
  if (flags) {
    flags.delete();
    flags = null;
  }
  if (regex) {
    regex.delete();
    regex = null;
  }
  if (match_iterator) {
    match_iterator.delete();
    match_iterator = null;
  }
  query = newQuery;
  doc = newDoc;
  variables = [];
};

self.onmessage = (event) => {
  switch (event.data.type) {
    case "QUERY_INIT": {
      // Initialize query
      initVars(event.data.query, event.data.doc);
      try {
        flags = new REmatchModuleInstance.Flags();
        regex = REmatchModuleInstance.compile(query, flags);
        match_iterator = regex.finditer(doc);
        // Get variables
        const variables_vector = match_iterator.variables();
        for (let i = 0; i < variables_vector.size(); ++i)
          variables.push(variables_vector.get(i));
        self.postMessage({ type: "QUERY_VARIABLES", variables });
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
              utf8IndexToStringIndex(doc, match.start(variable)),
              utf8IndexToStringIndex(doc, match.end(variable)),
            ])
          );
          // Post matches chunk and stop execution until further requests
          if (matches.length >= MIN_MATCHES_PER_POST) {
            self.postMessage({
              type: "QUERY_NEXT",
              matches,
              hasNext: true,
            });
            return;
          }
          match = match_iterator.next();
        }
        // Last chunk of matches, it may be empty but it is necessary to notify the main thread
        self.postMessage({ type: "QUERY_NEXT", matches, hasNext: false });
      } catch (err) {
        self.postMessage({
          type: "ERROR",
          error: getErrorText(err),
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
