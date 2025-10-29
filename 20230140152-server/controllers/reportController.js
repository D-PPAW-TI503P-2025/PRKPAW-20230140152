// controllers/reportController.js
const { Presensi, Sequelize } = require('../models');

exports.getDailyReport = async (req, res) => {
  try {
    // Ambil semua presensi dengan DATE(checkIn) = CURDATE() (mengandalkan tanggal server DB)
    const records = await Presensi.findAll({
      where: Sequelize.where(Sequelize.fn('DATE', Sequelize.col('checkIn')), Sequelize.literal('CURDATE()')),
      order: [['checkIn', 'ASC']]
    });

    res.json({
      message: `Laporan presensi tanggal ${new Date().toLocaleDateString()}`,
      total: records.length,
      data: records
    });
  } catch (err) {
    console.error('Error getDailyReport:', err);
    res.status(500).json({ message: 'Error mengambil laporan', error: err.message });
  }
};
