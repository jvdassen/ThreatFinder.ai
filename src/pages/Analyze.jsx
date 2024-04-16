import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { Typography } from '@mui/material'
import { useState, useEffect } from 'react'
import assetTaxonomy from './AssetTaxonomy.json'


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

  return (
    <>
      <Typography level="title-lg" variant='h4'>
        Threat Analysis
      </Typography>
      <Typography variant="subtitle">
        Identify the Threats Surrouding Your Assets
      </Typography>
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
