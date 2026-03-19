const express = require('express');
const adminMiddleware = require('../middleware/adminMiddleware');
const {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const {
  getAllOrders,
  updateOrderStatus,
} = require('../controllers/orderController');

const router = express.Router();

router.get('/products', adminMiddleware, getProducts);
router.post('/products', adminMiddleware, createProduct);
router.put('/products/:id', adminMiddleware, updateProduct);
router.delete('/products/:id', adminMiddleware, deleteProduct);

router.get('/orders', adminMiddleware, getAllOrders);
router.put('/orders/:id/status', adminMiddleware, updateOrderStatus);

module.exports = router;
