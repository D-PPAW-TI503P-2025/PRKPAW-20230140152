"use strict";

const { Presensi, User } = require("../models");
const { Op } = require("sequelize");
const timeZone = "Asia/Jakarta";

exports.getDailyReport = async (req, res) => {
  try {
    const { nama, tanggal } = req.query;

    let options = {
      where: {},
      include: [
        {
          model: User,
          as: "user", // ⚠️ Tambahkan alias sesuai model
          attributes: ["nama", "email", "role"], 
        },
      ],
      order: [["checkIn", "DESC"]],
    };

    // Filter berdasarkan nama user
    if (nama) {
      options.include[0].where = {
        nama: { [Op.like]: `%${nama}%` },
      };
    }

    // Filter berdasarkan tanggal
    if (tanggal) {
      const startOfDay = new Date(`${tanggal}T00:00:00+07:00`);
      const endOfDay = new Date(`${tanggal}T23:59:59+07:00`);

      options.where.checkIn = {
        [Op.between]: [startOfDay, endOfDay],
      };
    }

    const records = await Presensi.findAll(options);

    if (records.length === 0) {
      return res.status(404).json({
        message: "Tidak ada data presensi ditemukan untuk filter yang diberikan.",
      });
    }

    const reportDate = new Date().toLocaleDateString("id-ID", { timeZone });

    res.json({
      reportDate,
      total: records.length,
      data: records, 
    });

  } catch (error) {
    res.status(500).json({
      message: "Gagal mengambil laporan presensi.",
      error: error.message,
    });
  }
};