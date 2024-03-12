import { useState, useEffect } from 'react'
import { List, ListItem, ListSubheader, Typography } from '@mui/material'

export default Stats

function Stats({ diagram }) {
  var [asset, setAsset] = useState([])

  useEffect(() => {
    console.log('useeffect', diagram)
    console.log('handleStorageChange')
    if(diagram && Object.hasOwn(diagram, 'xml')) {
      try {
      var x = new DOMParser()
      var d = x.parseFromString(diagram.xml, 'text/xml')
      var a = [...d.querySelectorAll('[assetname]')]
      var assets = a.map(e => e.getAttribute('assetname'))
      setAsset(assets)
      } catch (e) {

      }
    }
  }, [ diagram ]);


  function assetList(assets) {
    var uniqueAssets = [...new Set(assets)]

    return uniqueAssets.map(a => {
      return <ListItem key={a}>
        {a} ({assets.filter(x => x === a).length})
      </ListItem>
    })
  }

  return (
    <List>
      <ListSubheader style={{lineHeight: '24px'}}>
        Overview
      </ListSubheader>
      <ListItem>
        <Typography
          level="title-lg"
          fontFamily="monospace"
          sx={{ opacity: '50%', marginBottom: '1em' }}
        >
      Your model contains the following {asset.length} assets:
        </Typography>
      </ListItem>
      {assetList(asset)}
    </List>
  )

}
