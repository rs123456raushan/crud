import './App.css';
import React, { useState } from 'react';
import Create from './create';
import Read from './read';
import Update from './update';
import Login from './login';
import LoginData from './loginData';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  return (
    <Router>
      <div className="main">
        <h2 className="main-header">React Crud Operations</h2>
        <div>
          <Routes>
            <Route exact path='/create' element={<Create />}></Route>
            <Route exact path='/read' element={<Read />}></Route>
            {/* <Route exact path='/update' element={<Update />}></Route> */}
            <Route exact path='/update' element={loggedIn ? <Update /> : <Navigate replace to={"/read"} />}></Route>
            <Route exact path='/login' element={<Login loggedIn={loggedIn} setLoggedIn={setLoggedIn}/>}></Route>
            <Route exact path='/loginData' element={loggedIn ? <LoginData /> : <Navigate replace to={"/read"} />}></Route>
            {/* <Route exact path='/loginData' element={<LoginData />}></Route> */}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
