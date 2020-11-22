import React from 'react';

import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';

import Viewer from './Viewer';

import english from '../text/english';

const About = () => {
  return (
    <Container maxWidth="sm" className="mainContainer">
      {english.about.title}
      {english.about.howto}
      {english.about.regexinrematch}
      {english.about.anotherlibrary}
      {english.about.example1}
      {english.about.example2}
      {english.about.example3}
      {english.about.outputtime}
      {english.about.authors}
    </Container>
  )
}

export default About;