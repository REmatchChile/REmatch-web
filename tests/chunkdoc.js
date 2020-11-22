fs = require('fs');
Module = require('./rematch_wasm.js');

const read = (path) => {
  return fs.readFileSync(path, 'utf-8');
}

const text = read('sparql.log.combo.2');
let regex = new Module.RegEx('.*\n[^\n]*!x{sparql[^\n]*OPTIONAL[^\n]*\n}.*');
CHUNK_SIZE = 10000;

let s = 0;
let e = CHUNK_SIZE;
let match;

let t0 = Date.now();
while (s < text.length) {
  regex.feed(text.slice(s, e));
  while ((match = regex.internalFindIter())) {
    // console.log(match.span('x'));
    continue;
  }
  s = e;
  e += CHUNK_SIZE;
}
console.log('Time:', (Date.now() - t0) / 1000);