import './App.css';
import React, { useState } from 'react';
import Create from './create';
import Read from './read';
import Update from './update';
import Login from './login';
import LoginData from './loginData';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './navbar';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [readIn, setReadIn] = useState(false);
  const [admin, setAdmin] = useState(false);

  return (
    <Router>
      <div>
        <div className='nav'>
          <Navbar readIn={readIn} loggedIn={loggedIn} setReadIn={setReadIn} setLoggedIn={setLoggedIn} />
        </div>
        <div className="main">
          <h2 className="main-header">React Crud Operations</h2>
          <div>
            <Routes>
              <Route exact path='/adminCreate' element={<Create isAdmin={true} />}></Route>
              <Route exact path='/create' element={<Create isAdmin={false} />}></Route>
              <Route exact path='/read' element={readIn ? <Read /> : <Navigate replace to={"/"} />}></Route>
              <Route exact path='/update' element={loggedIn ? <Update admin={admin} /> : <Navigate replace to={"/"} />}></Route>
              <Route exact path='/login' element={<Login setAdmin={setAdmin} setReadIn={setReadIn} setLoggedIn={setLoggedIn} />}></Route>
              <Route exact path='/loginData' element={loggedIn ? <LoginData /> : <Navigate replace to={"/"} />}></Route>
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
