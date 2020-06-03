import React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import Crop from "./components/Crop";
import Cheque from "./components/Cheque";
import './App.css';

function App() {
  return (
    <Router>
    <div className="App">
      <Route path="/" strict exact component={Crop} />
      <Route path="/cheque" component={Cheque} />
    </div>
    </Router>
  );
}

export default App;
