const express = require('express');
const {
  createOrder,
  getAllOrders,
  getUserOrders,
  updateOrderStatus,
  cancelOrder,
  testWhatsApp,
} = require('../controllers/orderController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/test-whatsapp', testWhatsApp);
router.post('/', verifyToken, createOrder);
router.get('/', verifyToken, isAdmin, getAllOrders);
router.get('/my-orders', verifyToken, getUserOrders);
router.get('/user', verifyToken, getUserOrders);
router.put('/:id/cancel', verifyToken, cancelOrder);
router.put('/:id/status', verifyToken, isAdmin, updateOrderStatus);

module.exports = router;
