import './App.css';
import { useEffect, useState } from "react";
import { api } from './utils/api'
import axios from "axios";

function App() {
  const [data, setData] = useState([]);
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post('http://localhost:8080/upload', formData);
      setData(response.data);
    } catch (error) {
      alert(error.response.data);
    }
  };

  const getTestDivs = data => {
    const result = data.map(asset => asset['Threats'].map(threat => (
        <>
          <div>Asset name: {threat['Affected assets']}</div>
          <div>"Threat Category":{threat["Threat Category"]},</div>
            <div>"Threat": {threat["Threat"]},</div>
              <div> "Description": {threat["De}scription"]},</div>
                <div>"Potential Impact":{threat["Potential Impact"]},</div>
                  <div>"Affected assets": {threat['Affected assets']}</div>
        </>
    )))
    return <>{result}</>;
  }

  return (
      <div className="App">
        <header className="App-header">
          <p>
            ThreatsFinder for AI-based Systems
          </p>
          <input type="file" onChange={handleFileChange} />
          <button onClick={handleUpload}>Upload and Identify Threats</button>
          {data.length > 0 && getTestDivs(data)}
        </header>
      </div>
  );
}

export default App;
