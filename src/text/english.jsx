import React from 'react';

import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';

import Viewer from '../components/Viewer';

const WORKPATH = `${process.env.PUBLIC_URL}/liteWork.js`;
let worker = new Worker(WORKPATH);

const adventures = "You don't know about me without you have read a book by the name of The Adventures of Tom Sawyer but that ain't no matter. That book was made by Mr Mark Twain and he told the truth, mainly. There was things which he stretched, but mainly he told the truth. That is nothing. I never seen anybody but lied one time or another, without it was Aunt Polly or the widow, or maybe Mary. Aunt Polly-Tom's Aunt Polly, she is-and Mary, and the Widow Douglas is all told about in that book, which is mostly a true book, with some stretchers, as I said before.";
const examples = {
  example1: {
    rematch: '.*[\\.^]!sentence{[^\\.]*!noun{[A-Z][a-z]* }[^\\.]*\\.}.*',
    regex: '([A-Z][^\\.]*([A-Z][a-z]* )[^\\.]*\\.)'
  },
  example2: {
    rematch: '.*[\\.^]!sen{[^\\.]*!n1{[A-Z][a-z]* }[^\\.]*!n2{[A-Z][a-z]*}[^\\.]*\\.}.*',
    regex: '([A-Z][^\\.]*([A-Z][a-z]* )[^\\.]*([A-Z][a-z]* )[^\\.]*\\.)'
  },
  example3: {
    rematch: '.*!x{.+}.*',
  }
}

