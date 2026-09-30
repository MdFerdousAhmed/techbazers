const dataService = require('../services/dataService');

// @desc    Fetch all products with query search/filter/pagination
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const { category, minPrice, maxPrice, search, sort, page, limit, includeInactive } = req.query;

    const result = await dataService.getProducts({
      category,
      minPrice,
      maxPrice,
      search,
      sort,
      page,
      limit,
      includeInactive: includeInactive === 'true'
    });

    return res.json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('[GetProducts Error]', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await dataService.getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    return res.json({ success: true, product });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new product
// @route   POST /api/products
// @access  Admin
const createProduct = async (req, res) => {
  try {
    const { title, description, price, category, image, stock, isActive } = req.body;

    if (!title || !description || price === undefined || !category || !image) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, description, price, category, and image'
      });
    }

    const product = await dataService.createProduct({
      title,
      description,
      price: Number(price),
      category,
      image,
      stock: Number(stock) || 0,
      isActive: isActive !== undefined ? Boolean(isActive) : true
    });

    return res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product
    });
  } catch (error) {
    console.error('[CreateProduct Error]', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update an existing product
// @route   PUT /api/products/:id
// @access  Admin
const updateProduct = async (req, res) => {
  try {
    const updated = await dataService.updateProduct(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    return res.json({
      success: true,
      message: 'Product updated successfully',
      product: updated
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Admin
const deleteProduct = async (req, res) => {
  try {
    const deleted = await dataService.deleteProduct(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    return res.json({
      success: true,
      message: 'Product deleted successfully',
      product: deleted
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get list of product categories
// @route   GET /api/products/categories/all
// @access  Public
const getCategories = async (req, res) => {
  try {
    const { products } = await dataService.getProducts({ limit: 1000, includeInactive: true });
    const categories = Array.from(new Set(products.map(p => p.category))).filter(Boolean);
    return res.json({ success: true, categories });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories
};
