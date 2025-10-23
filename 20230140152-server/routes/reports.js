const express = require("express");
const router = express.Router();
const { addUserData, isAdmin } = require("../middleware/permissionMiddleware");
const { getDailyReport } = require("../controllers/reportController");

// Tambahkan data user dummy
router.use(addUserData);

// Hanya admin yang bisa akses laporan harian
router.get("/daily", isAdmin, getDailyReport);

module.exports = router;
