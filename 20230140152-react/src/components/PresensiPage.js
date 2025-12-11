import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import locationPin from "./location-pin.png";

function PresensiPage() {
  const [coords, setCoords] = useState(null);
  const [error, setError] = useState("");
  const [photoURL, setPhotoURL] = useState(null);
  const [modalMessage, setModalMessage] = useState("");
  const [showModal, setShowModal] = useState(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const token = localStorage.getItem("token");

  const userIcon = new L.Icon({
    iconUrl: locationPin,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  });

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => setError("Gagal mendapatkan lokasi: " + err.message)
      );
    } else setError("Browser tidak mendukung geolocation.");
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) {
      setError("Tidak bisa mengakses kamera: " + err.message);
    }
  };

  const takePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);

    setPhotoURL(canvas.toDataURL("image/jpeg"));
    setError("");
  };

  useEffect(() => {
    getLocation();
    startCamera();
    return () => {
      if (streamRef.current)
        streamRef.current.getTracks().forEach((track) => track.stop());
    };
  }, []);

  const handlePresensi = async (type) => {
    if (!coords && type === "check-in") return setError("Lokasi belum didapatkan.");

    try {
      let res;
      if (type === "check-in") {
        if (!photoURL) return setError("Harap ambil foto selfie sebelum check-in.");

        const blob = await (await fetch(photoURL)).blob();
        const formData = new FormData();
        formData.append("latitude", coords.lat);
        formData.append("longitude", coords.lng);
        formData.append("buktiFoto", blob, "selfie.jpg");

        res = await axios.post("http://localhost:3001/api/presensi/check-in", formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        res = await axios.post(
          "http://localhost:3001/api/presensi/check-out",
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      setModalMessage(res.data.message);
      setShowModal(true);
      setPhotoURL(null);
    } catch (err) {
      setError(err.response?.data?.message || `${type} gagal`);
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Presensi Mahasiswa</h2>

      {coords && (
        <MapContainer
          center={[coords.lat, coords.lng]}
          zoom={16}
          style={{ height: "300px", width: "100%", marginBottom: "20px" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker position={[coords.lat, coords.lng]} icon={userIcon}>
            <Popup>Lokasi Anda</Popup>
          </Marker>
        </MapContainer>
      )}

      <div className="mb-4">
        <video
          ref={videoRef}
          autoPlay
          className="w-full border rounded-md mb-2"
          style={{ maxHeight: "300px" }}
        />
        <button
          onClick={takePhoto}
          className="py-2 px-4 bg-yellow-500 text-white rounded-md mb-2"
        >
          Ambil Foto
        </button>

        {photoURL && (
          <div className="mt-2">
            <img
              src={photoURL}
              alt="Preview"
              className="w-full rounded-md border"
              style={{ maxHeight: "300px" }}
            />
          </div>
        )}

        <canvas ref={canvasRef} style={{ display: "none" }} />
      </div>

      <div className="flex gap-2 mb-4">
        <button
          onClick={() => handlePresensi("check-in")}
          className="flex-1 py-2 px-4 bg-green-600 text-white rounded-md"
        >
          Check-In
        </button>
        <button
          onClick={() => handlePresensi("check-out")}
          className="flex-1 py-2 px-4 bg-red-600 text-white rounded-md"
        >
          Check-Out
        </button>
      </div>

      {error && <p className="text-red-600 mt-2">{error}</p>}

      {/* Modal Popup */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 animate-fade-in">
          <div className="bg-white rounded-lg p-6 w-11/12 max-w-sm shadow-lg relative">
            <h3 className="text-lg font-bold mb-4">Info Presensi</h3>
            <p className="mb-4">{modalMessage}</p>
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 font-bold"
            >
              &times;
            </button>
            <button
              onClick={() => setShowModal(false)}
              className="mt-2 w-full py-2 px-4 bg-blue-600 text-white rounded-md"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default PresensiPage;