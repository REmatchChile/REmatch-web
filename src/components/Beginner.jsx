import React from 'react';

import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Viewer from './Viewer';
import VerticalLinearStepper from './TutorialStepper';

// import english from '../text/english';
const WORKPATH5 = `${process.env.PUBLIC_URL}/liteWork.js`;
let worker5 = new Worker(WORKPATH5);

const email = 'janeeyre@gmail.cl'
const examples = {
  example1: {
    rematch: '.*[a-zA-Z0-9_\.]+@!domain{gmail|hotmail}\\.cl.*',
    regex: '[a-zA-Z0-9_\.]+@(gmail|hotmail)\\.cl'
  },
//   example2: {
//     rematch: '.*[\\.^]!sen{[^\\.]*!n1{[A-Z][a-z]* }[^\\.]*!n2{[A-Z][a-z]*}[^\\.]*\\.}.*',
//     regex: '([A-Z][^\\.]*([A-Z][a-z]* )[^\\.]*([A-Z][a-z]* )[^\\.]*\\.)'
//   },
//   example3: {
//     rematch: '.*!x{.+}.*',
//   }
}

const Beginner = () => {
  const [activeStep, setActiveStep] = React.useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };
  return (
    <Container maxWidth="lg" className="mainContainer">
      <div className="row">
        <div className="col-30">
          <VerticalLinearStepper 
            activeStep={activeStep}
            handleNext={() => handleNext()}
            handleBack={() => handleBack()}
            handleReset={() => handleReset()}
          />
        </div>
        <div className="col-70">
          <Typography variant="h5" color="primary" align="center" style={{marginBottom: '2rem', fontWeight: '800'}}>Beginner tutorial</Typography>
          { activeStep === 0 &&
            <div>
            <Typography variant="h6" color="primary" style={{marginBottom: '1rem'}}>
              Setup
            </Typography>
            <Typography variant="body1" align="justify" style={{marginBottom: '1rem'}}>
                You need to install the <span className="cm-m0">REmatch</span> library for Python. You can run the next command in any terminal:
                <br/>
                <span className="code">!pip3 install pyrematch</span>
            </Typography>
            <Typography variant="body1" align="justify">
                If you have already installed the library, update to the last version:
                <br/>
                <span className="code">!pip3 install --upgrade pyrematch</span>
            </Typography>
            </div>
          }
          { activeStep === 1 &&
            <div>

            </div>
          }
          { activeStep === 2 &&
            <div>
              
            </div>
          }
          { activeStep === 3 &&
            <div>
              
            </div>
          }
          {/* <Typography variant="h6" color="primary">
            What are regular expressions?
          </Typography>
          <Typography variant="body1" align="justify">
              Regular expressions are defined as a pattern and are described through specialized syntax. Some examples of situations that can be solved using regular expressions are: form validation, search and replace, text transformation, and log processing.
              Regular expressions were proposed in 1956 by mathematician Stephen Kleene, and today they are quite common so several programming languages allow their use.
          </Typography>
          <Typography variant="h6" color="primary">
            Syntax
          </Typography>
          <Typography variant="body1" align="justify">
              Regular expressions allow you to specify a set of strings that match it. Each character in a regular expression matches exactly the corresponding character in a string. For example, the regular expression <span className="code">abcde</span> allows you to match only the string <span className="code">abcde</span>. This does not seem very powerful because we have specified exactly the same string that we wanted to recognize. However, regular expressions use some special characters, called meta-characters, to specify more general patterns. The meta-characters are: <span className="code">. ^ $ * + ? { } [ ]  | ( )</span>, and its meaning is as follows:
          </Typography>
          <Typography variant="body1" align="justify">
              <ul>
                  <li> <span className="code">[ ]</span> allows you to specify character classes. For example, the regular expression <span className="code">[abc]</span> allows you to match each of the strings <span className="code">a, b,</span> or <span className="code">c</span>. 
                  Meta-characters do not work within the specification of a character class. 
                  For example, the regular expression <span className="code">[abc$]</span> allows you to match each of the strings <span className="code">a, b, c,</span> or <span className="code">$</span>. 
                  It is also possible to use <span className="code">-</span> within a character class to define a range of characters. 
                  For example, <span className="code">[a-p]</span> allows you to match a string that corresponds to any of the characters between <span className="code">a</span> and <span className="code">p</span> (inclusive). 
                  A simple way to describe a regular expression that matches each letter or number in the English alphabet is <span className="code">[a-zA-Z0-9]</span>. 
                  If the group within the class starts with <span className="code">^</span>, the match will be made with any character except those of the class (i.e., <span className="code">[^abc]</span> will match any character except <span className="code">a, b,</span> and <span className="code">c</span>). </li>
                  <li>
                      <span className="code">+</span> indicates that a regular expression can be repeated one or more times. 
                      For example, <span className="code">ab+c</span> allows you to match <span className="code">abc, abbc, abbbc,</span> etc. but not <span className="code">ac</span>. 
                      In the same way, <span className="code">a[bc]+d</span> allows to match with <span className="code">abd, acd, abbd, abcd, acbd, accd, abbbd,</span> etc., 
                      since the meta-character is applied over the class <span className="code">[bc]</span>.
                  </li>
                  <li>... </li>
              </ul>
          </Typography>
          <Typography variant="h6" color="primary">
            Examples
          </Typography>
          <Viewer
            idx="regex1"
            worker={worker5}
            regex={examples.example1.regex}
            text={email}
          />
          <Typography variant="h6" color="primary">
            REmatch syntax
          </Typography>
          <Typography variant="body1" align="justify">
              Unlike common regular expressions as shown above, REmatch proposes a slightly different syntax...
          </Typography>
          <Viewer
            idx="rematch1"
            worker={worker5}
            rematch={examples.example1.rematch}
            text={email}
          /> */}
        </div>
      </div>
    </Container>
  )
}

export default Beginner;