import React from 'react';
import logo from './logo.svg';
import './App.css';
import { useRoute } from "./router";

function App() {

  const route = useRoute();

  if( route.name === false ){

    return <h1>NOT FOUND</h1>;

  }

  return (
    <div className="App">
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
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
