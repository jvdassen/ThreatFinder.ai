import { useState, useEffect } from 'react'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionActions from '@mui/material/AccordionActions'

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt'
import AddIcon from '@mui/icons-material/Add'
import { BarChart } from '@mui/x-charts/BarChart'
import { LineChart } from '@mui/x-charts/LineChart'
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default Scenarios

function formatDate(date) {
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const month = months[date.getMonth()];
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();

  const formattedDate = `${month} ${day}, ${hour}:${minute.toString().padStart(2, '0')}`;
  return formattedDate;
}

function Scenarios({ onModelSelected }) {
  const [selectedModel, selectModel] = useState(localStorage.getItem('selectedModel') || '')
  onModelSelected(selectedModel)

  const [newName, setNewName] = useState('')
  const [newDesc, setNewDesc] = useState('')
  const [newKeyProp, setNewKeyProp] = useState('')
  const [newKeyAsset, setNewKeyAsset] = useState('')
  const [open, setOpen] = useState(false)
  const [importModelId, setImportModelId] = useState('')

  try {
    var loaded = JSON.parse(localStorage.getItem('storedModels')) || []
  } catch (e) {
    loaded = []
  }
  var storedModels = loaded
  const [models, setModels] = useState(storedModels)

  const [selectedModelInfo, selectModelInfo] = useState(storedModels.find(m => m.id === selectedModel))


  const elevation = 1

  useEffect(function handleModelSelection() {
    //console.g('store selected model', selectedModel)
    localStorage.setItem('selectedModel', selectedModel)
    selectModelInfo(models.find(m => m.id === selectedModel))
  }, [models, selectedModel])

  function createModel() {
    var storedModels = JSON.parse(localStorage.getItem('storedModels')) || []
    storedModels.push({
      id: '' + Math.random() * 1e17,
      name: newName,
      date: Date.now(),
      description: newDesc,
      keyProp: newKeyProp,
      keyAsset: newKeyAsset,
      assets: [],
      threats: [],
      diagram: '',
      analysis: {
        summary: {
          losses: [98071.64733176, 196143.29466353,
            294214.94199529, 392286.58932705, 490358.23665881,
            588429.88399058, 686501.53132234, 784573.1786541,
            882644.82598587, 980716.47331763, 1078788.12064939,
            1176859.76798116, 1274931.41531292, 1373003.06264468,
            1471074.70997644, 1569146.35730821, 1667218.00463997,
            1765289.65197173, 1863361.2993035, 1961432.94663526,
            2059504.59396702, 2157576.24129878, 2255647.88863055,
            2353719.53596231, 2451791.18329407, 2549862.83062584,
            2647934.4779576, 2746006.12528936, 2844077.77262112,
            2942149.41995289, 3040221.06728465, 3138292.71461641,
            3236364.36194818, 3334436.00927994, 3432507.6566117,
            3530579.30394347, 3628650.95127523, 3726722.59860699,
            3824794.24593875, 3922865.89327052, 4020937.54060228,
            4119009.18793404, 4217080.83526581, 4315152.48259757,
            4413224.12992933, 4511295.7772611, 4609367.42459286,
            4707439.07192462, 4805510.71925638, 4903582.36658815]
        }
      }
    })
    localStorage.setItem('storedModels', JSON.stringify(storedModels))
    setModels(storedModels)
  }

  function importModel() {
    if (importModelId) {
      const modelToImport = models.find(model => model.id === importModelId);
      console.log(modelToImport)
      if (modelToImport) {
        selectModel(modelToImport.id);
      }
    }
  }

  const handleClickOpen = (id) => {
    setOpen(true);
    selectModel(id)
  };

  const handleCancel = () => {
    setOpen(false);
  };

  function handleDelete() {
    // deleting threats
    var loadedTMs = JSON.parse(localStorage.getItem("threatModels"));
    loadedTMs = Object.keys(loadedTMs)
      .filter((key) => key !== selectedModel)
      .reduce((obj, key) => {
        obj[key] = loadedTMs[key];
        return obj;
      }, {});
    localStorage.setItem("threatModels", JSON.stringify(loadedTMs));
    // deleting risk scenarios
    var updatedRiskScenarios = JSON.parse(
      localStorage.getItem("riskScenarios")
    ).filter((m) => m.model !== selectedModel);
    localStorage.setItem("riskScenarios", JSON.stringify(updatedRiskScenarios));
    var storedModels = JSON.parse(localStorage.getItem("storedModels")) || [];
    const updatedModels = storedModels.filter(
      (model) => model.id !== selectedModel
    );
    localStorage.setItem("storedModels", JSON.stringify(updatedModels));
    setModels(updatedModels);
    selectModel("");
    setNewName("");
    setNewDesc("");
    selectModelInfo("");
    setOpen(false);
  };

  function Saved(props) {
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
                  <Typography kx={{ textTransform: 'inherit' }}>{model.name}</Typography>
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
                <AccordionActions>
                  <Button variant="contained" disabled={selectedModel === model.id} onClick={() => { selectModel(model.id) }}>Load</Button>
                  <Button variant="contained" onClick={() => handleClickOpen(model.id)}>Delete</Button>
                    <Dialog
                      open={open}
                      onClose={handleCancel}
                      aria-labelledby="alert-dialog-title"
                      aria-describedby="alert-dialog-description"
                    >
                      <DialogTitle id="alert-dialog-title">
                        {"Delete Model"}
                      </DialogTitle>
                      <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                          This action deletes the threat model diagram and associated risk analysis. Are you sure?
                        </DialogContentText>
                      </DialogContent>
                      <DialogActions>
                        <Button variant="contained" onClick={handleCancel} autoFocus>Cancel</Button>
                        <Button variant="contained" onClick={handleDelete} >
                          Delete
                        </Button>
                      </DialogActions>
                    </Dialog>
                </AccordionActions>
              </AccordionDetails>
            </Accordion>
          )
        })}
      </>
    )
  }

  return (
    <div>
      <Typography level="title-lg" variant='h4'>
        Scenarios
      </Typography>
      <Typography
        variant="subtitle">
        Manage your existing scenarios or create a new one from scratch
      </Typography>
      {/*<Typography sx={{ textTransform: 'uppercase', opacity: '50%', marginBottom: '.5em' }}>Add New Threat Model</Typography>*/}

      <Box sx={{ mt: '1em' }}>
        <Saved storedModels={models}></Saved>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}>
            <AddIcon sx={{ height: '1rem', marginTop: '3px' }} />
            <Typography>Create or import a threat model</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1em' }}>
              <TextField label="Name" variant="outlined" required onChange={(e) => { setNewName(e.target.value) }} />
              <TextField label="Description" variant="outlined" onChange={(e) => { setNewDesc(e.target.value) }} multiline required />
              <TextField label="Date" variant="outlined" disabled defaultValue={formatDate(new Date())} />


              <Box sx={{ display: 'flex', gap: '1em' }}>
                <FormControl sx={{ m: 0, minWidth: 120, flexGrow: 1 }}>
                  <InputLabel id="key-prop"><em>Property</em></InputLabel>
                  <Select
                    labelId="key-prop"
                    id="key-prop-helper"
                    value={newKeyProp}
                    onChange={(e) => { setNewKeyProp(e.target.value) }}
                    label="Key Security Property">
                    <MenuItem value={'Confidentiality'}>Confidentiality</MenuItem>
                    <MenuItem value={'Integrity'}>Integrity</MenuItem>
                    <MenuItem value={'Availability'}>Availability</MenuItem>
                    <MenuItem value={'Accountability'}>Accountability</MenuItem>
                  </Select>
                  <FormHelperText>Define the most critical security property</FormHelperText>
                </FormControl>
                <span style={{ paddingTop: '1em'}}>of</span>
                <FormControl sx={{ m: 0, minWidth: 120, flexGrow: 1 }}>
                  <InputLabel id="key-asset"><em>Asset</em></InputLabel>
                  <Select
                    labelId="key-asset"
                    id="key-asset-helper"
                    label="Optional: Key Asset"
                    onChange={(e) => { setNewKeyAsset(e.target.value) }}
                    value={newKeyAsset}>
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value={'Actor'}>Actors</MenuItem>
                    <MenuItem value={'Data'}>Data</MenuItem>
                    <MenuItem value={'Model'}>Models</MenuItem>
                    <MenuItem value={'Artefacts'}>Artefacts</MenuItem>
                    <MenuItem value={'Processes'}>Processes</MenuItem>
                    <MenuItem value={'Environment/tools'}>Environments and Tools</MenuItem>
                  </Select>
                  <FormHelperText>Optional: Define the most critical asset</FormHelperText>
                </FormControl>
              </Box>
              <Box sx={{ display: 'flex', gap: '1em' }}>
                <Button variant="contained" onClick={createModel} autoFocus>Create</Button>
                <FormControl sx={{ m: 0, minWidth: 120, flexGrow: 1 }}>
                  <InputLabel id="import-model"><em>Select Model</em></InputLabel>
                  <Select
                    labelId="import-model"
                    id="import-model-helper"
                    value={importModelId}
                    onChange={(e) => { setImportModelId(e.target.value) }}
                    label="Import Model">
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {models.map(model => (
                      <MenuItem key={model.id} value={model.id}>
                        {model.name}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>Select a model to import</FormHelperText>
                </FormControl>
                <Button variant="contained" onClick={importModel}>
                  Import
                </Button>
                </Box>
            </Box>
          </AccordionDetails>
        </Accordion>
      </Box>



      {selectedModelInfo &&
        <Box sx={{ marginTop: '1em' }} elevation={0}>
          <Box sx={{}}>
            {/*<Typography variant="h6" sx={{ textTransform: 'uppercase' }}>Selected Model </Typography>*/}
            <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'row', mb: '1em' }}>
              <ArrowRightAltIcon color="secondary" />
              <Typography variant="h5" sx={{ fontStyle: 'italic' }}>
                {selectedModelInfo.name}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: '1em', flexWrap: 'wrap' }}>
            <Paper elevation={elevation} sx={{ minWidth: '100%', p: '1em', display: 'flex', flexDirection: 'column', textTransform: 'uppercase' }}>
              <Box sx={{ flexGrow: 1}}>
                <Typography sx={{ display: 'inline-flex', opacity: '.6', mr: '.5em' }}>Created</Typography>
                <Typography sx={{ display: 'inline-flex', textTransform: 'initial'}}>{formatDate(new Date(selectedModelInfo.date))}</Typography>
              </Box>
              <Box sx={{ flexGrow: 1}}>
                <Typography sx={{ display: 'inline', opacity: '.6', mr: '.5em' }}>Description</Typography>
                <Typography sx={{ display: 'inline', textTransform: 'initial'}}>{selectedModelInfo.description}</Typography>
              </Box>
              {selectedModelInfo.keyProp && <Box sx={{ flexGrow: 1}}>
                <Typography sx={{ display: 'inline', opacity: '.6', mr: '.5em' }}>Security Goal</Typography>
                <Typography sx={{ display: 'inline', textTransform: 'initial'}}>Protect the {selectedModelInfo.keyProp} 
                    {selectedModelInfo.keyAsset && <span>
                      <span style={{opacity: '.6'}}> of</span> {selectedModelInfo.keyAsset} 
                    </span>}
                </Typography>
              </Box>}
            </Paper>
              {selectedModelInfo.assets &&
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1em' }}>
                <Paper elevation={elevation} sx={{ p: '1em', display: 'flex', flexGrow: 1, alignItems: 'center', flexDirection: 'column' }}>
                  <Typography variant="h4" sx={{ flexGrow: 1, fontSize: '4rem' }}>{selectedModelInfo.assets.length}</Typography>
                  <Typography sx={{ opacity: '.6' }}>ASSETS</Typography>
                </Paper>
                <Paper elevation={elevation} sx={{ p: '1em', display: 'flex', flexGrow: 1, alignItems: 'center', flexDirection: 'column' }}>
                  <Typography variant="h4" sx={{ flexGrow: 1, fontSize: '4rem' }}>{selectedModelInfo.threats.length|| '-'}{console.log('gg', selectedModelInfo)}</Typography>
                  <Typography sx={{ opacity: '.6' }}>THREATS</Typography>
                </Paper>
              </Box>
              }
              <Paper elevation={elevation} sx={{ p: '1em' }}>
                <BarChart
                  xAxis={[{ scaleType: 'band', barGapRatio: 0.1, data: [0,0,0,0,0,0,0,0,0] }]}
                  series={[{ color: '#8278d9', label: 'Exposure', data: [0,0,0,0,0,0,0,0,0] }]}
                  width={500}
                  height={300} />
              </Paper>
              <Paper elevation={elevation} sx={{ p: '1em' }}>
                <LineChart
                  xAxis={[{ data: [0,0,0,0,0,0,0,0,0] }]}
                  series={[
                    {
                      color: '#8278d9',
                      data: [0,0,0,0,0,0,0,0,0],
                      showMark: false
                    },
                  ]}
                  width={500}
                  height={300} />
              </Paper>
              <Paper elevation={elevation} sx={{ p: '1em', display: 'flex', flexGrow: 1, alignItems: 'left', flexDirection: 'column', textTransform: 'uppercase' }}>
                <Typography sx={{ flexGrow: 1, display: 'flex', textAlign: 'center', alignItems: 'center' }}>Annualized Loss (CHF)</Typography>
                <Typography variant="h4" sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', fontSize: '4rem' }}>0</Typography>
                <Typography sx={{ opacity: '.6' }}>Expected Loss P50)</Typography>
                <Typography variant="h4" sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', fontSize: '3rem' }}>0</Typography>
                <Typography sx={{ opacity: '.6' }}>Optimistic Loss (P20)</Typography>
                <Typography variant="h4" sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', fontSize: '3rem' }}>0</Typography>
                <Typography sx={{ opacity: '.6' }}>Pessimistic Loss (P80)</Typography>
              </Paper>
            </Box>
          </Box>
        </Box>
      }

    </div>
  )
}

