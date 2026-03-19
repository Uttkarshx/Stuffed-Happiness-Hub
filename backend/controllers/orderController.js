const Order = require('../models/Order');
const Product = require('../models/Product');
const { sendWhatsAppMessage } = require('../services/whatsappService');

const ORDER_STATUS_MAP = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

const PAYMENT_STATUS_MAP = {
  pending: 'Pending',
  paid: 'Paid',
  failed: 'Failed',
};

const normalizeOrderStatus = (value) => {
  if (!value) return undefined;
  const key = String(value).toLowerCase();
  return ORDER_STATUS_MAP[key] || value;
};

const normalizePaymentStatus = (value) => {
  if (!value) return undefined;
  const key = String(value).toLowerCase();
  return PAYMENT_STATUS_MAP[key] || value;
};

const toOrderResponse = (orderDoc) => {
  const order = orderDoc.toObject ? orderDoc.toObject() : orderDoc;
  return {
    ...order,
    customerPhone: order.phone,
    status: String(order.orderStatus || '').toLowerCase(),
    paymentStatus: String(order.paymentStatus || '').toLowerCase(),
    total: order.totalAmount,
  };
};

const createOrder = async (req, res, next) => {
  try {
    const {
      customerName,
      phone,
      customerPhone,
      address,
      items,
      totalAmount,
      total,
      paymentStatus,
      status,
      orderStatus,
    } = req.body;

    const finalPhone = phone || customerPhone;
    const finalTotal = totalAmount ?? total;

    if (!customerName || !finalPhone || !address || !Array.isArray(items) || !items.length || finalTotal === undefined) {
      return res.status(400).json({
        success: false,
        message: 'customerName, phone, address, items and totalAmount are required',
      });
    }

    const sanitizedItems = items
      .map((item) => ({
        productId:
          typeof item?.productId === 'string'
            ? item.productId
            : item?.productId?._id
              ? String(item.productId._id)
              : '',
        quantity: Number(item?.quantity),
      }))
      .filter((item) => item.productId);

    if (!sanitizedItems.length || sanitizedItems.some((item) => !item.quantity || item.quantity <= 0)) {
      return res.status(400).json({
        success: false,
        message: 'Each item must include valid productId and quantity > 0',
      });
    }

    const uniqueProductIds = [...new Set(sanitizedItems.map((item) => item.productId))];
    const productsCount = await Product.countDocuments({ _id: { $in: uniqueProductIds } });

    if (productsCount !== uniqueProductIds.length) {
      return res.status(400).json({
        success: false,
        message: 'One or more ordered products do not exist',
      });
    }

    const order = await Order.create({
      userId: req.user._id,
      customerName,
      phone: finalPhone,
      address,
      items: sanitizedItems,
      totalAmount: finalTotal,
      paymentStatus: normalizePaymentStatus(paymentStatus) || 'Pending',
      orderStatus: normalizeOrderStatus(orderStatus || status) || 'Pending',
    });

    const populatedOrder = await Order.findById(order._id).populate('items.productId', 'name');
    await sendWhatsAppMessage(populatedOrder || order);

    return res.status(201).json({
      success: true,
      message: 'Order created',
      data: toOrderResponse(populatedOrder || order),
    });
  } catch (error) {
    next(error);
  }
};

const testWhatsApp = async (req, res, next) => {
  try {
    const dummyOrder = {
      _id: 'test-whatsapp-order',
      customerName: 'Test Customer',
      phone: '+919999999999',
      address: 'Test Address, Test City',
      totalAmount: 999,
      items: [
        {
          productId: { name: 'Test Teddy Bear' },
          quantity: 1,
        },
        {
          productId: { name: 'Test Gift Box' },
          quantity: 2,
        },
      ],
    };

    await sendWhatsAppMessage(dummyOrder);

    return res.status(200).json({
      success: true,
      message: 'Test WhatsApp message flow executed',
    });
  } catch (error) {
    next(error);
  }
};

const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find()
      .populate('userId', 'name email role')
      .populate('items.productId', 'name price images')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: 'Orders fetched',
      data: orders.map(toOrderResponse),
    });
  } catch (error) {
    next(error);
  }
};

const getUserOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ userId: req.user._id })
      .populate('items.productId', 'name price images')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: 'User orders fetched',
      data: orders.map(toOrderResponse),
    });
  } catch (error) {
    next(error);
  }
};

const updateOrderStatus = async (req, res, next) => {
  try {
    const { orderStatus, status } = req.body;
    const nextStatus = normalizeOrderStatus(orderStatus || status);

    if (!nextStatus) {
      return res.status(400).json({
        success: false,
        message: 'Valid orderStatus is required',
      });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    order.orderStatus = nextStatus;

    if (nextStatus === 'Delivered') {
      order.paymentStatus = 'Paid';
    }

    if (nextStatus === 'Cancelled') {
      order.paymentStatus = 'Failed';
    }

    await order.save();

    return res.status(200).json({
      success: true,
      message: 'Order status updated',
      data: toOrderResponse(order),
    });
  } catch (error) {
    next(error);
  }
};

const cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    const requesterId = req.user?.id || req.user?._id;
    if (String(order.userId) !== String(requesterId)) {
      return res.status(403).json({
        success: false,
        message: 'You are not allowed to cancel this order',
      });
    }

    if (order.orderStatus !== 'Pending') {
      return res.status(400).json({
        success: false,
        message: 'Only pending orders can be cancelled',
      });
    }

    order.orderStatus = 'Cancelled';
    order.paymentStatus = 'Failed';
    await order.save();

    return res.status(200).json({
      success: true,
      message: 'Order cancelled successfully',
      data: toOrderResponse(order),
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  getUserOrders,
  updateOrderStatus,
  cancelOrder,
  testWhatsApp,
};
