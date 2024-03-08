import './App.css';
import { getDomain } from './utils/getDomain.js';
import { useState } from 'react';
import axios from 'axios';
import html2pdf from 'html2pdf.js';
import DrawIO from "./DrawIOMix";
import { Button, Checkbox, FormControlLabel, styled } from "@mui/material";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

function App() {
  const [data, setData] = useState([]);
  const [file, setFile] = useState(null);
  const [filter, setFilter] = useState("");
  const [threatFinder, setThreatFinder] = useState(true);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handlePropertyChange = (property) => {
    // Toggle selected property
    setFilter((prevSelected) => prevSelected.includes(property) ? prevSelected.filter((p) => p !== property) : [...prevSelected, property]);
  };

  const handleUpload = async () => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post(`${getDomain()}upload`, formData);
      setData(response.data);
    } catch (error) {
      alert(error.response.data);
    }
  };

  const getTestDivs = (data) => {
    return (
      <div style={{ textAlign: 'left', fontSize: '16px' }}>
        {data.map((asset) => (
          <ul key={asset['Identified Asset']}>
            <li>
              Identified Asset : <b>{asset['Identified Asset']}</b>
            </li>
            <li>Category: {asset['Category']}</li>
            <li>All possible Threats:</li>
            <ol type="1">
              {asset['Threats'].map((threat, index) => {
                const potentialImpacts = threat['Potential Impact'].split(", ");
                const shouldDisplay = filter.length === 0 || filter.some(f => potentialImpacts.includes(f));

                if (shouldDisplay) {
                  return (
                    <>
                      <li key={index}>
                        <ul>
                          <li>Threat: <u>{threat['Threat']}</u></li>
                          <li>Threat Category: {threat['Threat Category']}</li>
                          <li>Potential Impact: {threat['Potential Impact']}</li>
                          <li>Description: {threat['Description']}</li>
                        </ul>
                      </li>
                      <br />
                    </>
                  );
                } else {
                  return null;
                }
              })}
            </ol>
          </ul>
        ))}
      </div>
    );
  };

  const downloadPDF = () => {
    const element = document.getElementById('pdf-content');
    html2pdf(element);
  };

  return (
    <div className="App">
      <header
        className="App-header"
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            width: "20%",
            position: "fixed",
            top: "0",
            transform: "translateY(45vh)"
          }}
        >
          <Button
            onClick={() => setThreatFinder(false)}
            sx={{ color: "white", backgroundColor: "#546e7a" }}
            variant="contained"
          >
            1. Model Assets
          </Button>
          <Button
            onClick={() => { }}
            sx={{ color: "white", backgroundColor: "#546e7a" }}
            variant="contained"
          >
            2. Define Goals
          </Button>
          <Button
            onClick={() => setThreatFinder(true)}
            sx={{ color: "white", backgroundColor: "#546e7a" }}
            variant="contained"
          >
            3. Compile Threats
          </Button>
          <Button
            onClick={() => { }}
            sx={{ color: "white", backgroundColor: "#546e7a" }}
            variant="contained"
          >
            4. Adopt Controls
          </Button>
        </div>

        {threatFinder ? (
          <div style={{ width: "80%", marginLeft: "20%", textAlign: "center" }}>
            <h1>ThreatsFinder for AI-based Systems</h1>
            <Button component="label" variant="contained" onChange={handleFileChange}
              startIcon={<CloudUploadIcon />} sx={{ backgroundColor: "#2196f3", color: "white" }}>
              Choose XML file
              <VisuallyHiddenInput type="file" />
            </Button>
            <br />
            <Button onClick={handleUpload} variant="contained"
              sx={{ backgroundColor: "#4caf50", color: "white" }}>
              Upload and Identify Threats
            </Button>
            <br />
            <br />
            <div style={{ textAlign: 'left', fontSize: '16px' }}>
              <strong style={{ fontSize: "18px" }}>Filter by Properties: </strong>
              {['Integrity', 'Availability', 'Authenticity', 'Non-repudiation', 'Confidentiality', 'Authorization'].map((property) => (
                <FormControlLabel
                  key={property}
                  control={
                    <Checkbox
                      type="checkbox"
                      checked={filter.includes(property)}
                      onChange={() => handlePropertyChange(property)}
                      sx={{ color: "#546e7a" }}
                    />
                  }
                  label={property}
                />
              ))}
            </div>

            {data && (
              <>
                <br />
                <Button onClick={downloadPDF} variant="contained"
                  sx={{ backgroundColor: "#607d8b", color: "white" }}>
                  Download as a PDF
                </Button>
                <div id="pdf-content">{getTestDivs(data)}</div>
              </>
            )}
          </div>
        ) : (
          <div style={{ width: "80%", marginLeft: "20%" }}>
            <DrawIO />
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
