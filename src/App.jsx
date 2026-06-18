import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import BlinkDetection from './components/BlinkDetection'
import Stats from './components/Stats'
import Settings from './components/Settings'
import NavBar from './components/NavBar'
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';

function App() {

  return (
    <div>
      <NavBar />
      <Router>
        <Routes>
          <Route path="/blink" element={<BlinkDetection />} />
          <Route path="/" element={<h1>homepage</h1>} />
          <Route path="/stats" element={<Stats />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Router>
    </div>
   
  )
}

export default App
