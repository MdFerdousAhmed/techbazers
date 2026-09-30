const express = require('express');
const router = express.Router();
const {
  getAllOrders,
  updateOrderStatus,
  getAnalytics
} = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

router.use(protect, admin);

router.get('/orders', getAllOrders);
router.put('/orders/:id', updateOrderStatus);
router.get('/analytics', getAnalytics);

module.exports = router;
