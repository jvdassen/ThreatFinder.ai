import { useState, useEffect } from 'react'
import Badge from '@mui/material/Badge'
import { List, ListItem, ListItemText, ListSubheader, Typography } from '@mui/material'


export default Stats

function Stats({ diagram }) {
  var [asset, setAsset] = useState([])

  useEffect(() => {
    //console.log('useeffect', diagram)
    //console.log('handleStorageChange')
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
      {asset.length > 0 &&
      <List>
        <ListSubheader style={{lineHeight: '24px'}}>
          Assets
        </ListSubheader>

        <ListItem>
          <Typography
          level="title-lg"
          fontFamily="monospace"
          sx={{ opacity: '.6' }}>
          Your model contains {asset.length} assets:
          </Typography>
        </ListItem>

        <List
          sx={{
            width: '100%',
            maxWidth: 360,
            bgcolor: 'background.paper',
            position: 'relative',
            overflow: 'auto',
            maxHeight: 300,
            '& ul': { padding: 0 },
          }}
          subheader={<li />}>
            {assetList(asset)}
        </List>
      </List>
      }
    </>
  )
}
