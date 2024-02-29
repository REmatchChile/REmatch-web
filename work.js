import REmatch from "./emscripten_binding.js";

// Minimum number of matches to send in a single message
const MIN_MESSAGE_SIZE = 25000;

// Initialize WASM
let REmatchModuleInstance = null;
(async () => {
  REmatchModuleInstance = await REmatch();
})();

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

addEventListener("message", (e) => {
  if (REmatchModuleInstance === null) {
    postMessage({ type: "ERROR", payload: "WASM module not loaded yet" });
    return;
  }

  try {
    const { query, doc } = e.data;
    const flags = new REmatchModuleInstance.Flags();
    const rgx = REmatchModuleInstance.compile(query, flags);
    const match_iterator = rgx.finditer(doc);

    // Get variables
    const variables_vector = match_iterator.variables();
    const variables = [];
    for (let i = 0; i < variables_vector.size(); ++i)
      variables.push(variables_vector.get(i));
    postMessage({ type: "VARIABLES", payload: variables });

    // Get matches
    let matchesBuffer = [];
    let match = match_iterator.next();
    while (match != null) {
      const currentMatch = [];
      variables.forEach((variable) => {
        const start = match.start(variable);
        const end = match.end(variable);
        currentMatch.push([
          utf8IndexToStringIndex(doc, start),
          utf8IndexToStringIndex(doc, end),
        ]);
      });
      matchesBuffer.push(currentMatch);

      if (matchesBuffer.length === MIN_MESSAGE_SIZE) {
        postMessage({
          type: "MATCHES",
          payload: matchesBuffer,
        });
        matchesBuffer = [];
      }

      match = match_iterator.next();
    }

    // Send remaining matches if any
    if (matchesBuffer.length > 0) {
      postMessage({
        type: "MATCHES",
        payload: matchesBuffer,
      });
    }

    // Notify that we're done
    postMessage({
      type: "FINISHED",
    });

    // Free WASM objects memory manually
    flags.delete();
    rgx.delete();
    match_iterator.delete();
  } catch (err) {
    const [type, message] = REmatchModuleInstance.getExceptionMessage(err);
    postMessage({
      type: "ERROR",
      payload: `${type.slice(9)}: ${message}`,
    });
  }
});
