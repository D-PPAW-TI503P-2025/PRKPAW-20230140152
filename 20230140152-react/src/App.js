import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import LoginPage from "./components/loginpage";
import RegisterPage from "./components/RegisterPage";
import DashboardPage from "./components/DashboardPage";
import BooksPage from "./components/BooksPage";

function App() {
  return (
    <Router>
      <nav style={{ padding: "10px", background: "#eee" }}>
        <Link to="/login" style={{ marginRight: "10px" }}>Login</Link>
        <Link to="/register" style={{ marginRight: "10px" }}>Register</Link>
        <Link to="/dashboard" style={{ marginRight: "10px" }}>Dashboard</Link>
        <Link to="/books">Manajemen Buku</Link>
      </nav>

      <Routes>

        {/* AUTENTIKASI */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />

        {/* HALAMAN CRUD */}
        <Route path="/books" element={<BooksPage />} />

        {/* DEFAULT */}
        <Route path="/" element={<LoginPage />} />

      </Routes>
    </Router>
  );
}

export default App;
