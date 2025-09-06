import express from 'express';
import productService from '../services/productService.js';
import authMiddleware from '../middleware/auth.js';
import upload from '../middleware/upload.js';
import { validateRequest, productSchema } from '../middleware/validation.js';

const router = express.Router();

// Get all products (public route with filters)
router.get('/', async (req, res) => {
  try {
    const { category, search, condition, minPrice, maxPrice } = req.query;
    const products = await productService.getAllProducts({ 
      category, 
      search, 
      condition, 
      minPrice, 
      maxPrice 
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single product (public route)
router.get('/:id', async (req, res) => {
  try {
    const product = await productService.getProductById(req.params.id);
    res.json(product);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// Create product (protected route)
router.post('/', 
  authMiddleware, 
  upload.array('images', 5), // Support multiple images
  validateRequest(productSchema), 
  async (req, res) => {
    try {
      const images = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];
      
      const productData = {
        ...req.body,
        price: parseFloat(req.body.price),
        categoryId: parseInt(req.body.categoryId),
        quantity: req.body.quantity ? parseInt(req.body.quantity) : 1,
        yearOfManufacture: req.body.yearOfManufacture ? parseInt(req.body.yearOfManufacture) : null,
        length: req.body.length ? parseFloat(req.body.length) : null,
        width: req.body.width ? parseFloat(req.body.width) : null,
        height: req.body.height ? parseFloat(req.body.height) : null,
        weight: req.body.weight ? parseFloat(req.body.weight) : null,
        originalPackaging: req.body.originalPackaging === 'true',
        manualIncluded: req.body.manualIncluded === 'true',
        images
      };

      const product = await productService.createProduct(productData, req.user.id);
      res.status(201).json({
        message: 'Product created successfully',
        product
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
);

// Update product (protected route)
router.put('/:id', 
  authMiddleware, 
  upload.array('images', 5), 
  async (req, res) => {
    try {
      const updateData = {
        ...req.body,
        ...(req.body.price && { price: parseFloat(req.body.price) }),
        ...(req.body.categoryId && { categoryId: parseInt(req.body.categoryId) }),
        ...(req.body.quantity && { quantity: parseInt(req.body.quantity) }),
        ...(req.body.yearOfManufacture && { yearOfManufacture: parseInt(req.body.yearOfManufacture) }),
        ...(req.body.length && { length: parseFloat(req.body.length) }),
        ...(req.body.width && { width: parseFloat(req.body.width) }),
        ...(req.body.height && { height: parseFloat(req.body.height) }),
        ...(req.body.weight && { weight: parseFloat(req.body.weight) }),
        ...(req.body.originalPackaging !== undefined && { originalPackaging: req.body.originalPackaging === 'true' }),
        ...(req.body.manualIncluded !== undefined && { manualIncluded: req.body.manualIncluded === 'true' }),
        ...(req.files && req.files.length > 0 && { 
          images: req.files.map(file => `/uploads/${file.filename}`) 
        })
      };

      const product = await productService.updateProduct(req.params.id, updateData, req.user.id);
      res.json({
        message: 'Product updated successfully',
        product
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
);

// Delete product (protected route)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const result = await productService.deleteProduct(req.params.id, req.user.id);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get user's products (protected route)
router.get('/user/my-products', authMiddleware, async (req, res) => {
  try {
    const products = await productService.getUserProducts(req.user.id);
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
