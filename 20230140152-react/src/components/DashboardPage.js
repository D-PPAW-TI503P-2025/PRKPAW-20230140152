import React from "react";
import { useNavigate } from "react-router-dom";

function DashboardPage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-green-100 flex items-center justify-center p-6">

      <div className="bg-white p-10 rounded-2xl shadow-xl text-center w-full max-w-lg">
        <h1 className="text-4xl font-bold text-green-600 mb-4">
          Dashboard
        </h1>

        <p className="text-gray-700 text-lg mb-6">
          Selamat datang! Anda berhasil masuk.
        </p>

        <button
          onClick={handleLogout}
          className="px-6 py-2 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600"
        >
          Logout
        </button>
      </div>

    </div>
  );
}

export default DashboardPage;
