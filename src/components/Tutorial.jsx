import React from 'react';

import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom';
import Viewer from './Viewer';

const Tutorial = () => {
  return (

    <Container maxWidth="sm" className="mainContainer">
      <Typography variant="h5" color="primary" align="center">Tutorial</Typography>
      <Typography variant="h6" color="textSecondary" align="center">Choose the tutorial you want to take</Typography>
      <Card className="cardTutorial">
        <CardContent>
          <Typography variant="h6" color="primary" align="left">Beginner</Typography>
          <Typography variant="body1" color="white" align="left">If you have no experience with using regular expressions, this tutorial will teach you from the basics.</Typography>
        </CardContent>
        <CardActions className="float-right">
          <Link to="/beginner" className="link-tutorial float-right">
            <Button className="float-right" size="small">Learn More</Button>
          </Link>
        </CardActions>
      </Card>
      <Card className="cardTutorial">
        <CardContent>
          <Typography variant="h6" color="primary" align="left">Advanced</Typography>
          <Typography variant="body1" color="white" align="left">If you already have experience with regular expressions, this tutorial will teach you the main syntax differences between <span className="cm-m0">REmatch</span> and the usual regex usage.</Typography>
        </CardContent>
        <CardActions>
        <Link to="/advanced" className="link-tutorial">
          <Button size="small">Learn More</Button>
        </Link>
        </CardActions>
      </Card>
    </Container>
  )
}

export default Tutorial;