import React, { useEffect, useState } from "react";

import Container from "@material-ui/core/Container";

import Markdown from "./Markdown";

const aboutURL =
  "https://raw.githubusercontent.com/REmatchChile/REmatch-docs/master/about.md";

const About = () => {
  const [content, setContent] = useState("");
  useEffect(() => {
    fetch(aboutURL)
      .then((response) => response.text())
      .then((text) => setContent(text));
  }, []);

  return (
    <Container maxWidth='md' className='mainContainer'>
      <Markdown text={content} />
    </Container>
  );
};

export default About;
