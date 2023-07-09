import React, { useEffect, useState } from 'react';
import { CssBaseline } from '@mui/material';

import logo from './logo.svg';

import './App.css';

function App() {
  const [msg, setMsg] = useState(null)

  useEffect(() => {
    fetch('http://localhost:8080/')
      .then(res => res.json())
      .then(res => setMsg(res))
  }, [])

  return (
    <div className="App">
      <CssBaseline enableColorScheme />  
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React {msg}
        </a>
      </header>
    </div>
  );
}

export default App;
