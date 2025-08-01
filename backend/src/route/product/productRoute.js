import express from 'express';
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct
} from '../../controller/product/productController.js';
import upload from '../../middleware/multerConfig.js';
import { authenticateToken } from '../../middleware/token-middleware.js';
import { verifyAdminRole } from '../../middleware/admin-middleware.js';

const router = express.Router();

// Create a product (with image upload) - Admin only
router.post('/', authenticateToken, verifyAdminRole, upload.single('image'), createProduct);
// Get all products - Public
router.get('/', getProducts);
// Get a product by ID - Public
router.get('/:id', getProductById);
// Update a product (with image upload) - Admin only
router.put('/:id', authenticateToken, verifyAdminRole, upload.single('image'), updateProduct);
// Delete a product - Admin only
router.delete('/:id', authenticateToken, verifyAdminRole, deleteProduct);

export { router as productRouter }; 