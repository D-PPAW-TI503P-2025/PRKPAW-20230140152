import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import DashboardPage from './components/DashboardPage';
import PresensiPage from './components/PresensiPage';
import AdminPage from './components/AdminPage'; 
import "leaflet/dist/leaflet.css";
import "./components/presensi-dark.css";


function App() {
  return (
    <Router>
      <div className="cyber-wrapper">
        {/* ===== Navbar Soft Brown Theme ===== */}
        <nav className="cyber-card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>

          <h1 className="cyber-content">
            PAW
          </h1>
          <div className="space-x-3">
            <Link
              to="/login"
              className="cyber-btn neon-yellow"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="cyber-btn neon-yellow"
            >
              Register
            </Link>
            <Link
              to="/presensi"
              className="cyber-btn neon-yellow"
            >
              Presensi
            </Link>
            <Link
              to="/admin"
              className="cyber-btn neon-yellow"
            >
              Admin
            </Link>
          </div>
        </nav>

        <div className="p-4 max-w-4xl mx-auto mt-6">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/presensi" element={<PresensiPage />} />
            <Route path="/admin" element={<AdminPage />} /> {/* ⬅️ Route Admin */}
            <Route path="/" element={<LoginPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;