const express = require('express');
const router = express.Router();
const {
  getCart,
  addToCart,
  updateCartItemQuantity,
  removeFromCart,
  clearCart
} = require('../controllers/cartController');
const { optionalAuth } = require('../middleware/authMiddleware');

router.use(optionalAuth);

router.route('/')
  .get(getCart)
  .post(addToCart)
  .delete(clearCart);

router.route('/:productId')
  .put(updateCartItemQuantity)
  .delete(removeFromCart);

module.exports = router;
