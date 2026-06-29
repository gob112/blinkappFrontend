import './App.css'
import BlinkDetection from './components/BlinkDetection'
import Stats from './components/Stats'
import Settings from './components/Settings'
import NavBar from './components/NavBar'
import Timer from './components/Timer'
import BlinkTimer from './components/BlinkTimer'
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';

function App() {

  return (
    <div>
     
      <Router>
         <NavBar />
        <Routes>
          <Route path="/blink" element={<BlinkDetection />} />
          <Route path="/" element={<h1>homepage</h1>} />
          <Route path="/stats" element={<Stats />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/timer" element={<Timer />} />
           <Route path="/test" element={<BlinkTimer />} />
        </Routes>
      </Router>
    </div>
   
  )
}

export default App
