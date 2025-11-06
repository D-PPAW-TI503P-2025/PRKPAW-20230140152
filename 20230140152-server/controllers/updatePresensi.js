// controllers/presensiController.js
const { Presensi } = require('../models');
const { formatISO } = require('date-fns'); // optional

// Update presensi
exports.updatePresensi = async (req, res) => {
  try {
    const presensiId = req.params.id;
    const { checkIn, checkOut, nama } = req.body;

    // Jika semua kosong, kembalikan 400
    if (checkIn === undefined && checkOut === undefined && nama === undefined) {
      return res.status(400).json({
        message: 'Request body tidak berisi data yang valid untuk diupdate (checkIn, checkOut, atau nama).',
      });
    }

    const recordToUpdate = await Presensi.findByPk(presensiId);
    if (!recordToUpdate) {
      return res.status(404).json({ message: 'Catatan presensi tidak ditemukan.' });
    }

    // Optional: cek kepemilikan (jika mengharuskan user hanya bisa update miliknya)
    // const userId = req.user.id;
    // if (recordToUpdate.userId !== userId) return res.status(403).json({ message: 'Akses ditolak.' });

    // Update fields jika tersedia
    if (nama !== undefined) recordToUpdate.nama = nama;
    if (checkIn !== undefined) recordToUpdate.checkIn = new Date(checkIn);
    if (checkOut !== undefined) recordToUpdate.checkOut = new Date(checkOut);

    await recordToUpdate.save();

    res.json({
      message: 'Data presensi berhasil diperbarui.',
      data: recordToUpdate,
    });
  } catch (error) {
    console.error('updatePresensi error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server', error: error.message });
  }
};

// Delete presensi
exports.deletePresensi = async (req, res) => {
  try {
    const presensiId = req.params.id;
    const recordToDelete = await Presensi.findByPk(presensiId);

    if (!recordToDelete) {
      return res.status(404).json({ message: 'Catatan presensi tidak ditemukan.' });
    }

    // Optional: cek kepemilikan
    // const userId = req.user.id;
    // if (recordToDelete.userId !== userId) return res.status(403).json({ message: 'Akses ditolak: Anda bukan pemilik catatan ini.' });

    await recordToDelete.destroy();
    // 204 No Content lebih sesuai, tapi kita bisa kirim pesan
    return res.status(200).json({ message: 'Catatan presensi berhasil dihapus.' });
  } catch (error) {
    console.error('deletePresensi error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server', error: error.message });
  }
};
