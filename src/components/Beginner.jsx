import React from "react";

import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
//import Paper from "@material-ui/core/Paper";
//import Stepper from "@material-ui/core/Stepper";
//import Step from "@material-ui/core/Step";
//import StepLabel from "@material-ui/core/StepLabel";
import Button from "@material-ui/core/Button";
import Viewer from "./Viewer";
import VerticalLinearStepper from "./TutorialStepper";

// import english from '../text/english';
const WORKPATH5 = `${process.env.PUBLIC_URL}/liteWork.js`;
let worker5 = new Worker(WORKPATH5);

const email = "janeeyre@gmail.cl";
const examples = {
  example1: {
    rematch:
      "(^|[\\n.])!sentence{[^.\\n]*Chile [^.\\n]+(Peru|Argentina|Bolivia)[^.\\n]*\\.}",
    regex: "[a-zA-Z0-9_\\.]+@(gmail|hotmail)\\.cl",
  },
  //   example2: {
  //     rematch: '.*[\\.^]!sen{[^\\.]*!n1{[A-Z][a-z]* }[^\\.]*!n2{[A-Z][a-z]*}[^\\.]*\\.}.*',
  //     regex: '([A-Z][^\\.]*([A-Z][a-z]* )[^\\.]*([A-Z][a-z]* )[^\\.]*\\.)'
  //   },
  //   example3: {
  //     rematch: '.*!x{.+}.*',
  //   }
};

