import { Product } from '../../models/product/product.js';

// Create a new product
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock } = req.body;
    let imageUrl = req.body.imageUrl;
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    }
    const product = await Product.create({ name, description, price, imageUrl, category, stock });
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all products
export const getProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a product by ID
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a product
export const updateProduct = async (req, res) => {
  try {
    console.log('Update product request received');
    console.log('Request body:', req.body);
    console.log('Request file:', req.file);
    console.log('Request params:', req.params);
    
    const { id } = req.params;
    const { name, description, price, category, stock } = req.body;
    let imageUrl = req.body.imageUrl;
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    }
    const product = await Product.findByPk(id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    await product.update({ name, description, price, imageUrl, category, stock });
    res.json(product);
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Delete a product
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    await product.destroy();
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}; 