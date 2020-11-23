// eslint-disable-next-line no-undef
importScripts('./rematch_wasm.js');

// eslint-disable-next-line no-undef
const { RegEx, RegExOptions, Anchor } = Module;
const MESSAGE_SIZE = 5000;

this.onmessage = (m) => {
    try {
        let match;
        let i = 0;
        let count = 0;
        let currMatch = [];
        let matches = [];

        let rgxOptions = new RegExOptions();
        rgxOptions.early_output = true;
        let rgx = new RegEx(m.data.query, rgxOptions);

        /* THIS SHOULD BE IN RegEx OBJECT */
        let schema = [...m.data.query.matchAll(/!([A-Za-z0-9]+)/g)].map((m) => (m[1]));
        /* THIS SHOULD BE IN RegEx OBJECT */
        this.postMessage({
            type: 'SCHEMA',
            payload: schema,
        })
        let iterable = rgx.findIter(m.data.text, Anchor.kUnanchored);
        while (iterable.hasNext()) {
            console.log('Hola');
            match = iterable.next();
            schema.forEach(variable => {
                currMatch.push(match.span(variable));
            });
            
            matches.push(currMatch);
            currMatch = [];
            count++;

            if (matches.length === MESSAGE_SIZE) {
                console.log('SEND CHUNK');
                this.postMessage({
                    type: 'MATCHES',
                    payload: matches,
                })
                matches = [];
                count = 0;
            }
        }

        if (matches.length > 0) {
            console.log('SEND LAST CHUNK');
            this.postMessage({
                type: 'MATCHES',
                payload: matches,
            });
        }

        this.postMessage({
            type: 'FINISHED',
        })

        // Send a message of finished for disable/enable button

        rgxOptions.delete();
        rgx.delete();

    } catch (err) {
        this.postMessage({
            type: 'ERROR',
            payload: err,
        });
    }
}