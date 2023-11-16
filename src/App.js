import './App.css';
import {useState} from "react";
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
        return (<div style={{textAlign: "left"}}>
            {data.map((asset) => (<ul>
                <li>Identified Asset : {asset["Identified Asset"]}</li>
                <li>Category: {asset["Category"]}</li>
                <li>All possible Threats:</li>
                <ol type="1">
                {asset["Threats"].map((threat) => (<>
                    <li></li>
                    <ul>
                        <li>Threat: {threat["Threat"]}</li>
                        <li>Threat Category: {threat["Threat Category"]}</li>
                        <li>Potential Impact: {threat["Potential Impact"]}</li>
                        <li>Description: {threat["Description"]}</li>
                    </ul>
                </>))}
                </ol>
            </ul>))}
        </div>);
    }

    return (<div className="App">
        <header className="App-header">
            <h1>
                ThreatsFinder for AI-based Systems
            </h1>
            <input type="file" onChange={handleFileChange}/>
            <button onClick={handleUpload}>Upload and Identify Threats</button>
            <br/>
            {data && getTestDivs(data)}
        </header>
    </div>);
}

export default App;
