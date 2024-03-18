//import * as React from 'react'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import Typography from '@mui/material/Typography'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

export default ThreatModels

function ThreatModels() {
  function Saved () {
    localStorage.setItem('storedModels', [{
      name: 'project A',
      date: Date.now(),
      description: 'Create a exposure analysis of the healthcare blabla'
    }, {
      name: 'project B',
      date: Date.now(),
      description: 'Check some security controls'
    }])
    var storedModels = localStorage.getItem('storedModels')
    storedModels.map(function (model) {
      return (
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel2-content"
            id="panel2-header">
            <Typography>{model.name} - {model.date}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              model.description
            </Typography>
          </AccordionDetails>
        </Accordion>
      )
    })

    return storedModels
  }

  return (
    <div>
      <Accordion defaultExpanded>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          <Typography>Expanded by default</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
            malesuada lacus ex, sit amet blandit leo lobortis eget.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Saved></Saved>
    </div>
  )
}

