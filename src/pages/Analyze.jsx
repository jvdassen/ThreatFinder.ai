import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import { Switch } from '@mui/material'
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { Typography } from '@mui/material'
import TuneRoundedIcon from '@mui/icons-material/TuneRounded';
import { useState } from 'react'

import { FormControl, FormLabel, FormGroup, FormControlLabel, FormHelperText } from '@mui/material'
import assetTaxonomy from './AssetTaxonomy.json'
import threatTaxonomy from './ThreatTaxonomy.json'


export default Analyze

function Analyze() {
  const [selectedModel, selectModel] = useState(localStorage.getItem('selectedModel') || '')
  try {
    var loaded = JSON.parse(localStorage.getItem('storedModels')) || []
  } catch (e) {
    loaded = []
  }
  var storedModels = loaded
  const [models, setModels] = useState(storedModels)
  const [selectedModelInfo, selectModelInfo] = useState(storedModels.find(m => m.id === selectedModel))

  var diagram = selectedModelInfo.diagram
  var [detectedAssets, setAsset] = useModeledAssets(diagram, assetTaxonomy)

  selectedModelInfo.assets = detectedAssets
  localStorage.setItem('storedModels', JSON.stringify(storedModels))

  var keyProp = selectedModelInfo.keyProp
  const [propFilter, setPropFilter] = useState(
    {
      Confidentiality: keyProp === 'Confidentiality',
      Integrity: keyProp === 'Integrity',
      Availability: keyProp === 'Availability',
      Accountability: keyProp === 'Accountability',
      'Business Understanding': true,
      'Business Goal Definition': true,
      'Data Pre-processing': true,
      'Model Tuning': true,
      'Feature Selection': true,
      'Data Exploration': true,
      'Data Ingestion': true,
      'Model Training': true,
      'Model Selection': true,
      'Model Building': true,
      'Model Deployment': true,
      'Model Maintenance': true,
      'Transfer Learning': true,
      'Actor': true,
      'Data': true,
      'Model': true,
      'Artefacts': true,
      'Processes': true,
      'Environment/tools': true,
    }
  )

  function updatePropFilter(newState) { setPropFilter({ ...newState }) }

  window.assetTaxonomy = assetTaxonomy

  function getThreatsforCategory(category) {
    var threats = threatTaxonomy.filter(t => t['Affected assets'].includes(category))
    threats.map(t => {
      return t.potentialKeyThreat = t['Potential Impact'].includes(selectedModelInfo.keyProp)
    })
    return threats
  }


  function assetList(assets, selectedModelInfo) {
    assets.sort(function sortByStringAttribute(a, b) {
      return a.assetDisplayname.localeCompare(b.assetDisplayname)
    })

    // TODOD DELETE
    var potentialKeyAssets = assets.filter(a => a.assetCategory === selectedModelInfo.keyAsset)


    var nonCriticalAssets = assets.filter(a => a.assetCategory !== selectedModelInfo.keyAsset)
    //var notKeyAssetGroups = [...new Set(otherAssets.map(a => a.assetCategory))]

    function byCategory({ assetCategory }) { return assetCategory }
    var nonCriticalAssetGroups = Object.values(Object.groupBy(nonCriticalAssets, byCategory))

    function ThreatList(asset, category) {
      var threats = getThreatsforCategory(category)
      //console.log(`${asset.assetDisplayname} has ${threats.length} threats`, threats)
      return (
        <>
          {
            threats.map(k => {
              var impacts = k['Potential Impact'].split(', ').some(i => {
                return propFilter[i]
              })
              if (impacts) {
                return (
                  <Accordion>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1-content"
                      id="panel1-header"
                      sx={{ textTransform: 'capitalize' }}>
                      <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'space-between' }}>
                        <span>{k.Threat}</span>
                        <span>({k['Potential Impact'].split(', ').map(i => i.split('')[0])})</span>
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                      {k.Description}
                    </AccordionDetails>
                  </Accordion>
                )
              }
            })
          }
        </>

      )
    }

    function assetGroup(group, groupIsKey) {
      // should all be the same, check the first
      var category = group[0].assetCategory
      console.log(category)
      if (propFilter[category]) {
        return (
          <>
            <Paper sx={{ p: '1em' }} elevation={groupIsKey ? 0 : 0}>
              <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'row', mb: '1em' }}>
                {groupIsKey && <ArrowRightAltIcon color="secondary" />}
                <Typography variant="h5" sx={{ fontStyle: 'italic', textTransform: 'capitalize' }}>
                  {category.replace('/', ' & ')}
                </Typography>
              </Box>
              {groupIsKey &&
                <Typography >
                  These threats may impact or relate to a key asset.
                </Typography>
              }
              {group.map(asset => {
                if (asset.assetLifeCycleStage.split(',').some(lfc => propFilter[lfc])) {
                  console.log(asset, 'should be displayed', asset.assetLifeCycleStage)

                  return (<Accordion>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1-content"
                      id="panel1-header"
                      sx={{ textTransform: 'capitalize' }}>
                      {asset.assetDisplayname}
                    </AccordionSummary>
                    <AccordionDetails>
                      <Box sx={{ display: 'flex' }}>
                        <Box sx={{ minWidth: '35ch', maxWidth: '35ch' }}>
                          <Typography sx={{ opacity: '.6', mb: '1em' }}>{asset.assetLifeCycleStage.split(', ').join('—')}</Typography>
                          <Typography sx={{ fontStyle: 'italic', mb: '1em' }}>"{asset.assetDescription}"</Typography>
                        </Box>

                        <Box sx={{ flexGrow: 1 }}>
                          {ThreatList(asset, category)}
                        </Box>
                      </Box>

                    </AccordionDetails>
                  </Accordion>)
                }
              })}
            </Paper>
          </>
        )
      }
    }

    return (
      <>
        {assetGroup(potentialKeyAssets, true)}
        {nonCriticalAssetGroups.map(group => {
          return assetGroup(group, false)
        })}
      </>
    )
  }

  function handlePropChange(event) {
    var propChanged = event.target.name
    propFilter[propChanged] = !propFilter[propChanged]
    updatePropFilter(propFilter)
  }
  function handleAssetChange(event) {
    var propChanged = event.target.name
    propFilter[propChanged] = !propFilter[propChanged]
    updatePropFilter(propFilter)
  }

  return (
    <>
      <Typography level="title-lg" variant='h4'>
        Threat Analysis
      </Typography>
      <Typography variant="subtitle">
        Identify the Threats Surrouding Your Assets
      </Typography>
      <Accordion>
        <AccordionSummary
          expandIcon={<TuneRoundedIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
          sx={{ textTransform: 'capitalize' }}>
          Filters
        </AccordionSummary>
        <AccordionDetails>
          Automated threat identification easily produces false positives (<i>i.e.,</i> irrelevant threats).<br /> Apply filters to investigate threats from different angles — the initial selection reflects the previously defined key asset and security property.
          {propFilter.Confidentiality}
          <Box sx={{ display: 'flex' }}>
            <Box sx={{ maxHeight: '13em', p: '1em' }}>
              <FormControl component="fieldset">
                <FormLabel component="legend" color="secondary">Security Properties</FormLabel>
                <FormGroup>
                  <FormControlLabel
                    control={<Switch checked={propFilter.Confidentiality} onChange={handlePropChange} name="Confidentiality" color="secondary" />}
                    label="Confidentiality" />
                  <FormControlLabel
                    control={<Switch checked={propFilter.Integrity} onChange={handlePropChange} name="Integrity" color="secondary" />}
                    label="Integrity" />
                  <FormControlLabel
                    control={<Switch checked={propFilter.Availability} onChange={handlePropChange} name="Availability" color="secondary" />}
                    label="Availability" />
                  <FormControlLabel
                    control={<Switch checked={propFilter.Accountability} onChange={handlePropChange} name="Accountability" color="secondary" />}
                    label="Accountability" />
                </FormGroup>
                <FormHelperText>
                  <span style={{ textTransform: 'capitalize' }}>{selectedModelInfo.keyProp} is your key property</span>
                </FormHelperText>
              </FormControl>
            </Box>
            <Box sx={{ maxHeight: '12em', p: '1em', overflow: 'scroll' }}>
              <FormControl component="fieldset">
                <FormLabel component="legend" color="secondary">Design Stage</FormLabel>
                <FormGroup>
                  <FormControlLabel
                    control={<Switch checked={propFilter['Business Understanding']} onChange={handlePropChange} name="Business Understanding" color="secondary" />}
                    label="Business Understanding" />
                  <FormControlLabel
                    control={<Switch checked={propFilter['Business Goal Definition']} onChange={handlePropChange} name="Business Goal Definition" color="secondary" />}
                    label="Business Goal Definition" />
                  <FormControlLabel
                    control={<Switch checked={propFilter['Data Pre-processing']} onChange={handlePropChange} name="Data Pre-processing" color="secondary" />}
                    label="Data Pre-processing" />
                  <FormControlLabel
                    control={<Switch checked={propFilter['Model Tuning']} onChange={handlePropChange} name="Model Tuning" color="secondary" />}
                    label="Model Tuning" />
                  <FormControlLabel
                    control={<Switch checked={propFilter['Feature Selection']} onChange={handlePropChange} name="Feature Selection" color="secondary" />}
                    label="Feature Selection" />
                  <FormControlLabel
                    control={<Switch checked={propFilter['Data Exploration']} onChange={handlePropChange} name="Data Exploration" color="secondary" />}
                    label="Data Exploration" />
                  <FormControlLabel
                    control={<Switch checked={propFilter['Data Ingestion']} onChange={handlePropChange} name="Data Ingestion" color="secondary" />}
                    label="Data Ingestion" />
                  <FormControlLabel
                    control={<Switch checked={propFilter['Model Training']} onChange={handlePropChange} name="Model Training" color="secondary" />}
                    label="Model Training" />
                  <FormControlLabel
                    control={<Switch checked={propFilter['Model Selection']} onChange={handlePropChange} name="Model Selection" color="secondary" />}
                    label="Model Selection" />
                  <FormControlLabel
                    control={<Switch checked={propFilter['Model Building']} onChange={handlePropChange} name="Model Building" color="secondary" />}
                    label="Model Building" />
                  <FormControlLabel
                    control={<Switch checked={propFilter['Model Deployment']} onChange={handlePropChange} name="Model Deployment" color="secondary" />}
                    label="Model Deployment" />
                  <FormControlLabel
                    control={<Switch checked={propFilter['Model Maintenance']} onChange={handlePropChange} name="Model Maintenance" color="secondary" />}
                    label="Model Maintenance" />
                  <FormControlLabel
                    control={<Switch checked={propFilter['Transfer Learning']} onChange={handlePropChange} name="Transfer Learning" color="secondary" />}
                    label="Transfer Learning" />
                </FormGroup>
                <FormHelperText>
                </FormHelperText>
              </FormControl>
            </Box>
            <Box sx={{ maxHeight: '12em', p: '1em', overflow: 'scroll' }}>
              <FormControl component="fieldset">
                <FormLabel component="legend" color="secondary">Asset Type</FormLabel>
                <FormGroup>
                  <FormControlLabel
                    control={<Switch checked={propFilter['Actor']} onChange={handleAssetChange} name="Actor" color="secondary" />}
                    label="Actor" />
                  <FormControlLabel
                    control={<Switch checked={propFilter['Data']} onChange={handleAssetChange} name="Data" color="secondary" />}
                    label="Data" />
                  <FormControlLabel
                    control={<Switch checked={propFilter['Model']} onChange={handleAssetChange} name="Model" color="secondary" />}
                    label="Model" />
                  <FormControlLabel
                    control={<Switch checked={propFilter['Artefacts']} onChange={handleAssetChange} name="Artefacts" color="secondary" />}
                    label="Artefacts" />
                  <FormControlLabel
                    control={<Switch checked={propFilter['Processes']} onChange={handleAssetChange} name="Processes" color="secondary" />}
                    label="Processes" />
                  <FormControlLabel
                    control={<Switch checked={propFilter['Environment/Tools']} onChange={handleAssetChange} name="Environment/Tools" color="secondary" />}
                    label="Environment & Tools" />
                </FormGroup>
                <FormHelperText>
                </FormHelperText>
              </FormControl>
            </Box>
          </Box>

        </AccordionDetails>
      </Accordion>
      {assetList(detectedAssets, selectedModelInfo)}
    </>
  )
}

