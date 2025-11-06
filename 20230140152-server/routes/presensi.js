// routes/presensi.js
const express = require('express');
const router = express.Router();

const presensiController = require('../controllers/presensiController');

const { addUserData } = require('../middleware/permissionMiddleware');
// jika middleware mu ada di permissionMiddleware, ganti path di atas:
// const { addUserData } = require('../middleware/permissionMiddleware');
const { body, validationResult } = require('express-validator');

// const { updatePresensiRules, validate } = require('../validation/presensiValidator');

// Jika ingin semua route di file ini memakai addUserData, pakai router.use()
// (atau kamu bisa pasang addUserData per-route jika ada route publik)
router.use(addUserData);

// Check-in / Check-out (tidak perlu body kalau req.user di-middleware)
router.post('/check-in', presensiController.CheckIn);
router.post('/check-out', presensiController.CheckOut);

// (Opsional) GET semua presensi - jika controller punya fungsi ini
router.get('/', presensiController.getAllPresensi);

// Update dan Delete (dengan validasi untuk update)
// ✅ UPDATE (dengan validasi tanggal)
router.put('/:id',
  [
    body('checkIn').optional().isISO8601().withMessage('Format tanggal checkIn tidak valid'),
    body('checkOut').optional().isISO8601().withMessage('Format tanggal checkOut tidak valid')
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  presensiController.updatePresensi
);

router.delete('/:id', presensiController.deletePresensi);


module.exports = router;
