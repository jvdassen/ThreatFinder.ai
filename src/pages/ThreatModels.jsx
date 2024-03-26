import { useState, useEffect } from 'react'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionActions from '@mui/material/AccordionActions'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'

export default ThreatModels

function formatDate(date) {
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const month = months[date.getMonth()];
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();

  const formattedDate = `${month} ${day}, ${hour}:${minute.toString().padStart(2, '0')}`;
  return formattedDate;
}

function ThreatModels() {
  const [selectedModel, selectModel] = useState(localStorage.getItem('selectedModel') || '')

  const [newName, setNewName] = useState('')
  const [newDesc, setNewDesc] = useState('')

  try {
    var loaded = JSON.parse(localStorage.getItem('storedModels')) || []
  } catch (e) {
    loaded = []
  }
  var storedModels = loaded
  const [models, setModels] = useState(storedModels)

  useEffect(function handleModelSelection() {
    console.log('store selected model', selectedModel)
    localStorage.setItem('selectedModel', selectedModel)
  }, [selectedModel])

  function createModel() {
    console.log(newName)
    console.log(newDesc)
    var storedModels = JSON.parse(localStorage.getItem('storedModels')) || []
    storedModels.push({
      id: '' + Math.random() * 1e17,
      name: newName,
      date: Date.now(),
      description: newDesc,
      diagram: '',
      analysis: {}
    })
    localStorage.setItem('storedModels', JSON.stringify(storedModels))
    setModels(storedModels)
  }


  function Saved(props) {
    /*localStorage.setItem('storedModels', JSON.stringify([{
        id: Math.random() * 1e17,
        name: 'DataForge',
        date: Date.now() - 36000,
        description: 'Create a exposure analysis of the healthcare blabla'
      }, {
        id: Math.random() * 1e17,
        name: 'CodeCraft',
        date: Date.now() - 72000,
        description: 'Check some security controls'
      }, {
        id: Math.random() * 1e17,
        name: 'QuantumSphere',
        date: Date.now() - 96000,
        description: 'Test the beans'
      }, {
        id: Math.random() * 1e17,
        name: 'PhoenixRise',
        date: Date.now() - 128000,
        description: 'Review existing controls'
      }]))
      */

    var storedModels = props.storedModels.sort((a, b) => a.date < b.date)

    return (
      <>
        {storedModels.map(function renderModel(model) {
          return (
            <Accordion key={model.id}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls=""
                id="panel2-header">
                <Box sx={{ flexDirection: 'row', display: 'flex', alignItems: 'center' }}>
                  <Typography variant="h6" sx={{ textTransform: 'inherit' }}>{model.name}</Typography>
                  <span style={{ margin: '0 .5em' }}>—</span>
                  <Typography sx={{ opacity: '50%' }}>
                    {formatDate(new Date(model.date))}
                  </Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  {model.description}
                </Typography>
                <AccordionActions><Button variant="contained" disabled={selectedModel === model.id} onClick={() => { selectModel(model.id) }}>Load</Button></AccordionActions>
              </AccordionDetails>
            </Accordion>
          )
        })}
      </>
    )
  }

  return (
    <div>
      <Typography level="title-lg" variant='h4' fontFamily='monospace'>
        <i>Scenarios</i>
        <Typography
          level="title-lg"
          fontFamily="monospace"
          sx={{ opacity: '50%', marginBottom: '1em' }}
        >
          Manage your existing scenarios or create a new one from scratch
        </Typography>
      </Typography>
    <Paper elevation={2} sx={{padding: '1em'}}>
      <Typography variant="h6" sx={{ textTransform: 'uppercase', opacity: '50%', marginBottom: '.5em' }}>Add New Threat Model</Typography>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}>
          <Typography>Create or import a threat model</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1em' }}>
            <TextField label="Name" variant="outlined" required onChange={(e) => { setNewName(e.target.value) }} />
            <TextField label="Description" variant="outlined" onChange={(e) => { setNewDesc(e.target.value) }} multiline required />
            <TextField label="Date" variant="outlined" disabled defaultValue={formatDate(new Date())} />
            <Button variant="contained" onClick={createModel} >Create</Button>
          </Box>
        </AccordionDetails>
      </Accordion>
      <Typography variant="h6" sx={{ textTransform: 'uppercase', opacity: '50%', marginBottom: '.5em', marginTop: '.5em' }}>Load Existing Threat Model</Typography>
      <Saved storedModels={models}></Saved>
    </Paper>
    <Paper sx={{padding: '1em', marginTop: '1em'}}>
      <Box sx={{ display: 'flex' }}>
        <Typography variant="h6" sx={{ textTransform: 'uppercase', opacity: '50%', marginBottom: '.5em', marginTop: '.5em' }}>Selected Model: </Typography>
        <Typography variant="h5" sx={{ textTransform: 'uppercase', opacity: '50%', marginBottom: '.5em', marginTop: '.5em' }}>{selectedModel}</Typography>
      </Box>
    </Paper>

    </div>
  )
}

