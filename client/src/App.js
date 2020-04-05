import React from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import otherPage from './otherPage';
import Fib from './Fib';
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <Router>
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <Link to='/'>Home Page</Link>
        <Link to='/otherPage'>Other Page</Link>
      </header>
      <div>
          <Route exact path='/' component={Fib} />
          <Route exact path='/otherPage' component={otherPage} />
        </div>
    </div>
    </Router>
  );
}

export default App;