function useModeledAssets(diagram, taxonomy) {
  var x = new DOMParser()
  var d = x.parseFromString(diagram.xml, 'text/xml')
  var a = [...d.querySelectorAll('[assetname]')]
  var [detectedAssets, setAsset] = useState(a.map(function(e) {
    var assetAttr = e.getAttribute('assetname')
    var labelAttr = e.getAttribute('label')
    var displayName = assetAttr

    if (assetAttr !== labelAttr) {
      displayName = `${assetAttr} (${labelAttr})`
    }

    var assetTaxonomyEntry = taxonomy.find(t => t.Asset === assetAttr)
    if (!assetTaxonomyEntry) {
      console.warn(`${assetAttr} not in asset taxonomy`)
      return {
        assetname: e.getAttribute('assetname'),
        assetDisplayname: displayName,
        assetDescription: 'N/A',
        assetLifeCycleStage: 'N/A',
        assetCategory: 'N/A'
      }
    }

    return {
      assetname: e.getAttribute('assetname'),
      assetDisplayname: displayName,
      assetDescription: assetTaxonomyEntry.Definition,
      assetLifeCycleStage: assetTaxonomyEntry['AI Lifecycle Stage'],
      assetCategory: assetTaxonomyEntry.Category
    }
  }))

  return [detectedAssets, setAsset]
}
