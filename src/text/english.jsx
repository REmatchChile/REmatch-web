import React from 'react';

import Typography from '@material-ui/core/Typography';


const english = {
  // TODO: Agregar los ejemplos cuando estén disponibles
  examples: {
    querys: {
      BioExample1: '(^|\\.)!sen{[^\\.]*!n1{[A-Z][a-z]*} [^\\.]*!n2{[A-Z][a-z]*}( [^\\.]*)?\\.}',
      BioExample2: '(^|\\.)!sentence{[^\\.]*!noun{[A-Z][a-z]*}( [^\\.]*)?\\.}',
      BioExample3: '!x{a.+}',
      'Context Analysis': '(^|\\n|\\.\\s)!oracion{[^.]*!palabra{foo|bar}[^.]*}\\.',
    },
    texts: {
      BioExample1:`Proteina 1
Proteina 2
Aminoacido 1
Procarionte 3`,
      BioExample2:'ACATGCATCAGCTTCAGCATCAGCTACGACTAGCTAGCATCAGCATCAGCTACGCATCAG',
      BioExample3:`Proteina 8
Proteina 6
Aminoacido 10
GCATCAGCTACTACGATCAGCACTACATGCACTAGCATCAGACT`,
      'Context Analysis': `En un foo de la Mancha. De cuyo bar no quiero acordarme.
No ha mucho foo que vivía un bar de los de foobar en astillero.
Adarga antigua, foobarfoo flaco y barfoobar corredor.`
    },
    explanations: {
      BioExample1: 'The classical example here is DNA sequencing, where the DNA strand is represented as a string, and one would like to analyze different proteins involved in defining this DNA strand. The thing here is that proteins can be joined at certain points, meaning that if our strand has the letter sequence <span class="code">abcabbcdefbb</span>, both <span class="code">abcabb</span> (substring from positions 0 to 5), and <span class="code">abbcdefbb</span> (positions 3 to 11) might be two proteins participating in this DNA strand (for simplicity we assume <span class="code">ab</span> to be the start trigger, and <span class="code">bb</span> the end trigger, the situation in real world is much more involved).',
      BioExample2: 'While this example might seem very academic, and one might argue that something like overlapping matches might not be very useful (e.g. in a sequence <span class="code">abcde</span> having both the substrings <span class="code">bc</span> and <span class="code">cde</span> might seem and overkill). We however argue that there are many use cases when precisely this type of behaviour is sought after.',
      'Context Analysis':
        `
        &emsp;In literature, corpus extraction and context analysis is a relevant task for linguistic analysis, and together with computer science, it has reached big achievements in natural language processing. Regular expressions are a helpful tool for efficient information extraction, giving the possibility, for example, to obtain the context of certain words, morphemes, or any other linguistic object that we can define with regular expressions.
        <br><br>
        &emsp;In this example, we want to search occurrences of words “foo” or “bar” together with their context, in this case, the sentence where it appears. For this, we can use the following <span class="cm-m0">REmatch</span> expression:
        <br><br>
        <div class="text-center">
          <span class="code">(^|\\n|\\.\\s)!sentence{[^.]*!word{foo|bar}[^.]*}\\.</span>
        </div>
        <br><br>
        &emsp;The variable “word” stores the place in the document where “foo” or “bar” appears, and the variable “sentence” stores the context. If we use this expression over the following document fragment, we get:
        <br><br>
        <div class="text-center text-document">
          En un foo de la Mancha. De cuyo bar no quiero acordarme.<br>
          No hace mucho foo que vivía un bar de los de foobar en astillero.<br>
          Adarga antigua, foobarfoo flaco y barfoobar corredor
        </div>
        <br><br>
        &emsp;By analyzing the output, we can note that some sentences contain several occurrences of “foo” or “bar”. However, with <span class="cm-m0">REmatch</span>, it is possible to extract all the pairs word-context, which will not be possible using any standard regex library.
        `
    },
    title: <Typography variant="h5" color="primary" align="center">Examples</Typography>,
    description:
      <div className="sectionContainer">
        <Typography variant="h6" color="primary">
          Regular Expressions in the World
        </Typography>
        <Typography variant="body1" align="justify">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </Typography>
      </div>,
  },
}

export default english;