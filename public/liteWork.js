// eslint-disable-next-line no-undef
importScripts('./rematch_wasm.js');

const { RegEx, RegExOptions } = Module;

const MAX_MATCHES = 100;

this.onmessage = (m) => {
  let count = 0;
  let matches = [];
  let currMatch = {};
  let match;
  let rgxOptions = new RegExOptions();
  rgxOptions.early_output = true;
  rgxOptions.start_anchor = true;
  rgxOptions.end_anchor = true;
  let rgx = new RegEx(m.data.query, rgxOptions);
  
  /* THIS SHOULD BE IN RegEx OBJECT */
  let schema = [...m.data.query.matchAll(/!([A-Za-z0-9]+)/g)].map((m) => (m[1]));
  this.postMessage({
    type: 'SCHEMA',
    payload: schema,
  });
  
  while ((match = rgx.findIter(m.data.text))) {
    
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