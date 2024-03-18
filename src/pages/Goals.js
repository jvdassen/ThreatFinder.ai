import axios from 'axios'
import html2pdf from 'html2pdf.js'
import { useState } from 'react'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import { Button, Checkbox, FormControlLabel, styled, Typography, Box } from '@mui/material'
import { getDomain } from '../utils/getDomain.js'
import ThreatModels from './ThreatModels.jsx'


export default Goals

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

function Goals() {
  const [data, setData] = useState([]);
  const [file, setFile] = useState(null);
  const [filter, setFilter] = useState("");

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

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const downloadPDF = () => {
    const element = document.getElementById('pdf-content');
    html2pdf(element);
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

  return (
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Typography level="title-lg" variant='h4' fontFamily='monospace'>
        <i>Step 1) Security Objectives</i>
        <Typography
            level="title-lg"
            fontFamily="monospace"
            sx={{ opacity: '50%', marginBottom: '1em' }}
          >
          Define the most critical property of your key asset that you would intuitively protect.
          </Typography>
        </Typography>
      <h1>ThreatsFinder for AI-based Systems</h1>
      <Button component="label" variant="contained" onChange={handleFileChange}
        startIcon={<CloudUploadIcon />}>
        Choose XML file
        <VisuallyHiddenInput type="file" />
      </Button>
      <br />
      <Button onClick={handleUpload} variant="contained">
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
          <Button onClick={downloadPDF} variant="contained">
            Download as a PDF
          </Button>
          <div id="pdf-content">{getTestDivs(data)}</div>
        </>
      )}
      <ThreatModels/>
    </Box>
  )
}
