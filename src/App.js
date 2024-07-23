import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
    Routes,
    Route
} from "react-router-dom";


import Home from './components/pages/Home';
import AboutUs from './components/pages/AboutUs';
import ContactUs from './components/pages/ContactUs';

import './App.css';
import Layout from "./layout/Layout";


function App() {
  const [currentTime, setCurrentTime] = useState('Time since Epoch!');

  const fetchTime = () => {
    fetch('/time')
        .then(res => res.json())
        .then(data => {
      setCurrentTime(data.time);
    });
  };


  return (
      <div className={"container"}>
        <Router>
          <Layout>
            <Routes>
              <Route path={'/AboutUs'} component={AboutUs}></Route>
              <Route path={'/ContactUs'} component={ContactUs}></Route>
              <Route path={'/'} component={Home}></Route>
            </Routes>
          </Layout>
        </Router>
        <div className={"text-center mt-4"}>
          <button className={"btn btn-primary"} onClick={fetchTime}>
            {currentTime}
          </button>
        </div>
      </div>
  )
      ;
}

export default App;