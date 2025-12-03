const { Presensi, User } = require("../models");
const { format } = require("date-fns-tz");
const timeZone = "Asia/Jakarta";

exports.CheckIn = async (req, res) => {
  try {
    const { id: userId, role } = req.user;
    const { latitude, longitude } = req.body; // ➜ Tambahan lokasi
    const now = new Date();

    const existingRecord = await Presensi.findOne({
      where: {
        userId,
        checkOut: null
      }
    });

    if (existingRecord) {
      return res.status(400).json({
        message: "Anda sudah check-in dan belum check-out."
      });
    }

    // ➜ Tambahan data lokasi saat create
    const newRecord = await Presensi.create({
      userId,
      checkIn: now,
      latitude: latitude || null,
      longitude: longitude || null
    });

    return res.status(201).json({
      message: `Check-in berhasil pada pukul ${format(now, "HH:mm:ss", { timeZone })} WIB`,
      data: {
        id: newRecord.id,
        userId: newRecord.userId,
        checkIn: format(newRecord.checkIn, "yyyy-MM-dd HH:mm:ssXXX", { timeZone }),
        checkOut: null,
        latitude: newRecord.latitude,
        longitude: newRecord.longitude
      }
    });

  } catch (error) {
    return res.status(500).json({
      message: "Terjadi kesalahan server",
      error: error.message
    });
  }
};

exports.CheckOut = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const now = new Date();

    const record = await Presensi.findOne({
      where: {
        userId,
        checkOut: null
      }
    });

    if (!record) {
      return res.status(404).json({
        message: "Anda belum check-in atau sudah check-out."
      });
    }

    record.checkOut = now;
    await record.save();

    return res.json({
      message: `Check-out berhasil pada pukul ${format(now, "HH:mm:ss", { timeZone })} WIB`,
      data: {
        id: record.id,
        userId: record.userId,
        checkIn: format(record.checkIn, "yyyy-MM-dd HH:mm:ssXXX", { timeZone }),
        checkOut: format(record.checkOut, "yyyy-MM-dd HH:mm:ssXXX", { timeZone }),
        latitude: record.latitude,
        longitude: record.longitude
      }
    });

  } catch (error) {
    return res.status(500).json({
      message: "Terjadi kesalahan server",
      error: error.message
    });
  }
};

exports.deletePresensi = async (req, res) => {
  try {
    const { id: userId, role } = req.user;
    const presensiId = req.params.id;

    const record = await Presensi.findByPk(presensiId);

    if (!record) {
      return res.status(404).json({ message: "Catatan presensi tidak ditemukan." });
    }

    if (role === "mahasiswa" && record.userId !== userId) {
      return res.status(403).json({
        message: "Akses ditolak. Anda tidak memiliki izin."
      });
    }

    await record.destroy();
    return res.status(200).json({
      message: "Data presensi berhasil dihapus."
    });

  } catch (error) {
    return res.status(500).json({
      message: "Terjadi kesalahan server",
      error: error.message
    });
  }
};

exports.updatePresensi = async (req, res) => {
  try {
    const { id: userId, role } = req.user;
    const presensiId = req.params.id;
    const { checkIn, checkOut, latitude, longitude } = req.body;

    if (req.body.nama) {
      return res.status(400).json({
        message: "Kolom 'nama' tidak diperbolehkan. Nama berasal dari relasi User."
      });
    }

    const record = await Presensi.findByPk(presensiId);

    if (!record) {
      return res.status(404).json({ message: "Data presensi tidak ditemukan." });
    }

    if (role === "mahasiswa" && record.userId !== userId) {
      return res.status(403).json({ message: "Akses ditolak." });
    }

    const isValid = (v) => !isNaN(Date.parse(v));

    if (checkIn && !isValid(checkIn)) {
      return res.status(400).json({ message: "Format checkIn tidak valid." });
    }

    if (checkOut && !isValid(checkOut)) {
      return res.status(400).json({ message: "Format checkOut tidak valid." });
    }

    record.checkIn = checkIn || record.checkIn;
    record.checkOut = checkOut || record.checkOut;

    // ➜ Tambahan: update lokasi jika dikirim
    if (latitude !== undefined) record.latitude = latitude;
    if (longitude !== undefined) record.longitude = longitude;

    await record.save();

    return res.json({
      message: "Data presensi berhasil diperbarui.",
      data: record
    });

  } catch (error) {
    return res.status(500).json({
      message: "Terjadi kesalahan server",
      error: error.message
    });
  }
};