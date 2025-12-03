import React, { useState, useEffect } from "react";
import axios from "axios";


function ReportPage() {
  const [data, setData] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get("http://localhost:3001/api/presensi/laporan", {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((res) => setData(res.data.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div>
      <h2>Laporan Presensi</h2>

      <table border="1">
        <thead>
          <tr>
            <th>User</th>
            <th>Check-In</th>
            <th>Check-Out</th>
            <th>Latitude</th>
            <th>Longitude</th>
          </tr>
        </thead>

        <tbody>
          {data.map((item) => (
            <tr key={item.id}>
              <td>{item.user?.nama}</td>
              <td>{item.checkIn}</td>
              <td>{item.checkOut}</td>
              <td>{item.latitude}</td>
              <td>{item.longitude}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ReportPage;