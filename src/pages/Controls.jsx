import {
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  CardActions
} from '@mui/material'
import { useState } from 'react'
import Accordion from '@mui/material/Accordion'
import Link from '@mui/material/Link'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt'
import PolylineIcon from '@mui/icons-material/Polyline';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import GppMaybeIcon from '@mui/icons-material/GppMaybe';
import GppGoodIcon from '@mui/icons-material/GppGood';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

import ControlList from './ControlTaxonomy-owasp.json'
console.log(ControlList)

export default function Controls() {
  try {
    var [selectedModel] = useState(localStorage.getItem('selectedModel') || '')
    var loadedTM = JSON.parse(localStorage.getItem('threatModels'))[selectedModel] || []
  } catch (e) {
    loadedTM = []
  }
  console.log(loadedTM)
  var [threatModel, setThreatModel] = useState(loadedTM)

  function adoptControl (threat, control) {
    threat.controls.push(control)
    setThreatModel([...threatModel])
    var storedThreatModels = JSON.parse(localStorage.getItem('threatModels')) || {} 
    storedThreatModels[selectedModel] = threatModel
    localStorage.setItem('threatModels', JSON.stringify(storedThreatModels))
  }
 
  function removeControl (threat, control) {
    threat.controls = threat.controls.filter(c => c.title !== control.title)
    setThreatModel([...threatModel])
    var storedThreatModels = JSON.parse(localStorage.getItem('threatModels')) || {} 
    storedThreatModels[selectedModel] = threatModel
    localStorage.setItem('threatModels', JSON.stringify(storedThreatModels))
  }

  function ControlCard (props) {
    var {control, threat, adopted} = props

    return (
      <Card sx={{ flex: '1 0 calc(33% - 1em)', minWidth: '300px' }} variant="outlined">
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between'}}>
            <Typography sx={{ fontSize: 12, textTransform: 'uppercase', opacity: '.5' }} color="text.secondary" gutterBottom>
              {control.stages.join(' - ')}
            </Typography>
            <Typography sx={{ fontSize: 12 }} color="text.secondary">
              {control.category}
            </Typography>
          </Box>

          <Typography variant="h5" component="div" color="secondary" sx={{ mb: '.5em', opacity: 1 }}>
            {control.title}
          </Typography>
          <Typography variant="body2" sx={{ textAlign: 'justify', maxHeight: '10em', overflowY: 'scroll' }}>
            {control.description}
          </Typography>
        </CardContent>
        <CardActions>
          { adopted?
            (<Button size="small" color="secondary" startIcon={<AddIcon/>} onClick={() => {adoptControl(threat, control)}}>Adopt</Button>)
            :
            (<Button size="small" color="secondary" startIcon={<DeleteIcon/>} onClick={() => {removeControl(threat, control)}}>Remove</Button>)
          }
        </CardActions>
      </Card>
    )
  }

  return (
    <>
      <Typography level="title-lg" variant='h4'>
        Control Identification
      </Typography>
      <Typography variant="subtitle">
        Evaluate Controls to Protect Your Assets Against Threats
      </Typography>


      <Box sx={{ mt: '1em' }}>
        { threatModel.map(function renderThreat (threat) {
          console.log(threat)
          return (
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                sx={{ textTransform: 'capitalize' }}>
                <PolylineIcon color="secondary" sx={{ mr: '.5em' }}></PolylineIcon>
                {threat.threat.Threat}
                <Typography color="secondary" sx={{ml: '.5em', mr: '.5em'}}>@</Typography>
                <Typography sx={{opacity: '.5'}}>
                  {threat.targetedAsset.assetDisplayname}
                </Typography>

                <ArrowRightAltIcon color="secondary" sx={{ml: '.5em', mr: '.5em'}}/>
                <Typography sx={{ opacity: '.5'}}>
                  {threat.threat['Potential Impact']}
                </Typography>

              </AccordionSummary>

              <AccordionDetails>
                <Box sx={{ display: 'flex', gap: '2em' }}>
                  <Box sx={{ flex: '4 1'}}>
                    <Typography sx={{ textAlign: 'justify'}}><Typography color="secondary" style={{display: 'inline', fontFamily: 'monospace', marginRight: '1em'}}>DESCRIPTION</Typography>{threat.threat.Description}</Typography>
                  </Box>
                  <Box sx={{ flex: '1 1'}}>
                    <Typography><Typography color="secondary" style={{display: 'inline', fontFamily: 'monospace', marginRight: '1em'}}>CATEGORY</Typography>{threat.threat['Threat Category']}</Typography>
                    <Typography><Typography color="secondary" style={{display: 'inline', fontFamily: 'monospace', marginRight: '1em'}}>ASSET</Typography>{threat.targetedAsset['assetDisplayname']} </Typography>
                    <Typography><Typography color="secondary" style={{display: 'inline', fontFamily: 'monospace', marginRight: '1em'}}>ASSET CATEGORY</Typography>{threat.targetedAsset['assetCategory']}</Typography>
                    <Typography><Typography color="secondary" style={{display: 'inline', fontFamily: 'monospace', marginRight: '1em'}}>ASSET LIFE CYCLE</Typography>{threat.targetedAsset.assetLifeCycleStage}</Typography>
                  </Box>
                </Box>
              </AccordionDetails>

              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  sx={{ textTransform: 'capitalize' }}>
                  <GppGoodIcon color="secondary" sx={{ mr: '.5em'}}></GppGoodIcon>
                  Adopted Controls ({threat.controls.length})
                </AccordionSummary>
                <AccordionDetails>
                  <Box sx={{ display: 'flex', gap: '1em', flexWrap: 'wrap'}}>
                    {
                      threat.controls.map(function renderAdoptedControls (control) {
                        return (
                          <ControlCard control={control} threat={threat} adopted={false}/>
                        )
                      })
                    }
                  </Box>
                </AccordionDetails>
              </Accordion>
              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}>
                  <GppMaybeIcon color="secondary" sx={{ mr: '.5em'}}></GppMaybeIcon>
                  Suggested Controls for {threat.targetedAsset['assetCategory']}
                </AccordionSummary>
                <AccordionDetails>
                  <Typography sx={{ opacity: '.5', mb: '1em' }}>Review the following asset-related controls — Knowledge Base provided by the <Link color="secondary" href="https://owaspai.org/">OWASP AI Exchange</Link></Typography>
                  <Box sx={{ display: 'flex', gap: '1em', flexWrap: 'wrap'}}>
                    {
                      ControlList.filter(control => {
                        return control.asset.includes(threat.targetedAsset.assetCategory)}
                      ).filter(control => {
                        return !threat.controls.includes(control)
                      }).map(function renderRelatedControls (control) {
                        return (
                          <ControlCard control={control} threat={threat} adopted={true}/>
                        )
                      })
                    }
                  </Box>
                </AccordionDetails>
              </Accordion>
            </Accordion>
          )
        })
        }
      </Box>
    </>
  )
}

