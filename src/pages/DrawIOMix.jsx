import React, { useEffect, useRef } from 'react';
import CORSCommunicator from './Draw_io/CORSCommunicator'
import DrawioStateController from './Draw_io/DrawioController.js'
import LocalStorageModel from './Draw_io/LocalStorageModel.js'
import './Draw_io/styles/style.css'
import './Draw_io/styles/variables.css'

import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

function DrawIO({ sendDiagram }) {
  const iframeRef = useRef(null);
  var localStorageModel = new LocalStorageModel()


  const initialized = useRef(false);
  console.log('useEFF')
  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true
      var drawioView = new CORSCommunicator(iframeRef.current)
      var stateController = new DrawioStateController(drawioView, localStorageModel)
      console.log('START OBSERVING')
      localStorageModel.observe(function (diagram) {
        sendDiagram(diagram)
        console.log('localstorage.observe')
      })
      sendDiagram(localStorageModel.read())
      console.info(`stateController initialized`, stateController)
    }
  }, []);

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Typography level="title-lg" variant='h4' fontFamily='monospace'>
        <i>Step 1) Architectural Modeling</i>
        <Typography
            level="title-lg"
            fontFamily="monospace"
            sx={{ opacity: '50%', marginBottom: '1em' }}
          >
        Draw the architectural diagram
          </Typography>
        </Typography>
    <iframe
      ref={iframeRef}
      width="100%"
      height="100%"
      src="https://embed.diagrams.net/?embed=1&ui=dark&spin=1&proto=json&configure=1&noExitBtn=1&saveAndExit=0&noSaveBtn=1&noExitBtn=1"
      style={{ border: 'none', borderRadius: '.5em' }}
      title={'draw.io'}
    />
    </Box>

  );
}

export default DrawIO;