const english = {
  about: {
    title: <Typography variant="h5" color="primary" align="center">About</Typography>,
    howto:
      <div className="sectionContainer">
        <Typography variant="subtitle1" color="primary">
          How to use this page?
        </Typography>
        <Typography variant="body2" align="justify">
          This page serves as a visualisation tool for the <span className="cm-m0">REmatch</span> library,
          which allows users to run regular expressions over a text document,
          and extract certain pieces of information of their interest.
        </Typography>
        <Typography variant="body2" align="justify">
          The basic usage is simple: you enter your regular expression
          in the <span className="code">Query</span> field of the main page, and your text
          in the <span className="code">Text</span> page. Once you hit
          the <span className="code">Run</span> button, the
          field <span className="code">Matches</span> will fill up with the encountered results.
        </Typography>
        <Typography variant="body2" align="justify">
          To see where a result appears inside the text, you can click on it.
        </Typography>
        <Typography variant="body2" align="justify">
          You can also upload the text from a file by clicking
          the <span className="code">Import File</span> button and selecting a text file on your computer.
         </Typography>
      </div>,
    regexinrematch:
      <div className="sectionContainer">
        <Typography variant="subtitle1" color="primary">
          Regular Expressions in REmatch
        </Typography>
        <Typography variant="body2" align="justify">
          The syntax of regular expressions in <span className="cm-m0">REmatch</span> is almost
          identical to that of standard libraries, except for the treatment of capture groups.
          This stems from the design philosophy behind <span className="cm-m0">REmatch</span>:
          It is a library made to extract data from text. This is somewhat complementary to the main focus
          of standard regex libraries, whose main objective is to search for a pattern inside of a document.
        </Typography>
        <Typography variant="body2" align="justify">
          To make this explicit, every extraction group is named, and called a variable. For example,
          instead of writing <span className="code">{'([a-z]*)'}</span> to extract a sequence of
          lower case letters, in <span className="cm-m0">REmatch</span> we
          write <span className="code">{'!x{[a-z]*}'}</span>
          indicating that this information is extracted into the variable x. This is particularly
          useful when multiple variables are used, and when wanting to do more complex operations
          with the obtained results. For instance, we might want to take a variable x storing the
          name of a person, and a variable y, storing their last name, and return them in the
          format last name, first name. Having variable names makes this rather trivial.
        </Typography>
        <Typography variant="body2" align="justify">
          It is important to note that the syntax of regular expressions without capture groups is
          identical in <span className="cm-m0">REmatch</span> as it is in any other regex library you might have encountered before.
        </Typography>
        <Typography variant="body2" align="justify">
          If you are interested in learning more about the differences
          between <span className="cm-m0">REmatch</span> and standard
          regex libraries, please visit the following <span className="important">LINK?</span>.
        </Typography>
      </div>,
    anotherlibrary:
      <div className="sectionContainer">
        <Typography variant="subtitle1" color="primary">
          Another library for regular expressions?
        </Typography>
        <Typography variant="body2" align="justify">
          No. <span className="cm-m0">REmatch</span> is different from other regex libraries.
        Regarding evaluating simple regular
        expressions (without grouping), <span className="cm-m0">REmatch</span> has no
        differences, and it runs as fast as other libraries.
        However, suppose you want to extract information. In that
        case, <span className="cm-m0">REmatch</span> is different: <span className="cm-m0">REmatch</span> looks
        for <span className="cm-m0">ALL POSSIBLE</span> matches of
        your regular expression with the document.
        To illustrate why this might be useful, we provide several examples from text analysis.
        For this purpose, we will analyze the first paragraph of Tom Sawyer's
        book <span className="cm-m0">"Adventures of Huckleberry Finn"</span> shown in the box below.
       </Typography>
        <Paper className="codeBlock" elevation={3}>
          {adventures}
        </Paper>
      </div>,
    example1:
      <div className="sectionContainer">
        <Typography variant="subtitle2" color="primary">
          Example 1
        </Typography>
        <Typography variant="body2" align="justify">
          One common task in analyzing a corpus of text is determining the context in which
          certain words appear. For instance, we might wish to extract each proper noun (for
          simplicity we will consider any uppercase letter a proper noun), together with the
          sentence in which it appears, in order to determine what is the most common way the
          noun is used.
        </Typography>
        <Typography variant="body2" align="justify">
          If you are used to writing regular expressions, you would probably come up with
          something similar to the formula below:
        </Typography>
        <Viewer
          idx="regex1"
          worker={worker}
          regex={examples.example1.regex}
          text={adventures}
        />
        <Typography variant="body2" align="justify">
          Intuitively, the outer group searches for the sentence (starting with a capital letter
          and expanding until a dot, without seeing any dots in between) , and the inner group looks
          for the proper noun inside of this sentence. If you try to evaluate this expression in your
          favourite regex engine (that, surprisingly,  differs
          from <span className="cm-m0">REmatch</span>), you will indeed obtain
          all sentences which have a proper noun inside them, and the noun itself. The problem is,
          that for each sentence with more than one proper noun inside, only one occurrence is returned.
          For example, the very first sentence of our text contains a series of proper nouns, but only
          the very last one (Sawyer) will be returned. You can play around with regex libraries and come
          up with a series of similar expressions, but due to the "greedy" semantics they deploy, none of
          them will actually allow you to specify the desired data with a single regex.
        </Typography>
        <Typography variant="body2" align="justify">
          On the other hand, the <span className="cm-m0">REmatch</span> expression below does the trick.
          We invite you to try it out in our web interface here <span className="important">LINK?</span>.
        </Typography>
        <Viewer
          idx="rematch1"
          worker={worker}
          rematch={examples.example1.rematch}
          text={adventures}
        />
      </div>,
    example2:
      <div className="sectionContainer">
        <Typography variant="subtitle2" color="primary">
          Example 2
        </Typography>
        <Typography variant="body2" align="justify">
          Another typical task is to analyze when two terms are used together in the same context.
          For example, we might wonder when two characters are talked about in the same sentence in
          our text. For this, we might want to extract all pairs of proper nouns that appear within
          the same sentence.
        </Typography>
        <Typography variant="body2" align="justify">
          With regex, we might do something similar to the example above, but now adding an
          additional capture group inside of the sentence. The result is something similar to:
        </Typography>
        <Viewer
          idx="regex2"
          worker={worker}
          regex={examples.example2.regex}
          text={adventures}
        />
        <Typography variant="body2" align="justify">
          Indeed, this expression works very well when only two proper nouns are present inside of
          a sentence. However, in the final sentence of our paragraph this will not work since
          multiple proper nouns are present. On the other hand, in <span className="cm-m0">REmatch</span>,
          the followingexpression does the trick:
        </Typography>
        <Viewer
          idx="rematch2"
          worker={worker}
          rematch={examples.example2.rematch}
          text={adventures}
        />
        <Typography variant="body2" align="justify">
          We note that the logic is equivalent in both extensions: we simply duplicate the pattern
          for the proper noun. Also note that <span className="cm-m0">REmatch</span> expression
          is more verbose principally due to
          having explicit variable names, given that the remainder of the expressions is identical.
        </Typography>
      </div>,
    example3:
      <div className="sectionContainer">
        <Typography variant="subtitle2" color="primary">
          Example 3
        </Typography>
        <Typography variant="body2" align="justify">
          As our final example we will assume that we want to extract all non empty substrings from our text.
          The <span className="cm-m0">REmatch</span> expression for this is simply:
        </Typography>
        <Viewer
          idx="rematch3"
          worker={worker}
          rematch={examples.example3.rematch}
          text={adventures}
        />
        <Typography variant="body2" align="justify">
          The expression works as intended: <span className="code">.*</span> positions
          us anywhere inside the document, then a non empty string is extracted into the
          variable <span className="code">x</span>, and finally the expression matches the remainder of
          the document via the <span className="code">.*</span> statement.
        </Typography>
        <Typography variant="body2" align="justify">
          Strictly speaking, standard regex libraries can not express this query in a single expression.
          Indeed, due to their semantics, the synthetic equivalent of the expression above,
          that is, <span className="code">(.+)</span>, will simply match the entire document, and
          something similar occurs with <span className="code">.*(.+).*</span>.
        </Typography>
        <Typography variant="body2" align="justify">
          One can use regex libraries and force the expression to try and retrieve the match from
          every possible position, this will still not do the trick, as the entire remainder of the
          string will be consumed.
        </Typography>
        <Typography variant="body2" align="justify">
          While this example might seem very academic, and one might argue that something like
          overlapping matches might not be very useful (e.g. in a
          sequence <span className="code">abcde</span> having both
          the substrings <span className="code">bc</span> and <span className="code">cde</span> might
          seem and overkill). We however argue that there are many use cases when precisely this
          type of behaviour is sought after.
        </Typography>
        <Typography variant="body2" align="justify">
          The classical example here is DNA sequencing, where the DNA strand is represented
          as a string, and one would like to analyze different proteins involved in defining
          this DNA strand. The thing here is that proteins can be joined at certain points,
          meaning that if our strand has the letter sequence <span className="code">abcabbcdefbb</span>,
          both <span className="code">abcabb</span> (substring from positions 0 to 5),
          and <span className="code">abbcdefbb</span> (positions 3 to 11) might be two proteins
          participating in this DNA strand (for simplicity we
          assume <span className="code">ab</span> to be the
          start trigger, and <span className="code">bb</span> the
          end trigger, the situation in real world is much more involved, we invite
          you to explore our example here <span className="important">LINK?</span> to
          see how this would actually be done).
        </Typography>
      </div>,
    outputtime:
      <div className="sectionContainer">
        <Typography variant="subtitle1" color="primary">
          More outputs more time?
        </Typography>
        <Typography variant="body2" align="justify">
          No. <span className="cm-m0">REmatch</span> is based on the theory of "constant-delay"
          algorithms that have been developed in the last years
          (see <a className="cm-m1" target="_blank" href="https://dl.acm.org/doi/10.1145/3351451">here</a>).
          In a nutshell, the <span className="cm-m0">REmatch</span> algorithm reads your
          document just once and takes a
          fixed amount of time (say 0.001ms) to give you the next output.
          Of course, if the engine finds 1 million results, it will take you
          1 second to get all of them, but no more than that. In fact, suppose
          the file has 1MB of data, and we take 1ms to read the document. In
          that case, the algorithm will take 0.001ms to give you the next result,
          regardless that it found ten or 10^10 outputs.
        </Typography>
        <Typography variant="body2" align="justify">
          Given its design philosophy, <span className="cm-m0">REmatch</span> also
          does not suffer from the catastrophic
          backtracking <span className="important">LINK?</span> issue many regex engines are susceptible to. In a
          nutshell, <span className="cm-m0">REmatch</span> can run even
          faster than standard regex libraries and finds
          more outputs at the same time!
        </Typography>
        <Typography variant="body2" align="justify">
          We invite you to explore the REmatch algorithm in
          our <a className="cm-m1" target="_blank" href="https://dl.acm.org/doi/10.1145/3351451">academic paper</a>,
          by examining its source code
          on <a className="cm-m1" target="_blank" href="https://github.com/REmatchChile/REmatch">GitHub</a>,
          or by experimenting with a version of <span className="cm-m0">REmatch</span> in your favourite programming language.
          The current support includes <span className="code">C++</span>, <span className="code">Python</span> and <span className="code">JavaScript</span>.
        </Typography>
      </div>,
    authors:
      <div className="sectionContainer">
        <Typography variant="subtitle1" color="primary">
          More outputs more time?
        </Typography>
        <h1>bla</h1>
      </div>
  }
}

export default english;