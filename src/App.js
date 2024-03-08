import './App.css';
import { useState } from 'react';
import DrawIO from './pages/DrawIOMix';
import Analyze from './pages/Analyze';
import Controls from './pages/Controls';
import Goals from './pages/Goals';
import { Button } from '@mui/material';

function App() {
  const [view, setView] = useState('model');
  return (
    <div className="App">
      <header
        className="App-header"
        style={{
          display: "flex",
          alignItems: "flex-start",
          height: "2em"
        }}
      >
        <div className="header-item-wrapper">
          <Button
            onClick={() => setView('model')}
            sx={{ color: "white", backgroundColor: "#282c34" }}
            variant="contained"
          >
            1. Model Assets &#8871;
          </Button>
          <Button
            onClick={() => { setView('goals') }}
            sx={{ color: "white", backgroundColor: "#282c34" }}
            variant="contained"
          >
            2. Define Goals &#128907;
          </Button>
          <Button
            onClick={() => setView('analyze')}
            sx={{ color: "white", backgroundColor: "#282c34" }}
            variant="contained"
          >
            3. Compile Threats &#8721;
          </Button>
          <Button
            onClick={() => { setView('controls') }}
            sx={{ color: "white", backgroundColor: "#282c34" }}
            variant="contained"
          >
            4. Adopt Controls &#12108;
          </Button>
        </div>
      </header>
      <div className="body-wrapper">
        {view === 'model' && <DrawIO />}
        {view === 'goals' && <Goals />}
        {view === 'analyze' && <Analyze />}
        {view === 'controls' && <Controls />}
      </div>
    </div >
  );
}

export default App;
