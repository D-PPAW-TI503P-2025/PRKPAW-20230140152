import React, { useState, useEffect } from "react";
import axios from "axios";

function ReportPage() {
  const [data, setData] = useState([]);
  const [modalPhoto, setModalPhoto] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get("http://localhost:3001/api/presensi/laporan", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setData(res.data.data))
      .catch((err) => console.log(err));
  }, [token]);

  // Komponen Thumbnail Foto
  const PhotoThumbnail = ({ src, alt }) => {
    return (
      <img
        src={src}
        alt={alt}
        className="w-24 h-24 object-cover rounded cursor-pointer hover:scale-105 transition-transform"
        onClick={() => setModalPhoto(src)}
      />
    );
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Laporan Presensi</h2>

      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 px-2 py-1">User</th>
            <th className="border border-gray-300 px-2 py-1">Check-In</th>
            <th className="border border-gray-300 px-2 py-1">Check-Out</th>
            <th className="border border-gray-300 px-2 py-1">Latitude</th>
            <th className="border border-gray-300 px-2 py-1">Longitude</th>
            <th className="border border-gray-300 px-2 py-1">Foto</th>
          </tr>
        </thead>

        <tbody>
          {data.map((item) => (
            <tr key={item.id}>
              <td className="border border-gray-300 px-2 py-1">{item.user?.nama}</td>
              <td className="border border-gray-300 px-2 py-1">{item.checkIn}</td>
              <td className="border border-gray-300 px-2 py-1">{item.checkOut}</td>
              <td className="border border-gray-300 px-2 py-1">{item.latitude}</td>
              <td className="border border-gray-300 px-2 py-1">{item.longitude}</td>
              <td className="border border-gray-300 px-2 py-1">
                {item.buktiFoto ? (
                  <PhotoThumbnail src={`http://localhost:3001/${item.buktiFoto}`} alt="Bukti Foto" />
                ) : (
                  "Tidak ada foto"
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal Foto */}
      {modalPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 animate-fade-in">
          <div className="relative">
            <img
              src={modalPhoto}
              alt="Foto Presensi"
              className="max-h-screen max-w-screen rounded shadow-lg"
            />
            <button
              onClick={() => setModalPhoto(null)}
              className="absolute top-2 right-2 text-white text-2xl font-bold hover:text-gray-300"
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReportPage;