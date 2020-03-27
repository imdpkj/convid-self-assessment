import * as React from "react";
import {
  CssBaseline,
  Container,
  Button,
  makeStyles,
  Step,
  Typography,
  Paper,
  Theme,
  createStyles,
  Radio,
  FormControlLabel,
  RadioGroup,
  MobileStepper,
  Box
} from "@material-ui/core";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%"
    },
    button: {
      marginTop: theme.spacing(1),
      marginRight: theme.spacing(1)
    },
    headerContainer: {
      padding: theme.spacing(1),
      backgroundColor: theme.palette.background.default
    },
    actionsContainer: {
      flexGrow: 1,
      padding: theme.spacing(1),
      backgroundColor: theme.palette.background.default
    },
    resetContainer: {
      padding: theme.spacing(3)
    }
  })
);

interface Step {
  label: String;
  weightage: number;
  score: number;
}

interface State {
  active: number;
  steps: Array<Step>;
}

const INITIAL_STATE: State = {
  active: 0,
  steps: [
    { label: "Do you have cough?", weightage: 1, score: 0 },
    { label: "Do you have cold?", weightage: 1, score: 0 },
    { label: "Are you having Diarrhea?", weightage: 1, score: 0 },
    { label: "Do you have sore throat?", weightage: 1, score: 0 },
    {
      label: "Are you experiancing MYALGIA or Body Aches?",
      weightage: 1,
      score: 0
    },
    { label: "Do you have a headache?", weightage: 1, score: 0 },
    {
      label: "Do you have fever (37.8 degree celcius and above)?",
      weightage: 1,
      score: 0
    },
    { label: "Are you having difficulty breathing?", weightage: 2, score: 0 },
    { label: "Are you experiancing fatigue?", weightage: 2, score: 0 },
    {
      label: "Have you traveled recently during the past 14 days?",
      weightage: 3,
      score: 0
    },
    {
      label: "Do you have a travel history to a COVID-19 infected area?",
      weightage: 3,
      score: 0
    },
    {
      label:
        "Do you have direct contact or is taking care of a positive COVID-19 patients?",
      weightage: 3,
      score: 0
    }
  ]
};

type ActionType = {
  type: "next" | "prev" | "reset" | "select";
  payload?: number;
};

const reducer = (state: State, action: ActionType) => {
  switch (action.type) {
    case "next":
      return { ...state, active: ++state.active };
    case "prev":
      return { ...state, active: --state.active };
    case "reset":
      return {
        ...state,
        active: 0,
        step: state.steps.map(current => {
          return { ...current, score: 0 };
        })
      };
    case "select":
      const step = { ...state.steps[state.active], score: action.payload };

      return {
        ...state,
        steps: [
          ...state.steps.slice(0, state.active),
          Object.assign({}, state.steps[state.active], step),
          ...state.steps.slice(state.active + 1)
        ]
      };
  }
};

const SUGGESTIONS = {
  STRESS: "This may be stress related, please observe",
  HYDRATE:
    "Hydrate properly and maintaine personal hygiene. Re-evualate in 2 days",
  DOCTOR: "Seek a consulation with Doctor",
  HELPLINE: "Call COVID helpline immediatly"
};

const App = () => {
  const classes = useStyles();
  const [state, dispatch] = React.useReducer(reducer, INITIAL_STATE);

  const handleNext = () => {
    dispatch({ type: "next" });
  };

  const handleBack = () => {
    dispatch({ type: "prev" });
  };

  const handleReset = () => {
    dispatch({ type: "reset" });
  };

  const handleRadioSelect = (value: number) => {
    dispatch({ type: "select", payload: value });
  };

  const { active, steps } = state;

  const getScore = (): number => {
    return Math.floor(
      steps.reduce((accumulator: number, current) => {
        return accumulator + (current.weightage / 20) * (current.score / 3);
      }, 0) * 20
    );
  };

  const score = (): JSX.Element => {
    const score = getScore();

    const view = <Typography>You scored - {score}</Typography>;
    let message = "";
    if (score <= 2) {
      message = SUGGESTIONS.STRESS;
    } else if (score <= 5) {
      message = SUGGESTIONS.HYDRATE;
    } else if (score <= 12) {
      message = SUGGESTIONS.DOCTOR;
    } else {
      message = SUGGESTIONS.HELPLINE;
    }

    return (
      <React.Fragment>
        {view}
        <Typography color="primary">{message}</Typography>
      </React.Fragment>
    );
  };

  return (
    <React.Fragment>
      <CssBaseline />
      <Container component="main" maxWidth="sm">
        <Box className={classes.root} height={100}>
          <Paper square elevation={0} className={classes.headerContainer}>
            <Typography variant="h6" color="primary">
              COVID-19 Self Assessment
            </Typography>
            <Typography variant="subtitle2">Let us take assessment</Typography>
          </Paper>
          <MobileStepper
            activeStep={active}
            className={classes.actionsContainer}
            variant="dots"
            position="static"
            steps={steps.length}
            nextButton={
              <Button
                size="small"
                onClick={handleNext}
                color="primary"
                disabled={active === steps.length}
              >
                {active < steps.length - 1 ? "Next" : "Finish"}
                <KeyboardArrowRight />
              </Button>
            }
            backButton={
              <Button
                size="small"
                onClick={handleBack}
                disabled={active === 0}
                color="primary"
              >
                <KeyboardArrowLeft /> Back
              </Button>
            }
          />
          {active < steps.length && (
            <Paper
              square
              elevation={0}
              className={classes.actionsContainer}
              key={active}
            >
              <Typography>{steps[active].label}</Typography>
              <RadioGroup name={`step-${active}`} defaultValue="0">
                <FormControlLabel
                  value="3"
                  control={<Radio color="secondary" />}
                  onClick={() => handleRadioSelect(3)}
                  label="Yes"
                />
                <FormControlLabel
                  value="2"
                  control={<Radio color="default" />}
                  onClick={() => handleRadioSelect(2)}
                  label="May be"
                />
                <FormControlLabel
                  value="1"
                  control={<Radio color="default" />}
                  onClick={() => handleRadioSelect(1)}
                  label="Not sure"
                />
                <FormControlLabel
                  value="0"
                  control={<Radio color="primary" />}
                  onClick={() => handleRadioSelect(0)}
                  label="No"
                />
              </RadioGroup>
            </Paper>
          )}
          {active === steps.length && (
            <Paper square elevation={0} className={classes.actionsContainer}>
              {score()}
              <Button
                onClick={handleReset}
                className={classes.button}
                color="secondary"
              >
                Reset
              </Button>
            </Paper>
          )}
        </Box>
      </Container>
    </React.Fragment>
  );
};

export default App;
