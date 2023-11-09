import logo from './logo.svg';
import './App.css';
import {useEffect, useState} from "react";
import {api} from './utils/api'

function App() {
  const [data, setData] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/');
        setData(response.data.message);
      } catch (error) {
        alert(error.response.data.message);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <p>{data}</p>
      </header>
    </div>
  );
}

export default App;
