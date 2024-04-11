import { List, ListItem, ListItemText, ListSubheader, Typography } from '@mui/material'
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
  
  var x = new DOMParser()
  var d = x.parseFromString(diagram.xml, 'text/xml')
  var a = [...d.querySelectorAll('[assetname]')]
  var [assets, setAsset] = useState(a.map(e => e.getAttribute('assetname')))

  console.log(assetTaxonomy)
  function assetList (assets) {
    var uniqueAssets = [...new Set(assets)]
    uniqueAssets = uniqueAssets.map(function (e) {
      return {
        assetname: e,
        taxonomyEntry: assetTaxonomy.find(e => e.Asset = e)
      }
    })

    return uniqueAssets.map(a => {
      var mentioned = assets.filter(x => x === a).length

      if (mentioned > 1) {
        return <ListItem key={a} sx={{ pt: 0, pb: 0, pl: '1.5em', opacity: .6}}>
           <ListItemText>‒ {mentioned}&times; {a}</ListItemText>
        </ListItem>
      }
      return <ListItem key={a} sx={{ pt: 0, pb: 0, pl: '1.5em', opacity: .6}}>
        <ListItemText>‒ {a}</ListItemText>
      </ListItem>

    })
  }

  return (
    <>
      <Typography level="title-lg" variant='h4'>
        Threat Analysis
      </Typography>
      <Typography variant="subtitle">
        Identify the Threats Surrouding Your Assets
      </Typography>
      {assetList(assets)}
    </>
  )
}

