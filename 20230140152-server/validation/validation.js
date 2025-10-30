// validation/presensiValidator.js
const { check, validationResult } = require('express-validator');

const updatePresensiRules = [
  // semua field optional, tapi jika dikirim harus valid
  check('nama').optional().isString().withMessage('nama harus berupa string'),
  check('checkIn')
    .optional()
    .isISO8601()
    .withMessage('checkIn harus berupa tanggal ISO8601 (contoh: 2025-10-29T07:30:00.000Z)'),
  check('checkOut')
    .optional()
    .isISO8601()
    .withMessage('checkOut harus berupa tanggal ISO8601 (contoh: 2025-10-29T15:45:00.000Z)'),
];

// middleware untuk memeriksa hasil validasi
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: 'Validasi gagal', errors: errors.array() });
  }
  next();
};

module.exports = { updatePresensiRules, validate };
