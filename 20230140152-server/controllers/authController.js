const { User } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;
console.log("DEBUG JWT_SECRET =", process.env.JWT_SECRET);


// =========================
// REGISTER MAHASISWA
// =========================
exports.register = async (req, res) => {
  try {
    const { nama, email, password, role } = req.body;

    if (!nama || !email || !password) {
      return res.status(400).json({ message: "Nama, email, dan password wajib diisi." });
    }

    // ❗ Mencegah input role dari frontend
    if (role && role !== "mahasiswa") {
      return res.status(403).json({
        message: "Tidak diizinkan membuat akun selain role 'mahasiswa' melalui endpoint ini."
      });
    }

    const existingUser = await User.findOne({ where: { email }});
    if (existingUser) {
      return res.status(400).json({ message: "Email sudah digunakan." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      nama,
      email,
      password: hashedPassword,
      role: "mahasiswa"
    });

    return res.status(201).json({
      message: "Registrasi berhasil",
      data: {
        id: newUser.id,
        nama: newUser.nama,
        email: newUser.email,
        role: newUser.role
      }
    });

  } catch (error) {
    return res.status(500).json({
      message: "Terjadi kesalahan pada server",
      error: error.message
    });
  }
};

// =========================
// REGISTER ADMIN (Tambahan)
// =========================
exports.registerAdmin = async (req, res) => {
  try {
    const { nama, email, password } = req.body;

    if (!nama || !email || !password) {
      return res.status(400).json({ message: "Nama, email, dan password wajib diisi." });
    }

    const existingUser = await User.findOne({ where: { email }});
    if (existingUser) {
      return res.status(400).json({ message: "Email sudah digunakan." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = await User.create({
      nama,
      email,
      password: hashedPassword,
      role: "admin"
    });

    return res.status(201).json({
      message: "Admin berhasil dibuat",
      data: {
        id: newAdmin.id,
        nama: newAdmin.nama,
        email: newAdmin.email,
        role: newAdmin.role
      }
    });

  } catch (error) {
    return res.status(500).json({
      message: "Terjadi kesalahan pada server",
      error: error.message
    });
  }
};

// =========================
// LOGIN
// =========================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email }});
    if (!user) {
      return res.status(404).json({ message: "Email tidak ditemukan." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Password salah." });
    }

    const payload = {
      id: user.id,
      nama: user.nama,
      email: user.email,
      role: user.role
    };

    const token = jwt.sign(payload, JWT_SECRET, {
      expiresIn: "3h"
    });

    return res.status(200).json({
      message: "Login berhasil",
      token,
      user: payload
    });

  } catch (error) {
    console.error("🔥 LOGIN ERROR:", error); // <--- TAMBAHKAN INI
    return res.status(500).json({
      message: "Terjadi kesalahan pada server",
      error: error.message
    });
  }
};