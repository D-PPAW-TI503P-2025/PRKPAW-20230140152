import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function RegisterPage() {
  const [nama, setName] = useState("");
  const [role, setRole] = useState("mahasiswa");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      await axios.post("http://localhost:3001/api/auth/register", {
        nama,
        role,
        email,
        password,
      });

      navigate("/login");
    } catch (err) {
      setError(err.response ? err.response.data.message : "Registrasi gagal");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">

        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Register Akun
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nama
            </label>
            <input 
              type="text"
              className="mt-1 w-full px-3 py-2 border rounded-md"
              value={nama}
              onChange={(e)=>setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Role
            </label>
            <select
              className="mt-1 w-full px-3 py-2 border rounded-md"
              value={role}
              onChange={(e)=>setRole(e.target.value)}
            >
              <option value="mahasiswa">Mahasiswa</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input 
              type="email"
              className="mt-1 w-full px-3 py-2 border rounded-md"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input 
              type="password"
              className="mt-1 w-full px-3 py-2 border rounded-md"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
              required
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
          >
            Register
          </button>

        </form>

        {error && (
          <p className="text-red-500 text-center mt-3">{error}</p>
        )}

      </div>
    </div>
  );
}

export default RegisterPage;
