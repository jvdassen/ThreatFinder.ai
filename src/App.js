import './App.css';
import { useState } from 'react';
import axios from 'axios';
import html2pdf from 'html2pdf.js';

function App() {
    const [data, setData] = useState([]);
    const [file, setFile] = useState(null);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleUpload = async () => {
        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await axios.post('http://localhost:8080/upload', formData);
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
                            {asset['Threats'].map((threat, index) => (
                                <li key={index}>
                                    <ul>
                                        <li>
                                            Threat: <u>{threat['Threat']}</u>
                                        </li>
                                        <li>Threat Category: {threat['Threat Category']}</li>
                                        <li>Potential Impact: {threat['Potential Impact']}</li>
                                        <li>Description: {threat['Description']}</li>
                                    </ul>
                                </li>
                            ))}
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
            <header className="App-header">
                <h1>ThreatsFinder for AI-based Systems</h1>
                <input type="file" onChange={handleFileChange} />
                <br />
                <button onClick={handleUpload}>Upload and Identify Threats</button>
                <br />
                {data && (
                    <>
                        <button onClick={downloadPDF}>Download as a PDF</button>
                        <div id="pdf-content">{getTestDivs(data)}</div>
                    </>
                )}
            </header>
        </div>
    );
}

export default App;
