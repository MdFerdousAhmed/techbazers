const dataService = require('../services/dataService');

const getSessionOrUserId = (req) => {
  const userId = req.user ? (req.user._id || req.user.id) : null;
  const sessionId = req.headers['x-session-id'] || req.query.sessionId || req.body.sessionId || 'guest_default';
  return { userId, sessionId };
};

// @desc    Get active cart
// @route   GET /api/cart
// @access  Public / User
const getCart = async (req, res) => {
  try {
    const { userId, sessionId } = getSessionOrUserId(req);
    const cart = await dataService.getCart({ userId, sessionId });

    const items = cart.items || [];
    const subtotal = items.reduce((acc, item) => acc + (Number(item.price) * Number(item.quantity)), 0);
    const tax = Number((subtotal * 0.08).toFixed(2));
    const shipping = subtotal > 100 || items.length === 0 ? 0 : 9.99;
    const total = Number((subtotal + tax + shipping).toFixed(2));

    return res.json({
      success: true,
      cart: {
        ...cart,
        items,
        subtotal: Number(subtotal.toFixed(2)),
        tax,
        shipping,
        total,
        totalItems: items.reduce((sum, i) => sum + i.quantity, 0)
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Public / User
const addToCart = async (req, res) => {
  try {
    const { userId, sessionId } = getSessionOrUserId(req);
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({ success: false, message: 'Product ID is required' });
    }

    const cart = await dataService.addToCart({
      userId,
      sessionId,
      productId,
      quantity: Number(quantity) || 1
    });

    const items = cart.items || [];
    const subtotal = items.reduce((acc, item) => acc + (Number(item.price) * Number(item.quantity)), 0);

    return res.json({
      success: true,
      message: 'Item added to cart',
      cart: {
        ...cart,
        subtotal: Number(subtotal.toFixed(2)),
        totalItems: items.reduce((sum, i) => sum + i.quantity, 0)
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/:productId
// @access  Public / User
const updateCartItemQuantity = async (req, res) => {
  try {
    const { userId, sessionId } = getSessionOrUserId(req);
    const { productId } = req.params;
    const { quantity } = req.body;

    if (quantity === undefined) {
      return res.status(400).json({ success: false, message: 'Quantity is required' });
    }

    const cart = await dataService.updateCartQuantity({
      userId,
      sessionId,
      productId,
      quantity: Number(quantity)
    });

    return res.json({
      success: true,
      message: 'Cart updated',
      cart
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:productId
// @access  Public / User
const removeFromCart = async (req, res) => {
  try {
    const { userId, sessionId } = getSessionOrUserId(req);
    const { productId } = req.params;

    const cart = await dataService.removeFromCart({
      userId,
      sessionId,
      productId
    });

    return res.json({
      success: true,
      message: 'Item removed from cart',
      cart
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Clear entire cart
// @route   DELETE /api/cart
// @access  Public / User
const clearCart = async (req, res) => {
  try {
    const { userId, sessionId } = getSessionOrUserId(req);
    const cart = await dataService.clearCart({ userId, sessionId });
    return res.json({
      success: true,
      message: 'Cart cleared successfully',
      cart
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItemQuantity,
  removeFromCart,
  clearCart
};
