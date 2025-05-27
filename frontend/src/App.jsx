// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Heroine from './pages/Heroine';
import Planner from './pages/Planner';
import Places from './pages/Places';
import Restaurants from './pages/Restaurants';
import Explore from './pages/Explore';
import './App.css';
import Hotels from './pages/Hotel';
import Login from './pages/Login';
import Register from './pages/Register'
import ProtectedRoute from './components/ProtectedRoutes';
import CustomMap from "./pages/FInalMap";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Heroine />} />
        <Route path="/planner" element={
          <ProtectedRoute>
            <Planner />
          </ProtectedRoute>
        } />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/places" element={<Places />} />
        <Route path="/restaurants" element={<Restaurants />} />
        <Route path='/hotels' element={<Hotels/>}/>
        <Route path="/explore" element={<Explore />} />
       <Route path="/CustomMap" element={<CustomMap />} />
       
      </Routes>
    </Router>
  );
}

export default App;
