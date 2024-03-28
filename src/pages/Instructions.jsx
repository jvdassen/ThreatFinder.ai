import Typography from '@mui/material/Typography'

export default Instructions

function Instructions(props) {
  var instructions = {
    goals: `In the initial stage, create a new threat model or open an existing one. At this stage the  key concerns for the modeling stage are elicited.`,
    model: `In this stage, a diagram of the architecture is created. The resulting diagram is used to elicit AI-related assets and the threats surrounding them.`
  }

  var stage = props.stage

  var renderInstruction = instructions[stage] || instructions['model'] // the model instruction serves as a default for now

  return (
        <Typography
          level="title-lg"
          fontFamily="monospace"
          sx={{ opacity: '50%', marginBottom: '1em' }}>
      &rarr; {renderInstruction}
    </Typography>
  )
}