const Beginner = () => {
  const [activeStep, setActiveStep] = React.useState(0);
  const [activeSubStep, setActiveSubStep] = React.useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const handleNextSubStep = () => {
    setActiveSubStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBackSubStep = () => {
    setActiveSubStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleResetSubStep = () => {
    setActiveSubStep(0);
  };

  const steppersButtons = () => {
    return (
      <div>
        <Button
          color='secondary'
          // variant="contained"
          variant='outlined'
          onClick={activeSubStep === 0 ? handleBack : handleBackSubStep}
          sx={{ mt: 1, mr: 1 }}>
          Back
        </Button>
        <Button
          color='primary'
          style={{ marginLeft: "0.5rem" }}
          variant='outlined'
          onClick={handleNext}
          sx={{ mt: 1, mr: 1 }}
          className='button-right-tutorial'>
          Skip
        </Button>
        <Button
          color='secondary'
          // variant="contained"
          variant='outlined'
          onClick={activeSubStep === 2 ? handleNext : handleNextSubStep}
          sx={{ mt: 1, mr: 1 }}
          className='button-right-tutorial'>
          Continue
        </Button>
      </div>
    );
  };

  return (
    <Container maxWidth='lg' className='top-padding'>
      <div className='row'>
        <div className='col-30'>
          <VerticalLinearStepper
            activeStep={activeStep}
            activeSubStep={activeSubStep}
            handleNext={() => handleNext()}
            handleBack={() => handleBack()}
            handleReset={() => handleReset()}
            handleNextSubStep={() => handleNextSubStep()}
            handleBackSubStep={() => handleBackSubStep()}
            handleResetSubStep={() => handleResetSubStep()}
          />
        </div>
        <div className='col-70'>
          <Typography
            variant='h5'
            color='primary'
            align='center'
            style={{ marginBottom: ".5rem", fontWeight: "800" }}>
            Beginner tutorial
          </Typography>
          {activeStep === 0 && (
            <div className='scrollable-tutorial'>
              <Typography
                variant='h6'
                color='primary'
                style={{ marginBottom: "1.5rem" }}>
                Setup
              </Typography>
              <Typography
                variant='body1'
                align='justify'
                style={{ marginBottom: "1.5rem" }}>
                &emsp;You need to install the{" "}
                <span className='cm-m0'>REmatch</span> library for Python. You
                can run the next command in any terminal:
                <br />
                <pre>
                  <xmp className='tutorial-code'>{`
                            !pip3 install pyrematch
                `}</xmp>
                </pre>
                {/* <div className="text-center">
                  <span className="code" style={{padding: ".2rem"}}>!pip3 install pyrematch</span>
                </div> */}
              </Typography>
              <Typography
                variant='body1'
                align='justify'
                style={{ marginBottom: "3rem" }}>
                &emsp;If you have already installed the library, update to the
                last version:
                <br />
                <pre>
                  <xmp className='tutorial-code'>{`
                            !pip3 install --upgrade pyrematch
                `}</xmp>
                </pre>
                {/* <div className="text-center">
                  <span className="code" style={{padding: ".2rem"}}>!pip3 install --upgrade pyrematch</span>
                </div> */}
              </Typography>
              <Button
                color='secondary'
                // variant="contained"
                variant='outlined'
                onClick={handleNext}
                sx={{ mt: 1, mr: 1 }}
                className='button-right-tutorial'>
                Continue
              </Button>
            </div>
          )}
          {activeStep === 1 &&
            ((activeSubStep === 0 && (
              <div className='scrollable-tutorial'>
                <Typography
                  variant='h6'
                  color='primary'
                  style={{ marginBottom: "1.5rem" }}>
                  Problem
                </Typography>
                <Typography
                  variant='body1'
                  align='justify'
                  style={{ marginBottom: "1.5rem" }}>
                  &emsp;Suponga que usted quiere hacer un análisis lingüístico
                  centrado en las relaciones que tiene Chile con sus países
                  vecinos. Un posible punto de inicio sería analizar la página
                  de Wikipedia correspondiente a la Historia de Chile. El
                  artículo (de Wikipedia en inglés) está proporcionado en
                  formato de texto plano en{" "}
                  <span className='code'>chile_wiki.txt</span>.
                  <br />
                  {/* style={{backgroundColor: "#212121"}} */}
                  <pre>
                    <xmp className='tutorial-code'>{`
                    with open('chile_wiki.txt') as file:
                        text = file.read()
                    `}</xmp>
                  </pre>
                </Typography>
                <Typography
                  variant='body1'
                  align='justify'
                  style={{ marginBottom: "1.5rem" }}>
                  &emsp;Suponga ahora que usted desea extraer todas las
                  oraciones del artículo de Wikipedia que mencionan primero a
                  Chile y luego a alguno de sus países vecinos (Argentina,
                  Bolivia o Perú). Entiéndase por una oración como un string que
                  no posee ni saltos de línea ni puntos. Realizar esto en Python
                  sin la ayuda de una librería puede resultar complicado. Un
                  intento podría ser:
                  <br />
                  {/* style={{backgroundColor: "#212121"}} */}
                  <pre>
                    <xmp className='tutorial-code'>{`
                    count = 1
                    for line in text.split('\\n'):
                        for sentence in line.split('.'):
                            x = sentence.find("Chile ")
                            if x != -1:
                                for pais in ["Peru", "Argentina", "Bolivia"]:
                                    y = sentence.find(pais, x)
                                    if y != -1:
                                        print("{}. {}".format(count, sentence))
                                        count += 1
                                        break
                    `}</xmp>
                  </pre>
                </Typography>
                <Typography
                  variant='body1'
                  align='justify'
                  style={{ marginBottom: "1.5rem" }}>
                  &emsp;Donde, por cada línea del documento, se hace uso de el
                  método <span className='code'>find</span> de un string en
                  Python para buscar las palabras relevantes.
                  <br />
                  <br />
                  &emsp;Sin embargo, esta tarea no requiere mucho esfuerzo de su
                  parte.
                  <br />
                  <br />
                  &emsp;Ahora, imagine que como experto en datos usted requiere
                  hacer esta tarea multiples veces al dia, con distintos data
                  sets (potencialmente con grandes volumenes de datos) y donde
                  los requerimientos para la extracción es muy distinta. Si bien
                  escribir y probar este código le puede tomar 10 minutos a 30
                  minutos en promedio, realizar esta tarea reiteradas veces
                  puede ser un costo innecesario para su quehacer como experto
                  en datos. Por último, lo más seguro es que su programa en
                  Python no será muy eficiente y puede que tome varios minutos
                  en terminar para documentos de gran tamaño.
                  <br />
                </Typography>
                {steppersButtons()}
              </div>
            )) ||
              (activeSubStep === 1 && (
                <div className='scrollable-tutorial'>
                  <Typography
                    variant='h6'
                    color='primary'
                    style={{ marginBottom: "1.5rem" }}>
                    An efficent solution
                  </Typography>
                  <Typography
                    variant='body1'
                    align='justify'
                    style={{ marginBottom: "1.5rem" }}>
                    &emsp;La misma tarea anterior se puede hacer con las
                    siguientes lineas de código, usando la librería{" "}
                    <span className='cm-m0'>REmatch</span>.
                    <br />
                    <pre>
                      <xmp className='tutorial-code'>{`
  import pyrematch as re

  rgx = re.compile("(^|[\\n.])!sentence{[^.\\n]*Chile [^.\\n]+(Peru|Argentina|Bolivia)[^.\\n]*\\.}")

  for idx, match in enumerate(rgx.finditer(text)):
      print("{}. {sentence}".format(idx+1, **match.groupdict()))
                  `}</xmp>
                    </pre>
                    <br />
                    &emsp;Hagamos la misma consulta en la version{" "}
                    <span className='cm-m0'>REmatch</span> para navegador.
                  </Typography>
                  <Viewer
                    idx='rematch1'
                    worker={worker5}
                    regex={examples.example1.rematch}
                    text={email}
                  />
                  <Typography
                    variant='body1'
                    align='justify'
                    style={{ marginBottom: "3rem" }}>
                    &emsp;La mayor parte de las lineas del código anterior son
                    para llamar y ejecutar la librería REmatch. De hecho, toda
                    la tarea se encuentra descrita en:
                    <span className='code' style={{ padding: ".2rem" }}>
                      !pip3 install --upgrade pyrematch
                    </span>
                    el cuál es un patron que describe la tarea de extracción que
                    debe hacer la librería. El lenguaje de este patrón se conoce
                    como expresiones regulares (también llamados regex ó RE).
                    Las expresiones regulares es un lenguaje de caracteres y
                    operadores especiales que nos permiten describir grupos de
                    secuencias en strings, que a uno le gustaría identificar,
                    verificar, y extraer. Estas expresiones nos facilitarán la
                    tarea de extracción de información de documentos,
                    permitiendonos definir nuestra tarea y dejando que una
                    librería como REmatch se encargue de ejecutar y optimizar la
                    tarea de la mejor forma posible. Las expresiones regulares
                    nos pueden servir para otras tareas como validación de
                    formularios, búsqueda y reemplazo, transformación de texto,
                    y procesamiento de registros. En esta unidad usted aprenderá
                    el lenguaje de expresiones regulares para verificar patrones
                    sencillos en strings, para después aprovechar estos patrones
                    para extraer información desde documentos con la librería
                    REmatch.
                    <br />
                    <div className='text-center'>
                      <span className='code' style={{ padding: ".2rem" }}>
                        !pip3 install --upgrade pyrematch
                      </span>
                    </div>
                  </Typography>
                  {steppersButtons()}
                </div>
              )) ||
              (activeSubStep === 2 && (
                <div className='scrollable-tutorial'>{steppersButtons()}</div>
              )))}
          {activeStep === 2 && activeSubStep === 0 && <div>Holas</div>}
          {activeStep === 3 && <div></div>}
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
  );
};

export default Beginner;
