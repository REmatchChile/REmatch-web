// eslint-disable-next-line no-undef
importScripts('./rematch_wasm.js');

const { RegEx, RegExOptions, Anchor } = Module;

const MAX_MATCHES = 100;

this.onmessage = (m) => {
  let count = 0;
  let matches = [];
  let currMatch = {};
  let match;
  let rgxOptions = new RegExOptions();
  rgxOptions.early_output = true;
  let rgx = new RegEx(m.data.query, rgxOptions);
  
  /* THIS SHOULD BE IN RegEx OBJECT */
  let schema = [...m.data.query.matchAll(/!([A-Za-z0-9]+)/g)].map((m) => (m[1]));
  this.postMessage({
    type: 'SCHEMA',
    payload: schema,
  });
  let iterable = rgx.findIter(m.data.text, Anchor.kUnanchored);
  while (iterable.hasNext()) {
    match = iterable.next();
    schema.forEach(variable => {
      currMatch[variable] = match.span(variable);
    })
    matches.push(currMatch);
    currMatch = {};
    count++;
    if (count == MAX_MATCHES) break;
  }
  this.postMessage({
    type: 'MATCHES',
    payload: matches,
  });
  rgxOptions.delete();
  rgx.delete();
}