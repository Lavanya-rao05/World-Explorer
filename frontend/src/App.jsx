// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Hero from './pages/Herosection';
import Planner from './pages/Planner';
import Places from './pages/Places';
import Restaurants from './pages/Restaurants';
import Summary from './pages/Summary';
import Explore from './pages/Explore';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/planner" element={<Planner />} />
        <Route path="/places" element={<Places />} />
        <Route path="/restaurants" element={<Restaurants />} />
        <Route path="/summary" element={<Summary />} />
        <Route path="/explore" element={<Explore />} />
      </Routes>
    </Router>
  );
}

export default App;
