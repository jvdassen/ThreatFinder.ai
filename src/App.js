import './App.css';
import { getDomain } from './utils/getDomain.js';
import { useState } from 'react';
import axios from 'axios';
import html2pdf from 'html2pdf.js';

function App() {
    const [data, setData] = useState([]);
    const [file, setFile] = useState(null);
    const [filter, setFilter] = useState("");

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handlePropertyChange = (property) => {
        // Toggle selected property
        setFilter((prevSelected) =>
            prevSelected.includes(property)
                ? prevSelected.filter((p) => p !== property)
                : [...prevSelected, property]
        );
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
                                            <br/>
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
            <header className="App-header">
                <h1>ThreatsFinder for AI-based Systems</h1>
                <input type="file" onChange={handleFileChange} />
                <br />
                <button onClick={handleUpload}>Upload and Identify Threats</button>
                <br />

                <div style={{ textAlign: 'left', fontSize: '16px' }}>
                    <strong>Filter by Properties:</strong>
                    {['Integrity', 'Availability', 'Authenticity', 'Non-repudiation', 'Confidentiality', 'Authorization'].map(
                        (property) => (
                            <label key={property}>
                                <input
                                    type="checkbox"
                                    checked={filter.includes(property)}
                                    onChange={() => handlePropertyChange(property)}
                                />
                                {property}
                            </label>
                        )
                    )}
                </div>

                {data && (
                    <>
                        <br/>
                        <button onClick={downloadPDF}>Download as a PDF</button>
                        <div id="pdf-content">{getTestDivs(data)}</div>
                    </>
                )}
            </header>
        </div>
    );
}

export default App;
