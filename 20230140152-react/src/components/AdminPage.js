import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode"; // CHANGED: default import
const BASE = "http://localhost:3001";

const AdminPage = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterNama, setFilterNama] = useState("");
  const [filterTanggal, setFilterTanggal] = useState("");
  const [modalPhoto, setModalPhoto] = useState(null);

  // Cek role admin
  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      window.location.href = "/login";
      return;
    }
    try {
      const decoded = jwtDecode(token);
      if (decoded.role !== "admin") {
        alert("Akses ditolak! Hanya admin yang bisa membuka halaman ini.");
        window.location.href = "/login";
      }
    } catch (err) {
      console.error(err);
      window.location.href = "/login";
    }
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError("");
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

      let url = `${BASE}/api/reports/daily`;
      const params = new URLSearchParams();
      if (filterNama) params.append("nama", filterNama);
      if (filterTanggal) params.append("tanggal", filterTanggal);
      if ([...params].length) url += `?${params.toString()}`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || "Gagal mengambil laporan presensi.");
      }

      const data = await response.json();
      setReports(data.data || []);
    } catch (err) {
      setError(err.message || "Terjadi kesalahan");
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // initial load

  const formatDate = (dateStr) =>
    dateStr ? new Date(dateStr).toLocaleString("id-ID") : "-";

  // Thumbnail component: fixed size, object-cover so it doesn't stretch table
  const PhotoThumbnail = ({ src, alt }) => (
    <button
      onClick={() => setModalPhoto(src)}
      className="p-0 border-0 bg-transparent"
      style={{ display: "inline-block" }}
      aria-label={`Tampilkan foto ${alt}`}
      type="button"
    >
      <img
        src={src}
        alt={alt}
        loading="lazy"
        style={{ width: 64, height: 64, objectFit: "cover", borderRadius: 6 }}
        className="shadow-sm"
      />
    </button>
  );

  return (
    <div className="min-h-screen bg-amber-50 font-sans p-4">
      <h1 className="text-2xl font-bold text-amber-900 mb-4">
        Admin Panel - Laporan Presensi
      </h1>

      <div className="mb-4 flex gap-3 flex-wrap">
        <input
          type="text"
          placeholder="Cari nama..."
          value={filterNama}
          onChange={(e) => setFilterNama(e.target.value)}
          className="p-2 rounded border border-amber-300"
        />
        <input
          type="date"
          value={filterTanggal}
          onChange={(e) => setFilterTanggal(e.target.value)}
          className="p-2 rounded border border-amber-300"
        />
        <button
          onClick={fetchReports}
          className="bg-amber-400 hover:bg-amber-500 text-white px-4 py-2 rounded shadow-sm"
        >
          Filter
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full table-fixed border-collapse border border-amber-300">
            <colgroup>
              <col style={{ width: "6%" }} />
              <col style={{ width: "16%" }} />
              <col style={{ width: "20%" }} />
              <col style={{ width: "10%" }} />
              <col style={{ width: "12%" }} />
              <col style={{ width: "10%" }} />
              <col style={{ width: "10%" }} />
              <col style={{ width: "10%" }} />
              <col style={{ width: "8%" }} />
            </colgroup>

            <thead className="bg-amber-200">
              <tr>
                <th className="border border-amber-300 p-2">ID</th>
                <th className="border border-amber-300 p-2">Nama</th>
                <th className="border border-amber-300 p-2">Email</th>
                <th className="border border-amber-300 p-2">Role</th>
                <th className="border border-amber-300 p-2">Check-In</th>
                <th className="border border-amber-300 p-2">Check-Out</th>
                <th className="border border-amber-300 p-2">Latitude</th>
                <th className="border border-amber-300 p-2">Longitude</th>
                <th className="border border-amber-300 p-2">Foto</th>
              </tr>
            </thead>

            <tbody>
              {reports.length === 0 ? (
                <tr>
                  <td colSpan="9" className="text-center p-4">
                    Tidak ada data
                  </td>
                </tr>
              ) : (
                reports.map((item) => (
                  <tr key={item.id} className="align-top">
                    <td className="border border-amber-300 p-2">{item.id}</td>
                    <td className="border border-amber-300 p-2">
                      {item.user?.nama || "-"}
                    </td>
                    <td className="border border-amber-300 p-2">
                      {item.user?.email || "-"}
                    </td>
                    <td className="border border-amber-300 p-2">
                      {item.user?.role || "-"}
                    </td>
                    <td className="border border-amber-300 p-2">
                      {formatDate(item.checkIn)}
                    </td>
                    <td className="border border-amber-300 p-2">
                      {formatDate(item.checkOut)}
                    </td>
                    <td className="border border-amber-300 p-2">
                      {item.latitude ?? "-"}
                    </td>
                    <td className="border border-amber-300 p-2">
                      {item.longitude ?? "-"}
                    </td>
                    <td className="border border-amber-300 p-2 text-center">
                      {item.buktiFoto ? (
                        <PhotoThumbnail
                          src={`${BASE}/${item.buktiFoto}`}
                          alt={`Bukti ${item.user?.nama || item.id}`}
                        />
                      ) : (
                        "-"
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Foto */}
      {modalPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative max-w-full max-h-full" style={{ width: "90%", height: "90%" }}>
            <div className="mb-2 flex gap-2 justify-end">
              <button
                onClick={() => window.open(modalPhoto, "_blank")}
                className="bg-white text-black px-3 py-1 rounded shadow hover:bg-gray-100"
              >
                Open image in new tab
              </button>
              <button
                onClick={() => setModalPhoto(null)}
                className="bg-white text-black px-3 py-1 rounded shadow hover:bg-gray-100"
              >
                Close
              </button>
            </div>

            <div
              className="w-full h-full flex items-center justify-center bg-white rounded"
              style={{ overflow: "auto" }}
            >
              <img
                src={modalPhoto}
                alt="Foto Presensi"
                style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
                className="rounded"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
