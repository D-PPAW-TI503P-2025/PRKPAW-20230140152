const express = require("express");
const router = express.Router();

const permissionMiddleware = require("../middleware/permissionMiddleware");
const reportController = require("../controllers/reportController");

router.get(
  "/daily",
  permissionMiddleware.authenticateToken, 
  permissionMiddleware.isAdmin,          
  reportController.getDailyReport       
);

module.exports = router;