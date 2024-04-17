import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import { ListItem, ListItemText, Switch } from '@mui/material'
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { Typography } from '@mui/material'
import TuneRoundedIcon from '@mui/icons-material/TuneRounded';
import { useState, useEffect } from 'react'

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
      Accountability: keyProp === 'Accountability'
    }
  )

  function updatePropFilter(newState) { setPropFilter({ ... newState }) }

  window.propFilter = propFilter
  window.setPropFilter = setPropFilter

  //console.log(propFilter)

  function getThreatsforCategory (category) {
    var threats = threatTaxonomy.filter(t => t['Affected assets'].includes(category))
    threats.map(t => {
      return t.potentialKeyThreat = t['Potential Impact'].includes(selectedModelInfo.keyProp)
    })
    return threats
  }


  function assetList (assets, selectedModelInfo) {
    assets.sort(function sortByStringAttribute(a, b) {
      return a.assetDisplayname.localeCompare(b.assetDisplayname)
    })

    // TODOD DELETE
    var potentialKeyAssets = assets.filter(a => a.assetCategory === selectedModelInfo.keyAsset)


    var nonCriticalAssets = assets.filter(a => a.assetCategory !== selectedModelInfo.keyAsset)
    //var notKeyAssetGroups = [...new Set(otherAssets.map(a => a.assetCategory))]

    function byCategory ({ assetCategory }) { return assetCategory }
    var nonCriticalAssetGroups = Object.values(Object.groupBy(nonCriticalAssets, byCategory))

    function ThreatList (asset, category) {
      var threats = getThreatsforCategory(category)
      //console.log(`${asset.assetDisplayname} has ${threats.length} threats`, threats)
      return (
        <>
          {
            threats.map(k => {
              var impacts = k['Potential Impact'].split(', ').some(i => {
                return propFilter[i]
              })
              if(impacts) {
                return (
                  <Accordion>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1-content"
                      id="panel1-header"
                      sx={{ textTransform: 'capitalize' }}>
                      {k.Threat} - ({k['Potential Impact']})
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

    function assetGroup (group, groupIsKey) {
      // should all be the same, check the first
      var category = group[0].assetCategory
      return (
        <>
          <Paper sx={{ p: '1em' }} elevation={groupIsKey ? 0 : 0}>
            <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'row', mb: '1em' }}>
              {groupIsKey && <ArrowRightAltIcon color="secondary" />}
              <Typography variant="h5" sx={{ fontStyle: 'italic', textTransform: 'capitalize' }}>
                {category.replace('/', ' & ')}
              </Typography>
            </Box>
            { groupIsKey && 
              <Typography >
                  These threats may impact or relate to a key asset.
              </Typography>
            }
            { group.map(asset => {
              console.log(asset.assetCategory)
             return (<Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1-content"
                id="panel1-header"
                sx={{ textTransform: 'capitalize' }}>
                {asset.assetDisplayname}
              </AccordionSummary>
              <AccordionDetails>
                {asset.assetDescription}
                {ThreatList(asset, category)}
              </AccordionDetails>
            </Accordion>)
            })}
          </Paper>
        </>
      )
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

  function handlePropChange (event) {
    var propChanged = event.target.name
    propFilter[propChanged] = !propFilter[propChanged]
    updatePropFilter(propFilter)
    console.log(propFilter)
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
          Automated threat identification easily produces false positives (<i>i.e.,</i> irrelevant threats).<br/> Apply filters to investigate threats from different angles — the initial selection reflects the previously defined key asset and security property.
          {propFilter.Confidentiality}
          <Box>
            <FormControl component="fieldset" variant="standard">
              <FormLabel component="legend">Security Properties</FormLabel>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Switch checked={propFilter.Confidentiality} onChange={handlePropChange}  name="Confidentiality" color="secondary"/>
                  }
                  label="Confidentiality"
                />
                <FormControlLabel
                  control={
                    <Switch checked={propFilter.Integrity} onChange={handlePropChange} name="Integrity" color="secondary"/>
                  }
                  label="Integrity"
                />
                <FormControlLabel
                  control={
                    <Switch checked={propFilter.Availability} onChange={handlePropChange} name="Availability" color="secondary"/>
                  }
                  label="Availability"
                />
                <FormControlLabel
                  control={
                    <Switch checked={propFilter.Accountability} onChange={handlePropChange} name="Accountability" color="secondary"/>
                  }
                  label="Accountability"
                />
              </FormGroup>
              <FormHelperText><span style={{ textTransform: 'capitalize' }}>                {selectedModelInfo.keyProp} is your key property</span>

              </FormHelperText>
            </FormControl>
          </Box>

        </AccordionDetails>
      </Accordion>
      {assetList(detectedAssets, selectedModelInfo)}
    </>
  )
}

function useModeledAssets (diagram, taxonomy) {
  var x = new DOMParser()
  var d = x.parseFromString(diagram.xml, 'text/xml')
  var a = [...d.querySelectorAll('[assetname]')]
  var [detectedAssets, setAsset] = useState(a.map(function (e) {
    var assetAttr = e.getAttribute('assetname')
    var labelAttr = e.getAttribute('label')
    var displayName = assetAttr

    if (assetAttr !== labelAttr) {
      displayName = `${assetAttr} (${labelAttr})`
    }

    var assetTaxonomyEntry = taxonomy.find(t => t.Asset === assetAttr)
    if(!assetTaxonomyEntry) {
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
