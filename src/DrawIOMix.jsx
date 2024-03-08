import React, { useEffect, useRef } from 'react';
import CORSCommunicator from './Draw_io/CORSCommunicator'
import DrawioStateController from './Draw_io/DrawioController.js'
import LocalStorageModel from './Draw_io/LocalStorageModel.js'
import "./Draw_io/styles/style.css"
import "./Draw_io/styles/variables.css"

function DrawIO() {
  const iframeRef = useRef(null);

  useEffect(() => {
    const drawioView = new CORSCommunicator(iframeRef.current)
    const localStorageModel = new LocalStorageModel()
    const stateController = new DrawioStateController(drawioView, localStorageModel)
    console.info(`stateController initialized`, stateController)

  }, []);

  return (
    <iframe
      ref={iframeRef}
      width="100%"
      height="800px"
      src="https://embed.diagrams.net/?embed=1&ui=min&theme=dark&spin=1&proto=json&configure=1&noExitBtn=1&saveAndExit=0&noSaveBtn=1&noExitBtn=1"
      style={{ border: 'none' }}
      title={'draw.io'}
    />
  );
}

export default DrawIO;
