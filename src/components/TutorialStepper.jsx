import React, { useState } from 'react';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

const steps = [
  {
    label: 'Setup',
    description: `For each ad campaign that you create, you can control how much
              you're willing to spend on clicks and conversions, which networks
              and geographical locations you want your ads to show on, and more.`,
  },
  {
    label: 'Motivation',
    description:
      'An ad group contains one or more ads which target a shared set of keywords.',
  },
  {
    label: 'Regular Expressions',
    description: `Try out different ad text to see what brings in the most customers,
              and learn how to enhance your ads using features like ad extensions.
              If you run into any problems with your ads, find out how to tell if
              they're running and how to resolve approval issues.`,
  },
  {
    label: 'REmatch functionalities',
    description: '',
  },
  {
    label: 'Why REmatch?',
    description: '',
  },
];
// const steps = ['Setup', 'Motivation', 'Regular Expressions', 'REmatch functionalities', 'Why REmatch?'];

const subSetpsOnLabel = (index, activeStep, activeSubStep) => {
  return(
    (index === 1 && activeStep === 1 &&
      <div>
        <Typography variant="caption" color={activeSubStep === 0 ? 'secondary' : 'disabled'}>Problem</Typography>
        <br/>
        <Typography variant="caption" color={activeSubStep === 1 ? 'secondary' : 'disabled'}>An efficient solution</Typography>
        <br/>
        <Typography variant="caption" color={activeSubStep === 2 ? 'secondary' : 'disabled'}>Last step</Typography>
      </div>)
    ||
    (index === 2 && activeStep === 2 &&
    <div>
      <Typography variant="caption" onClick={()=> console.log('a')}>Larvita</Typography>
    </div>)
  )
}

export default function VerticalLinearStepper(props) {
  const { 
    activeStep,
    activeSubStep,
    handleNext,
    handleBack,
    handleReset,
    handleNextSubStep,
    handleBackSubStep,
    handleResetSubStep,
  } = props;
  return (
    // <Box sx={{ maxWidth: 400 }}>
      
    // </Box>
    <div className="tutorial-stepper">
      <Stepper activeStep={activeStep} orientation="vertical" style={{ backgroundColor: "transparent" }}>
        {steps.map((step, index) => (
          <Step key={step.label}>
            <StepLabel
              optional={ subSetpsOnLabel(index, activeStep, activeSubStep) }
            >
              {step.label}
            </StepLabel>
            <StepContent>
              {/* <Typography>{step.description}</Typography> */}
              {/* <Box sx={{ mb: 2 }}>
                <div>
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    {index === steps.length - 1 ? 'Finish' : 'Continue'}
                  </Button>
                  <Button
                    disabled={index === 0}
                    onClick={handleBack}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    Back
                  </Button>
                </div>
              </Box> */}
            </StepContent>
          </Step>
        ))}
      </Stepper>
      {activeStep === steps.length && (
        <Paper square elevation={0} sx={{ p: 3 }}>
          <Typography>All steps completed - you&apos;re finished</Typography>
          <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
            Reset
          </Button>
        </Paper>
      )}
    </div>
  );
}