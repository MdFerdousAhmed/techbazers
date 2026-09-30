const dataService = require('../services/dataService');

// @desc    Create new order from checkout
// @route   POST /api/orders
// @access  Private (User)
const createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'No order items specified' });
    }

    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.address || !shippingAddress.city) {
      return res.status(400).json({
        success: false,
        message: 'Please provide full shipping address details (fullName, address, city, postalCode, country)'
      });
    }

    const order = await dataService.createOrder({
      user: req.user,
      items,
      shippingAddress,
      paymentMethod: paymentMethod || 'Credit Card'
    });

    return res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order
    });
  } catch (error) {
    console.error('[CreateOrder Error]', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/my-orders
// @access  Private (User)
const getMyOrders = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const orders = await dataService.getOrdersByUser(userId);
    return res.json({ success: true, orders });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private (User/Admin)
const getOrderById = async (req, res) => {
  try {
    const order = await dataService.getOrderById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const userId = req.user._id || req.user.id;
    const orderUserId = order.user ? (order.user._id || order.user.id || order.user) : null;

    if (req.user.role !== 'Admin' && orderUserId !== userId) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this order' });
    }

    return res.json({ success: true, order });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById
};
