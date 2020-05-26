import React from 'react';
import './App.css';

import Game from "./wargame.js";

function App() {
  return (
    <div className="App">
      <header>WAR!</header>

      <Game />

      <footer></footer>
    </div>
  );
}

export default App;
